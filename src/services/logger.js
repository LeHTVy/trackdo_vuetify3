const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4,
}

// Current log level (can be configured)
const currentLogLevel = isDevelopment ? LOG_LEVELS.TRACE : LOG_LEVELS.ERROR

class Logger {
  constructor () {
    this.context = 'TrackDo'
  }

  /**
   * Create a logger instance with specific context
   * @param {string} context - Context name (e.g., component name, service name)
   * @returns {Logger} Logger instance
   */
  createLogger (context) {
    const logger = new Logger()
    logger.context = context
    return logger
  }

  /**
   * Format log message with timestamp and context
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @returns {Array} Formatted log arguments
   */
  formatMessage (level, message, data) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level}] [${this.context}]`

    if (data !== undefined) {
      return [prefix, message, data]
    }
    return [prefix, message]
  }

  /**
   * Check if log level should be output
   * @param {number} level - Log level to check
   * @returns {boolean} Should log
   */
  shouldLog (level) {
    return level <= currentLogLevel
  }

  /**
   * Error logging - always shown
   * @param {string} message - Error message
   * @param {any} error - Error object or additional data
   */
  error (message, error) {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      const args = this.formatMessage('ERROR', `❌ ${message}`, error)
      console.error(...args)

      // In production, you might want to send to error tracking service
      if (isProduction) {
        // TODO: Send to error tracking service (Sentry, etc.)
      }
    }
  }

  /**
   * Warning logging
   * @param {string} message - Warning message
   * @param {any} data - Additional data
   */
  warn (message, data) {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      const args = this.formatMessage('WARN', `⚠️ ${message}`, data)
      console.warn(...args)
    }
  }

  /**
   * Info logging
   * @param {string} message - Info message
   * @param {any} data - Additional data
   */
  info (message, data) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      const args = this.formatMessage('INFO', `ℹ️ ${message}`, data)
      console.log(...args)
    }
  }

  /**
   * Success logging
   * @param {string} message - Success message
   * @param {any} data - Additional data
   */
  success (message, data) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      const args = this.formatMessage('SUCCESS', `✅ ${message}`, data)
      console.log(...args)
    }
  }

  /**
   * Debug logging - development only
   * @param {string} message - Debug message
   * @param {any} data - Additional data
   */
  debug (message, data) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const args = this.formatMessage('DEBUG', `🐛 ${message}`, data)
      console.log(...args)
    }
  }

  /**
   * Trace logging - detailed development logging
   * @param {string} message - Trace message
   * @param {any} data - Additional data
   */
  trace (message, data) {
    if (this.shouldLog(LOG_LEVELS.TRACE)) {
      const args = this.formatMessage('TRACE', `🔍 ${message}`, data)
      console.log(...args)
    }
  }

  /**
   * Performance logging
   * @param {string} operation - Operation name
   * @param {number} startTime - Start time (performance.now())
   * @param {any} data - Additional data
   */
  performance (operation, startTime, data) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const duration = performance.now() - startTime
      const args = this.formatMessage('PERF', `⏱️ ${operation} took ${duration.toFixed(2)}ms`, data)
      console.log(...args)
    }
  }

  /**
   * API call logging
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {any} data - Request/response data
   * @param {number} duration - Request duration
   */
  api (method, url, data, duration) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const message = duration
        ? `🌐 ${method} ${url} (${duration}ms)`
        : `🌐 ${method} ${url}`
      const args = this.formatMessage('API', message, data)
      console.log(...args)
    }
  }

  /**
   * User action logging
   * @param {string} action - User action
   * @param {any} data - Action data
   */
  userAction (action, data) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      const args = this.formatMessage('USER', `👤 ${action}`, data)
      console.log(...args)
    }
  }

  /**
   * Store action logging
   * @param {string} store - Store name
   * @param {string} action - Action name
   * @param {any} data - Action data
   */
  storeAction (store, action, data) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const args = this.formatMessage('STORE', `🗃️ ${store}.${action}`, data)
      console.log(...args)
    }
  }

  /**
   * Navigation logging
   * @param {string} from - Previous route
   * @param {string} to - Next route
   * @param {any} data - Navigation data
   */
  navigation (from, to, data) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const args = this.formatMessage('NAV', `🧭 ${from} → ${to}`, data)
      console.log(...args)
    }
  }

  /**
   * Component lifecycle logging
   * @param {string} component - Component name
   * @param {string} lifecycle - Lifecycle event
   * @param {any} data - Additional data
   */
  lifecycle (component, lifecycle, data) {
    if (this.shouldLog(LOG_LEVELS.TRACE)) {
      const args = this.formatMessage('LIFECYCLE', `🔄 ${component}.${lifecycle}`, data)
      console.log(...args)
    }
  }

  /**
   * Group logging for related operations
   * @param {string} groupName - Group name
   * @param {Function} fn - Function to execute within group
   */
  group (groupName, fn) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.group(`📁 ${groupName}`)
      try {
        fn()
      } finally {
        console.groupEnd()
      }
    } else {
      fn()
    }
  }

  /**
   * Table logging for structured data
   * @param {string} title - Table title
   * @param {Array|Object} data - Data to display in table
   */
  table (title, data) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(`📊 ${title}`)
      console.table(data)
    }
  }
}

// Create default logger instance
const logger = new Logger()

// Export both the class and default instance
export { Logger, LOG_LEVELS }
export default logger

// Convenience exports for common use cases
export const createLogger = context => logger.createLogger(context)

// Specialized loggers for different parts of the application
export const authLogger = logger.createLogger('Auth')
export const apiLogger = logger.createLogger('API')
export const storeLogger = logger.createLogger('Store')
export const routerLogger = logger.createLogger('Router')
export const componentLogger = logger.createLogger('Component')
export const serviceLogger = logger.createLogger('Service')
export const composableLogger = logger.createLogger('Composable')
