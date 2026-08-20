import { Router } from 'express'
import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} from '../controllers/agent.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param, query } from 'express-validator'

const router = Router()

// Public routes
router.get('/', query('page').optional().isInt({ min: 1 }), validateRequest, getAgents)
router.get('/:id', param('id').notEmpty(), validateRequest, getAgentById)

// Admin routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  validateRequest,
  createAgent
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  updateAgent
)

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  deleteAgent
)

export default router
