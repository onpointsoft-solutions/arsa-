import { Router } from 'express'
import {
  updateProfile,
  changePassword,
  getSavedProperties,
  getAllUsers,
  getUserById,
  deleteUser,
} from '../controllers/user.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import {
  updateProfileValidator,
  changePasswordValidator,
  userIdValidator,
  paginationValidator,
} from '../validators/user.validator'

const router = Router()

// Protected routes
router.put('/profile', authenticate, updateProfileValidator, validateRequest, updateProfile)
router.post('/change-password', authenticate, changePasswordValidator, validateRequest, changePassword)
router.get('/saved-properties', authenticate, paginationValidator, validateRequest, getSavedProperties)

// Admin routes
router.get('/', authenticate, requireAdmin, paginationValidator, validateRequest, getAllUsers)
router.get('/:id', authenticate, userIdValidator, validateRequest, getUserById)
router.delete('/:id', authenticate, requireAdmin, userIdValidator, validateRequest, deleteUser)

export default router
