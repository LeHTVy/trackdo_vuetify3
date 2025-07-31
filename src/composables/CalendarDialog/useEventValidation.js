/**
 * Event validation composable
 */
export function useEventValidation () {

  const validateEventTitle = (title, name) => {
    const eventTitle = title || name
    if (!eventTitle || eventTitle.trim() === '') {
      return { isValid: false, message: 'Event title is required' }
    }
    return { isValid: true, message: '' }
  }

  const validateEventDates = (start, end) => {
    const errors = []

    if (!start) {
      errors.push('Start date is required')
    }

    if (!end) {
      errors.push('End date is required')
    }

    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      if (endDate < startDate) {
        errors.push('End date cannot be before start date')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const validateEventType = type => {
    const validTypes = ['meeting', 'task', 'reminder', 'appointment', 'deadline', 'personal', 'work', 'holiday', 'birthday', 'other']

    if (!type) {
      return { isValid: false, message: 'Event type is required' }
    }

    if (!validTypes.includes(type)) {
      return { isValid: false, message: 'Invalid event type' }
    }

    return { isValid: true, message: '' }
  }

  const validateEventPriority = priority => {
    const validPriorities = ['High', 'Medium', 'Low']

    if (!priority) {
      return { isValid: false, message: 'Priority level is required' }
    }

    if (!validPriorities.includes(priority)) {
      return { isValid: false, message: 'Invalid priority level' }
    }

    return { isValid: true, message: '' }
  }

  const validateEventColor = color => {
    if (!color) {
      return { isValid: false, message: 'Event color is required' }
    }

    // Check hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!hexColorRegex.test(color)) {
      return { isValid: false, message: 'Invalid color format' }
    }

    return { isValid: true, message: '' }
  }

  const validateCompleteEvent = eventData => {
    const errors = []

    // Validate title
    const titleValidation = validateEventTitle(eventData.title, eventData.name)
    if (!titleValidation.isValid) {
      errors.push(titleValidation.message)
    }

    // Validate dates
    const dateValidation = validateEventDates(eventData.start, eventData.end)
    if (!dateValidation.isValid) {
      errors.push(...dateValidation.errors)
    }

    // Validate type
    const typeValidation = validateEventType(eventData.type)
    if (!typeValidation.isValid) {
      errors.push(typeValidation.message)
    }

    // Validate priority
    const priorityValidation = validateEventPriority(eventData.priority)
    if (!priorityValidation.isValid) {
      errors.push(priorityValidation.message)
    }

    // Validate color
    const colorValidation = validateEventColor(eventData.color)
    if (!colorValidation.isValid) {
      errors.push(colorValidation.message)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const getValidationRules = () => {
    return {
      title: [
        v => (v === null || v === undefined || v === '' || (typeof v === 'string' && v.trim() === '')) ? 'Event title is required' : true,
        v => (v && v.length <= 100) ? true : 'Title must not exceed 100 characters',
      ],
      description: [
        v => !v || v.length <= 500 ? true : 'Description must not exceed 500 characters',
      ],
      start: [
        v => (v === null || v === undefined || v === '' || (typeof v === 'string' && v.trim() === '')) ? 'Start date is required' : true,
      ],
      end: [
        v => (v === null || v === undefined || v === '' || (typeof v === 'string' && v.trim() === '')) ? 'End date is required' : true,
      ],
      type: [
        v => (v === null || v === undefined || v === '' || (typeof v === 'string' && v.trim() === '')) ? 'Event type is required' : true,
      ],
      priority: [
        v => (v === null || v === undefined || v === '' || (typeof v === 'string' && v.trim() === '')) ? 'Priority level is required' : true,
      ],
      color: [
        v => (v === null || v === undefined || v === '' || (typeof v === 'string' && v.trim() === '')) ? 'Color is required' : true,
      ],
    }
  }

  return {
    validateEventTitle,
    validateEventDates,
    validateEventType,
    validateEventPriority,
    validateEventColor,
    validateCompleteEvent,
    getValidationRules,
  }
}
