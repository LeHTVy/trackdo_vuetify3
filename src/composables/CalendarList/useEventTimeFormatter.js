import {
  addDays,
  getDaysBetween,
  isToday,
  isValidDate,
  safeCreateDate,
  formatEventTime as utilsFormatEventTime,
} from '@/utils/dateUtils.js'

export function useEventTimeFormatter () {

  const formatTodayEventTime = (event, locale = 'en-US') => {
    if (!isValidDate(event.start)) {
      return 'Invalid time'
    }

    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`
    }

    return utilsFormatEventTime(event, locale)
  }

  const formatUpcomingEventTime = (event, locale = 'en-US') => {
    if (!isValidDate(event.start)) {
      return 'Invalid date'
    }

    const startDate = safeCreateDate(event.start)
    if (!startDate) {
      return 'Invalid date'
    }

    let dateText = ''

    if (isToday(startDate)) {
      dateText = 'Today'
    } else {
      const today = new Date()
      const tomorrow = addDays(today, 1)
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
      const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())

      if (eventDate.getTime() === tomorrowDate.getTime()) {
        dateText = 'Tomorrow'
      } else {
        const diffDays = getDaysBetween(todayDate, eventDate)

        if (diffDays <= 7) {
          dateText = startDate.toLocaleDateString(locale, {
            weekday: 'long',
          })
        } else {
          dateText = startDate.toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
          })
        }
      }
    }

    // Add time if available
    if (event.startTime) {
      return `${dateText} at ${event.startTime}`
    }

    return dateText
  }

  const formatEventTime = (event, type = 'upcoming', locale = 'en-US') => {
    if (type === 'today') {
      return formatTodayEventTime(event, locale)
    } else {
      return formatUpcomingEventTime(event, locale)
    }
  }

  const formatEventDuration = event => {
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
      day: 'numeric',
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
      day: 'numeric',
    })

    if (startDate.toDateString() === endDate.toDateString()) {
      return startDateStr
    }

    return `${startDateStr} - ${endDateStr}`
  }

  const formatRelativeTime = event => {
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

  const isAllDayEvent = event => {
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

  const getTimeFormatOptions = () => {
    return {
      short: { hour: '2-digit', minute: '2-digit' },
      medium: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
      long: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      },
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
    getTimeFormatOptions,
  }
}
