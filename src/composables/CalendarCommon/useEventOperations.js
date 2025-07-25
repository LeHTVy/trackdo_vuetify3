import { useAsyncOperation } from '@/composables/common/useAsyncOperation'

export function useEventOperations(eventsStore) {
  const { loading, error, execute, executeMultiple, clearError, setError } = useAsyncOperation()

  /**
   * Tạo event title thống nhất cho duplicate
   * @param {Object} event - Event object
   * @returns {string} - Event title
   */
  const getEventTitle = (event) => {
    return event?.title || event?.name || 'Untitled Event'
  }

  /**
   * Tạo duplicated event data thống nhất
   * @param {Object} event - Original event
   * @returns {Object} - Duplicated event data
   */
  const createDuplicatedEventData = (event) => {
    const eventTitle = getEventTitle(event)
    return {
      ...event,
      title: `${eventTitle} (Copy)`,
      name: `${eventTitle} (Copy)`,
      id: undefined,
      _id: undefined
    }
  }

  const saveEvent = async (eventData, isEdit = false, selectedEvent = null) => {
    return execute(async () => {
      const eventTitle = eventData.title || eventData.name
      if (!eventTitle || !eventData.start || !eventData.end) {
        throw new Error('Please fill in all required information.')
      }

      // Ensure both title and name are set
      if (eventData.title && !eventData.name) {
        eventData.name = eventData.title
      }
      if (eventData.name && !eventData.title) {
        eventData.title = eventData.name
      }

      // Validate date range
      if (new Date(eventData.end) < new Date(eventData.start)) {
        eventData.end = eventData.start
      }

      if (isEdit && selectedEvent) {
        const eventId = selectedEvent.id || selectedEvent._id
        if (!eventId) {
          throw new Error('Event ID not found for update.')
        }

        await eventsStore.updateEvent({
          ...eventData,
          id: eventId
        })
      } else {
        await eventsStore.addEvent(eventData)
      }

      return { success: true }
    }, 'Unable to save event')
  }

  const deleteEvent = async (event) => {
    return execute(async () => {
      const eventId = event?.id || event?._id
      if (!event || !eventId) {
        throw new Error('Event not found for deletion.')
      }

      await eventsStore.deleteEvent(eventId)
      return { success: true }
    }, 'Unable to delete event')
  }

  const duplicateEvent = async (event) => {
    return execute(async () => {
      if (!event) {
        throw new Error('Event not found for duplication.')
      }

      const duplicatedEvent = createDuplicatedEventData(event)
      await eventsStore.addEvent(duplicatedEvent)

      return { success: true }
    }, 'Unable to duplicate event')
  }

  const deleteMultipleEvents = async (eventIds) => {
    return execute(async () => {
      if (!eventIds || eventIds.length === 0) {
        throw new Error('No events selected for deletion.')
      }

      const operations = eventIds.map(id => () => eventsStore.deleteEvent(id))
      const result = await executeMultiple(operations, 'Unable to delete some events')

      if (!result.success) {
        throw new Error(result.error)
      }

      return { success: true, deletedCount: eventIds.length }
    }, 'Unable to delete selected events')
  }

  const refreshEvents = async () => {
    return execute(async () => {
      await eventsStore.initializeStore()
      return { success: true }
    }, 'Unable to refresh events list')
  }

  const exportEvents = () => {
    try {
      const events = eventsStore.events
      const dataStr = JSON.stringify(events, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `events_${new Date().toISOString().split('T')[0]}.json`
      link.click()

      URL.revokeObjectURL(url)

      return { success: true }
    } catch (err) {
      setError(err, 'Unable to export events data.')
      return { success: false, error: error.value }
    }
  }

  return {
    // State
    error,
    loading,

    // Methods
    saveEvent,
    deleteEvent,
    duplicateEvent,
    deleteMultipleEvents,
    refreshEvents,
    exportEvents,
    clearError,
    setError,

    // Utility methods
    getEventTitle,
    createDuplicatedEventData
  }
}
