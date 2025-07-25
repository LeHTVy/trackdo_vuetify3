// Import all composables
import { useCalendarNavigation } from './CalendarMain/useCalendarNavigation.js'
import { useEventFilters } from './CalendarCommon/useEventFilters.js'
import { useDialogManager } from './CalendarCommon/useDialogManager.js'
import { useEventForm } from './CalendarDialog/useEventForm.js'
import { useEventOperations } from './CalendarCommon/useEventOperations.js'
import { useCalendarEvents } from './CalendarCommon/useCalendarEvents.js'
import { useCalendarList } from './CalendarList/useCalendarList.js'
import { useDraggableFab } from './common/useDraggableFab.js'
import { useEventDragDrop } from './CalendarMain/useEventDragDrop.js'
import { useCalendarHeader } from './CalendarHeader/useCalendarHeader.js'

// Calendar Header composables
export { useCalendarHeader } from './CalendarHeader/useCalendarHeader'

// Calendar Main composables
export { useCalendarNavigation } from './CalendarMain/useCalendarNavigation'
export { useCalendarEvents } from './CalendarCommon/useCalendarEvents.js'
export { useCalendarGrid } from './CalendarMain/useCalendarGrid'
export { useWeatherData } from './CalendarMain/useWeatherData'
export { useDayEvents } from './CalendarMain/useDayEvents.js'
export { useEventFilters } from './CalendarCommon/useEventFilters.js'
export { useEventDragDrop } from './CalendarMain/useEventDragDrop'
export { useDialogManager } from './CalendarCommon/useDialogManager.js'

// Calendar Common composables
export { useEventOperations } from './CalendarCommon/useEventOperations.js'
export { useDayEventsModal } from './DayEventsModal/useDayEventsModal.js'

// Calendar List composables
export { useCalendarList } from './CalendarList/useCalendarList'
export { useThemeColors } from './CalendarCommon/useThemeColors.js'
export { useEventStatus } from './CalendarList/useEventStatus'
export { useEventTimeFormatter } from './CalendarList/useEventTimeFormatter'
export { useEmptyState } from './common/useEmptyState.js'
export { useComponentClasses } from './CalendarCommon/useComponentClasses.js'

// Calendar Dialog composables
export { useCalendarDialog } from './CalendarDialog/useCalendarDialog.js'
export { useEventActions } from './CalendarDialog/useEventActions.js'
export { useEventDetailsDialog } from './CalendarDialog/useEventDetailsDialog.js'
export { useEventValidation } from './CalendarDialog/useEventValidation.js'

// Other composables
export { useEventForm } from './useEventForm.js'
export { useEventOperations } from './CalendarCommon/useEventOperations.js'
export { useDraggableFab } from './common/useDraggableFab.js'

// Combined composable for calendar functionality
export function useCalendar() {
  return {
    ...useCalendarNavigation(),
    ...useEventFilters(),
    ...useDialogManager(),
    ...useEventForm(),
    ...useEventOperations()
  }
}

