import { computed } from 'vue'
import {
  isValidDate,
  safeCreateDate,
  getEventsByDate,
  isEventToday,
  isEventUpcoming
} from '@/utils/dateUtils.js'
import {
  sortEventsByDateTime,
  groupEventsByDate as groupEvents
} from '@/utils/eventUtils.js'

export function useCalendarEvents (events) {
  const getEventsForDate = dateString => {
    if (!dateString || !events.value?.length) {
      return []
    }

    try {
      return getEventsByDate(events.value, dateString)
    } catch (error) {
      console.warn('Error filtering events for date:', dateString, error)
      return []
    }
  }

  const hasEventsForDate = dateString => {
    return getEventsForDate(dateString).length > 0
  }

  const todayEvents = computed(() => {
    if (!events.value?.length) {
      return []
    }
    return events.value.filter(event => isEventToday(event))
  })

  const upcomingEvents = computed(() => {
    if (!events.value?.length) {
      return []
    }

    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcoming = events.value.filter(event => {
      if (!event || !isValidDate(event.start)) {
        return false
      }
      try {
        const eventDate = safeCreateDate(event.start)
        return eventDate && eventDate >= today && eventDate <= nextWeek
      } catch (error) {
        console.warn('Error processing upcoming event:', event, error)
        return false
      }
    })

    return sortEventsByDateTime(upcoming)
  })

  const getEventsForMonth = (year, month) => {
    if (!events.value?.length) {
      return []
    }

    return events.value.filter(event => {
      if (!event || !isValidDate(event.start)) {
        return false
      }
      try {
        const eventDate = safeCreateDate(event.start)
        return eventDate && eventDate.getFullYear() === year && eventDate.getMonth() === month
      } catch (error) {
        console.warn('Error processing month event:', event, error)
        return false
      }
    })
  }

  const groupEventsByDate = eventsList => {
    if (!eventsList?.length) {
      return {}
    }
    return groupEvents(eventsList)
  }

  const handleDateClick = (dateString, updateSelectedDate, emitDateClick) => {
    try {
      const dateObj = safeCreateDate(dateString)

      if (!dateObj) {
        console.warn('Invalid date string:', dateString)
        return {
          date: null,
          dateString,
          events: [],
          hasEvents: false,
        }
      }

      if (updateSelectedDate && typeof updateSelectedDate === 'function') {
        updateSelectedDate(dateObj)
      }

      const eventsForDate = getEventsForDate(dateString)

      const eventData = {
        date: dateObj,
        dateString,
        events: eventsForDate,
        hasEvents: eventsForDate.length > 0,
      }

      if (emitDateClick && typeof emitDateClick === 'function') {
        emitDateClick(eventData)
      }

      return eventData
    } catch (error) {
      console.warn('Error handling date click:', dateString, error)
      return {
        date: null,
        dateString,
        events: [],
        hasEvents: false,
      }
    }
  }

  return {
    getEventsForDate,
    hasEventsForDate,
    todayEvents,
    upcomingEvents,
    getEventsForMonth,
    groupEventsByDate,
    handleDateClick,
    // Re-export utilities for backward compatibility
    isValidDate,
  }
}
