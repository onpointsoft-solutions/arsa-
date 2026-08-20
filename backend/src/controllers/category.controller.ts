import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError, ConflictError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can create categories')
    }

    const { name, slug, description, icon } = req.body

    const existing = await prisma.category.findUnique({
      where: { slug },
    })

    if (existing) {
      throw new ConflictError('Category with this slug already exists')
    }

    const category = await prisma.category.create({
      data: { name, slug, description, icon },
    })

    logger.info(`Category created: ${category.id} by ${req.user.email}`)

    sendSuccess(res, category, 'Category created successfully', 201)
  } catch (error) {
    logger.error('Create category error:', error)
    if (error instanceof AuthorizationError || error instanceof ConflictError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create category' })
    }
  }
}

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
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
      prisma.category.count({ where }),
    ])

    sendPaginated(
      res,
      categories,
      total,
      page,
      limit,
      'Categories retrieved successfully'
    )
  } catch (error) {
    logger.error('Get categories error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve categories' })
  }
}

export const getCategoryById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
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

    if (!category) {
      throw new NotFoundError('Category')
    }

    sendSuccess(res, category, 'Category retrieved successfully')
  } catch (error) {
    logger.error('Get category by ID error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve category' })
    }
  }
}

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can update categories')
    }

    const { id } = req.params
    const { name, slug, description, icon } = req.body

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new NotFoundError('Category')
    }

    if (slug && slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug },
      })
      if (existing) {
        throw new ConflictError('Category with this slug already exists')
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(icon && { icon }),
      },
    })

    logger.info(`Category updated: ${id} by ${req.user.email}`)

    sendSuccess(res, updated, 'Category updated successfully')
  } catch (error) {
    logger.error('Update category error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError || error instanceof ConflictError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update category' })
    }
  }
}

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AuthorizationError('Only admins can delete categories')
    }

    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { properties: true } } },
    })

    if (!category) {
      throw new NotFoundError('Category')
    }

    if (category._count.properties > 0) {
      throw new ValidationError('Cannot delete category with existing properties')
    }

    await prisma.category.delete({
      where: { id },
    })

    logger.info(`Category deleted: ${id} by ${req.user.email}`)

    sendSuccess(res, {}, 'Category deleted successfully')
  } catch (error) {
    logger.error('Delete category error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete category' })
    }
  }
}
