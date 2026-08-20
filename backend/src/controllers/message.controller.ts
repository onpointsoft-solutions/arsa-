import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const createMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, body, propertyId } = req.body

    const message = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        subject,
        body,
        userId: req.user?.id,
        propertyId,
      },
    })

    logger.info(`Message created: ${message.id} from ${email}`)

    sendSuccess(res, message, 'Message sent successfully', 201)
  } catch (error) {
    logger.error('Create message error:', error)
    res.status(500).json({ success: false, message: 'Failed to send message' })
  }
}

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can view all messages')
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string

    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.message.count({ where }),
    ])

    sendPaginated(
      res,
      messages,
      total,
      page,
      limit,
      'Messages retrieved successfully'
    )
  } catch (error) {
    logger.error('Get messages error:', error)
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve messages' })
    }
  }
}

export const getMessageById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can view messages')
    }

    const { id } = req.params

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!message) {
      throw new NotFoundError('Message')
    }

    // Mark as read
    await prisma.message.update({
      where: { id },
      data: { status: 'READ' },
    })

    sendSuccess(res, message, 'Message retrieved successfully')
  } catch (error) {
    logger.error('Get message by ID error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve message' })
    }
  }
}

export const updateMessageStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can update message status')
    }

    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status')
    }

    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      throw new NotFoundError('Message')
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { status },
    })

    logger.info(`Message status updated: ${id} to ${status}`)

    sendSuccess(res, updated, 'Message status updated successfully')
  } catch (error) {
    logger.error('Update message status error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update message status' })
    }
  }
}

export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can delete messages')
    }

    const { id } = req.params

    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      throw new NotFoundError('Message')
    }

    await prisma.message.delete({
      where: { id },
    })

    logger.info(`Message deleted: ${id} by ${req.user.email}`)

    sendSuccess(res, {}, 'Message deleted successfully')
  } catch (error) {
    logger.error('Delete message error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete message' })
    }
  }
}

export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can view unread count')
    }

    const count = await prisma.message.count({
      where: { status: 'UNREAD' },
    })

    sendSuccess(res, { count }, 'Unread count retrieved successfully')
  } catch (error) {
    logger.error('Get unread count error:', error)
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to get unread count' })
    }
  }
}
