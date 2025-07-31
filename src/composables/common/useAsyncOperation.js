import { ref } from 'vue'

export function useAsyncOperation () {
  const loading = ref(false)
  const error = ref(null)

  const clearError = () => {
    error.value = null
  }

  const setError = (err, defaultMessage = 'An error occurred. Please try again.') => {
    if (err && typeof err === 'object' && err.cancelled) {
      return
    }

    console.log('Async operation error:', err)
    error.value = defaultMessage + ' ' + (err.message || '')
  }

  /**
   * @param {Function} operation - Async function to execute
   * @param {string} errorMessage - Custom error message
   * @returns {Promise<Object>} { success: boolean, data?: any, error?: string }
   */
  const execute = async (operation, errorMessage = 'Operation failed') => {
    try {
      loading.value = true
      clearError()

      const result = await operation()

      if (result && result.cancelled) {
        return result
      }

      if(result && result.success) {
        return result
      }

      return { success: true, data: result }
    } catch (err) {
      setError(err, errorMessage)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * @param {Array} operations - Array of async functions
   * @param {string} errorMessage - Custom error message
   * @returns {Promise<Object>} { success: boolean, results?: Array, failures?: Array }
   */
  const executeMultiple = async (operations, errorMessage = 'Some operations failed') => {
    try {
      loading.value = true
      clearError()

      const results = await Promise.allSettled(operations.map(op => op()))
      const successes = results.filter(result => result.status === 'fulfilled')
      const failures = results.filter(result => result.status === 'rejected')

      if (failures.length > 0) {
        setError(new Error(`${failures.length} operations failed`), errorMessage)
        return {
          success: false,
          error: error.value,
          results: successes.map(r => r.value),
          failures: failures.map(r => r.reason),
        }
      }

      return {
        success: true,
        results: successes.map(r => r.value),
      }
    } catch (err) {
      setError(err, errorMessage)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    loading,
    error,

    // Methods
    execute,
    executeMultiple,
    clearError,
    setError,
  }
}
