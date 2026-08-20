import { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import logger from '../utils/logger'

// Morgan stream
const morganStream = {
  write: (message: string) => {
    logger.info(message.trim())
  },
}

// Morgan middleware
export const morganMiddleware = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
  { stream: morganStream }
)

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime
    logger.debug(`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
    })
  })

  next()
}
