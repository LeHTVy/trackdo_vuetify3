import { computed } from 'vue'
import { isToday, isFuture, getDaysBetween, addDays } from '@/utils/dateUtils.js'

export function useCalendarList(type = 'upcoming') {
  // Computed properties for styling based on type
  const listClasses = computed(() => ({
    'today-list': type === 'today',
    'upcoming-list': type === 'upcoming'
  }))

  const headerClasses = computed(() => ({
    'today-header': type === 'today',
    'upcoming-header': type === 'upcoming'
  }))

  const eventItemClasses = computed(() => ({
    'today-event-item': type === 'today',
    'upcoming-event-item': type === 'upcoming'
  }))

  // Dynamic styling functions
  const getHeaderStyles = (vuetifyTheme) => {
    const colors = vuetifyTheme.current.colors
    if (type === 'today') {
      return {
        backgroundColor: colors.primary,
        color: 'white'
      }
    } else {
      return {
        backgroundColor: colors.secondary,
        color: colors.primary
      }
    }
  }

  const getChipColor = (vuetifyTheme) => {
    const colors = vuetifyTheme.current.colors
    return type === 'today' ? colors.secondary : colors.primary
  }

  const getAvatarColor = (vuetifyTheme) => {
    const colors = vuetifyTheme.current.colors
    return type === 'today' ? colors.primary : colors.secondary
  }

  const getTimeIconColor = (vuetifyTheme) => {
    const colors = vuetifyTheme.current.colors
    return type === 'today' ? colors.primary : colors.secondary
  }

  const getActionButtonColor = (vuetifyTheme) => {
    const colors = vuetifyTheme.current.colors
    return type === 'today' ? colors.primary : colors.secondary
  }

  // Enhanced event time formatting
  const formatEventTime = (event) => {
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    if (type === 'today') {
      // For today's events, show time
      const startTime = startDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })

      if (event.end && event.end !== event.start) {
        const endTime = endDate.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        })
        return `${startTime} - ${endTime}`
      }

      return startTime
    } else {
      // For upcoming events, show date with improved logic
      const today = new Date()
      const tomorrow = addDays(today, 1)

      // Reset time to compare dates only
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
      const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())

      if (eventDate.getTime() === todayDate.getTime()) {
        return 'Today'
      } else if (eventDate.getTime() === tomorrowDate.getTime()) {
        return 'Tomorrow'
      } else {
        // Calculate days difference
        const diffDays = getDaysBetween(todayDate, eventDate)

        if (diffDays <= 7) {
          // Show day of week for this week
          return startDate.toLocaleDateString('vi-VN', {
            weekday: 'long'
          })
        } else {
          // Show date for later events
          return startDate.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric'
          })
        }
      }
    }
  }

  // Enhanced event status calculation
  const getEventStatus = (event) => {
    const now = new Date()
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    if (type === 'today') {
      if (now > endDate) {
        return { text: 'Completed', color: 'success' }
      } else if (now >= startDate && now <= endDate) {
        return { text: 'Ongoing', color: 'warning' }
      } else {
        return { text: 'Upcoming', color: 'info' }
      }
    } else {
      const today = new Date()
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())

      const diffDays = getDaysBetween(todayDate, eventDate)

      if (diffDays <= 0) {
        return { text: 'Today', color: 'warning' }
      } else if (diffDays === 1) {
        return { text: 'Tomorrow', color: 'warning' }
      } else if (diffDays <= 3) {
        return { text: 'Soon', color: 'info' }
      } else if (diffDays <= 7) {
        return { text: 'This Week', color: 'primary' }
      } else {
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const eventMonth = startDate.getMonth()
        const eventYear = startDate.getFullYear()

        if (eventYear === currentYear && eventMonth === currentMonth) {
          return { text: 'This Month', color: 'secondary' }
        } else if (
          (eventYear === currentYear && eventMonth === currentMonth + 1) ||
          (eventYear === currentYear + 1 && currentMonth === 11 && eventMonth === 0)
        ) {
          return { text: 'Next Month', color: 'secondary' }
        } else {
          return { text: 'Later', color: 'primary' }
        }
      }
    }
  }

  // Title and icon getters
  const getTitle = () => {
    return type === 'today' ? 'Today\'s Events' : 'Upcoming Events'
  }

  const getTitleIcon = () => {
    return type === 'today' ? 'mdi-calendar-today' : 'mdi-calendar-clock'
  }

  const getEmptyIcon = () => {
    return type === 'today' ? 'mdi-calendar-blank' : 'mdi-calendar-remove'
  }

  const getEmptyTitle = () => {
    return type === 'today' ? 'No events today' : 'No upcoming events'
  }

  const getEmptyText = () => {
    return type === 'today'
      ? 'You have a free day! Enjoy your time.'
      : 'All caught up! No upcoming events scheduled.'
  }

  return {
    // Computed classes
    listClasses,
    headerClasses,
    eventItemClasses,

    // Dynamic styling functions
    getHeaderStyles,
    getChipColor,
    getAvatarColor,
    getTimeIconColor,
    getActionButtonColor,

    // Event formatting functions
    formatEventTime,
    getEventStatus,

    // Content getters
    getTitle,
    getTitleIcon,
    getEmptyIcon,
    getEmptyTitle,
    getEmptyText
  }
}
