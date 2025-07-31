import { useThemeColors } from '../CalendarCommon/useThemeColors.js'
import { useEventStatus } from './useEventStatus.js'
import { useEventTimeFormatter } from './useEventTimeFormatter.js'
import { useEmptyState } from '../common/useEmptyState.js'
import { useComponentClasses } from '../CalendarCommon/useComponentClasses.js'

export function useCalendarList (type = 'upcoming') {
  const themeColors = useThemeColors(type)
  const eventStatus = useEventStatus()
  const timeFormatter = useEventTimeFormatter()
  const emptyState = useEmptyState(type)
  const componentClasses = useComponentClasses(type)
  const formatEventTime = event => {
    return timeFormatter.formatEventTime(event, type)
  }

  const getEventStatus = event => {
    return eventStatus.getEventStatus(event, type)
  }

  const getTitle = () => {
    return type === 'today' ? 'Today\'s Events' : 'Upcoming Events'
  }

  const getTitleIcon = () => {
    return type === 'today' ? 'mdi-calendar-today' : 'mdi-calendar-clock'
  }

  return {
    // Computed classes from component classes composable
    listClasses: componentClasses.listClasses,
    headerClasses: componentClasses.headerClasses,
    eventItemClasses: componentClasses.itemClasses,

    // Dynamic styling functions from theme colors composable
    getHeaderStyles: themeColors.getHeaderStyles,
    getChipColor: themeColors.getChipColor,
    getAvatarColor: themeColors.getAvatarColor,
    getTimeIconColor: themeColors.getTimeIconColor,
    getActionButtonColor: themeColors.getActionButtonColor,

    // Event formatting functions
    formatEventTime,
    getEventStatus,

    // Content getters from empty state composable
    getTitle,
    getTitleIcon,
    getEmptyIcon: emptyState.getEmptyIcon,
    getEmptyTitle: emptyState.getEmptyTitle,
    getEmptyText: emptyState.getEmptyText,
  }
}
