import { Router } from 'express'
import {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getUnreadCount,
} from '../controllers/message.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param, query } from 'express-validator'

const router = Router()

// Public route
router.post(
  '/',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('body').trim().notEmpty().withMessage('Message body is required'),
  validateRequest,
  createMessage
)

// Admin routes
router.get('/', authenticate, requireAdmin, query('page').optional().isInt({ min: 1 }), validateRequest, getMessages)
router.get('/unread-count', authenticate, requireAdmin, getUnreadCount)
router.get('/:id', authenticate, requireAdmin, param('id').notEmpty(), validateRequest, getMessageById)
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  body('status').isIn(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']),
  validateRequest,
  updateMessageStatus
)

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  deleteMessage
)

export default router
