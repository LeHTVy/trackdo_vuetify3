// Import all composables
import { useCalendarNavigation } from './useCalendarNavigation.js'
import { useEventFilters } from './useEventFilters.js'
import { useDialogManager } from './useDialogManager.js'
import { useEventForm } from './useEventForm.js'
import { useEventOperations } from './useEventOperations.js'
import { useCalendarUtils } from './useCalendarUtils.js'
import { useCalendarEvents } from './useCalendarEvents.js'
import { useCalendarList } from './useCalendarList.js'
import { useDraggableFab } from './useDraggableFab.js'
import { useEventDragDrop } from './useEventDragDrop.js'

// Export all composables
export {
  useCalendarNavigation,
  useEventFilters,
  useDialogManager,
  useEventForm,
  useEventOperations,
  useCalendarUtils,
  useCalendarEvents,
  useCalendarList,
  useDraggableFab,
  useEventDragDrop
}

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
