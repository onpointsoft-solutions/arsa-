import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await prisma.settings.findMany()

    const settingsMap: Record<string, string> = {}
    settings.forEach(s => {
      settingsMap[s.key] = s.value
    })

    sendSuccess(res, settingsMap, 'Settings retrieved successfully')
  } catch (error) {
    logger.error('Get settings error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve settings' })
  }
}

export const getSettingByKey = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { key } = req.params

    const setting = await prisma.settings.findUnique({
      where: { key },
    })

    if (!setting) {
      throw new NotFoundError('Setting')
    }

    sendSuccess(res, setting, 'Setting retrieved successfully')
  } catch (error) {
    logger.error('Get setting by key error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve setting' })
    }
  }
}

export const updateSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can update settings')
    }

    const { key } = req.params
    const { value, description } = req.body

    if (!value) {
      throw new ValidationError('Value is required')
    }

    const existing = await prisma.settings.findUnique({
      where: { key },
    })

    let setting

    if (existing) {
      setting = await prisma.settings.update({
        where: { key },
        data: {
          value,
          ...(description && { description }),
        },
      })
    } else {
      setting = await prisma.settings.create({
        data: {
          key,
          value,
          description,
        },
      })
    }

    logger.info(`Setting updated: ${key} by ${req.user.email}`)

    sendSuccess(res, setting, 'Setting updated successfully')
  } catch (error) {
    logger.error('Update setting error:', error)
    if (error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update setting' })
    }
  }
}

export const updateMultipleSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can update settings')
    }

    const settings = req.body

    if (!settings || typeof settings !== 'object') {
      throw new ValidationError('Settings must be an object')
    }

    const updated: Record<string, string> = {}

    for (const [key, value] of Object.entries(settings)) {
      if (typeof value !== 'string') {
        throw new ValidationError(`Value for ${key} must be a string`)
      }

      const existing = await prisma.settings.findUnique({
        where: { key },
      })

      if (existing) {
        await prisma.settings.update({
          where: { key },
          data: { value },
        })
      } else {
        await prisma.settings.create({
          data: { key, value },
        })
      }

      updated[key] = value
    }

    logger.info(`Multiple settings updated by ${req.user.email}`)

    sendSuccess(res, updated, 'Settings updated successfully')
  } catch (error) {
    logger.error('Update multiple settings error:', error)
    if (error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update settings' })
    }
  }
}

export const deleteSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can delete settings')
    }

    const { key } = req.params

    const setting = await prisma.settings.findUnique({
      where: { key },
    })

    if (!setting) {
      throw new NotFoundError('Setting')
    }

    await prisma.settings.delete({
      where: { key },
    })

    logger.info(`Setting deleted: ${key} by ${req.user.email}`)

    sendSuccess(res, {}, 'Setting deleted successfully')
  } catch (error) {
    logger.error('Delete setting error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete setting' })
    }
  }
}
