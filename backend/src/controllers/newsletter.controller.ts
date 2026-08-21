import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { ValidationError, AuthorizationError, NotFoundError } from '../utils/errors'
import { query, queryOne, execute } from '../lib/db'
import { sendEmail, templates } from '../utils/email'
import config from '../config/index'
import logger from '../utils/logger'

// ── helpers ───────────────────────────────────────────────────────────────────

const makeToken = () => crypto.randomBytes(32).toString('hex')

const unsubscribeUrl = (token: string) =>
  `${config.apiUrl}/api/newsletter/unsubscribe/${token}`

// ── Subscribe ─────────────────────────────────────────────────────────────────

export const subscribe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    if (!email) throw new ValidationError('Email is required')

    // Check if already subscribed
    const existing = await queryOne<any>(
      'SELECT id, is_active, unsubscribe_token FROM newsletter_subscribers WHERE email = ?',
      [email]
    )

    if (existing) {
      if (existing.is_active) {
        // Already active — silently succeed (don't reveal subscription status)
        sendSuccess(res, {}, 'Subscribed successfully')
        return
      }
      // Re-activate if previously unsubscribed
      await execute(
        'UPDATE newsletter_subscribers SET is_active = 1, unsubscribed_at = NULL WHERE email = ?',
        [email]
      )
      // Send welcome email
      const tmpl = templates.welcome(email, unsubscribeUrl(existing.unsubscribe_token))
      await sendEmail({ to: email, ...tmpl })
      sendSuccess(res, {}, 'Subscribed successfully')
      return
    }

    // New subscriber
    const id    = uuidv4()
    const token = makeToken()

    await execute(
      'INSERT INTO newsletter_subscribers (id, email, unsubscribe_token) VALUES (?, ?, ?)',
      [id, email, token]
    )

    // Send welcome email (non-blocking — don't fail subscription if email fails)
    const tmpl = templates.welcome(email, unsubscribeUrl(token))
    sendEmail({ to: email, ...tmpl }).catch(() => {})

    logger.info(`Newsletter subscription: ${email}`)
    sendSuccess(res, {}, 'Subscribed successfully', 201)
  } catch (error) {
    logger.error('Newsletter subscribe error:', error)
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Subscription failed' })
    }
  }
}

// ── Unsubscribe (via token link in email) ─────────────────────────────────────

export const unsubscribe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.params

    const subscriber = await queryOne<any>(
      'SELECT id, email FROM newsletter_subscribers WHERE unsubscribe_token = ? AND is_active = 1',
      [token]
    )

    if (!subscriber) {
      // Already unsubscribed or invalid token — show success anyway
      res.status(200).send(`
        <!DOCTYPE html><html><head><title>Unsubscribed</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:60px;color:#374151;">
          <h2 style="color:#2d6a4f;">Already unsubscribed</h2>
          <p>This email is not on our newsletter list.</p>
        </body></html>
      `)
      return
    }

    await execute(
      'UPDATE newsletter_subscribers SET is_active = 0, unsubscribed_at = NOW() WHERE id = ?',
      [subscriber.id]
    )

    logger.info(`Newsletter unsubscribe: ${subscriber.email}`)

    res.status(200).send(`
      <!DOCTYPE html><html><head><title>Unsubscribed</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px;color:#374151;">
        <h2 style="color:#2d6a4f;">Successfully Unsubscribed</h2>
        <p>You've been removed from the ARSA Real Estate newsletter.</p>
        <p style="font-size:13px;color:#9ca3af;">Email: ${subscriber.email}</p>
        <a href="${config.clientUrl}" style="color:#2d6a4f;">← Back to site</a>
      </body></html>
    `)
  } catch (error) {
    logger.error('Newsletter unsubscribe error:', error)
    res.status(500).send('<p>Something went wrong. Please try again.</p>')
  }
}

// ── List subscribers (admin) ──────────────────────────────────────────────────

export const listSubscribers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Admins only')

    const page     = parseInt(req.query.page  as string) || 1
    const limit    = parseInt(req.query.limit as string) || 20
    const active   = req.query.active !== 'false'
    const skip     = (page - 1) * limit

    const where = active ? 'WHERE is_active = 1' : ''

    const [rows, countRows] = await Promise.all([
      query<any>(
        `SELECT id, email, is_active, created_at, unsubscribed_at
         FROM newsletter_subscribers ${where}
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, skip]
      ),
      query<any>(`SELECT COUNT(*) AS total FROM newsletter_subscribers ${where}`),
    ])

    const total = countRows[0]?.total ?? 0
    sendPaginated(res, rows, total, page, limit, 'Subscribers retrieved successfully')
  } catch (error) {
    logger.error('List subscribers error:', error)
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to list subscribers' })
    }
  }
}

// ── Send blast (admin) ────────────────────────────────────────────────────────

export const sendBlast = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Admins only')

    const { subject, content } = req.body
    if (!subject?.trim()) throw new ValidationError('Subject is required')
    if (!content?.trim()) throw new ValidationError('Content is required')

    // Get all active subscribers
    const subscribers = await query<any>(
      'SELECT email, unsubscribe_token FROM newsletter_subscribers WHERE is_active = 1'
    )

    if (subscribers.length === 0) {
      sendSuccess(res, { sent: 0 }, 'No active subscribers to send to')
      return
    }

    // Record the blast first
    const blastId = uuidv4()
    await execute(
      'INSERT INTO newsletter_blasts (id, subject, content, sent_by, recipient_count) VALUES (?, ?, ?, ?, ?)',
      [blastId, subject, content, req.user.id, subscribers.length]
    )

    // Send emails in batches of 50 to avoid overwhelming the SMTP server
    const BATCH = 50
    let sent = 0

    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH)
      await Promise.allSettled(
        batch.map(async (sub: any) => {
          const tmpl = templates.blast(subject, content, unsubscribeUrl(sub.unsubscribe_token))
          const ok   = await sendEmail({ to: sub.email, ...tmpl })
          if (ok) sent++
        })
      )
    }

    logger.info(`Newsletter blast sent: "${subject}" to ${sent}/${subscribers.length} subscribers by ${req.user.email}`)

    sendSuccess(res, {
      blastId,
      total:  subscribers.length,
      sent,
      failed: subscribers.length - sent,
    }, `Newsletter sent to ${sent} subscriber${sent !== 1 ? 's' : ''}`)
  } catch (error) {
    logger.error('Send blast error:', error)
    if (error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to send newsletter' })
    }
  }
}

// ── List past blasts (admin) ──────────────────────────────────────────────────

export const listBlasts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Admins only')

    const page  = parseInt(req.query.page  as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip  = (page - 1) * limit

    const [rows, countRows] = await Promise.all([
      query<any>(
        `SELECT nb.*, u.first_name, u.last_name, u.email AS sender_email
         FROM newsletter_blasts nb
         JOIN users u ON u.id = nb.sent_by
         ORDER BY nb.created_at DESC LIMIT ? OFFSET ?`,
        [limit, skip]
      ),
      query<any>('SELECT COUNT(*) AS total FROM newsletter_blasts'),
    ])

    const total = countRows[0]?.total ?? 0
    sendPaginated(
      res,
      rows.map((r: any) => ({
        id:             r.id,
        subject:        r.subject,
        content:        r.content,
        recipientCount: r.recipient_count,
        sentBy:         `${r.first_name} ${r.last_name}`,
        createdAt:      r.created_at,
      })),
      total, page, limit,
      'Blasts retrieved successfully'
    )
  } catch (error) {
    logger.error('List blasts error:', error)
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to list blasts' })
    }
  }
}

// ── Stats (admin) ─────────────────────────────────────────────────────────────

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Admins only')

    const [total, active, blasts] = await Promise.all([
      query<any>('SELECT COUNT(*) AS n FROM newsletter_subscribers'),
      query<any>('SELECT COUNT(*) AS n FROM newsletter_subscribers WHERE is_active = 1'),
      query<any>('SELECT COUNT(*) AS n FROM newsletter_blasts'),
    ])

    sendSuccess(res, {
      total:        total[0]?.n ?? 0,
      active:       active[0]?.n ?? 0,
      unsubscribed: (total[0]?.n ?? 0) - (active[0]?.n ?? 0),
      blastsSent:   blasts[0]?.n ?? 0,
    }, 'Stats retrieved')
  } catch (error) {
    logger.error('Newsletter stats error:', error)
    res.status(500).json({ success: false, message: 'Failed to get stats' })
  }
}
