import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError, ConflictError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const createAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can create agents')
    }

    const { firstName, lastName, email, phone, avatar, bio, license } = req.body

    const existing = await prisma.agent.findUnique({
      where: { email },
    })

    if (existing) {
      throw new ConflictError('Agent with this email already exists')
    }

    const agent = await prisma.agent.create({
      data: { firstName, lastName, email, phone, avatar, bio, license },
    })

    logger.info(`Agent created: ${agent.id} by ${req.user.email}`)

    sendSuccess(res, agent, 'Agent created successfully', 201)
  } catch (error) {
    logger.error('Create agent error:', error)
    if (error instanceof AuthorizationError || error instanceof ConflictError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create agent' })
    }
  }
}

export const getAgents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        include: {
          _count: {
            select: { properties: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.agent.count({ where }),
    ])

    sendPaginated(
      res,
      agents,
      total,
      page,
      limit,
      'Agents retrieved successfully'
    )
  } catch (error) {
    logger.error('Get agents error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve agents' })
  }
}

export const getAgentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        properties: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnail: true,
          },
          take: 10,
        },
      },
    })

    if (!agent) {
      throw new NotFoundError('Agent')
    }

    sendSuccess(res, agent, 'Agent retrieved successfully')
  } catch (error) {
    logger.error('Get agent by ID error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve agent' })
    }
  }
}

export const updateAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can update agents')
    }

    const { id } = req.params
    const { firstName, lastName, email, phone, avatar, bio, license } = req.body

    const agent = await prisma.agent.findUnique({
      where: { id },
    })

    if (!agent) {
      throw new NotFoundError('Agent')
    }

    if (email && email !== agent.email) {
      const existing = await prisma.agent.findUnique({
        where: { email },
      })
      if (existing) {
        throw new ConflictError('Agent with this email already exists')
      }
    }

    const updated = await prisma.agent.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(license && { license }),
      },
    })

    logger.info(`Agent updated: ${id} by ${req.user.email}`)

    sendSuccess(res, updated, 'Agent updated successfully')
  } catch (error) {
    logger.error('Update agent error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError || error instanceof ConflictError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update agent' })
    }
  }
}

export const deleteAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can delete agents')
    }

    const { id } = req.params

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    })

    if (!agent) {
      throw new NotFoundError('Agent')
    }

    await prisma.agent.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    logger.info(`Agent deleted: ${id} by ${req.user.email}`)

    sendSuccess(res, {}, 'Agent deleted successfully')
  } catch (error) {
    logger.error('Delete agent error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete agent' })
    }
  }
}
