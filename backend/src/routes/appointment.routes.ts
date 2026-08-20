import { Router } from 'express'
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param, query } from 'express-validator'

const router = Router()

// Protected routes
router.post(
  '/',
  authenticate,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('scheduledAt').isISO8601().withMessage('Valid date is required'),
  validateRequest,
  createAppointment
)

router.get(
  '/',
  authenticate,
  query('page').optional().isInt({ min: 1 }),
  query('status').optional().isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
  validateRequest,
  getAppointments
)

router.get(
  '/:id',
  authenticate,
  param('id').notEmpty(),
  validateRequest,
  getAppointmentById
)

router.put(
  '/:id',
  authenticate,
  param('id').notEmpty(),
  validateRequest,
  updateAppointment
)

router.delete(
  '/:id',
  authenticate,
  param('id').notEmpty(),
  validateRequest,
  deleteAppointment
)

export default router
