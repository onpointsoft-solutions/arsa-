import { Router } from 'express'
import {
  getSettings,
  getSettingByKey,
  updateSetting,
  updateMultipleSettings,
  deleteSetting,
} from '../controllers/settings.controller'
import { authenticate, requireAdmin } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { body, param } from 'express-validator'

const router = Router()

// Public routes
router.get('/', getSettings)

// Admin routes
router.get('/:key', param('key').notEmpty(), validateRequest, getSettingByKey)

router.put(
  '/:key',
  authenticate,
  requireAdmin,
  param('key').notEmpty(),
  body('value').notEmpty().withMessage('Value is required'),
  validateRequest,
  updateSetting
)

router.put(
  '/',
  authenticate,
  requireAdmin,
  updateMultipleSettings
)

router.delete(
  '/:key',
  authenticate,
  requireAdmin,
  param('key').notEmpty(),
  validateRequest,
  deleteSetting
)

export default router
