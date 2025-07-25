export const isValidDate = (dateString) => {
  if (!dateString) return false
  try {
    const date = new Date(dateString)
    return !Number.isNaN(date.getTime())
  } catch {
    return false
  }
}

export const safeCreateDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return Number.isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

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

export const formatDateISO = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

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

export const formatHour = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

export const isToday = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    return dateObj.toDateString() === today.toDateString()
  } catch {
    return false
  }
}

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

export const addDays = (date, days) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    dateObj.setDate(dateObj.getDate() + days)
    return dateObj
  } catch {
    return new Date()
  }
}

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

export const isEventToday = (event) => {
  if (!isValidDate(event.start)) return false
  const today = new Date().toISOString().split('T')[0]
  const eventDate = safeCreateDate(event.start)
  return eventDate && eventDate.toISOString().split('T')[0] === today
}

export const isEventUpcoming = (event) => {
  if (!isValidDate(event.start)) return false
  const now = new Date()
  const eventDate = safeCreateDate(event.start)
  return eventDate && eventDate > now
}

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

/**
 * Get week number of the year (ISO 8601 standard)
 * @param {Date|string} date - Date to get week number for
 * @returns {number} Week number (1-53)
 */
export const getWeekNumber = (date) => {
  try {
    const dateObj = typeof date === 'string' ? safeCreateDate(date) : new Date(date)
    if (!dateObj) return 0

    // Copy date so we don't modify original
    const target = new Date(dateObj.valueOf())
    const dayNr = (dateObj.getDay() + 6) % 7
    target.setDate(target.getDate() - dayNr + 3)
    const firstThursday = target.valueOf()
    target.setMonth(0, 1)
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000) // 604800000 = 7 * 24 * 3600 * 1000
  } catch {
    return 0
  }
}

/**
 * Get year for the week number (handles edge cases around year boundaries)
 * @param {Date|string} date - Date to get week year for
 * @returns {number} Year for the week
 */
export const getWeekYear = (date) => {
  try {
    const dateObj = typeof date === 'string' ? safeCreateDate(date) : new Date(date)
    if (!dateObj) return new Date().getFullYear()

    const target = new Date(dateObj.valueOf())
    const dayNr = (dateObj.getDay() + 6) % 7
    target.setDate(target.getDate() - dayNr + 3)
    return target.getFullYear()
  } catch {
    return new Date().getFullYear()
  }
}

/**
 * Check if a date is in the current week
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in current week
 */
export const isThisWeek = (date) => {
  try {
    const dateObj = typeof date === 'string' ? safeCreateDate(date) : new Date(date)
    if (!dateObj) return false

    const today = new Date()
    const currentWeek = getWeekNumber(today)
    const currentYear = getWeekYear(today)
    const dateWeek = getWeekNumber(dateObj)
    const dateYear = getWeekYear(dateObj)

    return currentWeek === dateWeek && currentYear === dateYear
  } catch {
    return false
  }
}

/**
 * Check if a date is in the next week
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in next week
 */
export const isNextWeek = (date) => {
  try {
    const dateObj = typeof date === 'string' ? safeCreateDate(date) : new Date(date)
    if (!dateObj) return false

    const today = new Date()
    const currentWeek = getWeekNumber(today)
    const currentYear = getWeekYear(today)
    const dateWeek = getWeekNumber(dateObj)
    const dateYear = getWeekYear(dateObj)

    // Handle year boundary case
    if (currentYear !== dateYear) {
      if (currentYear + 1 === dateYear && currentWeek >= 52 && dateWeek === 1) {
        return true
      }
      return false
    }

    return dateWeek === currentWeek + 1
  } catch {
    return false
  }
}
