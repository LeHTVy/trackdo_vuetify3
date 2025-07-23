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
