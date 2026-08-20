import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError, ConflictError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const createLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can create locations')
    }

    const { name, slug, description, image } = req.body

    const existing = await prisma.location.findUnique({
      where: { slug },
    })

    if (existing) {
      throw new ConflictError('Location with this slug already exists')
    }

    const location = await prisma.location.create({
      data: { name, slug, description, image },
    })

    logger.info(`Location created: ${location.id} by ${req.user.email}`)

    sendSuccess(res, location, 'Location created successfully', 201)
  } catch (error) {
    logger.error('Create location error:', error)
    if (error instanceof AuthorizationError || error instanceof ConflictError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create location' })
    }
  }
}

export const getLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}

    const [locations, total] = await Promise.all([
      prisma.location.findMany({
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
      prisma.location.count({ where }),
    ])

    sendPaginated(
      res,
      locations,
      total,
      page,
      limit,
      'Locations retrieved successfully'
    )
  } catch (error) {
    logger.error('Get locations error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve locations' })
  }
}

export const getLocationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const location = await prisma.location.findUnique({
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

    if (!location) {
      throw new NotFoundError('Location')
    }

    sendSuccess(res, location, 'Location retrieved successfully')
  } catch (error) {
    logger.error('Get location by ID error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve location' })
    }
  }
}

export const updateLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can update locations')
    }

    const { id } = req.params
    const { name, slug, description, image } = req.body

    const location = await prisma.location.findUnique({
      where: { id },
    })

    if (!location) {
      throw new NotFoundError('Location')
    }

    if (slug && slug !== location.slug) {
      const existing = await prisma.location.findUnique({
        where: { slug },
      })
      if (existing) {
        throw new ConflictError('Location with this slug already exists')
      }
    }

    const updated = await prisma.location.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(image && { image }),
      },
    })

    logger.info(`Location updated: ${id} by ${req.user.email}`)

    sendSuccess(res, updated, 'Location updated successfully')
  } catch (error) {
    logger.error('Update location error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError || error instanceof ConflictError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update location' })
    }
  }
}

export const deleteLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can delete locations')
    }

    const { id } = req.params

    const location = await prisma.location.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    })

    if (!location) {
      throw new NotFoundError('Location')
    }

    if (location._count.properties > 0) {
      throw new ValidationError('Cannot delete location with existing properties')
    }

    await prisma.location.delete({
      where: { id },
    })

    logger.info(`Location deleted: ${id} by ${req.user.email}`)

    sendSuccess(res, {}, 'Location deleted successfully')
  } catch (error) {
    logger.error('Delete location error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete location' })
    }
  }
}
