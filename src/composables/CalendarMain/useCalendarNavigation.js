import { ref, computed } from 'vue'

export function useCalendarNavigation(initialDate = new Date(), initialView = 'monthly') {
  const currentDate = ref(initialDate)
  const calendarType = ref(initialView)
  const viewTypes = ['monthly', 'weekly']

  /**
   * Navigate to previous period based on current view
   */
  const navigatePrev = () => {
    const newDate = new Date(currentDate.value)

    switch (calendarType.value) {
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'weekly':
        newDate.setDate(newDate.getDate() - 7)
        break
      default:
        newDate.setMonth(newDate.getMonth() - 1)
    }

    currentDate.value = newDate
  }

  /**
   * Navigate to next period based on current view
   */
  const navigateNext = () => {
    const newDate = new Date(currentDate.value)

    switch (calendarType.value) {
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7)
        break
      default:
        newDate.setMonth(newDate.getMonth() + 1)
    }

    currentDate.value = newDate
  }

  const prevMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentDate.value = newDate
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentDate.value = newDate
  }

  /**
   * Navigate to today
   */
  const goToToday = () => {
    currentDate.value = new Date()
  }

  /**
   * Change calendar view type
   * @param {string} viewType
   */
  const changeView = (viewType) => {
    if (viewTypes.includes(viewType)) {
      calendarType.value = viewType
    }
  }

  /**
   * Navigate to specific date
   * @param {Date|string} date
   */
  const goToDate = (date) => {
    currentDate.value = new Date(date)
  }

  /**
   * Navigate by specific number of periods
   * @param {number} periods
   */
  const navigateByPeriods = (periods) => {
    const newDate = new Date(currentDate.value)

    switch (calendarType.value) {
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + periods)
        break
      case 'weekly':
        newDate.setDate(newDate.getDate() + (periods * 7))
        break
      default:
        newDate.setMonth(newDate.getMonth() + periods)
    }

    currentDate.value = newDate
  }

  /**
   * Get current date information with enhanced details
   */
  const getCurrentDateInfo = () => {
    const date = currentDate.value
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: date.toLocaleDateString('en-US', { month: 'long' }),
      monthShort: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: date.toLocaleDateString('en-US'),
      isoDate: date.toISOString().split('T')[0],
      timestamp: date.getTime()
    }
  }

  /**
   * Get date range for current view
   */
  const getCurrentRange = computed(() => {
    const date = new Date(currentDate.value)

    switch (calendarType.value) {
      case 'monthly': {
        const start = new Date(date.getFullYear(), date.getMonth(), 1)
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        return { start, end }
      }
      case 'weekly': {
        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1)
        const start = new Date(date.setDate(diff))
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        return { start, end }
      }
      default: {
        const start = new Date(date.getFullYear(), date.getMonth(), 1)
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        return { start, end }
      }
    }
  })

  /**
   * Check if we can navigate to previous period
   * @param {Date} minDate
   */
  const canNavigatePrev = (minDate = null) => {
    if (!minDate) return true

    const range = getCurrentRange.value
    return range.start > minDate
  }

  /**
   * Check if we can navigate to next period
   * @param {Date} maxDate
   */
  const canNavigateNext = (maxDate = null) => {
    if (!maxDate) return true

    const range = getCurrentRange.value
    return range.end < maxDate
  }

  /**
   * Get formatted title for current view
   */
  const getViewTitle = computed(() => {
    const dateInfo = getCurrentDateInfo()

    switch (calendarType.value) {
      case 'monthly':
        return `${dateInfo.monthName} ${dateInfo.year}`
      case 'weekly': {
        const range = getCurrentRange.value
        const startMonth = range.start.toLocaleDateString('en-US', { month: 'short' })
        const endMonth = range.end.toLocaleDateString('en-US', { month: 'short' })
        const startDay = range.start.getDate()
        const endDay = range.end.getDate()

        if (startMonth === endMonth) {
          return `${startMonth} ${startDay}-${endDay}, ${dateInfo.year}`
        } else {
          return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${dateInfo.year}`
        }
      }
      default:
        return `${dateInfo.monthName} ${dateInfo.year}`
    }
  })

  return {
    // State
    currentDate,
    calendarType,

    // Computed
    getCurrentRange,
    getViewTitle,

    // Constants
    viewTypes,

    // Navigation methods
    navigatePrev,
    navigateNext,
    navigateByPeriods,
    goToToday,
    goToDate,

    // Legacy methods
    prevMonth,
    nextMonth,

    // View management
    changeView,
    canNavigatePrev,
    canNavigateNext,

    // Information getters
    getCurrentDateInfo
  }
}
