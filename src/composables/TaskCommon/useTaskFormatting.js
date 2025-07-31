import { computed } from 'vue'

/**
 * Task Formatting Utilities
 * @param {Ref} tasksRef - Reactive reference to tasks array
 * @returns {Object} Formatting utilities and computed properties
 */
export function useTaskFormatting (tasksRef) {
  // Date formatting
  const formatDate = date => {
    if (!date) return ''

    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return ''

      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  // Time formatting
  const formatTime = date => {
    if (!date) return ''

    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return ''

      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      console.error('Error formatting time:', error)
      return ''
    }
  }

  // Relative time formatting
  const formatRelativeTime = date => {
    if (!date) return ''

    try {
      const dateObj = new Date(date)
      const now = new Date()
      const diffInMs = now - dateObj
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

      if (diffInDays === 0) return 'Today'
      if (diffInDays === 1) return 'Yesterday'
      if (diffInDays === -1) return 'Tomorrow'
      if (diffInDays > 1) return `${diffInDays} days ago`
      if (diffInDays < -1) return `In ${Math.abs(diffInDays)} days`

      return formatDate(date)
    } catch (error) {
      console.error('Error formatting relative time:', error)
      return formatDate(date)
    }
  }

  // Priority formatting
  const formatPriority = priority => {
    if (!priority) return 'Medium'
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
  }

  // Status formatting
  const formatStatus = status => {
    if (!status) return 'To Do'

    const statusMap = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
    }

    return statusMap[status] || status
  }

  // Task completion percentage
  const getCompletionPercentage = computed(() => {
    if (!tasksRef.value || tasksRef.value.length === 0) return 0

    const completedTasks = tasksRef.value.filter(task => task.status === 'completed')
    return Math.round((completedTasks.length / tasksRef.value.length) * 100)
  })

  // Task statistics
  const getTaskStats = computed(() => {
    if (!tasksRef.value) return {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      inProgress: 0,
    }

    const today = new Date().toISOString().split('T')[0]

    return {
      total: tasksRef.value.length,
      completed: tasksRef.value.filter(task => task.status === 'completed').length,
      pending: tasksRef.value.filter(task => task.status === 'todo').length,
      inProgress: tasksRef.value.filter(task => task.status === 'in-progress').length,
      overdue: tasksRef.value.filter(task =>
        task.status !== 'completed' &&
        task.dueDate &&
        task.dueDate < today
      ).length,
    }
  })

  // Check if task is overdue
  const isTaskOverdue = task => {
    if (!task.dueDate || task.status === 'completed') return false

    const today = new Date().toISOString().split('T')[0]
    return task.dueDate < today
  }

  // Get task urgency level
  const getTaskUrgency = task => {
    if (!task.dueDate) return 'none'

    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const diffInDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

    if (diffInDays < 0) return 'overdue'
    if (diffInDays === 0) return 'today'
    if (diffInDays === 1) return 'tomorrow'
    if (diffInDays <= 3) return 'soon'
    if (diffInDays <= 7) return 'week'

    return 'later'
  }

  // Format task duration
  const formatDuration = estimatedHours => {
    if (!estimatedHours || estimatedHours === 0) return 'No estimate'

    if (estimatedHours < 1) {
      const minutes = Math.round(estimatedHours * 60)
      return `${minutes}m`
    }

    if (estimatedHours < 8) {
      return `${estimatedHours}h`
    }

    const days = Math.round(estimatedHours / 8)
    return `${days}d`
  }

  return {
    // Date/Time formatting
    formatDate,
    formatTime,
    formatRelativeTime,

    // Task formatting
    formatPriority,
    formatStatus,
    formatDuration,

    // Task analysis
    isTaskOverdue,
    getTaskUrgency,

    // Computed statistics
    getCompletionPercentage,
    getTaskStats,
  }
}
