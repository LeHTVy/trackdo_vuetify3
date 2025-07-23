// Import all composables
import { useCalendarNavigation } from './useCalendarNavigation.js'
import { useEventFilters } from './useEventFilters.js'
import { useDialogManager } from './useDialogManager.js'
import { useEventForm } from './useEventForm.js'
import { useEventOperations } from './useEventOperations.js'
import { useCalendarUtils } from './useCalendarUtils.js'
import { useCalendarEvents } from './useCalendarEvents.js'
import { useCalendarList } from './useCalendarList.js'

// Export individual composables
export { useCalendarNavigation } from './useCalendarNavigation.js'
export { useEventFilters } from './useEventFilters.js'
export { useDialogManager } from './useDialogManager.js'
export { useEventForm } from './useEventForm.js'
export { useEventOperations } from './useEventOperations.js'
export { useCalendarUtils } from './useCalendarUtils.js'
export { useCalendarEvents } from './useCalendarEvents.js'
export { useCalendarList } from './useCalendarList.js'

// Combined composable for calendar functionality
export function useCalendar() {
  return {
    ...useCalendarNavigation(),
    ...useEventFilters(),
    ...useDialogManager(),
    ...useEventForm(),
    ...useEventOperations(),
    ...useCalendarUtils(),
    ...useCalendarEvents()
  }
}
