/**
 * Date and Time Utility Functions
 * Centralized logic for date/time operations across the application
 */

/**
 * Validate if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false
  try {
    const date = new Date(dateString)
    return !Number.isNaN(date.getTime())
  } catch {
    return false
  }
}

/**
 * Safely create a Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} - Date object or null if invalid
 */
export const safeCreateDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return Number.isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

/**
 * Format date for display (from useDateUtils)
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'vi-VN')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, locale = 'vi-VN') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Format date to ISO string (from useDateUtils)
 * @param {string|Date} date - Date to format
 * @returns {string} - ISO date string
 */
export const formatDateISO = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

/**
 * Format event time for display
 * @param {Object} event - Event object
 * @param {string} locale - Locale for formatting (default: 'vi-VN')
 * @returns {string} - Formatted time string
 */
export const formatEventTime = (event, locale = 'vi-VN') => {
  if (event.allDay) return 'All day'

  if (!isValidDate(event.start) || !isValidDate(event.end)) {
    return 'Invalid time'
  }

  const start = safeCreateDate(event.start)
  const end = safeCreateDate(event.end)

  if (!start || !end) return 'Invalid time'

  const startTime = start.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  const endTime = end.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${startTime} - ${endTime}`
}

/**
 * Format event date for display
 * @param {Object} event - Event object
 * @param {string} locale - Locale for formatting (default: 'vi-VN')
 * @returns {string} - Formatted date string
 */
export const formatEventDate = (event, locale = 'vi-VN') => {
  if (!event.start && !event.date) return ''

  const dateString = event.start || event.date
  if (!isValidDate(dateString)) return 'Invalid date'

  const date = safeCreateDate(dateString)
  if (!date) return 'Invalid date'

  return date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format hour for calendar display
 * @param {number} hour - Hour number (0-23)
 * @returns {string} - Formatted hour string
 */
export const formatHour = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

/**
 * Check if a date is today (enhanced from useDateUtils)
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    return dateObj.toDateString() === today.toDateString()
  } catch {
    return false
  }
}

/**
 * Check if a date is in the past (from useDateUtils)
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export const isPast = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dateObj < today
  } catch {
    return false
  }
}

/**
 * Check if a date is in the future (from useDateUtils)
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the future
 */
export const isFuture = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return dateObj > today
  } catch {
    return false
  }
}

/**
 * Get days between two dates (from useDateUtils)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} - Number of days between dates
 */
export const getDaysBetween = (startDate, endDate) => {
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch {
    return 0
  }
}

/**
 * Add days to a date (from useDateUtils)
 * @param {string|Date} date - Base date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date with added days
 */
export const addDays = (date, days) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    dateObj.setDate(dateObj.getDate() + days)
    return dateObj
  } catch {
    return new Date()
  }
}

/**
 * Get start of week (from useDateUtils)
 * @param {string|Date} date - Date to get week start for
 * @param {number} startOfWeek - Start of week (0=Sunday, 1=Monday)
 * @returns {Date} - Start of week date
 */
export const getStartOfWeek = (date, startOfWeek = 1) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    const day = dateObj.getDay()
    const diff = (day < startOfWeek ? 7 : 0) + day - startOfWeek
    dateObj.setDate(dateObj.getDate() - diff)
    dateObj.setHours(0, 0, 0, 0)
    return dateObj
  } catch {
    return new Date()
  }
}

/**
 * Get end of week (from useDateUtils)
 * @param {string|Date} date - Date to get week end for
 * @param {number} startOfWeek - Start of week (0=Sunday, 1=Monday)
 * @returns {Date} - End of week date
 */
export const getEndOfWeek = (date, startOfWeek = 1) => {
  try {
    const startDate = getStartOfWeek(date, startOfWeek)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)
    return endDate
  } catch {
    return new Date()
  }
}

/**
 * Check if an event is happening today
 * @param {Object} event - Event object
 * @returns {boolean} - True if event is today
 */
export const isEventToday = (event) => {
  if (!isValidDate(event.start)) return false
  const today = new Date().toISOString().split('T')[0]
  const eventDate = safeCreateDate(event.start)
  return eventDate && eventDate.toISOString().split('T')[0] === today
}

/**
 * Check if an event is upcoming
 * @param {Object} event - Event object
 * @returns {boolean} - True if event is upcoming
 */
export const isEventUpcoming = (event) => {
  if (!isValidDate(event.start)) return false
  const now = new Date()
  const eventDate = safeCreateDate(event.start)
  return eventDate && eventDate > now
}

/**
 * Get events for a specific date
 * @param {Array} events - Array of events
 * @param {string|Date} targetDate - Target date
 * @returns {Array} - Events for the specified date
 */
export const getEventsByDate = (events, targetDate) => {
  if (!isValidDate(targetDate)) return []

  const target = safeCreateDate(targetDate)
  if (!target) return []

  const targetDateStr = target.toISOString().split('T')[0]

  return events.filter(event => {
    if (!isValidDate(event.start)) return false
    const eventDate = safeCreateDate(event.start)
    return eventDate && eventDate.toISOString().split('T')[0] === targetDateStr
  })
}
