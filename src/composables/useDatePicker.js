import { computed } from 'vue'
import { useCalendarEvents } from './useCalendarEvents'

export function useDatePicker (events, modelValue, emit) {
  const { getEventsForDate, groupEventsByDate, handleDateClick: handleDateClickLogic } = useCalendarEvents(events)

  const selectedDate = computed({
    get: () => modelValue.value,
    set: value => emit('update:modelValue', value),
  })

  const eventsByDate = computed(() => {
    return groupEventsByDate(events.value || [])
  })

  const handleDateClick = date => {
    try {
      let dateString
      if (date instanceof Date) {
        dateString = date.toISOString().split('T')[0]
      } else if (typeof date === 'string') {
        dateString = date
      } else {
        console.error('Invalid date format:', date)
        return
      }

      handleDateClickLogic(
        dateString,
        dateObj => {
          selectedDate.value = dateObj
        },
        eventData => {
          emit('date-click', eventData)
        },
      )
    } catch (error) {
      console.error('Error in handleDateClick:', error)
    }
  }

  const handleAddEvent = () => {
    emit('add-event')
  }

  const getDayPosition = dateString => {
    try {
      const date = new Date(dateString)
      const dayOfWeek = date.getDay()
      const weekOfMonth = Math.ceil(date.getDate() / 7)

      return {
        left: `${(dayOfWeek * 14.28) + 7.14}%`,
        top: `${(weekOfMonth * 40) + 20}px`,
      }
    } catch {
      return { left: '0%', top: '0px' }
    }
  }

  return {
    selectedDate,
    eventsByDate,
    handleDateClick,
    handleAddEvent,
    getDayPosition,
    getEventsForDate,
    groupEventsByDate,
  }
}
