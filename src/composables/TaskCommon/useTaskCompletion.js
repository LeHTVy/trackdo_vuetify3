import { ref, computed } from 'vue'

/**
 * Task Completion Utilities
 * Handles task completion state and visual effects
 */
export function useTaskCompletion(tasksStore) {
  // Loading state for completion toggle
  const completingTasks = ref(new Set())

  /**
   * Toggle task completion status
   * @param {Object} task - Task object to toggle
   */
  const toggleTaskCompletion = async (task) => {
    const taskId = task.id || task._id

    // Prevent multiple simultaneous toggles
    if (completingTasks.value.has(taskId)) return

    try {
      completingTasks.value.add(taskId)

      const newStatus = task.status === 'completed' ? 'todo' : 'completed'
      const updates = {
        status: newStatus,
        completed: newStatus === 'completed',
        completedAt: newStatus === 'completed' ? new Date().toISOString() : null
      }

      await tasksStore.updateTask(taskId, updates)
    } catch (error) {
      console.error('Error toggling task completion:', error)
      throw error
    } finally {
      completingTasks.value.delete(taskId)
    }
  }

  /**
   * Check if task is currently being toggled
   * @param {Object} task - Task object to check
   * @returns {boolean} - True if task is being toggled
   */
  const isTaskToggling = (task) => {
    const taskId = task.id || task._id
    return completingTasks.value.has(taskId)
  }

  /**
   * Get task completion CSS classes
   * @param {Object} task - Task object
   * @returns {Array} - Array of CSS classes
   */
  const getTaskCompletionClasses = (task) => {
    const classes = []

    if (task.status === 'completed') {
      classes.push('task-completed')
    }

    if (isTaskToggling(task)) {
      classes.push('task-toggling')
    }

    return classes
  }

  /**
   * Get task completion styles
   * @param {Object} task - Task object
   * @returns {Object} - Style object
   */
  const getTaskCompletionStyles = (task) => {
    const styles = {}

    if (task.status === 'completed') {
      styles.opacity = '0.6'
      styles.textDecoration = 'line-through'
      styles.position = 'relative'
    }

    return styles
  }

  /**
   * Check if task is completed
   * @param {Object} task - Task object
   * @returns {boolean} - True if task is completed
   */
  const isTaskCompleted = (task) => {
    return task.status === 'completed'
  }

  /**
   * Get completion percentage for a list of tasks
   * @param {Array} tasks - Array of tasks
   * @returns {number} - Completion percentage (0-100)
   */
  const getCompletionPercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0

    const completedTasks = tasks.filter(task => task.status === 'completed')
    return Math.round((completedTasks.length / tasks.length) * 100)
  }

  return {
    // State
    completingTasks: computed(() => completingTasks.value),

    // Methods
    toggleTaskCompletion,
    isTaskToggling,
    getTaskCompletionClasses,
    getTaskCompletionStyles,
    isTaskCompleted,
    getCompletionPercentage
  }
}
