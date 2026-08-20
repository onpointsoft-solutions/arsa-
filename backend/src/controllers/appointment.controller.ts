import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import prisma from '../lib/prisma'
import logger from '../utils/logger'

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { title, description, propertyId, scheduledAt } = req.body

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      throw new NotFoundError('Property')
    }

    const appointment = await prisma.appointment.create({
      data: {
        title,
        description,
        propertyId,
        userId: req.user.id,
        scheduledAt: new Date(scheduledAt),
      },
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
            address: true,
          },
        },
      },
    })

    logger.info(`Appointment created: ${appointment.id} by ${req.user.email}`)

    sendSuccess(res, appointment, 'Appointment created successfully', 201)
  } catch (error) {
    logger.error('Create appointment error:', error)
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create appointment' })
    }
  }
}

export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string

    const skip = (page - 1) * limit

    const where: any = req.user.role === 'ADMIN' ? {} : { userId: req.user.id }
    if (status) where.status = status

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
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
              address: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { scheduledAt: 'asc' },
      }),
      prisma.appointment.count({ where }),
    ])

    sendPaginated(
      res,
      appointments,
      total,
      page,
      limit,
      'Appointments retrieved successfully'
    )
  } catch (error) {
    logger.error('Get appointments error:', error)
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve appointments' })
    }
  }
}

export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { id } = req.params

    const appointment = await prisma.appointment.findUnique({
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
            address: true,
          },
        },
      },
    })

    if (!appointment) {
      throw new NotFoundError('Appointment')
    }

    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AuthorizationError('You can only view your own appointments')
    }

    sendSuccess(res, appointment, 'Appointment retrieved successfully')
  } catch (error) {
    logger.error('Get appointment by ID error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve appointment' })
    }
  }
}

export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { id } = req.params
    const { title, description, scheduledAt, status } = req.body

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!appointment) {
      throw new NotFoundError('Appointment')
    }

    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AuthorizationError('You can only update your own appointments')
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(status && { status }),
      },
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
            address: true,
          },
        },
      },
    })

    logger.info(`Appointment updated: ${id} by ${req.user.email}`)

    sendSuccess(res, updated, 'Appointment updated successfully')
  } catch (error) {
    logger.error('Update appointment error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update appointment' })
    }
  }
}

export const deleteAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new ValidationError('User not authenticated')
    }

    const { id } = req.params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!appointment) {
      throw new NotFoundError('Appointment')
    }

    if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AuthorizationError('You can only delete your own appointments')
    }

    await prisma.appointment.delete({
      where: { id },
    })

    logger.info(`Appointment deleted: ${id} by ${req.user.email}`)

    sendSuccess(res, {}, 'Appointment deleted successfully')
  } catch (error) {
    logger.error('Delete appointment error:', error)
    if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete appointment' })
    }
  }
}
