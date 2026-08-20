import { Router } from 'express'
import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from '../controllers/location.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param, query } from 'express-validator'

const router = Router()

// Public routes
router.get('/', query('page').optional().isInt({ min: 1 }), validateRequest, getLocations)
router.get('/:id', param('id').notEmpty(), validateRequest, getLocationById)

// Admin routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  validateRequest,
  createLocation
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  updateLocation
)

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  deleteLocation
)

export default router
