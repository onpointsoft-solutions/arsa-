import { Response } from 'express'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
): Response => {
  return res.status(statusCode).json({
    success: false,
    message: error,
  })
}

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const totalPages = Math.ceil(total / limit)
  
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  })
}
