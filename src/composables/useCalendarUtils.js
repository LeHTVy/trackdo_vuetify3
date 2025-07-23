import { ref, computed } from 'vue'
import { formatDate, formatEventTime as formatEventTimeUtil } from '@/utils/dateUtils.js'

export function useCalendarUtils() {
  // Use dateUtils functions instead of duplicating
  const formatDateTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Use dateUtils formatDate function
  const formatDateLocal = formatDate

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const intervalStyle = (interval) => {
    const hour = interval.hour
    if (hour < 6 || hour > 22) {
      return {
        backgroundColor: 'rgba(var(--v-theme-surface), 0.3)',
        opacity: 0.6
      }
    }
    return {}
  }

  const getEventColor = (event) => {
    return event.color || 'primary'
  }

  const viewTypes = [
    { title: 'Month', value: 'monthly' },
    { title: 'Week', value: 'weekly' }
  ]

  const weekdayOptions = [
    { title: 'Monday - Sunday', value: [0, 1, 2, 3, 4, 5, 6] },
    { title: 'Tuesday - Sunday', value: [1, 2, 3, 4, 5, 6, 0] },
    { title: 'Tuesday - Saturday', value: [1, 2, 3, 4, 5] },
    { title: 'Tuesday, Thursday, Saturday', value: [1, 3, 5] }
  ]

  return {
    // Date formatting (using dateUtils where possible)
    formatDateTime,
    formatDate: formatDateLocal,
    formatTime,
    formatEventTime: formatEventTimeUtil,

    // Styling utilities
    intervalStyle,
    getEventColor,

    // Configuration
    viewTypes,
    weekdayOptions
  }
}
