import { computed } from 'vue'
import { useTheme } from 'vuetify'

/**
 * Business Color for Calendar Components
 * @param {string} componentType
 * @returns {Object}
 */
export function useThemeColors (componentType = 'default') {
  const theme = useTheme()
  const colors = computed(() => theme.current.value.colors)
  const isDark = computed(() => theme.current.value.dark)
  const componentColors = computed(() => {
    const primary = colors.value.primary
    const secondary = colors.value.secondary

    switch (componentType) {
      case 'today':
        return { primary, secondary, accent: primary }
      case 'upcoming':
        return { primary: secondary, secondary: primary, accent: secondary }
      default:
        return { primary, secondary, accent: primary }
    }
  })

  const EVENT_TYPE_ICONS = {
    meeting: 'mdi-account-group',
    work: 'mdi-briefcase',
    social: 'mdi-account-heart',
    milestone: 'mdi-flag-checkered',
    deadline: 'mdi-clock-alert',
  }

  const EVENT_COLORS = [
    { text: 'Blue', value: '#1976D2' },
    { text: 'Green', value: '#388E3C' },
    { text: 'Orange', value: '#F57C00' },
    { text: 'Red', value: '#D32F2F' },
    { text: 'Purple', value: '#7B1FA2' },
    { text: 'Teal', value: '#00796B' },
    { text: 'Pink', value: '#C2185B' },
    { text: 'Indigo', value: '#303F9F' },
  ]

  const statusColorMap = computed(() => ({
    completed: colors.value.success,
    ongoing: colors.value.warning,
    upcoming: colors.value.info,
    today: colors.value.warning,
    tomorrow: colors.value.warning,
    soon: colors.value.info,
    'this week': colors.value.primary,
    'this month': colors.value.secondary,
    'next month': colors.value.secondary,
    later: colors.value.primary,
  }))

  const priorityColorMap = computed(() => ({
    Low: colors.value.success,
    Medium: colors.value.warning,
    High: colors.value.error,
  }))

  const eventTypeColorMap = computed(() => ({
    meeting: colors.value.primary,
    work: colors.value.info,
    social: colors.value.secondary,
    milestone: colors.value.success,
    deadline: colors.value.error,
  }))

  const eventTypes = computed(() => [
    { text: 'Meeting', value: 'meeting', icon: EVENT_TYPE_ICONS.meeting, color: colors.value.primary },
    { text: 'Work', value: 'work', icon: EVENT_TYPE_ICONS.work, color: colors.value.info },
    { text: 'Social', value: 'social', icon: EVENT_TYPE_ICONS.social, color: colors.value.secondary },
    { text: 'Milestone', value: 'milestone', icon: EVENT_TYPE_ICONS.milestone, color: colors.value.success },
    { text: 'Deadline', value: 'deadline', icon: EVENT_TYPE_ICONS.deadline, color: colors.value.error },
  ])

  const priorityLevels = computed(() => [
    { text: 'Low', value: 'Low', color: colors.value.success },
    { text: 'Medium', value: 'Medium', color: colors.value.warning },
    { text: 'High', value: 'High', color: colors.value.error },
  ])

  const themeClasses = computed(() => ({
    'theme-dark': isDark.value,
    'theme-light': !isDark.value,
    [`theme-${componentType}`]: true,
  }))

  const getHeaderStyles = () => {
    if (componentType === 'today') {
      return {
        backgroundColor: componentColors.value.secondary,
        color: componentColors.value.primary,
      }
    } else if (componentType === 'upcoming') {
      return {
        backgroundColor: componentColors.value.secondary,
        color: componentColors.value.primary,
      }
    }
    return {
      backgroundColor: colors.value.surface,
      color: colors.value.onSurface,
    }
  }

  const getChipColor = () => componentColors.value.accent
  const getAvatarColor = () => componentColors.value.primary
  const getTimeIconColor = () => componentColors.value.accent
  const getActionButtonColor = () => componentColors.value.primary
  const getDividerColor = () => colors.value.primary
  const getBorderColor = (opacity = 0.1) => {
    return `rgba(${hexToRgb(colors.value.primary)}, ${opacity})`
  }

  const getBackgroundColor = (colorName = 'surface', opacity = 1) => {
    const color = colors.value[colorName]
    return opacity === 1 ? color : `rgba(${hexToRgb(color)}, ${opacity})`
  }

  const getHoverColor = (colorName = 'primary', opacity = 0.05) => {
    const color = colors.value[colorName]
    return `rgba(${hexToRgb(color)}, ${opacity})`
  }

  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0'
  }

  const getStatusColor = status => {
    return statusColorMap.value[status?.toLowerCase()] || colors.value.primary
  }

  const getEventTypeIcon = type => {
    return EVENT_TYPE_ICONS[type] || 'mdi-calendar'
  }

  const getPriorityColor = priority => {
    return priorityColorMap.value[priority] || colors.value.primary
  }

  const getEventTypeColor = type => {
    return eventTypeColorMap.value[type] || colors.value.primary
  }

  const getPrimaryColor = () => colors.value.primary
  const getThemeColor = colorName => colors.value[colorName] || colors.value.primary
  const getEventColors = () => EVENT_COLORS
  const getEventTypes = () => eventTypes.value
  const getPriorityLevels = () => priorityLevels.value

  return {
    // Computed properties
    colors,
    isDark,
    themeClasses,
    componentColors,

    // Basic styling functions
    getHeaderStyles,
    getChipColor,
    getAvatarColor,
    getTimeIconColor,
    getActionButtonColor,
    getDividerColor,
    getBorderColor,
    getBackgroundColor,
    getHoverColor,
    getStatusColor,

    // Enhanced calendar-specific functions
    getEventTypeIcon,
    getPriorityColor,
    getEventTypeColor,
    getPrimaryColor,
    getThemeColor,

    // Business logic arrays
    getEventColors,
    getEventTypes,
    getPriorityLevels,

    // Utility
    hexToRgb,
  }
}
