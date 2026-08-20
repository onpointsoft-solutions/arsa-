import { Router } from 'express'
import {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  toggleFeatured,
} from '../controllers/testimonial.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param, query } from 'express-validator'

const router = Router()

// Public routes
router.get('/', query('page').optional().isInt({ min: 1 }), validateRequest, getTestimonials)
router.get('/:id', param('id').notEmpty(), validateRequest, getTestimonialById)

// Protected routes
router.post(
  '/',
  authenticate,
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ min: 10 }),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validateRequest,
  createTestimonial
)

router.put(
  '/:id',
  authenticate,
  param('id').notEmpty(),
  validateRequest,
  updateTestimonial
)

router.delete(
  '/:id',
  authenticate,
  param('id').notEmpty(),
  validateRequest,
  deleteTestimonial
)

// Admin routes
router.patch(
  '/:id/featured',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  toggleFeatured
)

export default router
