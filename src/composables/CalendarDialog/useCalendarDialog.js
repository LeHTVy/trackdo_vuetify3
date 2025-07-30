import { ref, computed, watch } from 'vue'
import { useEventForm } from '@/composables/CalendarDialog/useEventForm'
import { useThemeColors } from '@/composables/CalendarCommon/useThemeColors'
import { useDialogManager } from '@/composables/common/useDialogManager'

export function useCalendarDialog(props, emit) {
  const themeColors = useThemeColors('dialog')
  const dialogManager = useDialogManager()

  const {
    editedEvent,
    editedIndex: formEditedIndex,
    resetForm,
    initializeNewEvent,
    initializeEditEvent,
    validateForm,
    getFormData,
    isEditMode
  } = useEventForm()

  // Dialog state management - use from dialogManager
  const dialog = computed({
    get() {
      return props.modelValue || dialogManager.eventDialog.value
    },
    set(value) {
      emit('update:modelValue', value)
      dialogManager.eventDialog.value = value
    }
  })

  const detailsDialog = computed({
    get() {
      return props.detailsModelValue || dialogManager.eventDetailsDialog.value
    },
    set(value) {
      // Only emit if we have the prop
      if (props.detailsModelValue !== undefined) {
        emit('update:detailsModelValue', value)
      }
      // Only set if it's not readonly
      if (dialogManager.eventDetailsDialog.value !== value) {
        dialogManager.eventDetailsDialog.value = value
      }
    }
  })

  // Form state
  const formTitle = computed(() => {
    return props.editedIndex === -1 ? 'New Event' : 'Edit Event'
  })

  const isFormValid = computed(() => {
    const validation = validateForm()
    return validation.isValid
  })

  // Theme-based options
  const eventTypes = computed(() => themeColors.getEventTypes())
  const priorityLevels = computed(() => themeColors.getPriorityLevels())
  const eventColors = computed(() => themeColors.getEventColors())

  // Watchers for form initialization
  watch(() => props.event, (newEvent) => {
    if (newEvent && Object.keys(newEvent).length > 0) {
      initializeEditEvent(newEvent, props.editedIndex)
    }
  }, { deep: true, immediate: true })

  watch(() => props.editedIndex, (newIndex) => {
    if (newIndex !== -1 && props.event && Object.keys(props.event).length > 0) {
      initializeEditEvent(props.event, newIndex)
    } else if (newIndex === -1) {
      initializeNewEvent()
    }
  }, { immediate: true })

  // Dialog methods - use from dialogManager
  const closeDialog = () => {
    dialogManager.closeEventDialog()
    resetForm()
    emit('close')
  }

  const openDialog = (event = null, index = -1) => {
    if (event) {
      initializeEditEvent(event, index)
      dialogManager.selectedEvent.value = event
    } else {
      initializeNewEvent()
    }
    dialogManager.openEventDialog()
  }

  return {
    // Theme colors
    ...themeColors,

    // Dialog manager
    ...dialogManager,

    // Form state
    editedEvent,
    dialog,
    detailsDialog,
    formTitle,
    isFormValid,

    // Options
    eventTypes,
    priorityLevels,
    eventColors,

    // Form methods
    resetForm,
    initializeNewEvent,
    initializeEditEvent,
    validateForm,
    getFormData,
    isEditMode,

    // Dialog methods
    closeDialog,
    openDialog
  }
}
