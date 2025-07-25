import { ref } from 'vue'

export function useCalendarEvents() {
  const handleEventClick = ({ event, nativeEvent }, emit, dialogManager) => {
    if (nativeEvent) {
      nativeEvent.stopPropagation()
    }
    emit('event-clicked', event)
  }

  const handleDateClick = ({ date }, emit) => {
    emit('date-selected', date)
  }

  const handleShowMore = ({ nativeEvent, date, events }, emit) => {
    if (nativeEvent) {
      nativeEvent.stopPropagation()
    }
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
