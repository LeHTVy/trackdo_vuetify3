import { ref } from 'vue'
import logger from '@/services/logger'

export function useEventHandler (context = 'EventHandler') {
  const contextLogger = logger.createLogger(context)
  const isProcessing = ref(false)
  const lastResult = ref(null)

  /**
   * Handle async operations with consistent error handling and logging
   * @param {Function} operation - Async operation to execute
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Operation result
   */
  const handleAsyncEvent = async (operation, options = {}) => {
    const {
      successMessage,
      errorMessage,
      showLoading = true,
      logUserAction = true,
      onSuccess,
      onError,
      onFinally,
      validateBefore,
      confirmBefore,
    } = options

    // Prevent concurrent operations if specified
    if (showLoading && isProcessing.value) {
      contextLogger.warn('Operation already in progress, skipping')
      return { success: false, error: 'Operation already in progress' }
    }

    const startTime = performance.now()

    try {
      if (showLoading) {
        isProcessing.value = true
      }

      // Pre-validation if specified
      if (validateBefore) {
        const validationResult = await validateBefore()
        if (!validationResult.isValid) {
          throw new Error(validationResult.error || 'Validation failed')
        }
      }

      // Confirmation if specified
      if (confirmBefore) {
        const confirmed = await confirmBefore()
        if (!confirmed) {
          return { success: false, cancelled: true }
        }
      }

      // Log user action if enabled
      if (logUserAction && options.actionName) {
        contextLogger.userAction(options.actionName, options.actionData)
      }

      // Execute the operation
      const result = await operation()

      // Handle different result formats
      let normalizedResult
      if (result && typeof result === 'object' && 'success' in result) {
        normalizedResult = result
      } else {
        normalizedResult = { success: true, data: result }
      }

      // Log success
      if (successMessage) {
        contextLogger.success(successMessage, normalizedResult.data)
      }

      // Performance logging
      contextLogger.performance(options.actionName || 'async operation', startTime)

      // Call success callback
      if (onSuccess) {
        await onSuccess(normalizedResult)
      }

      lastResult.value = normalizedResult
      return normalizedResult

    } catch (error) {
      const errorResult = {
        success: false,
        error: error.message || 'Unknown error occurred',
        originalError: error,
      }

      // Log error
      const logMessage = errorMessage || `Failed to execute ${options.actionName || 'operation'}`
      contextLogger.error(logMessage, error)

      // Call error callback
      if (onError) {
        await onError(errorResult)
      }

      lastResult.value = errorResult
      return errorResult

    } finally {
      if (showLoading) {
        isProcessing.value = false
      }

      // Call finally callback
      if (onFinally) {
        await onFinally()
      }
    }
  }

  /**
   * Handle form submission events
   * @param {Function} submitOperation - Form submit operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Submit result
   */
  const handleFormSubmit = async (submitOperation, options = {}) => {
    return handleAsyncEvent(submitOperation, {
      actionName: 'form_submit',
      successMessage: 'Form submitted successfully',
      errorMessage: 'Form submission failed',
      ...options,
    })
  }

  /**
   * Handle delete operations with confirmation
   * @param {Function} deleteOperation - Delete operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Delete result
   */
  const handleDelete = async (deleteOperation, options = {}) => {
    const {
      itemName = 'item',
      confirmMessage,
    } = options

    return handleAsyncEvent(deleteOperation, {
      actionName: 'delete_item',
      successMessage: `${itemName} deleted successfully`,
      errorMessage: `Failed to delete ${itemName}`,
      confirmBefore: confirmMessage ? () => {
        // This would integrate with your confirm modal system
        return window.confirm(confirmMessage)
      } : undefined,
      ...options,
    })
  }

  /**
   * Handle create operations
   * @param {Function} createOperation - Create operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Create result
   */
  const handleCreate = async (createOperation, options = {}) => {
    const { itemName = 'item' } = options

    return handleAsyncEvent(createOperation, {
      actionName: 'create_item',
      successMessage: `${itemName} created successfully`,
      errorMessage: `Failed to create ${itemName}`,
      ...options,
    })
  }

  /**
   * Handle update operations
   * @param {Function} updateOperation - Update operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Update result
   */
  const handleUpdate = async (updateOperation, options = {}) => {
    const { itemName = 'item' } = options

    return handleAsyncEvent(updateOperation, {
      actionName: 'update_item',
      successMessage: `${itemName} updated successfully`,
      errorMessage: `Failed to update ${itemName}`,
      ...options,
    })
  }

  /**
   * Handle duplicate operations
   * @param {Function} duplicateOperation - Duplicate operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Duplicate result
   */
  const handleDuplicate = async (duplicateOperation, options = {}) => {
    const { itemName = 'item' } = options

    return handleAsyncEvent(duplicateOperation, {
      actionName: 'duplicate_item',
      successMessage: `${itemName} duplicated successfully`,
      errorMessage: `Failed to duplicate ${itemName}`,
      ...options,
    })
  }

  /**
   * Handle navigation events
   * @param {Function} navigationOperation - Navigation operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Navigation result
   */
  const handleNavigation = async (navigationOperation, options = {}) => {
    return handleAsyncEvent(navigationOperation, {
      actionName: 'navigate',
      showLoading: false,
      logUserAction: true,
      ...options,
    })
  }

  /**
   * Handle file upload events
   * @param {Function} uploadOperation - Upload operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Upload result
   */
  const handleFileUpload = async (uploadOperation, options = {}) => {
    return handleAsyncEvent(uploadOperation, {
      actionName: 'file_upload',
      successMessage: 'File uploaded successfully',
      errorMessage: 'File upload failed',
      ...options,
    })
  }

  /**
   * Handle API calls with retry logic
   * @param {Function} apiOperation - API operation
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} API result
   */
  const handleApiCall = async (apiOperation, options = {}) => {
    const { retries = 0, retryDelay = 1000 } = options

    let lastError
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          contextLogger.info(`Retry attempt ${attempt}/${retries}`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }

        return await handleAsyncEvent(apiOperation, {
          actionName: 'api_call',
          ...options,
        })
      } catch (error) {
        lastError = error
        if (attempt === retries) {
          throw error
        }
      }
    }

    throw lastError
  }

  /**
   * Debounced event handler
   * @param {Function} operation - Operation to debounce
   * @param {number} delay - Debounce delay in ms
   * @returns {Function} Debounced function
   */
  const createDebouncedHandler = (operation, delay = 300) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => operation(...args), delay)
    }
  }

  /**
   * Throttled event handler
   * @param {Function} operation - Operation to throttle
   * @param {number} limit - Throttle limit in ms
   * @returns {Function} Throttled function
   */
  const createThrottledHandler = (operation, limit = 300) => {
    let inThrottle
    return (...args) => {
      if (!inThrottle) {
        operation(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  return {
    // State
    isProcessing,
    lastResult,

    // Generic handlers
    handleAsyncEvent,

    // Specific handlers
    handleFormSubmit,
    handleDelete,
    handleCreate,
    handleUpdate,
    handleDuplicate,
    handleNavigation,
    handleFileUpload,
    handleApiCall,

    // Utility handlers
    createDebouncedHandler,
    createThrottledHandler,
  }
}
