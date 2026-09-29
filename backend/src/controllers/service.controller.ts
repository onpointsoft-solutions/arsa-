import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import { query, queryOne, execute } from '../lib/db'
import logger from '../utils/logger'

const mapService = (row: any) => ({
  id:         row.id,
  num:        row.num,
  title:      row.title,
  body:       row.body,
  icon:       row.icon,
  sortOrder:  row.sort_order,
  createdAt:  row.created_at,
  updatedAt:  row.updated_at,
})

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Only admins can create services')

    const { num, title, body, icon, sortOrder } = req.body
    if (!title) throw new ValidationError('Title is required')

    // Auto-generate num if not provided
    const rows = await query<any>('SELECT COUNT(*) AS cnt FROM services')
    const count = (rows[0]?.cnt ?? 0) + 1
    const resolvedNum = num ?? String(count).padStart(2, '0')

    const id = uuidv4()
    await execute(
      'INSERT INTO services (id, num, title, body, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [id, resolvedNum, title, body ?? null, icon ?? null, sortOrder ?? count]
    )

    const service = await queryOne<any>('SELECT * FROM services WHERE id = ?', [id])
    logger.info(`Service created: ${id} by ${req.user.email}`)
    sendSuccess(res, mapService(service!), 'Service created successfully', 201)
  } catch (error) {
    logger.error('Create service error:', error)
    if (error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create service' })
    }
  }
}

export const getServices = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rows = await query<any>('SELECT * FROM services ORDER BY sort_order ASC, created_at ASC')
    // Public endpoint — return all without pagination
    sendSuccess(res, rows.map(mapService), 'Services retrieved successfully')
  } catch (error) {
    logger.error('Get services error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve services' })
  }
}

export const getServiceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const row = await queryOne<any>('SELECT * FROM services WHERE id = ?', [id])
    if (!row) throw new NotFoundError('Service')
    sendSuccess(res, mapService(row), 'Service retrieved successfully')
  } catch (error) {
    logger.error('Get service by id error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve service' })
    }
  }
}

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Only admins can update services')

    const { id } = req.params
    const existing = await queryOne<any>('SELECT * FROM services WHERE id = ?', [id])
    if (!existing) throw new NotFoundError('Service')

    const { num, title, body, icon, sortOrder } = req.body

    const sets: string[] = []
    const params: any[] = []

    if (num       !== undefined) { sets.push('num = ?');        params.push(num) }
    if (title     !== undefined) { sets.push('title = ?');      params.push(title) }
    if (body      !== undefined) { sets.push('body = ?');       params.push(body) }
    if (icon      !== undefined) { sets.push('icon = ?');       params.push(icon) }
    if (sortOrder !== undefined) { sets.push('sort_order = ?'); params.push(sortOrder) }

    if (sets.length > 0) {
      params.push(id)
      await execute(`UPDATE services SET ${sets.join(', ')} WHERE id = ?`, params)
    }

    const updated = await queryOne<any>('SELECT * FROM services WHERE id = ?', [id])
    logger.info(`Service updated: ${id} by ${req.user.email}`)
    sendSuccess(res, mapService(updated!), 'Service updated successfully')
  } catch (error) {
    logger.error('Update service error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update service' })
    }
  }
}

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Only admins can delete services')

    const { id } = req.params
    const existing = await queryOne<any>('SELECT id FROM services WHERE id = ?', [id])
    if (!existing) throw new NotFoundError('Service')

    await execute('DELETE FROM services WHERE id = ?', [id])
    logger.info(`Service deleted: ${id} by ${req.user.email}`)
    sendSuccess(res, {}, 'Service deleted successfully')
  } catch (error) {
    logger.error('Delete service error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete service' })
    }
  }
}
