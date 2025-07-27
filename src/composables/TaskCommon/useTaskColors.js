import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useTaskFormatting } from './useTaskFormatting'

export function useTaskColors(componentType = 'default') {
  const { isTaskOverdue, getTaskUrgency } = useTaskFormatting()
  const theme = useTheme()
  const colors = computed(() => theme.current.value.colors)
  const isDark = computed(() => theme.current.value.dark)

  // Task Status Constants
  const TASK_STATUS_TYPES = {
    todo: 'todo',
    'in-progress': 'in-progress',
    completed: 'completed',
    cancelled: 'cancelled'
  }

  // Task Priority Constants
  const TASK_PRIORITY_TYPES = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical'
  }

  // Status color mapping using Vuetify theme colors
  const statusColorMap = computed(() => ({
    [TASK_STATUS_TYPES.todo]: colors.value.warning,
    [TASK_STATUS_TYPES['in-progress']]: colors.value.info,
    [TASK_STATUS_TYPES.completed]: colors.value.success,
    [TASK_STATUS_TYPES.cancelled]: colors.value.error
  }))

  // Priority color mapping using Vuetify theme colors
  const priorityColorMap = computed(() => ({
    [TASK_PRIORITY_TYPES.low]: colors.value.success,
    [TASK_PRIORITY_TYPES.medium]: colors.value.warning,
    [TASK_PRIORITY_TYPES.high]: colors.value.error,
    [TASK_PRIORITY_TYPES.critical]: colors.value.error
  }))

  // Header styling functions
  const getHeaderBackground = () => {
    return isDark.value
      ? 'linear-gradient(135deg, rgb(var(--v-theme-primary), 0.9) 0%, rgb(var(--v-theme-primary), 0.7) 50%, rgb(var(--v-theme-secondary), 0.8) 100%)'
      : 'linear-gradient(135deg, rgb(var(--v-theme-primary)) 50%, rgb(var(--v-theme-secondary)) 100%)'
  }

  // Stats styling functions
  const getStatsBackground = (opacity = null) => {
    const defaultOpacity = isDark.value ? 0.1 : 0.15
    return `rgba(255, 255, 255, ${opacity || defaultOpacity})`
  }

  const getStatsBackgroundHover = (opacity = null) => {
    const defaultOpacity = isDark.value ? 0.2 : 0.25
    return `rgba(255, 255, 255, ${opacity || defaultOpacity})`
  }

  const getStatsBorder = (opacity = null) => {
    const defaultOpacity = isDark.value ? 0.1 : 0.2
    return `rgba(255, 255, 255, ${opacity || defaultOpacity})`
  }

  const getCardBorder = (opacity = 0.1) => {
    return isDark.value
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`
  }

  // CSS Variables for consistent styling
  const cssVars = computed(() => ({
    '--task-header-bg': getHeaderBackground(),
    '--task-header-text': `rgb(var(--v-theme-title-text))`,
    '--task-header-title': `rgb(var(--v-theme-title-text))`,
    '--task-header-subtitle': `rgb(var(--v-theme-subtitle-text))`,
    '--task-avatar-bg': isDark.value ? `rgb(var(--v-theme-avatar-bg))` : `rgb(var(--v-theme-secondary))`,
    '--task-avatar-icon': `rgb(var(--v-theme-primary))`,
    '--task-stats-bg': getStatsBackground(),
    '--task-stats-bg-hover': getStatsBackgroundHover(),
    '--task-stats-border': getStatsBorder(),
    '--task-stats-text': `rgb(var(--v-theme-task-stats-value))`,
    '--task-stats-text-hover': `rgb(var(--v-theme-task-stats-value-hover))`,
    '--task-stats-label': `rgb(var(--v-theme-task-stats-label))`,
    '--task-stats-label-hover': `rgb(var(--v-theme-task-stats-label-hover))`,
    '--task-stats-icon': `rgb(var(--v-theme-task-stats-label))`,
    '--task-card-bg': isDark.value ? `rgb(var(--v-theme-surface))` : `rgb(var(--v-theme-task-card-bg))`,
    '--task-card-hover': `rgb(var(--v-theme-task-card-hover))`,
    '--task-card-border': getCardBorder(),
    '--task-progress-bg': `rgb(var(--v-theme-task-progress-bg))`,
    '--task-progress-fill': `rgb(var(--v-theme-primary))`,
    '--task-text-primary': `rgb(var(--v-theme-title-text))`,
    '--task-text-secondary': `rgb(var(--v-theme-subtitle-text))`
  }))

  // Business logic functions
  const getStatusColor = (status) => {
    return statusColorMap.value[status?.toLowerCase()] || colors.value.warning
  }

  const getPriorityColor = (priority) => {
    return priorityColorMap.value[priority?.toLowerCase()] || colors.value.warning
  }

  // Theme color getters
  const getPrimaryColor = () => colors.value.primary
  const getSecondaryColor = () => colors.value.secondary
  const getThemeColor = (colorName) => colors.value[colorName] || colors.value.primary

  // CSS Variables application
  const applyCssVars = () => {
    const vars = cssVars.value
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }

  // Task card styling (from useTaskStyling)
  const getTaskCardClass = (task) => {
    const classes = []
    if (task.status === 'completed') classes.push('completed')
    if (isTaskOverdue(task)) classes.push('overdue')
    return classes
  }

  // Date styling (from useTaskStyling)
  const getDateColor = (task) => {
    if (isTaskOverdue(task)) return 'error'
    if (getTaskUrgency(task) === 'today') return 'warning'
    if (getTaskUrgency(task) === 'tomorrow') return 'info'
    return 'primary'
  }

  const getDateClass = (task) => {
    if (isTaskOverdue(task)) return 'overdue-text'
    return ''
  }

  // Task urgency styling (from useTaskStyling)
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'overdue':
        return 'error'
      case 'today':
        return 'warning'
      case 'tomorrow':
        return 'info'
      case 'soon':
        return 'orange'
      case 'week':
        return 'blue'
      default:
        return 'grey'
    }
  }

  // Task status styling (from useTaskStyling)
  const getTaskStatusClass = (task) => {
    const classes = [`status-${task.status}`]

    if (task.status === 'completed') {
      classes.push('task-completed')
    } else if (isTaskOverdue(task)) {
      classes.push('task-overdue')
    } else if (getTaskUrgency(task) === 'today') {
      classes.push('task-urgent')
    }

    return classes
  }

  // Priority styling (from useTaskStyling)
  const getPriorityClass = (priority) => {
    return `priority-${priority?.toLowerCase() || 'medium'}`
  }

  // Combined task styling (from useTaskStyling)
  const getTaskClasses = (task) => {
    return [
      ...getTaskCardClass(task),
      ...getTaskStatusClass(task),
      getPriorityClass(task.priority)
    ]
  }

  return {
    // Computed properties
    colors,
    isDark,
    cssVars,

    // Business logic functions
    getStatusColor,
    getPriorityColor,

    // Theme color functions
    getPrimaryColor,
    getSecondaryColor,
    getThemeColor,

    // Utility functions
    applyCssVars,

    // Task styling functions (merged from useTaskStyling)
    getTaskCardClass,
    getTaskClasses,
    getDateColor,
    getDateClass,
    getTaskStatusClass,
    getPriorityClass,
    getUrgencyColor
  }
}
