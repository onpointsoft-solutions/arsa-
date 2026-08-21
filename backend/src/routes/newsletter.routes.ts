import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  subscribe,
  unsubscribe,
  listSubscribers,
  sendBlast,
  listBlasts,
  getStats,
} from '../controllers/newsletter.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'

const router = Router()

// ── Public ────────────────────────────────────────────────────────────────────

router.post(
  '/subscribe',
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  validateRequest,
  subscribe
)

// Unsubscribe via token — renders HTML page (linked from email footer)
router.get('/unsubscribe/:token', param('token').notEmpty(), validateRequest, unsubscribe)

// ── Admin ─────────────────────────────────────────────────────────────────────

router.get('/subscribers', authenticate, requireAdmin, listSubscribers)
router.get('/blasts',      authenticate, requireAdmin, listBlasts)
router.get('/stats',       authenticate, requireAdmin, getStats)

router.post(
  '/blast',
  authenticate,
  requireAdmin,
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validateRequest,
  sendBlast
)

export default router
