import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const createTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { content, rating } = req.body

    const testimonial = await prisma.testimonial.create({
      data: {
        content,
        rating: Math.min(Math.max(rating, 1), 5),
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    logger.info(`Testimonial created: ${testimonial.id} by ${req.user.email}`)

    sendSuccess(res, testimonial, 'Testimonial created successfully', 201)
  } catch (error) {
    logger.error('Create testimonial error:', error)
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create testimonial' })
    }
  }
}

export const getTestimonials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const featured = req.query.featured === 'true'

    const skip = (page - 1) * limit

    const where = featured ? { featured: true } : {}

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.testimonial.count({ where }),
    ])

    sendPaginated(
      res,
      testimonials,
      total,
      page,
      limit,
      'Testimonials retrieved successfully'
    )
  } catch (error) {
    logger.error('Get testimonials error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve testimonials' })
  }
}

export const getTestimonialById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    if (!testimonial) {
      throw new NotFoundError('Testimonial')
    }

    sendSuccess(res, testimonial, 'Testimonial retrieved successfully')
  } catch (error) {
    logger.error('Get testimonial by ID error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve testimonial' })
    }
  }
}

export const updateTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { id } = req.params
    const { content, rating } = req.body

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      throw new NotFoundError('Testimonial')
    }

    if (testimonial.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AuthorizationError('You can only update your own testimonials')
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(rating && { rating: Math.min(Math.max(rating, 1), 5) }),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    logger.info(`Testimonial updated: ${id} by ${req.user.email}`)

    sendSuccess(res, updated, 'Testimonial updated successfully')
  } catch (error) {
    logger.error('Update testimonial error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update testimonial' })
    }
  }
}

export const deleteTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { id } = req.params

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      throw new NotFoundError('Testimonial')
    }

    if (testimonial.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AuthorizationError('You can only delete your own testimonials')
    }

    await prisma.testimonial.delete({
      where: { id },
    })

    logger.info(`Testimonial deleted: ${id} by ${req.user.email}`)

    sendSuccess(res, {}, 'Testimonial deleted successfully')
  } catch (error) {
    logger.error('Delete testimonial error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete testimonial' })
    }
  }
}

export const toggleFeatured = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can feature testimonials')
    }

    const { id } = req.params

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      throw new NotFoundError('Testimonial')
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { featured: !testimonial.featured },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    logger.info(`Testimonial featured status toggled: ${id} by ${req.user.email}`)

    sendSuccess(res, updated, 'Testimonial featured status updated')
  } catch (error) {
    logger.error('Toggle featured error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to toggle featured status' })
    }
  }
}
