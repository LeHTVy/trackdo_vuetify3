import { computed } from 'vue'

export function useCalendarGrid(currentValue, viewType = 'monthly') {
  const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const fullWeekdayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const calendarDays = computed(() => {
    if (!currentValue.value) return []

    const currentViewType = viewType?.value || viewType || 'monthly'

    switch (currentViewType) {
      case 'weekly':
        return getWeeklyView(currentValue.value)
      case 'monthly':
      default:
        return getMonthlyView(currentValue.value)
    }
  })

  /**
   * Generate monthly view grid
   */
  const getMonthlyView = (currentDate) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7

    const days = []
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({
        date,
        isCurrentMonth: false,
        isPreviousMonth: true,
        isNextMonth: false
      })
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isPreviousMonth: false,
        isNextMonth: false
      })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isPreviousMonth: false,
        isNextMonth: true
      })
    }

    return days
  }

  /**
   * Generate weekly view grid
   */
  const getWeeklyView = (currentDate) => {
    const startOfWeek = getStartOfWeek(currentDate)
    const days = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isPreviousMonth: date.getMonth() < currentDate.getMonth(),
        isNextMonth: date.getMonth() > currentDate.getMonth()
      })
    }

    return days
  }

  /**
   * Generate daily view grid
   */
  const getDailyView = (currentDate) => {
    return [{
      date: new Date(currentDate),
      isCurrentMonth: true,
      isPreviousMonth: false,
      isNextMonth: false
    }]
  }

  /**
   * Check if a date is today
   * @param {Date} date
   */
  const isToday = (date) => {
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return today.getTime() === checkDate.getTime()
  }

  /**
   * Check if a date is in the past
   * @param {Date} date
   */
  const isPast = (date) => {
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate.getTime() < today.getTime()
  }

  /**
   * Check if a date is in the future
   * @param {Date} date
   */
  const isFuture = (date) => {
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate.getTime() > today.getTime()
  }

  /**
   * Check if a date is a weekend (Saturday or Sunday)
   * @param {Date} date
   */
  const isWeekend = (date) => {
    if (!date) return false
    const day = date.getDay()
    return day === 0 || day === 6
  }

  /**
   * Format month and year for display
   * @param {Date} date
   * @param {string} locale
   */
  const formatMonthYear = (date, locale = 'en-US') => {
    if (!date) return ''

    return date.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric'
    })
  }

  /**
   * Format date for display
   * @param {Date} date
   * @param {string} locale
   */
  const formatDate = (date, locale = 'en-US') => {
    if (!date) return ''

    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Format date for short display
   * @param {Date} date
   * @param {string} locale
   */
  const formatDateShort = (date, locale = 'en-US') => {
    if (!date) return ''

    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * Get week number for a date
   * @param {Date} date
   */
  const getWeekNumber = (date) => {
    if (!date) return 0

    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  /**
   * Get the start of week for a given date (Monday)
   * @param {Date} date
   */
  const getStartOfWeek = (date) => {
    if (!date) return null

    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  /**
   * Get the end of week for a given date (Sunday)
   * @param {Date} date
   */
  const getEndOfWeek = (date) => {
    if (!date) return null

    const startOfWeek = getStartOfWeek(date)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return endOfWeek
  }

  /**
   * Get days between two dates
   * @param {Date} startDate
   * @param {Date} endDate
   */
  const getDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0

    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)

    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return {
    // Computed
    calendarDays,

    // Constants
    weekdayLabels,
    fullWeekdayLabels,

    // Methods
    isToday,
    isPast,
    isFuture,
    isWeekend,
    formatMonthYear,
    formatDate,
    formatDateShort,
    getWeekNumber,
    getStartOfWeek,
    getEndOfWeek,
    getDaysBetween
  }
}
