import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores/events'

export function useDragAndDrop() {
  const eventsStore = useEventsStore()
  const draggedEvent = ref(null)
  const dragOverSlot = ref(null)
  const isDragging = ref(false)
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime())
  }

  const formatDateForDB = (date) => {
    if (!isValidDate(date)) return null
    return date.toISOString()
  }

  const calculateEventDuration = (startDate, endDate) => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) return 60 * 60 * 1000
    return endDate.getTime() - startDate.getTime()
  }

  const onDragStart = (event, eventData) => {
    try {
      console.log('Drag started:', eventData)
      draggedEvent.value = { ...eventData }
      isDragging.value = true

      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', eventData.id)

      if (event.target) {
        event.target.classList.add('dragging')
      }

      const dragImage = event.target.cloneNode(true)
      dragImage.style.transform = 'rotate(5deg)'
      dragImage.style.opacity = '0.8'
      event.dataTransfer.setDragImage(dragImage, 0, 0)

    } catch (error) {
      console.error('Error starting drag:', error)
    }
  }

  const onDragOver = (event, hour, dateStr = null) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'

    dragOverSlot.value = {
      hour: parseInt(hour),
      dateStr: dateStr || null,
      timestamp: Date.now()
    }
  }

  const onDragLeave = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      dragOverSlot.value = null
    }
  }

  const onDrop = async (event, hour, dateStr = null, emit = null) => {
    event.preventDefault()

    try {
      if (!draggedEvent.value) {
        console.warn('No dragged event found')
        return false
      }

      console.log('Drop event:', { hour, dateStr, draggedEvent: draggedEvent.value })

      const targetDate = dateStr || new Date().toISOString().split('T')[0]
      const targetHour = parseInt(hour)

      if (targetHour === 0 && dateStr) {
        const originalStart = new Date(draggedEvent.value.start)
        const originalEnd = new Date(draggedEvent.value.end || originalStart.getTime() + 60 * 60 * 1000)

        if (!isValidDate(originalStart) || !isValidDate(originalEnd)) {
          console.error('Invalid original dates')
          return false
        }

        const newStartTime = new Date(`${targetDate}T${originalStart.toTimeString().split(' ')[0]}`)
        const duration = calculateEventDuration(originalStart, originalEnd)
        const newEndTime = new Date(newStartTime.getTime() + duration)

        const updatedEvent = {
          ...draggedEvent.value,
          start: formatDateForDB(newStartTime),
          end: formatDateForDB(newEndTime)
        }

        console.log('Updated event (month view):', updatedEvent)

        if (eventsStore.updateEvent) {
          await eventsStore.updateEvent(updatedEvent.id, updatedEvent)
          console.log('Event updated in store successfully')
        }

        if (emit && typeof emit === 'function') {
          emit('event-update', updatedEvent)
        }

        return true
      }

      if (isNaN(targetHour) || targetHour < 0 || targetHour > 23) {
        console.error('Invalid target hour:', targetHour)
        return false
      }

      const newStartTime = new Date(`${targetDate}T${targetHour.toString().padStart(2, '0')}:00:00`)

      if (!isValidDate(newStartTime)) {
        console.error('Invalid new start time:', newStartTime)
        return false
      }

      const originalStart = new Date(draggedEvent.value.start)
      const originalEnd = new Date(draggedEvent.value.end || originalStart.getTime() + 60 * 60 * 1000)
      const duration = calculateEventDuration(originalStart, originalEnd)
      const newEndTime = new Date(newStartTime.getTime() + duration)
      const updatedEvent = {
        ...draggedEvent.value,
        start: formatDateForDB(newStartTime),
        end: formatDateForDB(newEndTime)
      }

      console.log('Updated event:', updatedEvent)

      if (eventsStore.updateEvent) {
        await eventsStore.updateEvent(updatedEvent.id, updatedEvent)
        console.log('Event updated in store successfully')
      }

      if (emit && typeof emit === 'function') {
        emit('event-update', updatedEvent)
      }

      return true

    } catch (error) {
      console.error('Error dropping event:', error)
      return false
    } finally {
      draggedEvent.value = null
      dragOverSlot.value = null
      isDragging.value = false
      document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging')
      })
    }
  }

  const onDragEnd = (event) => {
    try {
      draggedEvent.value = null
      dragOverSlot.value = null
      isDragging.value = false

      if (event.target) {
        event.target.classList.remove('dragging')
      }

      document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging')
      })

    } catch (error) {
      console.error('Error ending drag:', error)
    }
  }

  const isDragOver = (hour, dateStr = null) => {
    if (!dragOverSlot.value) return false

    const targetDate = dateStr || new Date().toISOString().split('T')[0]
    const targetHour = parseInt(hour)

    if (targetHour === 0 && dateStr) {
      return dragOverSlot.value.dateStr === targetDate
    }

    return dragOverSlot.value.hour === targetHour &&
           (dragOverSlot.value.dateStr === targetDate ||
            (!dragOverSlot.value.dateStr && !dateStr))
  }

  const dragState = computed(() => ({
    isDragging: isDragging.value,
    draggedEvent: draggedEvent.value,
    dragOverSlot: dragOverSlot.value
  }))

  const resetDragState = () => {
    draggedEvent.value = null
    dragOverSlot.value = null
    isDragging.value = false

    document.querySelectorAll('.dragging').forEach(el => {
      el.classList.remove('dragging')
    })
  }

  return {
    // State
    draggedEvent,
    dragOverSlot,
    isDragging,
    dragState,

    // Methods
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    isDragOver,
    resetDragState,

    // Utilities
    isValidDate,
    formatDateForDB,
    calculateEventDuration
  }
}
