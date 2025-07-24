import { ref, reactive } from 'vue'

export function useEventForm() {
  const editedIndex = ref(-1)
  const defaultEvent = {
    name: '',
    title: '',
    details: '',
    description: '',
    start: new Date().toISOString().substr(0, 10),
    end: new Date().toISOString().substr(0, 10),
    color: 'primary',
    type: 'work',
    priority: 'Medium',
  }
  const editedEvent = reactive({ ...defaultEvent })
  const resetForm = () => {
    Object.assign(editedEvent, defaultEvent)
    editedIndex.value = -1
  }
  const initializeNewEvent = (date = null) => {
    resetForm()

    if (date) {
      const dateStr = new Date(date).toISOString().substr(0, 10)
      editedEvent.start = dateStr
      editedEvent.end = dateStr
    }
  }
  const initializeEditEvent = (event, index = -1) => {
    if (!event) {
      resetForm()
      return
    }

    // Copy tất cả thông tin từ event sang editedEvent
    Object.assign(editedEvent, {
      name: event.name || event.title || '',
      title: event.title || event.name || '',
      details: event.details || '',
      description: event.description || event.details || '',
      start: event.start ? new Date(event.start).toISOString().substr(0, 10) : defaultEvent.start,
      end: event.end ? new Date(event.end).toISOString().substr(0, 10) : defaultEvent.end,
      color: event.color || 'primary',
      type: event.type || 'work',
      priority: event.priority || 'Medium',
      id: event.id || event._id || null,
    })

    editedIndex.value = index
  }

  const validateForm = () => {
    const errors = []

    if (!editedEvent.name || editedEvent.name.trim() === '') {
      errors.push('Tên sự kiện là bắt buộc')
    }

    if (!editedEvent.start) {
      errors.push('Ngày bắt đầu là bắt buộc')
    }

    if (!editedEvent.end) {
      errors.push('Ngày kết thúc là bắt buộc')
    }

    if (editedEvent.start && editedEvent.end) {
      const startDate = new Date(editedEvent.start)
      const endDate = new Date(editedEvent.end)

      if (endDate < startDate) {
        errors.push('Ngày kết thúc không thể trước ngày bắt đầu')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const getFormData = () => {
    let endDate = editedEvent.end
    if (new Date(endDate) < new Date(editedEvent.start)) {
      endDate = editedEvent.start
    }

    return {
      ...editedEvent,
      end: endDate,
      name: editedEvent.name.trim()
    }
  }

  const isEditMode = () => {
    return editedIndex.value > -1
  }

  const hasChanges = () => {
    return Object.keys(editedEvent).some(key => {
      if (key === 'id') return false
      return editedEvent[key] !== defaultEvent[key]
    })
  }

  return {
    // State
    editedEvent,
    editedIndex,
    defaultEvent,

    // Methods
    resetForm,
    initializeNewEvent,
    initializeEditEvent,
    validateForm,
    getFormData,
    isEditMode,
    hasChanges
  }
}
