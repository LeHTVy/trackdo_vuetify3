import { computed } from 'vue'

export function useCalendarHeader(currentDate) {
  const getCurrentDateInfo = () => {
    const date = currentDate.value || new Date()
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: date.toLocaleDateString('en-US', { month: 'long' }),
      day: date.getDate(),
      fullDate: date.toLocaleDateString('en-US')
    }
  }

  const currentMonthYear = computed(() => {
    const dateInfo = getCurrentDateInfo()
    return `${dateInfo.monthName} ${dateInfo.year}`
  })

  const todayFormatted = computed(() => {
    const today = new Date()
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  })

  return {
    getCurrentDateInfo,
    currentMonthYear,
    todayFormatted
  }
}
