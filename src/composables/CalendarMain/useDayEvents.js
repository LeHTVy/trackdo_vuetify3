import { ref } from 'vue'

export function useDayEvents (events, viewType = ref('monthly')) {
  /**
   * Get events for a specific day with enhanced metadata
   * @param {Date} date
   * @param {Array} eventList
   */
  const getDayEvents = (date, eventList = null) => {
    if (!date) return []

    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    const eventsToFilter = eventList || events.value || []

    return eventsToFilter.filter(event => {
      if (!event.start) return false

      const eventStartDate = new Date(event.start)
      eventStartDate.setHours(0, 0, 0, 0)

      const eventEndDate = new Date(event.end || event.start)
      eventEndDate.setHours(0, 0, 0, 0)
      return targetDate.getTime() >= eventStartDate.getTime() &&
             targetDate.getTime() <= eventEndDate.getTime()
    }).map(event => {
      const eventStartDate = new Date(event.start)
      eventStartDate.setHours(0, 0, 0, 0)

      const eventEndDate = new Date(event.end || event.start)
      eventEndDate.setHours(0, 0, 0, 0)

      const isFirstDay = targetDate.getTime() === eventStartDate.getTime()
      const isLastDay = targetDate.getTime() === eventEndDate.getTime()
      const isMultiDay = eventStartDate.getTime() !== eventEndDate.getTime()

      return {
        ...event,
        isFirstDay,
        isLastDay,
        isMultiDay,
        isContinuation: !isFirstDay && isMultiDay,
        dayIndex: Math.floor((targetDate.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24)),
        totalDays: Math.floor((eventEndDate.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      }
    }).sort((a, b) => {
      const aStart = new Date(a.start).getTime()
      const bStart = new Date(b.start).getTime()

      if (aStart !== bStart) {
        return aStart - bStart
      }
      return b.totalDays - a.totalDays
    })
  }

  /**
   * Get events count for a specific day
   * @param {Date} date
   */
  const getDayEventsCount = date => {
    return getDayEvents(date).length
  }

  /**
   * Check if a day has events
   * @param {Date} date
   */
  const hasEvents = date => {
    return getDayEventsCount(date) > 0
  }

  /**
   * Get visible events for a day (limited display) based on view type : Monthly 3, Weekly 10
   * @param {Date} date
   * @param {number} maxVisible
   */
  const getVisibleDayEvents = (date, maxVisible = null) => {
    if (maxVisible === null) {
      maxVisible = viewType.value === 'weekly' ? 10 : 3
    }

    const dayEvents = getDayEvents(date)
    return {
      events: dayEvents.slice(0, maxVisible),
      hidden: dayEvents.slice(maxVisible),
      hasMore: dayEvents.length > maxVisible,
      moreCount: Math.max(0, dayEvents.length - maxVisible),
      totalCount: dayEvents.length,
    }
  }

  /**
   * Get events that start on a specific day
   * @param {Date} date
   */
  const getEventsStartingOnDay = date => {
    if (!date) return []

    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    return (events.value || []).filter(event => {
      if (!event.start) return false

      const eventStartDate = new Date(event.start)
      eventStartDate.setHours(0, 0, 0, 0)

      return eventStartDate.getTime() === targetDate.getTime()
    })
  }

  /**
   * Get events that end on a specific day
   * @param {Date} date
   */
  const getEventsEndingOnDay = date => {
    if (!date) return []

    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    return (events.value || []).filter(event => {
      if (!event.start) return false

      const eventEndDate = new Date(event.end || event.start)
      eventEndDate.setHours(0, 0, 0, 0)

      return eventEndDate.getTime() === targetDate.getTime()
    })
  }

  /**
   * Get multi-day events that span across a date
   * @param {Date} date
   */
  const getMultiDayEvents = date => {
    return getDayEvents(date).filter(event => event.isMultiDay)
  }

  /**
   * Get single-day events for a date
   * @param {Date} date
   */
  const getSingleDayEvents = date => {
    return getDayEvents(date).filter(event => !event.isMultiDay)
  }

  /**
   * Calculate event positioning for better visual layout
   * @param {Date} date
   */
  const getEventLayout = date => {
    const dayEvents = getDayEvents(date)
    const layout = {
      multiDay: [],
      singleDay: [],
      maxLayers: 0,
    }

    // Separate multi-day and single-day events
    dayEvents.forEach(event => {
      if (event.isMultiDay) {
        layout.multiDay.push(event)
      } else {
        layout.singleDay.push(event)
      }
    })

    // Calculate layers for overlapping events
    layout.maxLayers = Math.max(layout.multiDay.length, layout.singleDay.length)

    return layout
  }

  /**
   * Get event statistics for a date range
   * @param {Date} startDate
   * @param {Date} endDate
   */
  const getEventStats = (startDate, endDate) => {
    if (!startDate || !endDate) return null

    const stats = {
      totalEvents: 0,
      multiDayEvents: 0,
      singleDayEvents: 0,
      daysWithEvents: 0,
      averageEventsPerDay: 0,
    }

    const currentDate = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end - currentDate) / (1000 * 60 * 60 * 24)) + 1

    while (currentDate <= end) {
      const dayEvents = getDayEvents(currentDate)

      if (dayEvents.length > 0) {
        stats.daysWithEvents++
        stats.totalEvents += dayEvents.length

        dayEvents.forEach(event => {
          if (event.isMultiDay) {
            stats.multiDayEvents++
          } else {
            stats.singleDayEvents++
          }
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    stats.averageEventsPerDay = stats.totalEvents / totalDays

    return stats
  }

  /**
   * Find events by search criteria
   * @param {string} searchTerm
   * @param {Date} date
   */
  const searchEvents = (searchTerm, date = null) => {
    if (!searchTerm) return date ? getDayEvents(date) : (events.value || [])

    const term = searchTerm.toLowerCase()
    const eventsToSearch = date ? getDayEvents(date) : (events.value || [])

    return eventsToSearch.filter(event => {
      return (event.title && event.title.toLowerCase().includes(term)) ||
             (event.name && event.name.toLowerCase().includes(term)) ||
             (event.description && event.description.toLowerCase().includes(term))
    })
  }

  return {
    // Main methods
    getDayEvents,
    getDayEventsCount,
    hasEvents,
    getVisibleDayEvents,

    // Specialized getters
    getEventsStartingOnDay,
    getEventsEndingOnDay,
    getMultiDayEvents,
    getSingleDayEvents,

    // Layout and analysis
    getEventLayout,
    getEventStats,
    searchEvents,
  }
}
