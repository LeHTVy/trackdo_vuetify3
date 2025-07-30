import { useBaseOperations } from '@/composables/common/useBaseOperations'
import { useEventHandler } from '@/composables/common/useEventHandler'
import logger from '@/services/logger'

const eventLogger = logger.createLogger('EventOperations')

export function useEventOperations(eventsStore) {
  const baseOps = useBaseOperations(eventsStore, 'event')
  const eventHandler = useEventHandler('EventOperations')

  /**
   * Get event title with fallback
   * @param {Object} event - Event object
   * @returns {string} - Event title
   */
  const getEventTitle = (event) => {
    return event?.title || event?.name || 'Untitled Event'
  }

  /**
   * Create duplicated event data
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

  /**
   * Validate event data
   * @param {Object} eventData - Event data to validate
   * @returns {Object} - Validation result
   */
  const validateEventData = (eventData) => {
    const errors = []

    const eventTitle = eventData.title || eventData.name
    if (!eventTitle) {
      errors.push('Event title is required')
    }

    if (!eventData.start) {
      errors.push('Start date is required')
    }

    if (!eventData.end) {
      errors.push('End date is required')
    }

    if (eventData.start && eventData.end && new Date(eventData.end) < new Date(eventData.start)) {
      errors.push('End date must be after start date')
    }

    return {
      isValid: errors.length === 0,
      errors,
      error: errors.join(', ')
    }
  }

  /**
   * Normalize event data
   * @param {Object} eventData - Event data to normalize
   * @returns {Object} - Normalized event data
   */
  const normalizeEventData = (eventData) => {
    const normalized = { ...eventData }

    // Ensure both title and name are set
    if (normalized.title && !normalized.name) {
      normalized.name = normalized.title
    }
    if (normalized.name && !normalized.title) {
      normalized.title = normalized.name
    }

    // Fix date range if needed
    if (normalized.start && normalized.end && new Date(normalized.end) < new Date(normalized.start)) {
      normalized.end = normalized.start
      eventLogger.warn('End date was before start date, adjusted to match start date')
    }

    return normalized
  }

  /**
   * Save event (create or update)
   * @param {Object} eventData - Event data
   * @param {boolean} isEdit - Whether this is an edit operation
   * @param {Object} selectedEvent - Selected event for edit
   * @returns {Promise<Object>} - Operation result
   */
  const saveEvent = async (eventData, isEdit = false, selectedEvent = null) => {
    return eventHandler.handleAsyncEvent(async () => {
      // Validate data
      const validation = validateEventData(eventData)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      // Normalize data
      const normalizedData = normalizeEventData(eventData)

      if (isEdit && selectedEvent) {
        // For update, ensure the event has proper ID
        const eventId = selectedEvent.id || selectedEvent._id
        if (!eventId) {
          throw new Error('Event ID is required for update')
        }

        // Merge the normalized data with the event ID
        const eventToUpdate = {
          ...normalizedData,
          id: eventId,
          _id: eventId
        }

        // Call the store's updateEvent method directly with the full event object
        const result = await eventsStore.updateEvent(eventToUpdate)
        return {
          success: true,
          data: result,
          message: 'Event updated successfully'
        }
      } else {
        return baseOps.createItem(normalizedData, {
          createMethod: 'addEvent',
          successMessage: 'Event created successfully',
          errorMessage: 'Unable to create event'
        })
      }
    }, {
      actionName: isEdit ? 'update_event' : 'create_event',
      itemName: 'Event'
    })
  }

  /**
   * Delete event
   * @param {Object} event - Event to delete
   * @returns {Promise<Object>} - Operation result
   */
  const deleteEvent = async (event) => {
    const eventTitle = getEventTitle(event)

    return eventHandler.handleDelete(async () => {
      return baseOps.deleteItem(event, {
        deleteMethod: 'deleteEvent',
        successMessage: 'Event deleted successfully',
        errorMessage: 'Unable to delete event'
      })
    }, {
      itemName: eventTitle,
      confirmMessage: `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`
    })
  }

  /**
   * Delete event without confirmation (for use when confirmation is already handled)
   * @param {Object} event - Event to delete
   * @returns {Promise<Object>} - Operation result
   */
  const deleteEventWithoutConfirm = async (event) => {
    return eventHandler.handleAsyncEvent(async () => {
      return baseOps.deleteItem(event, {
        deleteMethod: 'deleteEvent',
        successMessage: 'Event deleted successfully',
        errorMessage: 'Unable to delete event'
      })
    }, {
      actionName: 'delete_event',
      itemName: getEventTitle(event)
    })
  }

  /**
   * Duplicate event
   * @param {Object} event - Event to duplicate
   * @returns {Promise<Object>} - Operation result
   */
  const duplicateEvent = async (event) => {
    return eventHandler.handleDuplicate(async () => {
      return baseOps.duplicateItem(event, {
        createMethod: 'addEvent',
        duplicateTransform: createDuplicatedEventData,
        successMessage: 'Event duplicated successfully',
        errorMessage: 'Unable to duplicate event'
      })
    }, {
      itemName: getEventTitle(event)
    })
  }

  /**
   * Delete multiple events
   * @param {Array} eventIds - Array of event IDs
   * @returns {Promise<Object>} - Operation result
   */
  const deleteMultipleEvents = async (eventIds) => {
    return eventHandler.handleAsyncEvent(async () => {
      return baseOps.deleteMultipleItems(eventIds, {
        deleteMethod: 'deleteEvent',
        successMessage: `${eventIds.length} events deleted successfully`,
        errorMessage: 'Unable to delete selected events'
      })
    }, {
      actionName: 'delete_multiple_events',
      confirmBefore: () => window.confirm(`Are you sure you want to delete ${eventIds.length} events? This action cannot be undone.`)
    })
  }

  /**
   * Refresh events
   * @returns {Promise<Object>} - Operation result
   */
  const refreshEvents = async () => {
    return eventHandler.handleAsyncEvent(async () => {
      return baseOps.refreshItems({
        refreshMethod: 'initializeStore',
        successMessage: 'Events refreshed successfully',
        errorMessage: 'Unable to refresh events'
      })
    }, {
      actionName: 'refresh_events'
    })
  }

  /**
   * Export events to JSON file
   * @returns {Object} - Export result
   */
  const exportEvents = () => {
    try {
      const events = eventsStore.events
      const dataStr = JSON.stringify(events, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

      const exportFileDefaultName = `events-export-${new Date().toISOString().split('T')[0]}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()

      eventLogger.success(`Exported ${events.length} events to ${exportFileDefaultName}`)
      return { success: true, message: 'Events exported successfully' }
    } catch (error) {
      eventLogger.error('Export failed', error)
      return { success: false, error: 'Export failed' }
    }
  }

  return {
    // State from base operations
    loading: baseOps.loading,
    error: baseOps.error,

    // Operations
    saveEvent,
    deleteEvent,
    deleteEventWithoutConfirm,
    duplicateEvent,
    deleteMultipleEvents,
    refreshEvents,
    exportEvents,

    // Utilities
    clearError: baseOps.clearError,
    setError: baseOps.setError,
    getEventTitle,
    createDuplicatedEventData,
    validateEventData,
    normalizeEventData
  }
}
