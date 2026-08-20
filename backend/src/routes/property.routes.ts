import { Router } from 'express'
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  saveProperty,
  getFeaturedProperties,
} from '../controllers/property.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import {
  createPropertyValidator,
  updatePropertyValidator,
  propertyIdValidator,
  savePropertyValidator,
  propertyQueryValidator,
} from '../validators/property.validator'

const router = Router()

// Public routes
router.get('/', propertyQueryValidator, validateRequest, getProperties)
router.get('/featured', getFeaturedProperties)
router.get('/:id', propertyIdValidator, validateRequest, getPropertyById)

// Protected routes
router.post('/', authenticate, createPropertyValidator, validateRequest, createProperty)
router.put('/:id', authenticate, propertyIdValidator, updatePropertyValidator, validateRequest, updateProperty)
router.delete('/:id', authenticate, propertyIdValidator, validateRequest, deleteProperty)
router.post('/save', authenticate, savePropertyValidator, validateRequest, saveProperty)

export default router
