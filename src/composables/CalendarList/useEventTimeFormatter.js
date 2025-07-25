import {
  getDaysBetween,
  addDays,
  formatEventTime as utilsFormatEventTime,
  formatEventDate as utilsFormatEventDate,
  isToday,
  safeCreateDate,
  isValidDate
} from '@/utils/dateUtils.js'

/**
 * Composable for formatting event time display
 * @returns {Object} Event time formatting functions
 */
export function useEventTimeFormatter() {

  /**
   * Format time for today's events
   * @param {Object} event - Event object with start and end dates
   * @param {string} locale - Locale for formatting (default: 'en-US')
   * @returns {string} Formatted time string
   */
  const formatTodayEventTime = (event, locale = 'en-US') => {
    if (!isValidDate(event.start)) {
      return 'Invalid time'
    }

    return utilsFormatEventTime(event, locale)
  }

  /**
   * Format time for upcoming events
   * @param {Object} event - Event object with start and end dates
   * @param {string} locale - Locale for formatting (default: 'en-US')
   * @returns {string} Formatted date string
   */
  const formatUpcomingEventTime = (event, locale = 'en-US') => {
    if (!isValidDate(event.start)) {
      return 'Invalid date'
    }

    const startDate = safeCreateDate(event.start)
    if (!startDate) {
      return 'Invalid date'
    }

    if (isToday(startDate)) {
      return 'Today'
    }

    const today = new Date()
    const tomorrow = addDays(today, 1)
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
    const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())

    if (eventDate.getTime() === tomorrowDate.getTime()) {
      return 'Tomorrow'
    } else {
      const diffDays = getDaysBetween(todayDate, eventDate)

      if (diffDays <= 7) {
        return startDate.toLocaleDateString(locale, {
          weekday: 'long'
        })
      } else {
        return startDate.toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric'
        })
      }
    }
  }

  /**
   * Main event time formatter
   * @param {Object} event - Event object
   * @param {string} type - Type of list ('today' or 'upcoming')
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted time string
   */
  const formatEventTime = (event, type = 'upcoming', locale = 'en-US') => {
    if (type === 'today') {
      return formatTodayEventTime(event, locale)
    } else {
      return formatUpcomingEventTime(event, locale)
    }
  }

  /**
   * Format event duration
   * @param {Object} event - Event object
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted duration string
   */
  const formatEventDuration = (event, locale = 'en-US') => {
    if (!isValidDate(event.start)) {
      return 'Invalid duration'
    }

    if (!event.end || event.end === event.start || !isValidDate(event.end)) {
      return 'All day'
    }

    const startDate = safeCreateDate(event.start)
    const endDate = safeCreateDate(event.end)

    if (!startDate || !endDate) {
      return 'Invalid duration'
    }

    const durationMs = endDate.getTime() - startDate.getTime()

    if (durationMs <= 0) {
      return 'Invalid duration'
    }

    const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    if (durationHours === 0) {
      return `${durationMinutes} minutes`
    } else if (durationMinutes === 0) {
      return `${durationHours} hours`
    } else {
      return `${durationHours}h ${durationMinutes}m`
    }
  }

  /**
   * Format event date range
   * @param {Object} event - Event object
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted date range string
   */
  const formatEventDateRange = (event, locale = 'en-US') => {
    if (!isValidDate(event.start)) {
      return 'Invalid date'
    }

    const startDate = safeCreateDate(event.start)
    if (!startDate) {
      return 'Invalid date'
    }

    const startDateStr = startDate.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric'
    })

    if (!event.end || event.end === event.start || !isValidDate(event.end)) {
      return startDateStr
    }

    const endDate = safeCreateDate(event.end)
    if (!endDate) {
      return startDateStr
    }

    const endDateStr = endDate.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric'
    })

    if (startDate.toDateString() === endDate.toDateString()) {
      return startDateStr
    }

    return `${startDateStr} - ${endDateStr}`
  }

  /**
   * Format relative time (e.g., "in 2 hours", "3 days ago")
   * @param {Object} event - Event object
   * @param {string} locale - Locale for formatting
   * @returns {string} Relative time string
   */
  const formatRelativeTime = (event, locale = 'en-US') => {
    if (!isValidDate(event.start)) {
      return 'Invalid time'
    }

    const startDate = safeCreateDate(event.start)
    if (!startDate) {
      return 'Invalid time'
    }

    const now = new Date()
    const diffMs = startDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMs < 0) {
      // Past event
      const absDiffDays = Math.abs(diffDays)
      const absDiffHours = Math.abs(diffHours)
      const absDiffMinutes = Math.abs(diffMinutes)

      if (absDiffDays > 0) {
        return `${absDiffDays} days ago`
      } else if (absDiffHours > 0) {
        return `${absDiffHours} hours ago`
      } else {
        return `${absDiffMinutes} minutes ago`
      }
    } else {
      // Future event
      if (diffDays > 0) {
        return `in ${diffDays} days`
      } else if (diffHours > 0) {
        return `in ${diffHours} hours`
      } else {
        return `in ${diffMinutes} minutes`
      }
    }
  }

  /**
   * Check if event is all day
   * @param {Object} event - Event object
   * @returns {boolean} True if event is all day
   */
  const isAllDayEvent = (event) => {
    if (!isValidDate(event.start)) {
      return false
    }

    if (!event.end || event.end === event.start || !isValidDate(event.end)) {
      return true
    }

    const startDate = safeCreateDate(event.start)
    const endDate = safeCreateDate(event.end)

    if (!startDate || !endDate) {
      return false
    }

    // Check if times are at midnight (00:00)
    return startDate.getHours() === 0 &&
           startDate.getMinutes() === 0 &&
           endDate.getHours() === 0 &&
           endDate.getMinutes() === 0
  }

  /**
   * Get time formatting options for different contexts
   * @returns {Object}
   */
  const getTimeFormatOptions = () => {
    return {
      short: { hour: '2-digit', minute: '2-digit' },
      medium: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
      long: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }
    }
  }

  return {
    // Main formatting functions
    formatEventTime,
    formatTodayEventTime,
    formatUpcomingEventTime,

    // Additional formatting functions
    formatEventDuration,
    formatEventDateRange,
    formatRelativeTime,

    // Helper functions
    isAllDayEvent,
    getTimeFormatOptions
  }
}
