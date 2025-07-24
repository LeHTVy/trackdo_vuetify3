import { ref } from 'vue'

export function useCalendarEvents() {
  // Event handlers
  const handleEventClick = ({ event, nativeEvent }, emit, dialogManager) => {
    if (nativeEvent) {
      nativeEvent.stopPropagation()
    }

    // Emit event to parent instead of opening dialog directly
    emit('event-clicked', event)
  }

  const handleDateClick = ({ date }, emit) => {
    emit('date-selected', date)
  }

  const handleShowMore = ({ nativeEvent, date, events }, emit) => {
    if (nativeEvent) {
      nativeEvent.stopPropagation()
    }

    // Emit event để hiển thị modal với tất cả events của ngày đó
    emit('show-more-events', { date, events })
  }

  const handleRangeChange = ({ start, end }, emit) => {
    emit('range-changed', { start, end })
  }

  const editEvent = (event, emit, dialogManager) => {
    if (event) {
      emit('edit-event', event)
      dialogManager.closeEventDetailsDialog()
    }
  }

  return {
    handleEventClick,
    handleDateClick,
    handleShowMore,
    handleRangeChange,
    editEvent
  }
}
