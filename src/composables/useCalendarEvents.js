import { ref } from 'vue'

export function useCalendarEvents() {
  // Event handlers
  const handleEventClick = ({ event, nativeEvent }, emit, dialogManager) => {
    if (nativeEvent) {
      nativeEvent.stopPropagation()
    }

    dialogManager.showEventDetails(event)
    emit('event-clicked', event)
  }

  const handleDateClick = ({ date }, emit) => {
    emit('date-selected', date)
  }

  const handleShowMore = ({ nativeEvent, date, events }) => {
    nativeEvent.stopPropagation()
    console.log('Hiển thị thêm sự kiện cho ngày:', date, events)
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
