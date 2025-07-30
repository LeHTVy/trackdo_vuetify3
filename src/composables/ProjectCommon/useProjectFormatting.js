import { computed } from 'vue'

export function useProjectFormatting(projects) {

  const statusColorMap = {
    'Active': 'project-active',
    'Completed': 'project-completed',
    'On Hold': 'project-onhold',
    'Cancelled': 'error'
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return ''
    return `$${amount.toLocaleString('en-US')}`
  }

  const getStatusColor = (status) => {
    return statusColorMap[status] || 'grey'
  }

  const getStatusIcon = (status) => {
    const iconMap = {
      'Active': 'mdi-play-circle',
      'Completed': 'mdi-check-circle',
      'On Hold': 'mdi-pause-circle',
      'Cancelled': 'mdi-close-circle'
    }
    return iconMap[status] || 'mdi-help-circle'
  }

  const overallProgress = computed(() => {
    if (!projects.value || projects.value.length === 0) return 0
    const totalProgress = projects.value.reduce((sum, project) => sum + (project.progress || 0), 0)
    return Math.round(totalProgress / projects.value.length)
  })

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

  const formatDescription = (description, maxLength = 100) => {
    if (!description) return 'No description available'
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
  }

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
