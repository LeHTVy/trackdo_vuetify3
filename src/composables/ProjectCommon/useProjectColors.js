import { computed } from 'vue'
import { useTheme } from 'vuetify'

/**
 * Business Color Management for Project Components
 * @param {string} componentType - Type of component (header, card, stats, etc.)
 * @returns {Object} Color management utilities and computed properties
 */
export function useProjectColors(componentType = 'default') {
  const theme = useTheme()
  const colors = computed(() => theme.current.value.colors)
  const isDark = computed(() => theme.current.value.dark)

  // Project Status Constants
  const PROJECT_STATUS_TYPES = {
    active: 'active',
    completed: 'completed',
    onhold: 'onhold',
    cancelled: 'cancelled',
    planning: 'planning'
  }

  // Project Priority Constants
  const PROJECT_PRIORITY_TYPES = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical'
  }

  // Status color mapping using Vuetify theme colors
  const statusColorMap = computed(() => ({
    [PROJECT_STATUS_TYPES.active]: colors.value.success,
    [PROJECT_STATUS_TYPES.completed]: colors.value.info,
    [PROJECT_STATUS_TYPES.onhold]: colors.value.warning,
    [PROJECT_STATUS_TYPES.cancelled]: colors.value.error,
    [PROJECT_STATUS_TYPES.planning]: colors.value.secondary
  }))

  // Priority color mapping using Vuetify theme colors
  const priorityColorMap = computed(() => ({
    [PROJECT_PRIORITY_TYPES.low]: colors.value.success,
    [PROJECT_PRIORITY_TYPES.medium]: colors.value.warning,
    [PROJECT_PRIORITY_TYPES.high]: colors.value.error,
    [PROJECT_PRIORITY_TYPES.critical]: colors.value.error
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

  // Card styling functions
  const getCardBackground = () => {
    return isDark.value ? `rgb(var(--v-theme-surface))` : '#FFFFFF'
  }

  const getCardHoverBackground = () => {
    return isDark.value ? '#334155' : '#F8FAFC'
  }

  const getCardBorder = (opacity = 0.1) => {
    return isDark.value
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`
  }

  // Progress styling functions
  const getProgressBackground = () => {
    return isDark.value ? '#1E293B' : '#F1F5F9'
  }

  // Background styling functions
  const getBackgroundPrimary = () => {
    return isDark.value ? '#1a1a1a' : '#F8F9FA'
  }

  // CSS Variables for consistent styling
  const cssVars = computed(() => ({
    '--project-header-bg': getHeaderBackground(),
    '--project-header-text': `rgb(var(--v-theme-title-text))`,
    '--project-header-title': `rgb(var(--v-theme-title-text))`,
    '--project-header-subtitle': `rgb(var(--v-theme-subtitle-text))`,
    '--project-avatar-bg': `rgb(var(--v-theme-secondary))`,
    '--project-avatar-icon': `rgb(var(--v-theme-primary))`,
    '--project-stats-bg': getStatsBackground(),
    '--project-stats-bg-hover': getStatsBackgroundHover(),
    '--project-stats-border': getStatsBorder(),
    '--project-stats-text': `rgb(var(--v-theme-secondary))`,
    '--project-stats-icon': `rgb(var(--v-theme-secondary))`,
    '--project-card-bg': getCardBackground(),
    '--project-card-hover': getCardHoverBackground(),
    '--project-card-border': getCardBorder(),
    '--project-progress-bg': getProgressBackground(),
    '--project-progress-fill': `rgb(var(--v-theme-primary))`,
    '--project-text-primary': `rgb(var(--v-theme-title-text))`,
    '--project-text-secondary': `rgb(var(--v-theme-subtitle-text))`,
    '--project-bg-primary': getBackgroundPrimary()
  }))

  // Business logic functions
  const getStatusColor = (status) => {
    return statusColorMap.value[status?.toLowerCase()] || colors.value.secondary
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
    applyCssVars
  }
}
