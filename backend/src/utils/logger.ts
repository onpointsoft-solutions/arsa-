import config from '../config/index'

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const getCurrentLevel = (): number => {
  return LOG_LEVELS[config.logging.level as LogLevel] ?? 2
}

const formatLog = (level: string, message: string, data?: any): string => {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`
  
  if (data) {
    return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`
  }
  
  return `${prefix} ${message}`
}

export const logger = {
  error: (message: string, data?: any): void => {
    if (LOG_LEVELS.error <= getCurrentLevel()) {
      console.error(formatLog('error', message, data))
    }
  },

  warn: (message: string, data?: any): void => {
    if (LOG_LEVELS.warn <= getCurrentLevel()) {
      console.warn(formatLog('warn', message, data))
    }
  },

  info: (message: string, data?: any): void => {
    if (LOG_LEVELS.info <= getCurrentLevel()) {
      console.log(formatLog('info', message, data))
    }
  },

  debug: (message: string, data?: any): void => {
    if (LOG_LEVELS.debug <= getCurrentLevel()) {
      console.log(formatLog('debug', message, data))
    }
  },
}

export default logger
