/**
 * Event Utility Functions
 * Centralized logic for event operations across the application
 */

/**
 * Get color for event type
 * @param {string} type - Event type
 * @returns {string} - Color hex code
 */
export const getEventTypeColor = (type) => {
  const colorMap = {
    meeting: '#1976D2',
    work: '#388E3C',
    personal: '#F57C00',
    reminder: '#7B1FA2',
    deadline: '#D32F2F',
    appointment: '#0288D1',
    task: '#5D4037',
    event: '#455A64',
    default: '#757575'
  }
  
  return colorMap[type] || colorMap.default
}

/**
 * Get priority color for events
 * @param {string} priority - Event priority (high, medium, low)
 * @returns {string} - Color hex code
 */
export const getEventPriorityColor = (priority) => {
  const priorityColors = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#4CAF50',
    default: '#9E9E9E'
  }
  
  return priorityColors[priority] || priorityColors.default
}

/**
 * Get status color for events
 * @param {string} status - Event status
 * @returns {string} - Color hex code
 */
export const getEventStatusColor = (status) => {
  const statusColors = {
    pending: '#FF9800',
    confirmed: '#4CAF50',
    cancelled: '#F44336',
    completed: '#2196F3',
    default: '#9E9E9E'
  }
  
  return statusColors[status] || statusColors.default
}

/**
 * Get event display color (combines type, priority, and status)
 * @param {Object} event - Event object
 * @returns {string} - Color hex code
 */
export const getEventDisplayColor = (event) => {
  // Priority: status > priority > type
  if (event.status && event.status !== 'confirmed') {
    return getEventStatusColor(event.status)
  }
  
  if (event.priority && event.priority !== 'medium') {
    return getEventPriorityColor(event.priority)
  }
  
  return getEventTypeColor(event.type)
}

/**
 * Get event icon based on type
 * @param {string} type - Event type
 * @returns {string} - Icon name
 */
export const getEventTypeIcon = (type) => {
  const iconMap = {
    meeting: 'mdi-account-group',
    work: 'mdi-briefcase',
    personal: 'mdi-account',
    reminder: 'mdi-bell',
    deadline: 'mdi-clock-alert',
    appointment: 'mdi-calendar-clock',
    task: 'mdi-check-circle',
    event: 'mdi-calendar-star',
    default: 'mdi-calendar'
  }
  
  return iconMap[type] || iconMap.default
}

/**
 * Get priority icon
 * @param {string} priority - Event priority
 * @returns {string} - Icon name
 */
export const getEventPriorityIcon = (priority) => {
  const priorityIcons = {
    high: 'mdi-arrow-up-bold',
    medium: 'mdi-minus',
    low: 'mdi-arrow-down-bold',
    default: 'mdi-minus'
  }
  
  return priorityIcons[priority] || priorityIcons.default
}

/**
 * Get status icon
 * @param {string} status - Event status
 * @returns {string} - Icon name
 */
export const getEventStatusIcon = (status) => {
  const statusIcons = {
    pending: 'mdi-clock-outline',
    confirmed: 'mdi-check-circle',
    cancelled: 'mdi-cancel',
    completed: 'mdi-check-circle-outline',
    default: 'mdi-help-circle'
  }
  
  return statusIcons[status] || statusIcons.default
}

/**
 * Format event for display
 * @param {Object} event - Event object
 * @param {Object} options - Formatting options
 * @returns {Object} - Formatted event object
 */
export const formatEventForDisplay = (event, options = {}) => {
  const {
    includeTime = true,
    includeDate = true,
    includeColor = true,
    includeIcon = true,
    locale = 'vi-VN'
  } = options

  const formatted = { ...event }

  if (includeTime) {
    formatted.displayTime = formatEventTime(event, locale)
  }

  if (includeDate) {
    formatted.displayDate = formatEventDate(event, locale)
  }

  if (includeColor) {
    formatted.displayColor = getEventDisplayColor(event)
    formatted.typeColor = getEventTypeColor(event.type)
    formatted.priorityColor = getEventPriorityColor(event.priority)
    formatted.statusColor = getEventStatusColor(event.status)
  }

  if (includeIcon) {
    formatted.typeIcon = getEventTypeIcon(event.type)
    formatted.priorityIcon = getEventPriorityIcon(event.priority)
    formatted.statusIcon = getEventStatusIcon(event.status)
  }

  return formatted
}

/**
 * Sort events by date and time
 * @param {Array} events - Array of events
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted events
 */
export const sortEventsByDateTime = (events, order = 'asc') => {
  return [...events].sort((a, b) => {
    const dateStringA = a.start || a.date
    const dateStringB = b.start || b.date
    
    // Handle invalid dates - put them at the end
    const dateA = safeCreateDate(dateStringA)
    const dateB = safeCreateDate(dateStringB)
    
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    
    if (order === 'desc') {
      return dateB - dateA
    }
    return dateA - dateB
  })
}

/**
 * Group events by date
 * @param {Array} events - Array of events
 * @returns {Object} - Events grouped by date
 */
export const groupEventsByDate = (events) => {
  return events.reduce((groups, event) => {
    const dateString = event.start || event.date
    
    // Skip events with invalid dates
    if (!isValidDate(dateString)) {
      console.warn('Skipping event with invalid date:', event)
      return groups
    }
    
    const dateObj = safeCreateDate(dateString)
    if (!dateObj) {
      console.warn('Skipping event with unparseable date:', event)
      return groups
    }
    
    const date = dateObj.toISOString().split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {})
}

// Import date utilities
import {
  formatEventTime,
  formatEventDate,
  isValidDate,
  safeCreateDate
} from './dateUtils.js'