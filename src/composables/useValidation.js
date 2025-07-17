import { computed, ref } from 'vue'

export function useValidation () {
  const errors = ref({})

  const validateTask = task => {
    const newErrors = {}

    if (!task.title || task.title.trim().length === 0) {
      newErrors.title = 'Task title is required'
    } else if (task.title.length > 100) {
      newErrors.title = 'Task title must be less than 100 characters'
    }

    if (task.description && task.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (!task.priority || !['High', 'Medium', 'Low'].includes(task.priority)) {
      newErrors.priority = 'Valid priority is required'
    }

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const validateProject = project => {
    const newErrors = {}

    if (!project.name || project.name.trim().length === 0) {
      newErrors.name = 'Project name is required'
    } else if (project.name.length > 100) {
      newErrors.name = 'Project name must be less than 100 characters'
    }

    if (project.budget && (project.budget < 0 || project.budget > 10_000_000)) {
      newErrors.budget = 'Budget must be between 0 and 10,000,000'
    }

    if (project.startDate && project.endDate) {
      const start = new Date(project.startDate)
      const end = new Date(project.endDate)

      if (end <= start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const validateEvent = event => {
    const newErrors = {}

    if (!event.title || event.title.trim().length === 0) {
      newErrors.title = 'Event title is required'
    }

    if (!event.start) {
      newErrors.start = 'Start time is required'
    }

    if (event.start && event.end) {
      const start = new Date(event.start)
      const end = new Date(event.end)

      if (end <= start) {
        newErrors.end = 'End time must be after start time'
      }
    }

    if (event.attendees && event.attendees.length > 50) {
      newErrors.attendees = 'Maximum 50 attendees allowed'
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  return {
    errors,
    hasErrors,
    validateTask,
    validateProject,
    validateEvent,
    clearErrors,
  }
}
