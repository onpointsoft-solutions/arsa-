import { Router } from 'express'
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import {
  signupValidator,
  loginValidator,
  refreshTokenValidator,
} from '../validators/auth.validator'

const router = Router()

// Public routes
router.post('/signup', signupValidator, validateRequest, signup)
router.post('/login', loginValidator, validateRequest, login)
router.post('/refresh-token', refreshTokenValidator, validateRequest, refreshAccessToken)

// Protected routes
router.get('/me', authenticate, getCurrentUser)
router.post('/logout', authenticate, logout)

export default router
