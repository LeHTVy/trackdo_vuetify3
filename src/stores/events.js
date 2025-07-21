import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
// Import utility functions
import {
  isValidDate,
  safeCreateDate,
  formatEventTime,
  formatEventDate,
  isEventToday,
  isEventUpcoming,
  getEventsByDate
} from '@/utils/dateUtils.js'
import {
  getEventTypeColor,
  getEventPriorityColor,
  getEventStatusColor,
  getEventDisplayColor,
  formatEventForDisplay,
  sortEventsByDateTime,
  groupEventsByDate
} from '@/utils/eventUtils.js'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentView = ref('month')
  const selectedDate = ref(new Date())
  const filters = ref({
    type: 'All',
    priority: 'All',
    status: 'All',
    search: '',
    attendees: [],
  })

  const totalEvents = computed(() => events.value.length)

  const upcomingEvents = computed(() => {
    return sortEventsByDateTime(
      events.value.filter(event => isEventUpcoming(event))
    )
  })

  const todayEvents = computed(() => {
    return events.value.filter(event => isEventToday(event))
  })

  const thisWeekEvents = computed(() => {
    const today = new Date()
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
    const weekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6)

    return events.value.filter(event => {
      if (!isValidDate(event.start)) {
        return false
      }
      const eventDate = safeCreateDate(event.start)
      return eventDate && eventDate >= weekStart && eventDate <= weekEnd
    })
  })

  const filteredEvents = computed(() => {
    let filtered = events.value

    if (filters.value.type !== 'All') {
      filtered = filtered.filter(event => event.type === filters.value.type)
    }

    if (filters.value.priority !== 'All') {
      filtered = filtered.filter(event => event.priority === filters.value.priority)
    }

    if (filters.value.status !== 'All') {
      filtered = filtered.filter(event => event.status === filters.value.status)
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search)
        || event.description.toLowerCase().includes(search),
      )
    }

    if (filters.value.attendees.length > 0) {
      filtered = filtered.filter(event =>
        filters.value.attendees.some(attendee => event.attendees.includes(attendee)),
      )
    }

    return filtered
  })

  const eventStats = computed(() => {
    const total = events.value.length
    const upcoming = upcomingEvents.value.length
    const today = todayEvents.value.length
    const thisWeek = thisWeekEvents.value.length
    const completed = events.value.filter(event => event.status === 'Completed').length
    const cancelled = events.value.filter(event => event.status === 'Cancelled').length

    return {
      total,
      upcoming,
      today,
      thisWeek,
      completed,
      cancelled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  const allEventTypes = computed(() => {
    const typeSet = new Set()
    for (const event of events.value) {
      if (event.type) {
        typeSet.add(event.type)
      }
    }
    return Array.from(typeSet).sort()
  })

  const allAttendees = computed(() => {
    const attendeeSet = new Set()
    for (const event of events.value) {
      if (event.attendees) {
        for (const attendee of event.attendees) {
          attendeeSet.add(attendee)
        }
      }
    }
    return Array.from(attendeeSet).sort()
  })

  const calendarEvents = computed(() => {
    return events.value.filter(event => {
      return isValidDate(event.start) && isValidDate(event.end)
    }).map(event => {
      const startDate = safeCreateDate(event.start)
      const endDate = safeCreateDate(event.end)

      if (!startDate || !endDate) {
        console.warn('Invalid date in event:', event)
        return null
      }

      return {
        ...event,
        start: startDate,
        end: endDate,
        color: getEventTypeColor(event.type),
      }
    }).filter(Boolean) // Remove null entries
  })

  const initializeStore = async () => {
    await fetchEvents()
  }

  const fetchEvents = async () => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.events.getAll()
      if (result.success) {
        events.value = result.data
        console.log('✅ Events loaded from MongoDB:', result.data.length)
      } else {
        console.warn('⚠️ Failed to load from MongoDB')
        error.value = result.error
      }
    } catch (error_) {
      console.error('❌ Error fetching events:', error_)
      error.value = error_.message
    } finally {
      loading.value = false
    }
  }

  const addEvent = async eventData => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.events.create(eventData)
      if (result.success) {
        events.value.push(result.data)
        console.log('✅ Event created in MongoDB:', result.data)
        return result.data
      } else {
        console.error('❌ Failed to create event:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error creating event:', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const updateEvent = async (eventId, updates) => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.events.update(eventId, updates)
      if (result.success) {
        const index = events.value.findIndex(event => event.id === eventId)
        if (index !== -1) {
          events.value[index] = result.data
        }
        console.log('✅ Event updated in MongoDB:', result.data)
        return result.data
      } else {
        console.error('❌ Failed to update event:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error updating event:', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteEvent = async eventId => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.events.delete(eventId)
      if (result.success) {
        const index = events.value.findIndex(event => event.id === eventId)
        if (index !== -1) {
          const deletedEvent = events.value.splice(index, 1)[0]
          console.log('✅ Event deleted from MongoDB:', deletedEvent)
          return deletedEvent
        }
      } else {
        console.error('❌ Failed to delete event:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error deleting event:', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const moveEvent = (eventId, newStart, newEnd) => {
    const event = events.value.find(event => event.id === eventId)
    if (event) {
      event.startDate = newStart
      event.endDate = newEnd
      event.updatedAt = new Date().toISOString()
      return event
    }
    return null
  }

  const changeEventStatus = (eventId, status) => {
    const event = events.value.find(event => event.id === eventId)
    if (event) {
      event.status = status
      event.updatedAt = new Date().toISOString()
      return event
    }
    return null
  }

  const addAttendee = (eventId, attendeeName) => {
    const event = events.value.find(event => event.id === eventId)
    if (event && !event.attendees.includes(attendeeName)) {
      event.attendees.push(attendeeName)
      event.updatedAt = new Date().toISOString()
      return event
    }
    return null
  }

  const removeAttendee = (eventId, attendeeName) => {
    const event = events.value.find(event => event.id === eventId)
    if (event) {
      const index = event.attendees.indexOf(attendeeName)
      if (index !== -1) {
        event.attendees.splice(index, 1)
        event.updatedAt = new Date().toISOString()
        return event
      }
    }
    return null
  }

  const setCurrentView = view => {
    currentView.value = view
  }

  const setSelectedDate = date => {
    selectedDate.value = date
  }

  const setFilter = (filterType, value) => {
    filters.value[filterType] = value
  }

  const clearFilters = () => {
    filters.value = {
      type: 'All',
      priority: 'All',
      status: 'All',
      search: '',
      attendees: [],
    }
  }

  const getEventById = eventId => {
    return events.value.find(event => event.id === eventId)
  }

  const getEventsByDateLocal = date => {
    return getEventsByDate(events.value, date)
  }

  const getEventsByProject = projectId => {
    return events.value.filter(event => event.projectId === projectId)
  }

  const getEventsByType = type => {
    return events.value.filter(event => event.type === type)
  }

  const getConflictingEvents = (startDate, endDate, excludeEventId = null) => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return []
    }

    const newStart = safeCreateDate(startDate)
    const newEnd = safeCreateDate(endDate)
    if (!newStart || !newEnd) {
      return []
    }

    return events.value.filter(event => {
      if (excludeEventId && event.id === excludeEventId) {
        return false
      }

      if (!isValidDate(event.start) || !isValidDate(event.end)) {
        return false
      }

      const eventStart = safeCreateDate(event.start)
      const eventEnd = safeCreateDate(event.end)

      if (!eventStart || !eventEnd) {
        return false
      }

      return (newStart < eventEnd && newEnd > eventStart)
    })
  }

  const generateRecurringEvents = (baseEvent, recurrenceRule) => {
    if (!isValidDate(baseEvent.start) || !isValidDate(baseEvent.end)) {
      console.warn('Invalid dates in base event for recurring generation')
      return []
    }

    const recurringEvents = []
    const startDate = safeCreateDate(baseEvent.start)
    const endDate = safeCreateDate(baseEvent.end)

    if (!startDate || !endDate) {
      return []
    }

    const duration = endDate.getTime() - startDate.getTime()
    const currentDate = new Date(startDate)
    let count = 0
    const maxOccurrences = recurrenceRule.count || 10

    while (count < maxOccurrences) {
      if (count > 0) {
        const newEvent = {
          ...baseEvent,
          id: `${baseEvent.id}_${count}`,
          start: currentDate.toISOString(),
          end: new Date(currentDate.getTime() + duration).toISOString(),
          isRecurring: true,
          parentEventId: baseEvent.id,
        }
        recurringEvents.push(newEvent)
      }

      switch (recurrenceRule.frequency) {
        case 'daily': {
          currentDate.setDate(currentDate.getDate() + (recurrenceRule.interval || 1))
          break
        }
        case 'weekly': {
          currentDate.setDate(currentDate.getDate() + 7 * (recurrenceRule.interval || 1))
          break
        }
        case 'monthly': {
          currentDate.setMonth(currentDate.getMonth() + (recurrenceRule.interval || 1))
          break
        }
        case 'yearly': {
          currentDate.setFullYear(currentDate.getFullYear() + (recurrenceRule.interval || 1))
          break
        }
      }

      count++
    }

    return recurringEvents
  }

  return {
    events,
    loading,
    error,
    currentView,
    selectedDate,
    filters,

    totalEvents,
    upcomingEvents,
    todayEvents,
    thisWeekEvents,
    filteredEvents,
    eventStats,
    allEventTypes,
    allAttendees,
    calendarEvents,

    initializeStore,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,

    moveEvent,
    changeEventStatus,
    addAttendee,
    removeAttendee,
    setCurrentView,
    setSelectedDate,
    setFilter,
    clearFilters,
    getEventById,
    getEventsByDate: getEventsByDateLocal,
    getEventsByProject,
    getEventsByType,
    getConflictingEvents,
    generateRecurringEvents,

    // Expose utility functions for components
    getEventTypeColor,
    getEventPriorityColor,
    getEventStatusColor,
    getEventDisplayColor,
    formatEventTime,
    formatEventDate,
    formatEventForDisplay,
    isEventToday,
    isEventUpcoming,
  }
})
