import { ref } from 'vue'

export function useCalendarNavigation(initialDate = new Date(), initialView = 'month') {
  const currentDate = ref(initialDate)
  const calendarType = ref(initialView)

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

  const goToToday = () => {
    currentDate.value = new Date()
  }

  const changeView = (viewType) => {
    calendarType.value = viewType
  }

  const goToDate = (date) => {
    currentDate.value = new Date(date)
  }

  const getCurrentDateInfo = () => {
    const date = currentDate.value
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: date.toLocaleDateString('en-US', { month: 'long' }),
      day: date.getDate(),
      fullDate: date.toLocaleDateString('en-US')
    }
  }

  return {
    // State
    currentDate,
    calendarType,

    // Methods
    prevMonth,
    nextMonth,
    goToToday,
    changeView,
    goToDate,
    getCurrentDateInfo
  }
}
