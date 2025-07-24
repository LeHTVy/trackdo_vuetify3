import { ref, reactive, readonly } from 'vue'

export function useEventDragDrop() {
  // Drag state
  const dragState = reactive({
    isDragging: false,
    draggedEvent: null,
    dragType: null, // 'move', 'resize-start', 'resize-end'
    originalEvent: null,
    ghostElement: null
  })

  // Visual feedback state
  const dropZoneState = reactive({
    activeDropZone: null,
    validDropZone: false
  })

  // Start dragging an event
  const startEventDrag = (event, dragType = 'move', nativeEvent) => {
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

    // Position ghost element
    if (nativeEvent) {
      updateGhostPosition(nativeEvent)
    }
  }

  // Update ghost element position
  const updateGhostPosition = (nativeEvent) => {
    if (dragState.ghostElement) {
      dragState.ghostElement.style.left = (nativeEvent.clientX + 10) + 'px'
      dragState.ghostElement.style.top = (nativeEvent.clientY - 10) + 'px'
    }
  }

  // Handle drag over calendar days
  const handleDragOver = (nativeEvent) => {
    nativeEvent.preventDefault()
    
    // Update ghost position
    updateGhostPosition(nativeEvent)

    // Find drop zone
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

  // Update drop zone visual feedback
  const updateDropZone = (date, element) => {
    // Clear previous drop zone
    clearDropZone()

    dropZoneState.activeDropZone = date
    dropZoneState.validDropZone = isValidDropZone(date)

    // Add visual feedback class
    element.classList.add('drop-zone-active')
    if (dropZoneState.validDropZone) {
      element.classList.add('drop-zone-valid')
    } else {
      element.classList.add('drop-zone-invalid')
    }
  }

  // Clear drop zone visual feedback
  const clearDropZone = () => {
    document.querySelectorAll('.drop-zone-active').forEach(el => {
      el.classList.remove('drop-zone-active', 'drop-zone-valid', 'drop-zone-invalid')
    })
    dropZoneState.activeDropZone = null
    dropZoneState.validDropZone = false
  }

  // Check if drop zone is valid
  const isValidDropZone = (dropDate) => {
    if (!dragState.draggedEvent || !dropDate) return false

    const eventStart = new Date(dragState.originalEvent.start)
    const eventEnd = new Date(dragState.originalEvent.end || dragState.originalEvent.start)
    
    eventStart.setHours(0, 0, 0, 0)
    eventEnd.setHours(0, 0, 0, 0)
    dropDate.setHours(0, 0, 0, 0)

    switch (dragState.dragType) {
      case 'move':
        return true // Can move to any date
      
      case 'resize-start':
        // Start date can't be after end date
        return dropDate.getTime() <= eventEnd.getTime()
      
      case 'resize-end':
        // End date can't be before start date
        return dropDate.getTime() >= eventStart.getTime()
      
      default:
        return false
    }
  }

  // Handle drop event
  const handleDrop = (nativeEvent) => {
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
  const calculateNewEventDates = (dropDate) => {
    const originalStart = new Date(dragState.originalEvent.start)
    const originalEnd = new Date(dragState.originalEvent.end || dragState.originalEvent.start)
    
    let newStart, newEnd

    switch (dragState.dragType) {
      case 'move':
        // Calculate duration and move entire event
        const duration = originalEnd.getTime() - originalStart.getTime()
        newStart = new Date(dropDate)
        newStart.setHours(originalStart.getHours(), originalStart.getMinutes())
        newEnd = new Date(newStart.getTime() + duration)
        break

      case 'resize-start':
        // Change start date, keep end date
        newStart = new Date(dropDate)
        newStart.setHours(originalStart.getHours(), originalStart.getMinutes())
        newEnd = new Date(originalEnd)
        break

      case 'resize-end':
        // Keep start date, change end date
        newStart = new Date(originalStart)
        newEnd = new Date(dropDate)
        newEnd.setHours(originalEnd.getHours(), originalEnd.getMinutes())
        break

      default:
        return null
    }

    return {
      ...dragState.originalEvent,
      start: newStart.toISOString(),
      end: newEnd.toISOString()
    }
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
    isValidDropZone
  }
}