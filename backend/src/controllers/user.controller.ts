import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated, sendError } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'
import { hashPassword } from '../utils/password'

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { firstName, lastName, phone, bio, address, city, state, zipCode, country, avatar } =
      req.body

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(bio && { bio }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(country && { country }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        bio: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    logger.info(`User profile updated: ${req.user.email}`)

    sendSuccess(res, user, 'Profile updated successfully')
  } catch (error) {
    logger.error('Update profile error:', error)
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update profile' })
    }
  }
}

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    // Verify current password
    const { comparePassword } = await import('../utils/password')
    const isPasswordValid = await comparePassword(currentPassword, user.password)

    if (!isPasswordValid) {
      throw new ValidationError('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    })

    logger.info(`User password changed: ${req.user.email}`)

    sendSuccess(res, {}, 'Password changed successfully')
  } catch (error) {
    logger.error('Change password error:', error)
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to change password' })
    }
  }
}

export const getSavedProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const skip = (page - 1) * limit

    const [savedProperties, total] = await Promise.all([
      prisma.savedProperty.findMany({
        where: { userId: req.user.id },
        include: { property: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedProperty.count({
        where: { userId: req.user.id },
      }),
    ])

    sendPaginated(
      res,
      savedProperties.map(sp => sp.property),
      total,
      page,
      limit,
      'Saved properties retrieved successfully'
    )
  } catch (error) {
    logger.error('Get saved properties error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve saved properties' })
  }
}

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can access this endpoint')
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    sendPaginated(
      res,
      users,
      total,
      page,
      limit,
      'Users retrieved successfully'
    )
  } catch (error) {
    logger.error('Get all users error:', error)
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve users' })
    }
  }
}

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        bio: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    sendSuccess(res, user, 'User retrieved successfully')
  } catch (error) {
    logger.error('Get user by ID error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve user' })
    }
  }
}

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can delete users')
    }

    const { id } = req.params

    if (id === req.user.id) {
      throw new ValidationError('You cannot delete your own account')
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    logger.info(`User deleted by admin: ${id}`)

    sendSuccess(res, {}, 'User deleted successfully')
  } catch (error) {
    logger.error('Delete user error:', error)
    if (error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete user' })
    }
  }
}
