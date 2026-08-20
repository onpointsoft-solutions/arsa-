import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const {
      title,
      description,
      price,
      type,
      address,
      city,
      state,
      zipCode,
      country,
      bedrooms,
      bathrooms,
      squareFeet,
      yearBuilt,
      categoryId,
      locationId,
      agentId,
      images,
      thumbnail,
    } = req.body

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        type,
        address,
        city,
        state,
        zipCode,
        country,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        squareFeet: parseInt(squareFeet),
        ...(yearBuilt && { yearBuilt: parseInt(yearBuilt) }),
        categoryId,
        locationId,
        agentId,
        ownerId: req.user.id,
        images: images || [],
        thumbnail,
      },
      include: {
        category: true,
        location: true,
        agent: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    logger.info(`Property created: ${property.id} by ${req.user.email}`)

    sendSuccess(res, property, 'Property created successfully', 201)
  } catch (error) {
    logger.error('Create property error:', error)
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create property' })
    }
  }
}

export const getProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 12
    const search = req.query.search as string
    const categoryId = req.query.categoryId as string
    const locationId = req.query.locationId as string
    const status = req.query.status as string
    const minPrice = req.query.minPrice as string
    const maxPrice = req.query.maxPrice as string
    const type = req.query.type as string
    const sortBy = (req.query.sortBy as string) || 'createdAt'
    const sortOrder = (req.query.sortOrder as string) || 'desc'

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoryId) where.categoryId = categoryId
    if (locationId) where.locationId = locationId
    if (status) where.status = status
    if (type) where.type = type

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          category: true,
          location: true,
          agent: true,
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.property.count({ where }),
    ])

    sendPaginated(
      res,
      properties,
      total,
      page,
      limit,
      'Properties retrieved successfully'
    )
  } catch (error) {
    logger.error('Get properties error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve properties' })
  }
}

export const getPropertyById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        location: true,
        agent: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
          },
        },
        savedBy: true,
      },
    })

    if (!property) {
      throw new NotFoundError('Property')
    }

    // Increment views
    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    sendSuccess(res, property, 'Property retrieved successfully')
  } catch (error) {
    logger.error('Get property by ID error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve property' })
    }
  }
}

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { id } = req.params
    const updateData = req.body

    const property = await prisma.property.findUnique({
      where: { id },
    })

    if (!property) {
      throw new NotFoundError('Property')
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AuthorizationError('You can only update your own properties')
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.price && { price: parseFloat(updateData.price) }),
        ...(updateData.bedrooms && { bedrooms: parseInt(updateData.bedrooms) }),
        ...(updateData.bathrooms && { bathrooms: parseInt(updateData.bathrooms) }),
        ...(updateData.squareFeet && { squareFeet: parseInt(updateData.squareFeet) }),
        ...(updateData.yearBuilt && { yearBuilt: parseInt(updateData.yearBuilt) }),
      },
      include: {
        category: true,
        location: true,
        agent: true,
      },
    })

    logger.info(`Property updated: ${id} by ${req.user.email}`)

    sendSuccess(res, updated, 'Property updated successfully')
  } catch (error) {
    logger.error('Update property error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update property' })
    }
  }
}

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { id } = req.params

    const property = await prisma.property.findUnique({
      where: { id },
    })

    if (!property) {
      throw new NotFoundError('Property')
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AuthorizationError('You can only delete your own properties')
    }

    await prisma.property.delete({
      where: { id },
    })

    logger.info(`Property deleted: ${id} by ${req.user.email}`)

    sendSuccess(res, {}, 'Property deleted successfully')
  } catch (error) {
    logger.error('Delete property error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete property' })
    }
  }
}

export const saveProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { propertyId } = req.body

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      throw new NotFoundError('Property')
    }

    const existing = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId,
        },
      },
    })

    if (existing) {
      await prisma.savedProperty.delete({
        where: {
          userId_propertyId: {
            userId: req.user.id,
            propertyId,
          },
        },
      })
      sendSuccess(res, {}, 'Property removed from saved')
    } else {
      await prisma.savedProperty.create({
        data: {
          userId: req.user.id,
          propertyId,
        },
      })
      sendSuccess(res, {}, 'Property saved successfully', 201)
    }
  } catch (error) {
    logger.error('Save property error:', error)
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to save property' })
    }
  }
}

export const getFeaturedProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 6

    const properties = await prisma.property.findMany({
      where: { featured: true, status: 'AVAILABLE' },
      include: {
        category: true,
        location: true,
        agent: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    sendSuccess(res, properties, 'Featured properties retrieved successfully')
  } catch (error) {
    logger.error('Get featured properties error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve featured properties' })
  }
}
