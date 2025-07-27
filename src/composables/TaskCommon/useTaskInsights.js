import { computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useProjectsStore } from '@/stores/projects'

export function useTaskInsights() {
  const eventsStore = useEventsStore()
  const projectsStore = useProjectsStore()

  // Today's upcoming events
  const todayEvents = computed(() => {
    return eventsStore.getTodayEvents.slice(0, 3) // Limit to 3 events
  })

  // Recent projects (2 newest)
  const recentProjects = computed(() => {
    return [...projectsStore.projects]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.startDate || 0)
        const dateB = new Date(b.createdAt || b.startDate || 0)
        return dateB - dateA
      })
      .slice(0, 2)
  })

  // High completion projects (>50% progress)
  const highCompletionProjects = computed(() => {
    return projectsStore.projects
      .filter(project => project.progress > 50 && project.status !== 'Completed')
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 2)
  })

  // Check if there's any data to show
  const hasInsights = computed(() => {
    return todayEvents.value.length > 0 || 
           recentProjects.value.length > 0 || 
           highCompletionProjects.value.length > 0
  })

  // Format event time
  const formatEventTime = (event) => {
    const start = new Date(event.start)
    const end = new Date(event.end || event.start)
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }

    if (event.allDay) {
      return 'All day'
    }

    return `${formatTime(start)} - ${formatTime(end)}`
  }

  // Get event color based on category
  const getEventColor = (event) => {
    const colorMap = {
      'work': '#1976d2',
      'personal': '#388e3c',
      'meeting': '#f57c00',
      'deadline': '#d32f2f',
      'default': '#6200ea'
    }
    return colorMap[event.category] || colorMap.default
  }

  // Get project status color
  const getProjectStatusColor = (status) => {
    const colorMap = {
      'Active': '#4caf50',
      'Planning': '#2196f3',
      'On Hold': '#ff9800',
      'Completed': '#9c27b0',
      'default': '#757575'
    }
    return colorMap[status] || colorMap.default
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    const colorMap = {
      'High': '#f44336',
      'Medium': '#ff9800',
      'Low': '#4caf50',
      'default': '#757575'
    }
    return colorMap[priority] || colorMap.default
  }

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date()
    const targetDate = new Date(date)
    const diffInMs = targetDate - now
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Tomorrow'
    } else if (diffInDays > 1 && diffInDays <= 7) {
      return `In ${diffInDays} days`
    } else if (diffInDays < 0) {
      const pastDays = Math.abs(diffInDays)
      if (pastDays === 1) {
        return 'Yesterday'
      } else if (pastDays <= 7) {
        return `${pastDays} days ago`
      } else {
        return targetDate.toLocaleDateString()
      }
    } else {
      return targetDate.toLocaleDateString()
    }
  }

  return {
    // Data
    todayEvents,
    recentProjects,
    highCompletionProjects,
    hasInsights,

    // Formatters
    formatEventTime,
    formatRelativeTime,

    // Colors
    getEventColor,
    getProjectStatusColor,
    getPriorityColor
  }
}