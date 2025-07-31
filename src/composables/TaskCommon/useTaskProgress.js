import { computed } from 'vue'

/**
 * Composable for task progress calculations and data
 * @param {Object} tasksStore - The tasks store instance
 * @returns {Object} Progress-related computed properties and data
 */
export function useTaskProgress (tasksStore) {
  // Computed properties
  const completionPercentage = computed(() => {
    const total = tasksStore.totalTasks
    if (total === 0) return 0
    const completed = tasksStore.completedTasks.length
    return (completed / total) * 100
  })

  const progressItems = computed(() => [
    {
      key: 'completed',
      label: 'Completed',
      count: tasksStore.completedTasks.length,
      color: '#4caf50',
      icon: 'mdi-check-circle',
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      count: tasksStore.inProgressTasks.length,
      color: '#ff9800',
      icon: 'mdi-clock-outline',
    },
    {
      key: 'pending',
      label: 'Pending',
      count: tasksStore.pendingTasks.length,
      color: '#2196f3',
      icon: 'mdi-pause-circle-outline',
    },
    {
      key: 'overdue',
      label: 'Overdue',
      count: tasksStore.overdueTasks.length,
      color: '#f44336',
      icon: 'mdi-alert-circle-outline',
    },
  ])

  const hasData = computed(() => tasksStore.totalTasks > 0)

  const progressStats = computed(() => ({
    total: tasksStore.totalTasks,
    completed: tasksStore.completedTasks.length,
    inProgress: tasksStore.inProgressTasks.length,
    pending: tasksStore.pendingTasks.length,
    overdue: tasksStore.overdueTasks.length,
    completionRate: completionPercentage.value,
  }))

  return {
    completionPercentage,
    progressItems,
    hasData,
    progressStats,
  }
}
