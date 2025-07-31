import { computed, ref, watch } from 'vue'

export function useValidation (formData = ref({}), validationSchema = {}) {
  const errors = ref({})
  const isValidating = ref(false)

  // Base validation rules
  const rules = {
    required: (message = 'This field is required') => value => {
      // Check for empty values more thoroughly
      if (value === null || value === undefined || value === '' ||
          (typeof value === 'string' && value.trim() === '')) {
        return message
      }
      return true
    },

    email: (message = 'Invalid email format') => value => {
      if (!value) return true
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) ? true : message
    },

    username: (message = 'Username must be 3-20 characters, containing only letters, numbers and underscores') => value => {
      if (!value) return true
      const pattern = /^[a-zA-Z0-9_]{3,20}$/
      return pattern.test(value) ? true : message
    },

    password: (minLength = 6, message = `Password must be at least ${minLength} characters`) => value => {
      if (!value) return true
      return value.length >= minLength ? true : message
    },

    confirmPassword: (passwordField = 'password', message = 'Password confirmation does not match') => value => {
      if (!value) return true
      const password = typeof formData.value === 'object' ? formData.value[passwordField] : ''
      return value === password ? true : message
    },

    minLength: (min, message = `Minimum ${min} characters required`) => value => {
      if (!value) return true
      return value.length >= min ? true : message
    },

    maxLength: (max, message = `Maximum ${max} characters allowed`) => value => {
      if (!value) return true
      return value.length <= max ? true : message
    },

    numeric: (message = 'Must be a valid number') => value => {
      if (!value) return true
      return !isNaN(Number(value)) ? true : message
    },

    integer: (message = 'Must be a valid integer') => value => {
      if (!value) return true
      return Number.isInteger(Number(value)) ? true : message
    },

    positive: (message = 'Must be a positive number') => value => {
      if (!value) return true
      return Number(value) > 0 ? true : message
    },

    date: (message = 'Invalid date format') => value => {
      if (!value) return true
      const date = new Date(value)
      return (date instanceof Date && !isNaN(date)) ? true : message
    },

    dateRange: (startField, endField, message = 'End date must be after start date') => value => {
      if (!value || !formData.value) return true
      const startDate = new Date(formData.value[startField])
      const endDate = new Date(formData.value[endField])
      return endDate >= startDate ? true : message
    },

    url: (message = 'Invalid URL format') => value => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return message
      }
    },

    pattern: (regex, message = 'Invalid format') => value => {
      if (!value) return true
      return regex.test(value) ? true : message
    },

    custom: (validatorFn, message = 'Invalid value') => value => {
      if (!value) return true
      return validatorFn(value) ? true : message
    },
  }

  // Validation methods
  const validateField = (fieldName, value, fieldRules = []) => {
    const fieldErrors = []

    for (const rule of fieldRules) {
      const result = typeof rule === 'function' ? rule(value) : rule
      if (result !== true) {
        fieldErrors.push(result)
      }
    }

    errors.value[fieldName] = fieldErrors
    return fieldErrors.length === 0
  }

  const validateForm = () => {
    isValidating.value = true
    let isValid = true

    Object.keys(validationSchema).forEach(fieldName => {
      const fieldValue = formData.value[fieldName]
      const fieldRules = validationSchema[fieldName]
      const fieldValid = validateField(fieldName, fieldValue, fieldRules)
      if (!fieldValid) {
        isValid = false
      }
    })

    isValidating.value = false
    return isValid
  }

  const clearErrors = (fieldName = null) => {
    if (fieldName) {
      delete errors.value[fieldName]
    } else {
      errors.value = {}
    }
  }

  const hasErrors = computed(() => {
    return Object.keys(errors.value).some(key =>
      errors.value[key] && errors.value[key].length > 0
    )
  })

  const getFieldError = fieldName => {
    const fieldErrors = errors.value[fieldName]
    return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : null
  }

  const isFieldValid = fieldName => {
    const fieldErrors = errors.value[fieldName]
    return !fieldErrors || fieldErrors.length === 0
  }

  if (formData.value && validationSchema) {
    watch(formData, newFormData => {
      if (isValidating.value) return

      Object.keys(validationSchema).forEach(fieldName => {
        if (newFormData[fieldName] !== undefined) {
          const fieldRules = validationSchema[fieldName]
          validateField(fieldName, newFormData[fieldName], fieldRules)
        }
      })
    }, { deep: true })
  }

  const validationState = computed(() => ({
    isValid: !hasErrors.value,
    errors: errors.value,
    hasErrors: hasErrors.value,
    isValidating: isValidating.value,
  }))

  return {
    // Rules
    rules,

    // State
    errors,
    isValidating,
    validationState,

    // Computed
    hasErrors,

    // Methods
    validateField,
    validateForm,
    clearErrors,
    getFieldError,
    isFieldValid,
  }
}

/**
 * Common validation schemas for different entities
 */
export const validationSchemas = {
  auth: {
    login: {
      username: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Username is required' : true,
      ],
      password: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Password is required' : true,
      ],
    },
    signup: {
      firstName: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'First name is required' : true,
        value => !value || value.length <= 50 ? true : 'First name must be less than 50 characters',
      ],
      lastName: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Last name is required' : true,
        value => !value || value.length <= 50 ? true : 'Last name must be less than 50 characters',
      ],
      username: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Username is required' : true,
        value => {
          if (!value) return true
          const pattern = /^[a-zA-Z0-9_]{3,20}$/
          return pattern.test(value) ? true : 'Username must be 3-20 characters, containing only letters, numbers and underscores'
        },
      ],
      email: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Email is required' : true,
        value => {
          if (!value) return true
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) ? true : 'Invalid email format'
        },
      ],
      password: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Password is required' : true,
        value => !value || value.length >= 6 ? true : 'Password must be at least 6 characters',
      ],
    },
  },

  event: {
    create: {
      title: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Event title is required' : true,
        value => !value || value.length <= 100 ? true : 'Title must be less than 100 characters',
      ],
      start: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Start date is required' : true,
        value => {
          if (!value) return true
          const date = new Date(value)
          return (date instanceof Date && !isNaN(date)) ? true : 'Invalid start date'
        },
      ],
      end: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'End date is required' : true,
        value => {
          if (!value) return true
          const date = new Date(value)
          return (date instanceof Date && !isNaN(date)) ? true : 'Invalid end date'
        },
      ],
    },
  },

  project: {
    create: {
      title: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Project title is required' : true,
        value => !value || value.length <= 100 ? true : 'Title must be less than 100 characters',
      ],
      description: [
        value => !value || value.length <= 500 ? true : 'Description must be less than 500 characters',
      ],
    },
  },

  task: {
    create: {
      title: [
        value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Task title is required' : true,
        value => !value || value.length <= 100 ? true : 'Title must be less than 100 characters',
      ],
      description: [
        value => !value || value.length <= 500 ? true : 'Description must be less than 500 characters',
      ],
    },
  },
}
