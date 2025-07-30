// ===============================================
// 🏗️  COMPOSABLES INDEX - Organized by Function
// ===============================================

// =====================================
// 📦 CORE & FOUNDATION
// =====================================
export { useBaseOperations } from './common/useBaseOperations.js'
export { useEventHandler } from './common/useEventHandler.js'
export { useAsyncOperation } from './common/useAsyncOperation.js'
export { useErrorHandler } from './common/useErrorHandler.js'

// =====================================
// 🔐 AUTHENTICATION & VALIDATION
// =====================================
export { useAuth } from './common/useAuth.js'
export { useValidation, validationSchemas } from './common/useValidation.js'

// =====================================
// 🎨 UI COMPONENTS & DIALOGS
// =====================================
export { useUniversalDialog, useGlobalDialogManager, useConfirmDialog, useFormDialog, useDetailsDialog, DialogTypes } from './common/useUniversalDialog.js'
export { useDialogManager } from './common/useDialogManager.js'
export { useConfirmModal } from './common/useConfirmModal.js'
export { useConfirmModalConfig } from './common/useConfirmModalConfig.js'
export { useEmptyState } from './common/useEmptyState.js'
export { useDraggableFab } from './common/useDraggableFab.js'

// =====================================
// 📅 CALENDAR FEATURES
// =====================================

// Calendar Header
export { useCalendarHeader } from './CalendarHeader/useCalendarHeader.js'

// Calendar Main & Grid
export { useCalendarNavigation } from './CalendarMain/useCalendarNavigation.js'
export { useCalendarGrid } from './CalendarMain/useCalendarGrid.js'
export { useWeatherData } from './CalendarMain/useWeatherData.js'
export { useDayEvents } from './CalendarMain/useDayEvents.js'
export { useEventDragDrop } from './CalendarMain/useEventDragDrop.js'

// Calendar Common Operations
export { useCalendarEvents } from './CalendarCommon/useCalendarEvents.js'
export { useEventFilters } from './CalendarCommon/useEventFilters.js'
export { useEventOperations } from './CalendarCommon/useEventOperations.js'
export { useThemeColors } from './CalendarCommon/useThemeColors.js'
export { useEventUtils } from './CalendarCommon/useEventUtils.js'
export { useComponentClasses } from './CalendarCommon/useComponentClasses.js'

// Calendar Dialogs
export { useCalendarDialog } from './CalendarDialog/useCalendarDialog.js'
export { useEventActions } from './CalendarDialog/useEventActions.js'
export { useEventDetailsDialog } from './CalendarDialog/useEventDetailsDialog.js'
export { useEventValidation } from './CalendarDialog/useEventValidation.js'
export { useEventForm } from './CalendarDialog/useEventForm.js'

// Calendar List & Display
export { useCalendarList } from './CalendarList/useCalendarList.js'
export { useEventStatus } from './CalendarList/useEventStatus.js'
export { useEventTimeFormatter } from './CalendarList/useEventTimeFormatter.js'

// Day Events Modal
export { useDayEventsModal } from './DayEventsModal/useDayEventsModal.js'

// =====================================
// 🚀 PROJECT FEATURES
// =====================================
export { useProjectColors } from './ProjectCommon/useProjectColors.js'
export { useProjectDetailsDialog } from './ProjectCommon/useProjectDetailsDialog.js'
export { useProjectDialog } from './ProjectCommon/useProjectDialog.js'
export { useProjectFilters } from './ProjectCommon/useProjectFilters.js'
export { useProjectFormatting } from './ProjectCommon/useProjectFormatting.js'
export { useProjectOperations } from './ProjectCommon/useProjectOperations.js'
export { useProjectProgress } from './ProjectCommon/useProjectProgress.js'
export { useProjectStats } from './ProjectCommon/useProjectStats.js'

// =====================================
// ✅ TASK FEATURES
// =====================================
export { useTaskColors } from './TaskCommon/useTaskColors.js'
export { useTaskCompletion } from './TaskCommon/useTaskCompletion.js'
export { useTaskFilters } from './TaskCommon/useTaskFilters.js'
export { useTaskFormatting } from './TaskCommon/useTaskFormatting.js'
export { useTaskInsights } from './TaskCommon/useTaskInsights.js'
export { useTaskProgress } from './TaskCommon/useTaskProgress.js'
export { useTaskValidation } from './TaskCommon/useTaskValidation.js'

// ===============================================
// 📊 COMPOSABLES SUMMARY:
// - Core: 4 files (Base operations, handlers, utilities)
// - Auth & Validation: 2 files
// - UI Components: 6 files (Dialogs, modals, states)
// - Calendar: 17 files (Full calendar functionality)
// - Projects: 8 files (Project management)
// - Tasks: 7 files (Task management)
//
// Total: 44 composables (organized & clean) ✨
// ===============================================
