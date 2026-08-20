import { Request, Response, NextFunction } from 'express'
import { AuthenticationError, AuthorizationError } from '../utils/errors'
import { verifyAccessToken } from '../utils/jwt'
import logger from '../utils/logger'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: 'ADMIN' | 'USER'
  }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided')
    }

    const token = authHeader.slice(7)
    const payload = verifyAccessToken(token)

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    logger.debug('Authentication failed', error)
    if (error instanceof AuthenticationError) {
      res.status(401).json({ success: false, message: error.message })
    } else {
      res.status(401).json({ success: false, message: 'Invalid token' })
    }
  }
}

export const authorize = (...allowedRoles: Array<'ADMIN' | 'USER'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated')
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError()
      }

      next()
    } catch (error) {
      if (error instanceof AuthorizationError) {
        res.status(403).json({ success: false, message: error.message })
      } else {
        res.status(401).json({ success: false, message: 'Authentication failed' })
      }
    }
  }
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  authorize('ADMIN')(req, res, next)
}

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  authorize('USER', 'ADMIN')(req, res, next)
}
