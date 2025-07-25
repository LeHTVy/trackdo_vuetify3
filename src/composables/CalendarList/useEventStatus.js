import {
  getDaysBetween,
  isThisWeek,
  isNextWeek,
  getWeekNumber,
  getWeekYear,
  safeCreateDate,
  isValidDate
} from '@/utils/dateUtils.js'

/**
 * Composable for calculating event status based on timing
 * @returns {Object}
 */
export function useEventStatus() {

  /**
   * Calculate event status for today's events
   * @param {Object} event - Event object with start and end dates
   * @returns {Object} Status object with text and color
   */
  const getTodayEventStatus = (event) => {
    const now = new Date()
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    if (now > endDate) {
      return { text: 'Completed', color: 'success' }
    } else if (now >= startDate && now <= endDate) {
      return { text: 'Ongoing', color: 'warning' }
    } else {
      return { text: 'Upcoming', color: 'info' }
    }
  }

  /**
   * Calculate event status for upcoming events
   * @param {Object} event - Event object with start and end dates
   * @returns {Object} Status object with text and color
   */
  const getUpcomingEventStatus = (event) => {
    // Validate input
    if (!isValidDate(event.start)) {
      return { text: 'Invalid', color: 'error' }
    }

    const today = new Date()
    const startDate = safeCreateDate(event.start)

    if (!startDate) {
      return { text: 'Invalid', color: 'error' }
    }

    // Reset time to compare dates only
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())

    const diffDays = getDaysBetween(todayDate, eventDate)

    // Handle immediate timeframes first
    if (diffDays <= 0) {
      return { text: 'Today', color: 'warning' }
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', color: 'warning' }
    } else if (diffDays <= 3) {
      return { text: 'Soon', color: 'info' }
    }

    // Use week-based logic for better accuracy
    if (isThisWeek(startDate)) {
      return { text: 'This Week', color: 'primary' }
    } else if (isNextWeek(startDate)) {
      return { text: 'Next Week', color: 'primary' }
    } else {
      // Handle month-based logic for longer timeframes
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      const eventMonth = startDate.getMonth()
      const eventYear = startDate.getFullYear()

      if (eventYear === currentYear && eventMonth === currentMonth) {
        return { text: 'This Month', color: 'secondary' }
      } else if (
        (eventYear === currentYear && eventMonth === currentMonth + 1) ||
        (eventYear === currentYear + 1 && currentMonth === 11 && eventMonth === 0)
      ) {
        return { text: 'Next Month', color: 'secondary' }
      } else {
        return { text: 'Later', color: 'primary' }
      }
    }
  }

  /**
   * Get event status based on type and event data
   * @param {Object} event - Event object
   * @param {string} type - Type of list ('today' or 'upcoming')
   * @returns {Object} Status object with text and color
   */
  const getEventStatus = (event, type = 'upcoming') => {
    if (type === 'today') {
      return getTodayEventStatus(event)
    } else {
      return getUpcomingEventStatus(event)
    }
  }

  /**
   * Check if event is overdue
   * @param {Object} event - Event object
   * @returns {boolean} True if event is overdue
   */
  const isEventOverdue = (event) => {
    const now = new Date()
    const endDate = new Date(event.end)
    return now > endDate
  }

  /**
   * Check if event is currently active
   * @param {Object} event - Event object
   * @returns {boolean} True if event is currently active
   */
  const isEventActive = (event) => {
    const now = new Date()
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)
    return now >= startDate && now <= endDate
  }

  /**
   * Check if event is upcoming (starts in the future)
   * @param {Object} event - Event object
   * @returns {boolean} True if event is upcoming
   */
  const isEventUpcoming = (event) => {
    const now = new Date()
    const startDate = new Date(event.start)
    return startDate > now
  }

  /**
   * Get event urgency level
   * @param {Object} event - Event object
   * @returns {string} Urgency level ('high', 'medium', 'low')
   */
  const getEventUrgency = (event) => {
    const today = new Date()
    const startDate = new Date(event.start)
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())

    const diffDays = getDaysBetween(todayDate, eventDate)

    if (diffDays <= 0) {
      return 'high'
    } else if (diffDays <= 3) {
      return 'high'
    } else if (diffDays <= 7) {
      return 'medium'
    } else {
      return 'low'
    }
  }

  /**
   * Get all available status types
   * @returns {Array} Array of status types
   */
  const getStatusTypes = () => {
    return [
      'completed', 'ongoing', 'upcoming', 'today', 'tomorrow',
      'soon', 'this week', 'next week', 'this month', 'next month', 'later'
    ]
  }

  return {
    // Main status functions
    getEventStatus,
    getTodayEventStatus,
    getUpcomingEventStatus,

    // Helper functions
    isEventOverdue,
    isEventActive,
    isEventUpcoming,
    getEventUrgency,
    getStatusTypes
  }
}
