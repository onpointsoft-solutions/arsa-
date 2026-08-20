import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Log queries in development
prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query}`, { duration: `${e.duration}ms` })
})

export default prisma
