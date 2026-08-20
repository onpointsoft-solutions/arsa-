import { Router } from 'express'
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param, query } from 'express-validator'

const router = Router()

// Public routes
router.get('/', query('page').optional().isInt({ min: 1 }), validateRequest, getCategories)
router.get('/:id', param('id').notEmpty(), validateRequest, getCategoryById)

// Admin routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  validateRequest,
  createCategory
)

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  updateCategory
)

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  param('id').notEmpty(),
  validateRequest,
  deleteCategory
)

export default router
