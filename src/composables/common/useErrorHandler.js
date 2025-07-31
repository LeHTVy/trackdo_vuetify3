import { ref } from 'vue'

export function useErrorHandler () {
  const lastError = ref(null)

  const handleAsyncError = async (operation, errorMessage = 'Operation failed') => {
    try {
      const result = await operation()

      if (result && !result.success) {
        const error = new Error(result.error || errorMessage)
        lastError.value = error
        console.error(`❌ ${errorMessage}:`, result.error)
        return { success: false, error: result.error }
      }

      return result || { success: true }
    } catch (error) {
      lastError.value = error
      console.error(`❌ Unexpected error during ${errorMessage}:`, error)
      return { success: false, error: error.message }
    }
  }

  const clearError = () => {
    lastError.value = null
  }

  return {
    lastError,
    handleAsyncError,
    clearError,
  }
}
