import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { generateTokens } from '../utils/jwt'
import { hashPassword, comparePassword } from '../utils/password'
import { sendSuccess, sendError } from '../utils/response'
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const signup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER',
      },
    })

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    logger.info(`User registered: ${email}`)

    sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      'User registered successfully',
      201
    )
  } catch (error) {
    logger.error('Signup error:', error)
    if (error instanceof ConflictError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
      })
    }
  }
}

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AuthenticationError('Invalid email or password')
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password')
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is inactive')
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    logger.info(`User logged in: ${email}`)

    sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      'Login successful'
    )
  } catch (error) {
    logger.error('Login error:', error)
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Login failed',
      })
    }
  }
}

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    logger.info(`User logged out: ${req.user?.email}`)
    
    sendSuccess(res, {}, 'Logout successful')
  } catch (error) {
    logger.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    })
  }
}

export const refreshAccessToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required')
    }

    // Verify refresh token (imported verifyRefreshToken)
    const { verifyRefreshToken } = await import('../utils/jwt')
    const payload = verifyRefreshToken(refreshToken)

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    })

    if (!user || !user.isActive) {
      throw new AuthenticationError('Invalid refresh token')
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    sendSuccess(res, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed')
  } catch (error) {
    logger.error('Token refresh error:', error)
    if (error instanceof ValidationError || error instanceof AuthenticationError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Token refresh failed',
      })
    }
  }
}

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AuthenticationError('User not authenticated')
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
    logger.error('Get current user error:', error)
    if (error instanceof NotFoundError || error instanceof AuthenticationError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get user',
      })
    }
  }
}
