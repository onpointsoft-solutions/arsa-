import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { AuthRequest } from '../middleware/auth'
import { sendSuccess, sendPaginated } from '../utils/response'
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors'
import { query, queryOne, execute } from '../lib/db'
import logger from '../utils/logger'

const mapAgent = (row: any) => ({
  id:             row.id,
  firstName:      row.first_name,
  lastName:       row.last_name,
  email:          row.email,
  phone:          row.phone,
  avatar:         row.avatar,
  bio:            row.bio,
  specialization: row.specialization,
  licenseNumber:  row.license_number,
  isActive:       !!row.is_active,
  createdAt:      row.created_at,
  updatedAt:      row.updated_at,
})

export const getAllAgents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page   = parseInt(req.query.page  as string) || 1
    const limit  = parseInt(req.query.limit as string) || 20
    const search = (req.query.search as string) || ''
    const skip   = (page - 1) * limit

    const conditions: string[] = ['deleted_at IS NULL']
    const params: any[] = []

    if (search) {
      conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR specialization LIKE ?)')
      const like = `%${search}%`
      params.push(like, like, like, like)
    }

    const where = `WHERE ${conditions.join(' AND ')}`

    const [rows, countRows] = await Promise.all([
      query<any>(
        `SELECT * FROM agents ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, skip]
      ),
      query<any>(`SELECT COUNT(*) AS total FROM agents ${where}`, params),
    ])

    const total = countRows[0]?.total ?? 0
    sendPaginated(res, rows.map(mapAgent), total, page, limit, 'Agents retrieved successfully')
  } catch (error) {
    logger.error('Get all agents error:', error)
    res.status(500).json({ success: false, message: 'Failed to retrieve agents' })
  }
}

export const getAgentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const row = await queryOne<any>('SELECT * FROM agents WHERE id = ? AND deleted_at IS NULL', [id])
    if (!row) throw new NotFoundError('Agent')
    sendSuccess(res, mapAgent(row), 'Agent retrieved successfully')
  } catch (error) {
    logger.error('Get agent by id error:', error)
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to retrieve agent' })
    }
  }
}

export const createAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Only admins can create agents')

    const { firstName, lastName, email, phone, avatar, bio, specialization, licenseNumber } = req.body
    if (!firstName || !lastName || !email) throw new ValidationError('First name, last name and email are required')

    const existing = await queryOne('SELECT id FROM agents WHERE email = ? AND deleted_at IS NULL', [email])
    if (existing) throw new ValidationError('An agent with this email already exists')

    const id = uuidv4()
    await execute(
      `INSERT INTO agents (id, first_name, last_name, email, phone, avatar, bio, specialization, license_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, firstName, lastName, email, phone ?? null, avatar ?? null, bio ?? null, specialization ?? null, licenseNumber ?? null]
    )

    const row = await queryOne<any>('SELECT * FROM agents WHERE id = ?', [id])
    logger.info(`Agent created: ${id} by ${req.user.email}`)
    sendSuccess(res, mapAgent(row!), 'Agent created successfully', 201)
  } catch (error) {
    logger.error('Create agent error:', error)
    if (error instanceof AuthorizationError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to create agent' })
    }
  }
}

export const updateAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Only admins can update agents')

    const { id } = req.params
    const existing = await queryOne<any>('SELECT * FROM agents WHERE id = ? AND deleted_at IS NULL', [id])
    if (!existing) throw new NotFoundError('Agent')

    const { firstName, lastName, email, phone, avatar, bio, specialization, licenseNumber, isActive } = req.body

    if (email && email !== existing.email) {
      const dup = await queryOne('SELECT id FROM agents WHERE email = ? AND deleted_at IS NULL AND id != ?', [email, id])
      if (dup) throw new ValidationError('An agent with this email already exists')
    }

    const sets: string[] = []
    const params: any[] = []

    if (firstName      !== undefined) { sets.push('first_name = ?');      params.push(firstName) }
    if (lastName       !== undefined) { sets.push('last_name = ?');       params.push(lastName) }
    if (email          !== undefined) { sets.push('email = ?');           params.push(email) }
    if (phone          !== undefined) { sets.push('phone = ?');           params.push(phone) }
    if (avatar         !== undefined) { sets.push('avatar = ?');          params.push(avatar) }
    if (bio            !== undefined) { sets.push('bio = ?');             params.push(bio) }
    if (specialization !== undefined) { sets.push('specialization = ?'); params.push(specialization) }
    if (licenseNumber  !== undefined) { sets.push('license_number = ?'); params.push(licenseNumber) }
    if (isActive       !== undefined) { sets.push('is_active = ?');      params.push(isActive ? 1 : 0) }

    if (sets.length > 0) {
      params.push(id)
      await execute(`UPDATE agents SET ${sets.join(', ')} WHERE id = ?`, params)
    }

    const updated = await queryOne<any>('SELECT * FROM agents WHERE id = ?', [id])
    logger.info(`Agent updated: ${id} by ${req.user.email}`)
    sendSuccess(res, mapAgent(updated!), 'Agent updated successfully')
  } catch (error) {
    logger.error('Update agent error:', error)
    if (error instanceof AuthorizationError || error instanceof NotFoundError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update agent' })
    }
  }
}

export const deleteAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'ADMIN') throw new AuthorizationError('Only admins can delete agents')

    const { id } = req.params
    const existing = await queryOne('SELECT id FROM agents WHERE id = ? AND deleted_at IS NULL', [id])
    if (!existing) throw new NotFoundError('Agent')

    await execute('UPDATE agents SET deleted_at = NOW() WHERE id = ?', [id])
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
