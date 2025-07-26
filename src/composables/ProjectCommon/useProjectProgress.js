import { ref, watch, computed } from 'vue'

export function useProjectProgress(formData, onStatusChange) {
  // Progress validation rules
  const progressRules = [
    (value) => {
      if (value === null || value === undefined || value === '') {
        return 'Progress is required'
      }
      const num = Number(value)
      if (isNaN(num)) {
        return 'Progress must be a number'
      }
      if (num < 0 || num > 100) {
        return 'Progress must be between 0 and 100'
      }
      return true
    }
  ]

  // Format progress input to ensure it's within 0-100 range
  const formatProgress = (value) => {
    if (value === null || value === undefined || value === '') {
      return 0
    }

    let num = Number(value)
    if (isNaN(num)) {
      return 0
    }

    // Ensure it's within 0-100 range
    num = Math.max(0, Math.min(100, Math.round(num)))
    return num
  }

  // Watch for progress changes and auto-complete
  watch(
    () => formData.value?.progress,
    (newProgress) => {
      if (newProgress !== null && newProgress !== undefined) {
        const progress = Number(newProgress)

        // Auto-complete when progress reaches 100
        if (progress === 100 && formData.value?.status !== 'Completed') {
          formData.value.status = 'Completed'

          // Call callback if provided
          if (onStatusChange && typeof onStatusChange === 'function') {
            onStatusChange('Completed', 'Progress reached 100%')
          }
        }

        // Format the progress value
        formData.value.progress = formatProgress(progress)
      }
    },
    { immediate: false }
  )

  // Computed property to check if progress is valid
  const isProgressValid = computed(() => {
    const progress = formData.value?.progress
    if (progress === null || progress === undefined || progress === '') {
      return false
    }
    const num = Number(progress)
    return !isNaN(num) && num >= 0 && num <= 100
  })

  // Method to validate progress input
  const validateProgressInput = (event) => {
    const value = event.target.value

    // Allow empty value for clearing
    if (value === '') {
      return
    }

    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '')

    // Ensure only one decimal point
    const parts = cleanValue.split('.')
    if (parts.length > 2) {
      event.target.value = parts[0] + '.' + parts.slice(1).join('')
      return
    }

    // Update the cleaned value
    event.target.value = cleanValue

    // Format and validate the number
    const num = Number(cleanValue)
    if (!isNaN(num)) {
      const formatted = formatProgress(num)
      if (formatted !== num) {
        event.target.value = formatted.toString()
        formData.value.progress = formatted
      }
    }
  }

  // Method to handle progress blur (when user leaves the field)
  const handleProgressBlur = (event) => {
    const value = event.target.value
    if (value !== '') {
      const formatted = formatProgress(value)
      event.target.value = formatted.toString()
      formData.value.progress = formatted
    }
  }

  return {
    progressRules,
    formatProgress,
    isProgressValid,
    validateProgressInput,
    handleProgressBlur
  }
}
