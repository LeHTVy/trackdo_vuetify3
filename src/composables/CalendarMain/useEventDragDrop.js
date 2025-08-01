import { reactive, readonly } from 'vue'

export function useEventDragDrop () {
  // Drag state
  const dragState = reactive({
    isDragging: false,
    draggedEvent: null,
    dragType: null,
    originalEvent: null,
    ghostElement: null,
  })

  const dropZoneState = reactive({
    activeDropZone: null,
    validDropZone: false,
  })

  // Start dragging an event
  const startEventDrag = (event, dragType = 'move', nativeEvent) => {
    // Debug logging to track the original event
    console.log('startEventDrag called with:', {
      event,
      hasId: !!event.id,
      has_id: !!event._id,
      eventId: event.id || event._id,
      dragType,
    })

    dragState.isDragging = true
    dragState.draggedEvent = { ...event }
    dragState.originalEvent = { ...event }
    dragState.dragType = dragType

    // Create ghost element for visual feedback
    createGhostElement(event, nativeEvent)

    // Add global event listeners
    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)
    document.addEventListener('dragend', handleDragEnd)
  }

  // Create ghost element for drag feedback
  const createGhostElement = (event, nativeEvent) => {
    const ghost = document.createElement('div')
    ghost.className = 'event-drag-ghost'
    ghost.textContent = event.title || event.name
    ghost.style.cssText = `
      position: fixed;
      background: ${event.color || '#1976d2'};
      color: white;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 12px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.8;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `

    document.body.appendChild(ghost)
    dragState.ghostElement = ghost

    if (nativeEvent) {
      updateGhostPosition(nativeEvent)
    }
  }

  const updateGhostPosition = nativeEvent => {
    if (dragState.ghostElement) {
      dragState.ghostElement.style.left = (nativeEvent.clientX + 10) + 'px'
      dragState.ghostElement.style.top = (nativeEvent.clientY - 10) + 'px'
    }
  }

  const handleDragOver = nativeEvent => {
    nativeEvent.preventDefault()

    updateGhostPosition(nativeEvent)

    const dropZone = nativeEvent.target.closest('.calendar-day')
    if (dropZone) {
      const dateAttr = dropZone.getAttribute('data-date')
      if (dateAttr) {
        const dropDate = new Date(dateAttr)
        updateDropZone(dropDate, dropZone)
      }
    } else {
      clearDropZone()
    }
  }

  const updateDropZone = (date, element) => {
    clearDropZone()

    dropZoneState.activeDropZone = date
    dropZoneState.validDropZone = isValidDropZone(date)

    element.classList.add('drop-zone-active')
    if (dropZoneState.validDropZone) {
      element.classList.add('drop-zone-valid')
    } else {
      element.classList.add('drop-zone-invalid')
    }
  }

  const clearDropZone = () => {
    document.querySelectorAll('.drop-zone-active').forEach(el => {
      el.classList.remove('drop-zone-active', 'drop-zone-valid', 'drop-zone-invalid')
    })
    dropZoneState.activeDropZone = null
    dropZoneState.validDropZone = false
  }

  const isValidDropZone = dropDate => {
    if (!dragState.draggedEvent || !dropDate) return false

    const eventStart = new Date(dragState.originalEvent.start)
    const eventEnd = new Date(dragState.originalEvent.end || dragState.originalEvent.start)

    eventStart.setHours(0, 0, 0, 0)
    eventEnd.setHours(0, 0, 0, 0)
    dropDate.setHours(0, 0, 0, 0)

    switch (dragState.dragType) {
      case 'move':
        return true
      case 'resize-start':
        return dropDate.getTime() <= eventEnd.getTime()
      case 'resize-end':
        return dropDate.getTime() >= eventStart.getTime()
      default:
        return false
    }
  }

  // Handle drop event
  const handleDrop = nativeEvent => {
    nativeEvent.preventDefault()

    if (!dropZoneState.validDropZone || !dropZoneState.activeDropZone) {
      handleDragEnd()
      return null
    }

    const dropDate = new Date(dropZoneState.activeDropZone)
    const updatedEvent = calculateNewEventDates(dropDate)

    handleDragEnd()
    return updatedEvent
  }

  // Calculate new event dates based on drop
  const calculateNewEventDates = dropDate => {
    console.log('calculateNewEventDates called with:', {
      dropDate,
      originalEvent: dragState.originalEvent,
      originalEventId: dragState.originalEvent?.id || dragState.originalEvent?._id,
      dragType: dragState.dragType,
    })

    const originalStart = new Date(dragState.originalEvent.start)
    const originalEnd = new Date(dragState.originalEvent.end || dragState.originalEvent.start)

    let newStart, newEnd

    switch (dragState.dragType) {
      case 'move':
        const duration = originalEnd.getTime() - originalStart.getTime()
        newStart = new Date(dropDate)
        newStart.setHours(originalStart.getHours(), originalStart.getMinutes())
        newEnd = new Date(newStart.getTime() + duration)
        break
      case 'resize-start':
        newStart = new Date(dropDate)
        newStart.setHours(originalStart.getHours(), originalStart.getMinutes())
        newEnd = new Date(originalEnd)
        break
      case 'resize-end':
        newStart = new Date(originalStart)
        newEnd = new Date(dropDate)
        newEnd.setHours(originalEnd.getHours(), originalEnd.getMinutes())
        break
      default:
        return null
    }

    // Ensure the event ID is properly preserved
    const updatedEvent = {
      ...dragState.originalEvent,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
    }

    console.log('calculateNewEventDates result:', {
      updatedEvent,
      hasId: !!updatedEvent.id,
      has_id: !!updatedEvent._id,
      eventId: updatedEvent.id || updatedEvent._id,
    })

    // Make sure we have a valid ID - prefer _id over id for MongoDB compatibility
    if (!updatedEvent.id && !updatedEvent._id) {
      console.error('Event missing ID during drag and drop:', updatedEvent)
      return null
    }

    // Ensure both id and _id are set for compatibility
    if (updatedEvent._id && !updatedEvent.id) {
      updatedEvent.id = updatedEvent._id
    } else if (updatedEvent.id && !updatedEvent._id) {
      updatedEvent._id = updatedEvent.id
    }

    return updatedEvent
  }

  // Handle drag end
  const handleDragEnd = () => {
    // Remove ghost element
    if (dragState.ghostElement) {
      document.body.removeChild(dragState.ghostElement)
      dragState.ghostElement = null
    }

    // Clear drop zone feedback
    clearDropZone()

    // Remove global event listeners
    document.removeEventListener('dragover', handleDragOver)
    document.removeEventListener('drop', handleDrop)
    document.removeEventListener('dragend', handleDragEnd)

    // Reset drag state
    dragState.isDragging = false
    dragState.draggedEvent = null
    dragState.originalEvent = null
    dragState.dragType = null
  }

  // Handle resize handles
  const startResize = (event, direction, nativeEvent) => {
    nativeEvent.stopPropagation()
    const dragType = direction === 'start' ? 'resize-start' : 'resize-end'
    startEventDrag(event, dragType, nativeEvent)
  }

  return {
    dragState: readonly(dragState),
    dropZoneState: readonly(dropZoneState),
    startEventDrag,
    startResize,
    handleDrop,
    handleDragEnd,
    isValidDropZone,
  }
}
