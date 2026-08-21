import nodemailer from 'nodemailer'
import config from '../config/index'
import logger from './logger'

// ── Transport ─────────────────────────────────────────────────────────────────

function createTransport() {
  // If no SMTP credentials are configured, use Ethereal (dev preview only)
  if (!config.email.user || !config.email.password) {
    logger.warn('SMTP credentials not set — emails will be logged but not sent')
    return null
  }

  return nodemailer.createTransport({
    host:   config.email.host,
    port:   config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
    tls: { rejectUnauthorized: false },
  })
}

// ── Send helper ───────────────────────────────────────────────────────────────

export interface MailOptions {
  to:      string | string[]
  subject: string
  html:    string
  text?:   string
}

export async function sendEmail(opts: MailOptions): Promise<boolean> {
  const transport = createTransport()

  if (!transport) {
    // Dev fallback — log the email so you can see it without real SMTP
    logger.info(`[EMAIL NOT SENT — no SMTP config]\nTo: ${opts.to}\nSubject: ${opts.subject}\n${opts.text ?? ''}`)
    return false
  }

  try {
    const info = await transport.sendMail({
      from:    `"ARSA Real Estate" <${config.email.from}>`,
      to:      Array.isArray(opts.to) ? opts.to.join(', ') : opts.to,
      subject: opts.subject,
      html:    opts.html,
      text:    opts.text ?? opts.html.replace(/<[^>]+>/g, ''),
    })
    logger.info(`Email sent: ${info.messageId} → ${opts.to}`)
    return true
  } catch (err) {
    logger.error('Email send error:', err)
    return false
  }
}

// ── Templates ─────────────────────────────────────────────────────────────────

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ARSA Real Estate</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f5; font-family:'DM Sans',Arial,sans-serif; color:#111827; }
    .wrap { max-width:600px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.07); }
    .header { background:linear-gradient(135deg,#2d6a4f,#1b4332); padding:36px 40px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:26px; letter-spacing:3px; font-weight:700; }
    .header p  { margin:6px 0 0; color:rgba(255,255,255,0.75); font-size:13px; }
    .body   { padding:36px 40px; }
    .footer { background:#f4f6f5; padding:24px 40px; text-align:center; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb; }
    .footer a { color:#2d6a4f; text-decoration:none; }
    .btn { display:inline-block; background:#2d6a4f; color:#fff!important; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:600; font-size:14px; margin:16px 0; }
    h2 { color:#111827; font-size:22px; margin-top:0; }
    p  { color:#374151; line-height:1.7; font-size:15px; }
    .divider { border:none; border-top:1px solid #e5e7eb; margin:24px 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>ARSA · REALESTATE</h1>
      <p>Curated Luxury · Exceptional Properties</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ARSA Real Estate. All rights reserved.</p>
      <p><a href="{{unsubscribeUrl}}">Unsubscribe</a> from this list.</p>
    </div>
  </div>
</body>
</html>`

export const templates = {

  welcome: (email: string, unsubscribeUrl: string) => {
    const html = baseLayout(`
      <h2>Welcome to ARSA Real Estate</h2>
      <p>Thank you for subscribing to our newsletter. You'll be the first to know about:</p>
      <ul style="color:#374151;line-height:2;font-size:15px;">
        <li>🏡 New luxury property listings</li>
        <li>📈 Market insights and trends</li>
        <li>🎯 Exclusive off-market opportunities</li>
        <li>💡 Real estate investment tips</li>
      </ul>
      <hr class="divider"/>
      <p style="font-size:13px;color:#6b7280;">
        You subscribed with <strong>${email}</strong>.
        If this was a mistake, you can unsubscribe at any time using the link below.
      </p>
    `).replace('{{unsubscribeUrl}}', unsubscribeUrl)

    return {
      subject: 'Welcome to ARSA Real Estate Newsletter',
      html,
      text: `Welcome to ARSA Real Estate! You've successfully subscribed. Unsubscribe: ${unsubscribeUrl}`,
    }
  },

  blast: (subject: string, content: string, unsubscribeUrl: string) => {
    const html = baseLayout(`
      <h2>${subject}</h2>
      <div style="color:#374151;line-height:1.8;font-size:15px;">${content.replace(/\n/g, '<br/>')}</div>
      <hr class="divider"/>
      <p style="font-size:13px;color:#6b7280;">
        You're receiving this because you subscribed to ARSA Real Estate updates.
      </p>
    `).replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl)

    return {
      subject,
      html,
      text: `${subject}\n\n${content}\n\nUnsubscribe: ${unsubscribeUrl}`,
    }
  },
}
