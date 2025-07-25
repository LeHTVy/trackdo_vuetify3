import { useAsyncOperation } from '@/composables/common/useAsyncOperation'
import { useConfirmModal } from '@/composables/common/useConfirmModal'
import { useEventOperations } from '@/composables/CalendarCommon/useEventOperations'

export function useEventActions(eventsStore) {
  const { loading, error, execute, clearError, setError } = useAsyncOperation()
  const {
    isOpen: confirmModalOpen,
    loading: confirmModalLoading,
    modalConfig: confirmModalConfig,
    confirm: confirmModalConfirm,
    cancel: confirmModalCancel,
    confirmDelete
  } = useConfirmModal()
  const {
    saveEvent: saveEventOperation,
    deleteEvent: deleteEventOperation,
    duplicateEvent: duplicateEventOperation,
    createDuplicatedEventData,
    getEventTitle
  } = useEventOperations(eventsStore)

  const saveEvent = async (eventData, isEdit = false, selectedEvent = null) => {
    return execute(async () => {
      const result = await saveEventOperation(eventData, isEdit, selectedEvent)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    }, 'Unable to save event')
  }

  const deleteEvent = async (event) => {
    return execute(async () => {
      console.log('useEventActions deleteEvent called with:', event)

      const eventTitle = getEventTitle(event)
      const confirmed = await confirmDelete(
        `Are you sure you want to delete "${eventTitle}"?`,
        'This action cannot be undone.'
      )

      if (!confirmed) {
        return { success: false, cancelled: true }
      }

      const result = await deleteEventOperation(event)
      console.log('deleteEventOperation result:', result)

      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    }, 'Unable to delete event')
  }

  const duplicateEvent = async (event) => {
    return execute(async () => {
      if (!event) {
        throw new Error('Event not found for duplication.')
      }

      const result = await duplicateEventOperation(event)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    }, 'Unable to duplicate event')
  }

  const updateEvent = async (event, newEventData) => {
    return execute(async () => {
      if (!event) {
        throw new Error('Event not found for editing.')
      }

      const result = await saveEventOperation(newEventData, true, event)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    }, 'Unable to edit event')
  }

  const editEvent = (event) => {
    if (!event) {
      console.warn('No event provided for editing')
      return
    }

    console.log('Switching to edit mode for event:', event)
    return event
  }

  const quickDuplicate = async (event) => {
    return execute(async () => {
      if (!event) {
        throw new Error('Event not found for quick duplication.')
      }
      const now = new Date()
      const duplicatedEventData = {
        ...createDuplicatedEventData(event),
        start: now.toISOString(),
        end: new Date(now.getTime() + 60 * 60 * 1000).toISOString() // +1 hour
      }

      const result = await saveEventOperation(duplicatedEventData, false)
      if (!result.success) {
        throw new Error(result.error)
      }

      return result
    }, 'Unable to quick duplicate event')
  }

  return {
    // State
    loading,
    error,

    // Confirm Modal State
    confirmModalOpen,
    confirmModalLoading,
    confirmModalConfig,
    confirmModalConfirm,
    confirmModalCancel,

    // Actions
    saveEvent,
    deleteEvent,
    duplicateEvent,
    editEvent,
    updateEvent,
    quickDuplicate,

    // Utilities
    clearError,
    setError,
    getEventTitle,
    createDuplicatedEventData
  }
}
