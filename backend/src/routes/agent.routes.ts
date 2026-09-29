import { Router } from 'express'
import {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from '../controllers/agent.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param, query } from 'express-validator'

const router = Router()

// Public
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  getAllAgents
)

router.get('/:id', param('id').notEmpty(), validateRequest, getAgentById)

// Admin
router.post(
  '/',
  authenticate,
  requireAdmin,
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  validateRequest,
  createAgent
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  body('email').optional().isEmail().withMessage('Valid email is required'),
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
