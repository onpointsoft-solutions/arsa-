import app from './app'
import config from './config/index'
import logger from './utils/logger'
import prisma from './lib/prisma'

const PORT = config.port

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error('Database connection failed:', error)
    process.exit(1)
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
    logger.info(`Environment: ${config.nodeEnv}`)
    logger.info(`API Documentation: http://localhost:${PORT}/api-docs`)
  })

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}, starting graceful shutdown...`)

    server.close(async () => {
      logger.info('HTTP server closed')

      try {
        await prisma.$disconnect()
        logger.info('Database connection closed')
      } catch (error) {
        logger.error('Error disconnecting database:', error)
      }

      process.exit(0)
    })

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  })

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error)
    process.exit(1)
  })
}

startServer()
