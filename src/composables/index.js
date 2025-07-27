// Import all composables
import { useCalendarNavigation } from './CalendarMain/useCalendarNavigation.js'
import { useEventFilters } from './CalendarCommon/useEventFilters.js'
import { useDialogManager } from './common/useDialogManager.js'
import { useEventForm } from './CalendarDialog/useEventForm.js'
import { useEventOperations } from './CalendarCommon/useEventOperations.js'
import { useCalendarEvents } from './CalendarCommon/useCalendarEvents.js'
import { useCalendarList } from './CalendarList/useCalendarList.js'
import { useDraggableFab } from './common/useDraggableFab.js'
import { useEventDragDrop } from './CalendarMain/useEventDragDrop.js'
import { useCalendarHeader } from './CalendarHeader/useCalendarHeader.js'

// Calendar Header composables
export { useCalendarHeader } from './CalendarHeader/useCalendarHeader.js'

// Calendar Main composables
export { useCalendarNavigation } from './CalendarMain/useCalendarNavigation.js'
export { useCalendarEvents } from './CalendarCommon/useCalendarEvents.js'
export { useCalendarGrid } from './CalendarMain/useCalendarGrid.js'
export { useWeatherData } from './CalendarMain/useWeatherData.js'
export { useDayEvents } from './CalendarMain/useDayEvents.js'
export { useEventFilters } from './CalendarCommon/useEventFilters.js'
export { useEventDragDrop } from './CalendarMain/useEventDragDrop.js'
export { useDialogManager } from './common/useDialogManager.js'

// Calendar Common composables
export { useEventOperations } from './CalendarCommon/useEventOperations.js'
export { useDayEventsModal } from './DayEventsModal/useDayEventsModal.js'

// Calendar List composables
export { useCalendarList } from './CalendarList/useCalendarList.js'
export { useThemeColors } from './CalendarCommon/useThemeColors.js'
export { useEventStatus } from './CalendarList/useEventStatus.js'
export { useEventTimeFormatter } from './CalendarList/useEventTimeFormatter.js'
export { useEmptyState } from './common/useEmptyState.js'
export { useComponentClasses } from './CalendarCommon/useComponentClasses.js'

// Calendar Dialog composables
export { useCalendarDialog } from './CalendarDialog/useCalendarDialog.js'
export { useEventActions } from './CalendarDialog/useEventActions.js'
export { useEventDetailsDialog } from './CalendarDialog/useEventDetailsDialog.js'
export { useEventValidation } from './CalendarDialog/useEventValidation.js'

// Other composables
export { useDraggableFab } from './common/useDraggableFab.js'
export { useErrorHandler } from './common/useErrorHandler.js'

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

// Project Common composables
export { useProjectColors } from './ProjectCommon/useProjectColors.js'
export { useProjectDetailsDialog } from './ProjectCommon/useProjectDetailsDialog.js'
export { useProjectDialog } from './ProjectCommon/useProjectDialog.js'
export { useProjectOperations } from './ProjectCommon/useProjectOperations.js'
export { useProjectFilters } from './ProjectCommon/useProjectFilters.js'
export { useProjectFormatting } from './ProjectCommon/useProjectFormatting.js'
export { useProjectStats } from './ProjectCommon/useProjectStats.js'

// Combined composable for project functionality
export function useProject() {
  const operations = useProjectOperations()
  const colors = useProjectColors()
  const dialog = useProjectDialog()
  const filters = useProjectFilters()
  const formatting = useProjectFormatting()
  const stats = useProjectStats()

  return {
    // Operations
    ...operations,

    // Colors
    ...colors,

    // Dialog
    ...dialog,

    // Filters (with prefix to avoid conflicts)
    projectFilters: filters,

    // Formatting
    ...formatting,

    // Stats
    ...stats
  }
}

// Task Common composables
export { useTaskColors } from './TaskCommon/useTaskColors.js'
export { useTaskFormatting } from './TaskCommon/useTaskFormatting.js'
export { useTaskFilters } from './TaskCommon/useTaskFilters.js'
export { useTaskValidation } from './TaskCommon/useTaskValidation.js'
export { useTaskProgress } from './TaskCommon/useTaskProgress.js'
export { useTaskInsights } from './TaskCommon/useTaskInsights.js'
export { useTaskCompletion } from './TaskCommon/useTaskCompletion.js'

// Combined composable for task functionality
export function useTask() {
  const colors = useTaskColors()
  const formatting = useTaskFormatting()
  const filters = useTaskFilters()
  const validation = useTaskValidation()

  return {
    // Colors
    ...colors,

    // Formatting
    ...formatting,

    // Filters (with prefix to avoid conflicts)
    taskFilters: filters,

    // Validation
    ...validation
  }
}

