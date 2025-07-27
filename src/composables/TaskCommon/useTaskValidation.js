import { ref, computed } from 'vue'

/**
 * Task Form Validation Utilities
 * @param {Object} formData - Reactive form data object
 * @returns {Object} Validation utilities and computed properties
 */
export function useTaskValidation(formData) {
  // Validation rules
  const titleRules = [
    v => !!v || 'Title is required',
    v => (v && v.length >= 3) || 'Title must be at least 3 characters',
    v => (v && v.length <= 100) || 'Title must be less than 100 characters'
  ]

  const descriptionRules = [
    v => !v || v.length <= 500 || 'Description must be less than 500 characters'
  ]

  const dueDateRules = [
    v => !v || isValidDate(v) || 'Please enter a valid date'
  ]

  const estimatedHoursRules = [
    v => !v || (!isNaN(v) && v > 0 && v <= 1000) || 'Estimated hours must be a positive number less than 1000'
  ]

  const projectRules = [
    v => !v || v.length <= 50 || 'Project name must be less than 50 characters'
  ]

  // Validation helper functions
  const isValidDate = (dateString) => {
    if (!dateString) return true
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
  }

  const isValidEmail = (email) => {
    if (!email) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Individual field validations
  const isTitleValid = computed(() => {
    if (!formData.value.title) return false
    return formData.value.title.length >= 3 && formData.value.title.length <= 100
  })

  const isDescriptionValid = computed(() => {
    if (!formData.value.description) return true
    return formData.value.description.length <= 500
  })

  const isDueDateValid = computed(() => {
    if (!formData.value.dueDate) return true
    return isValidDate(formData.value.dueDate)
  })

  const isEstimatedHoursValid = computed(() => {
    if (!formData.value.estimatedHours) return true
    const hours = parseFloat(formData.value.estimatedHours)
    return !isNaN(hours) && hours > 0 && hours <= 1000
  })

  const isProjectValid = computed(() => {
    if (!formData.value.project) return true
    return formData.value.project.length <= 50
  })

  // Overall form validation
  const isFormValid = computed(() => {
    return isTitleValid.value &&
           isDescriptionValid.value &&
           isDueDateValid.value &&
           isEstimatedHoursValid.value &&
           isProjectValid.value
  })

  // Get validation errors
  const getValidationErrors = computed(() => {
    const errors = []

    if (!isTitleValid.value) {
      if (!formData.value.title) {
        errors.push('Title is required')
      } else if (formData.value.title.length < 3) {
        errors.push('Title must be at least 3 characters')
      } else if (formData.value.title.length > 100) {
        errors.push('Title must be less than 100 characters')
      }
    }

    if (!isDescriptionValid.value) {
      errors.push('Description must be less than 500 characters')
    }

    if (!isDueDateValid.value) {
      errors.push('Please enter a valid due date')
    }

    if (!isEstimatedHoursValid.value) {
      errors.push('Estimated hours must be a positive number less than 1000')
    }

    if (!isProjectValid.value) {
      errors.push('Project name must be less than 50 characters')
    }

    return errors
  })

  // Validate specific field
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'title':
        if (!value) return 'Title is required'
        if (value.length < 3) return 'Title must be at least 3 characters'
        if (value.length > 100) return 'Title must be less than 100 characters'
        return true

      case 'description':
        if (value && value.length > 500) return 'Description must be less than 500 characters'
        return true

      case 'dueDate':
        if (value && !isValidDate(value)) return 'Please enter a valid date'
        return true

      case 'estimatedHours':
        if (value) {
          const hours = parseFloat(value)
          if (isNaN(hours) || hours <= 0) return 'Estimated hours must be a positive number'
          if (hours > 1000) return 'Estimated hours must be less than 1000'
        }
        return true

      case 'project':
        if (value && value.length > 50) return 'Project name must be less than 50 characters'
        return true

      default:
        return true
    }
  }

  // Real-time validation
  const validateForm = () => {
    const errors = {}

    // Validate title
    const titleError = validateField('title', formData.value.title)
    if (titleError !== true) errors.title = titleError

    // Validate description
    const descriptionError = validateField('description', formData.value.description)
    if (descriptionError !== true) errors.description = descriptionError

    // Validate due date
    const dueDateError = validateField('dueDate', formData.value.dueDate)
    if (dueDateError !== true) errors.dueDate = dueDateError

    // Validate estimated hours
    const estimatedHoursError = validateField('estimatedHours', formData.value.estimatedHours)
    if (estimatedHoursError !== true) errors.estimatedHours = estimatedHoursError

    // Validate project
    const projectError = validateField('project', formData.value.project)
    if (projectError !== true) errors.project = projectError

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  return {
    // Validation rules for v-text-field
    titleRules,
    descriptionRules,
    dueDateRules,
    estimatedHoursRules,
    projectRules,

    // Individual field validations
    isTitleValid,
    isDescriptionValid,
    isDueDateValid,
    isEstimatedHoursValid,
    isProjectValid,

    // Overall validation
    isFormValid,
    getValidationErrors,

    // Methods
    validateField,
    validateForm,

    // Helper functions
    isValidDate,
    isValidEmail
  }
}
