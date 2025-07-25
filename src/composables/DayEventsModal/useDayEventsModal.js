import { computed } from 'vue'
import { useEventTimeFormatter } from '@/composables/CalendarList/useEventTimeFormatter'
import { formatDate as utilsFormatDate } from '@/utils/dateUtils'

/**
 * Composable for DayEventsModal component
 * Centralizes modal state management and event handling logic
 * @param {Object} props - Component props
 * @param {Function} emit - Component emit function
 * @returns {Object} Modal state and methods
 */
export function useDayEventsModal(props, emit) {
  const { formatEventTime: formatEventTimeComposable } = useEventTimeFormatter()
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  /**
   * Close the modal
   */
  const closeModal = () => {
    isOpen.value = false
  }

  /**
   * Handle event click - emit event and close modal
   * @param {Object} event - Event object
   */
  const onEventClick = (event) => {
    emit('event-click', event)
    closeModal()
  }

  /**
   * Handle event menu action
   * @param {Object} event - Event object
   */
  const onEventMenu = (event) => {
    emit('event-menu', event)
  }

  /**
   * Format date for modal header display
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    if (!date) return ''
    return utilsFormatDate(date, 'en-US')
  }

  /**
   * Format event time for display in modal
   * Uses the composable formatter for consistency
   * @param {Object} event - Event object
   * @returns {string} Formatted time string
   */
  const formatEventTime = (event) => {
    if (!event.start) return ''

    const startDate = new Date(event.start)
    const endDate = new Date(event.end || event.start)

    const startTime = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })

    if (event.end && event.end !== event.start) {
      const endTime = endDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `${startTime} - ${endTime}`
    }

    return startTime
  }

  return {
    // State
    isOpen,

    // Methods
    closeModal,
    onEventClick,
    onEventMenu,
    formatDate,
    formatEventTime
  }
}
