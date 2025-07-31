/**
 * Composable for project statistics management
 * Provides reusable statistics logic for project components
 */
import { computed } from 'vue'

/**
 * Project statistics composable
 * @param {Array} projects - Array of projects for statistics calculation
 * @returns {Object} Statistics data and computed values
 */
export function useProjectStats (projects) {

  // Basic project counts
  const totalProjects = computed(() => projects.value?.length || 0)

  const activeProjects = computed(() =>
    projects.value?.filter(p => p.status === 'Active').length || 0
  )

  const completedProjects = computed(() =>
    projects.value?.filter(p => p.status === 'Completed').length || 0
  )

  const onHoldProjects = computed(() =>
    projects.value?.filter(p => p.status === 'On Hold').length || 0
  )

  // Statistics configuration for display
  const statsConfig = computed(() => [
    {
      label: 'Total Projects',
      value: totalProjects.value,
      icon: 'mdi-folder-multiple',
      color: 'primary',
      type: 'total',
      progress: 100,
    },
    {
      label: 'Active Projects',
      value: activeProjects.value,
      icon: 'mdi-play-circle',
      color: 'project-active',
      type: 'active',
      progress: totalProjects.value > 0 ? Math.round((activeProjects.value / totalProjects.value) * 100) : 0,
    },
    {
      label: 'Completed',
      value: completedProjects.value,
      icon: 'mdi-check-circle',
      color: 'project-completed',
      type: 'completed',
      progress: totalProjects.value > 0 ? Math.round((completedProjects.value / totalProjects.value) * 100) : 0,
    },
    {
      label: 'On Hold',
      value: onHoldProjects.value,
      icon: 'mdi-pause-circle',
      color: 'project-onhold',
      type: 'onhold',
      progress: totalProjects.value > 0 ? Math.round((onHoldProjects.value / totalProjects.value) * 100) : 0,
    },
  ])

  // Overall progress calculation
  const overallProgress = computed(() => {
    if (totalProjects.value === 0) return 0
    const totalProgress = projects.value.reduce((sum, project) => sum + (project.progress || 0), 0)
    return Math.round(totalProgress / totalProjects.value)
  })

  // Progress distribution
  const progressDistribution = computed(() => {
    if (totalProjects.value === 0) return { low: 0, medium: 0, high: 0, completed: 0 }

    return projects.value.reduce((acc, project) => {
      const progress = project.progress || 0
      if (progress === 100) acc.completed++
      else if (progress >= 75) acc.high++
      else if (progress >= 25) acc.medium++
      else acc.low++
      return acc
    }, { low: 0, medium: 0, high: 0, completed: 0 })
  })

  // Budget statistics
  const budgetStats = computed(() => {
    if (totalProjects.value === 0) return { total: 0, average: 0, highest: 0, lowest: 0 }

    const budgets = projects.value
      .map(p => p.budget || 0)
      .filter(budget => budget > 0)

    if (budgets.length === 0) return { total: 0, average: 0, highest: 0, lowest: 0 }

    const total = budgets.reduce((sum, budget) => sum + budget, 0)
    const average = Math.round(total / budgets.length)
    const highest = Math.max(...budgets)
    const lowest = Math.min(...budgets)

    return { total, average, highest, lowest }
  })

  // Status distribution percentages
  const statusDistribution = computed(() => {
    if (totalProjects.value === 0) return {}

    return {
      active: Math.round((activeProjects.value / totalProjects.value) * 100),
      completed: Math.round((completedProjects.value / totalProjects.value) * 100),
      onHold: Math.round((onHoldProjects.value / totalProjects.value) * 100),
    }
  })

  return {
    // Basic counts
    totalProjects,
    activeProjects,
    completedProjects,
    onHoldProjects,

    // Computed statistics
    statsConfig,
    overallProgress,
    progressDistribution,
    budgetStats,
    statusDistribution,
  }
}
