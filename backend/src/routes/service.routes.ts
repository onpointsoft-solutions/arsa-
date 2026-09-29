import { Router } from 'express'
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param } from 'express-validator'

const router = Router()

// Public
router.get('/', getServices)
router.get('/:id', param('id').notEmpty(), validateRequest, getServiceById)

// Admin
router.post(
  '/',
  authenticate,
  requireAdmin,
  body('title').trim().notEmpty().withMessage('Title is required'),
  validateRequest,
  createService
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  updateService
)

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  deleteService
)

export default router
