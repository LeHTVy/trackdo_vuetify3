import { computed } from 'vue'
import { useThemeColors } from '@/composables/CalendarCommon/useThemeColors'
import { useDialogManager } from '@/composables/common/useDialogManager'
import { useConfirmModal } from '@/composables/common/useConfirmModal'
import { useEventOperations } from '@/composables/CalendarCommon/useEventOperations'
import { useEventsStore } from '@/stores/events'

export function useEventDetailsDialog (props, emit) {
  const themeColors = useThemeColors('modal')
  const dialogManager = useDialogManager()
  const eventsStore = useEventsStore()

  const {
    deleteEventWithoutConfirm,
  } = useEventOperations(eventsStore)
  const {
    isOpen: confirmModalOpen,
    loading: confirmModalLoading,
    modalConfig: confirmModalConfig,
    confirmDelete,
    confirm: confirmModalConfirm,
    cancel: confirmModalCancel,
  } = useConfirmModal()

  // Dialog state - use from dialogManager
  const isOpen = computed({
    get () {
      return props.modelValue || dialogManager.eventDetailsDialog.value
    },
    set (value) {
      emit('update:modelValue', value)
      dialogManager.eventDetailsDialog.value = value
    },
  })

  // Event information getters - use selectedEvent from dialogManager
  const eventTitle = computed(() => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    return event?.title || event?.name || ''
  })

  const eventDescription = computed(() => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    return event?.description || event?.details || ''
  })

  const eventType = computed(() => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    return event?.type || 'Event'
  })

  const hasEndDate = computed(() => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    return event?.end && event.end !== event.start
  })

  const hasPriority = computed(() => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    return event?.priority
  })

  const hasDescription = computed(() => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    return !!(event?.description || event?.details)
  })

  // Event type icon getter - use from themeColors
  const getEventTypeIcon = themeColors.getEventTypeIcon

  // Priority color getter - use from themeColors
  const getPriorityColor = themeColors.getPriorityColor

  // Date formatter
  const formatDate = dateStr => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Dialog methods - use from dialogManager
  const closeDialog = () => {
    dialogManager.closeEventDetailsDialog()
    emit('close')
  }

  const deleteEvent = async () => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value

    if (!event) {
      console.error('No event selected for deletion')
      return
    }

    try {
      const confirmed = await confirmDelete(
        eventTitle.value || 'this event',
        'This action cannot be undone and will permanently remove the event from your calendar.'
      )

      if (confirmed) {
        console.log('Selected event for deletion:', event)
        console.log('Event ID:', event?.id || event?._id)

        const result = await deleteEventWithoutConfirm(event)
        if (result.success) {
          closeDialog()
          console.log('✅ Event deleted successfully')
        } else {
          console.error('❌ Failed to delete event:', result.error)
        }
      }
    } catch (error) {
      console.error('Error during event deletion:', error)
    }
  }

  const editEvent = () => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    emit('edit-event', event)
    dialogManager.switchToEditDialog()
  }

  const duplicateEvent = () => {
    const event = props.selectedEvent || dialogManager.selectedEvent.value
    emit('duplicate-event', event)
    closeDialog()
  }

  return {
    // Theme colors
    ...themeColors,

    // Dialog manager
    ...dialogManager,

    // State
    isOpen,

    // Confirm modal properties
    confirmModalOpen,
    confirmModalLoading,
    confirmModalConfig,
    confirmModalConfirm,
    confirmModalCancel,

    // Computed properties
    eventTitle,
    eventDescription,
    eventType,
    hasEndDate,
    hasPriority,
    hasDescription,

    // Methods
    getEventTypeIcon,
    getPriorityColor,
    formatDate,
    closeDialog,
    deleteEvent,
    editEvent,
    duplicateEvent,
  }
}
