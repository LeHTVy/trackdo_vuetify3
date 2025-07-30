import { useAsyncOperation } from './useAsyncOperation'

export function useBaseOperations(store, entityName = 'item') {
  const { loading, error, execute, executeMultiple, clearError, setError } = useAsyncOperation()

  /**
   * Generic create operation
   * @param {Object} itemData - Data to create
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Operation result
   */
  const createItem = async (itemData, options = {}) => {
    return execute(async () => {
      // Validate required fields if specified
      if (options.requiredFields) {
        const missingFields = options.requiredFields.filter(field => !itemData[field])
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
        }
      }

      // Call store method
      const storeMethod = options.createMethod || 'addItem'
      const result = await store[storeMethod](itemData)

      return {
        success: true,
        data: result,
        message: options.successMessage || `${entityName} created successfully`
      }
    }, options.errorMessage || `Unable to create ${entityName}`)
  }

  /**
   * Generic update operation
   * @param {Object} itemData - Data to update
   * @param {string|Object} identifier - Item ID or item object
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Operation result
   */
  const updateItem = async (itemData, identifier, options = {}) => {
    return execute(async () => {
      // Extract ID from identifier
      const itemId = typeof identifier === 'object'
        ? (identifier.id || identifier._id)
        : identifier

      if (!itemId) {
        throw new Error(`${entityName} ID not found for update`)
      }

      // Validate required fields if specified
      if (options.requiredFields) {
        const missingFields = options.requiredFields.filter(field => !itemData[field])
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
        }
      }

      // Call store method
      const storeMethod = options.updateMethod || 'updateItem'
      const result = await store[storeMethod](itemId, itemData)

      return {
        success: true,
        data: result,
        message: options.successMessage || `${entityName} updated successfully`
      }
    }, options.errorMessage || `Unable to update ${entityName}`)
  }

  /**
   * Generic delete operation
   * @param {string|Object} identifier - Item ID or item object
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Operation result
   */
  const deleteItem = async (identifier, options = {}) => {
    return execute(async () => {
      // Extract ID from identifier
      const itemId = typeof identifier === 'object'
        ? (identifier.id || identifier._id)
        : identifier

      if (!itemId) {
        throw new Error(`${entityName} ID not found for deletion`)
      }

      // Call store method
      const storeMethod = options.deleteMethod || 'deleteItem'
      const result = await store[storeMethod](itemId)

      return {
        success: true,
        data: result,
        message: options.successMessage || `${entityName} deleted successfully`
      }
    }, options.errorMessage || `Unable to delete ${entityName}`)
  }

  /**
   * Generic fetch operation
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Operation result
   */
  const fetchItems = async (options = {}) => {
    return execute(async () => {
      // Call store method
      const storeMethod = options.fetchMethod || 'fetchItems'
      const result = await store[storeMethod](options.params)

      return {
        success: true,
        data: result,
        message: options.successMessage || `${entityName}s loaded successfully`
      }
    }, options.errorMessage || `Unable to fetch ${entityName}s`)
  }

  /**
   * Generic duplicate operation
   * @param {Object} item - Item to duplicate
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Operation result
   */
  const duplicateItem = async (item, options = {}) => {
    return execute(async () => {
      if (!item) {
        throw new Error(`${entityName} not found for duplication`)
      }

      // Create duplicated data
      const duplicatedData = {
        ...item,
        ...(options.duplicateTransform ? options.duplicateTransform(item) : {}),
        id: undefined,
        _id: undefined,
        // Add copy suffix if title/name exists
        ...(item.title && { title: `${item.title} (Copy)` }),
        ...(item.name && { name: `${item.name} (Copy)` })
      }

      // Create the duplicate
      return await createItem(duplicatedData, {
        ...options,
        successMessage: options.successMessage || `${entityName} duplicated successfully`,
        errorMessage: options.errorMessage || `Unable to duplicate ${entityName}`
      })
    }, options.errorMessage || `Unable to duplicate ${entityName}`)
  }

  /**
   * Generic bulk delete operation
   * @param {Array} identifiers - Array of IDs or objects
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Operation result
   */
  const deleteMultipleItems = async (identifiers, options = {}) => {
    return execute(async () => {
      if (!identifiers || identifiers.length === 0) {
        throw new Error(`No ${entityName}s selected for deletion`)
      }

      // Extract IDs
      const itemIds = identifiers.map(identifier =>
        typeof identifier === 'object'
          ? (identifier.id || identifier._id)
          : identifier
      )

      // Create operations array
      const operations = itemIds.map(id => () => {
        const storeMethod = options.deleteMethod || 'deleteItem'
        return store[storeMethod](id)
      })

      const result = await executeMultiple(
        operations,
        options.errorMessage || `Unable to delete some ${entityName}s`
      )

      if (!result.success) {
        throw new Error(result.error)
      }

      return {
        success: true,
        deletedCount: itemIds.length,
        message: options.successMessage || `${itemIds.length} ${entityName}s deleted successfully`
      }
    }, options.errorMessage || `Unable to delete selected ${entityName}s`)
  }

  /**
   * Generic refresh operation
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Operation result
   */
  const refreshItems = async (options = {}) => {
    return execute(async () => {
      const storeMethod = options.refreshMethod || 'initializeStore'
      await store[storeMethod]()

      return {
        success: true,
        message: options.successMessage || `${entityName}s refreshed successfully`
      }
    }, options.errorMessage || `Unable to refresh ${entityName}s`)
  }

  return {
    // State
    loading,
    error,

    // Operations
    createItem,
    updateItem,
    deleteItem,
    fetchItems,
    duplicateItem,
    deleteMultipleItems,
    refreshItems,

    // Utilities
    clearError,
    setError
  }
}
