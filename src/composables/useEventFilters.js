import { computed } from 'vue'

export function useEventFilters(events) {
  const formattedEvents = computed(() => {
    if (!events.value || !Array.isArray(events.value)) return []

    return events.value.map(event => ({
      ...event,
      title: event.name || event.title,
      start: new Date(event.start),
      end: new Date(event.end)
    }))
  })

  const todayEvents = computed(() => {
    if (!events.value || !Array.isArray(events.value)) return []

    const today = new Date()
    const todayStr = today.toISOString().substr(0, 10)

    return events.value.filter(event => {
      const eventStart = new Date(event.start).toISOString().substr(0, 10)
      const eventEnd = new Date(event.end).toISOString().substr(0, 10)
      return eventStart <= todayStr && eventEnd >= todayStr
    }).sort((a, b) => new Date(a.start) - new Date(b.start))
  })

  const upcomingEvents = computed(() => {
    if (!events.value || !Array.isArray(events.value)) return []

    const today = new Date()
    const todayStr = today.toISOString().substr(0, 10)

    return events.value.filter(event => {
      const eventStart = new Date(event.start).toISOString().substr(0, 10)
      return eventStart > todayStr
    }).sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 5)
  })

  const getEventsForDate = (date) => {
    if (!events.value || !Array.isArray(events.value)) return []

    const dateStr = new Date(date).toISOString().substr(0, 10)

    return events.value.filter(event => {
      const eventStart = new Date(event.start).toISOString().substr(0, 10)
      const eventEnd = new Date(event.end).toISOString().substr(0, 10)
      return eventStart <= dateStr && eventEnd >= dateStr
    }).sort((a, b) => new Date(a.start) - new Date(b.start))
  }

  const getEventsForRange = (startDate, endDate) => {
    if (!events.value || !Array.isArray(events.value)) return []

    const start = new Date(startDate)
    const end = new Date(endDate)

    return events.value.filter(event => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      return eventStart <= end && eventEnd >= start
    }).sort((a, b) => new Date(a.start) - new Date(b.start))
  }

  const getEventsByColor = (color) => {
    if (!events.value || !Array.isArray(events.value)) return []

    return events.value.filter(event => event.color === color)
  }

  const searchEvents = (query) => {
    if (!events.value || !Array.isArray(events.value) || !query) return []

    const searchTerm = query.toLowerCase()

    return events.value.filter(event =>
      (event.name && event.name.toLowerCase().includes(searchTerm)) ||
      (event.details && event.details.toLowerCase().includes(searchTerm))
    )
  }

  return {
    // Computed properties
    formattedEvents,
    todayEvents,
    upcomingEvents,

    // Methods
    getEventsForDate,
    getEventsForRange,
    getEventsByColor,
    searchEvents
  }
}
