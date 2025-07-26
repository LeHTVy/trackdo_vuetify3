import { computed } from 'vue'

/**
 * Project formatting composable
 * @param {Array} projects - Array of projects for calculations
 * @returns {Object} Formatting functions and computed values
 */
export function useProjectFormatting(projects) {

  // Status color mapping
  const statusColorMap = {
    'Active': 'project-active',
    'Completed': 'project-completed',
    'On Hold': 'project-onhold',
    'Cancelled': 'error'
  }

  // Format date function
  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency function
  const formatCurrency = (amount) => {
    if (!amount) return ''
    return `$${amount.toLocaleString()}`
  }

  // Get status color function
  const getStatusColor = (status) => {
    return statusColorMap[status] || 'grey'
  }

  // Get status icon function
  const getStatusIcon = (status) => {
    const iconMap = {
      'Active': 'mdi-play-circle',
      'Completed': 'mdi-check-circle',
      'On Hold': 'mdi-pause-circle',
      'Cancelled': 'mdi-close-circle'
    }
    return iconMap[status] || 'mdi-help-circle'
  }

  // Calculate overall progress
  const overallProgress = computed(() => {
    if (!projects.value || projects.value.length === 0) return 0
    const totalProgress = projects.value.reduce((sum, project) => sum + (project.progress || 0), 0)
    return Math.round(totalProgress / projects.value.length)
  })

  // Calculate project statistics
  const projectStats = computed(() => {
    if (!projects.value) return { total: 0, active: 0, completed: 0, onHold: 0 }

    const stats = projects.value.reduce((acc, project) => {
      acc.total++
      switch (project.status) {
        case 'Active':
          acc.active++
          break
        case 'Completed':
          acc.completed++
          break
        case 'On Hold':
          acc.onHold++
          break
      }
      return acc
    }, { total: 0, active: 0, completed: 0, onHold: 0 })

    return stats
  })

  // Format project description with truncation
  const formatDescription = (description, maxLength = 100) => {
    if (!description) return 'No description available'
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
  }

  // Calculate progress percentage for stats
  const calculateProgressPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  return {
    // Formatting functions
    formatDate,
    formatCurrency,
    formatDescription,
    getStatusColor,
    getStatusIcon,
    calculateProgressPercentage,

    // Computed values
    overallProgress,
    projectStats,

    // Constants
    statusColorMap
  }
}
