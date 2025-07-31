import { computed, nextTick, reactive } from 'vue'
import logger from '@/services/logger'

const dialogLogger = logger.createLogger('DialogManager')

// Global dialog registry
const dialogRegistry = reactive(new Map())

export function useUniversalDialog (dialogName = null) {
  const uniqueDialogName = dialogName || `dialog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  if (!dialogRegistry.has(uniqueDialogName)) {
    dialogRegistry.set(uniqueDialogName, {
      isOpen: false,
      loading: false,
      data: null,
      options: {},
      history: [],
    })
  }

  const dialogState = computed(() => dialogRegistry.get(uniqueDialogName))

  /**
   * Open dialog with optional data and options
   * @param {any} data - Data to pass to dialog
   * @param {Object} options - Dialog options
   * @returns {Promise<boolean>} Success state
   */
  const openDialog = async (data = null, options = {}) => {
    try {
      const state = dialogRegistry.get(uniqueDialogName)

      // Add to history
      state.history.push({
        action: 'open',
        timestamp: new Date(),
        data,
        options,
      })

      state.data = data
      state.options = { ...options }
      state.isOpen = true

      dialogLogger.debug(`Dialog opened: ${uniqueDialogName}`, { data, options })

      await nextTick()
      return true
    } catch (error) {
      dialogLogger.error(`Failed to open dialog: ${uniqueDialogName}`, error)
      return false
    }
  }

  /**
   * Close dialog and optionally clear data
   * @param {boolean} clearData - Whether to clear dialog data
   * @returns {Promise<boolean>} Success state
   */
  const closeDialog = async (clearData = true) => {
    try {
      const state = dialogRegistry.get(uniqueDialogName)

      // Add to history
      state.history.push({
        action: 'close',
        timestamp: new Date(),
        clearData,
      })

      state.isOpen = false
      state.loading = false

      if (clearData) {
        state.data = null
        state.options = {}
      }

      dialogLogger.debug(`Dialog closed: ${uniqueDialogName}`, { clearData })

      await nextTick()
      return true
    } catch (error) {
      dialogLogger.error(`Failed to close dialog: ${uniqueDialogName}`, error)
      return false
    }
  }

  /**
   * Toggle dialog state
   * @param {any} data - Data to pass when opening
   * @param {Object} options - Dialog options
   * @returns {Promise<boolean>} New state (true = open, false = closed)
   */
  const toggleDialog = async (data = null, options = {}) => {
    const state = dialogRegistry.get(uniqueDialogName)

    if (state.isOpen) {
      await closeDialog()
      return false
    } else {
      await openDialog(data, options)
      return true
    }
  }

  /**
   * Update dialog data without closing
   * @param {any} newData - New data to set
   * @param {boolean} merge - Whether to merge with existing data
   * @returns {void}
   */
  const updateDialogData = (newData, merge = false) => {
    const state = dialogRegistry.get(uniqueDialogName)

    if (merge && state.data && typeof state.data === 'object' && typeof newData === 'object') {
      state.data = { ...state.data, ...newData }
    } else {
      state.data = newData
    }

    dialogLogger.debug(`Dialog data updated: ${uniqueDialogName}`, { newData, merge })
  }

  /**
   * Update dialog options
   * @param {Object} newOptions - New options to set
   * @param {boolean} merge - Whether to merge with existing options
   * @returns {void}
   */
  const updateDialogOptions = (newOptions, merge = true) => {
    const state = dialogRegistry.get(uniqueDialogName)

    if (merge) {
      state.options = { ...state.options, ...newOptions }
    } else {
      state.options = { ...newOptions }
    }

    dialogLogger.debug(`Dialog options updated: ${uniqueDialogName}`, { newOptions, merge })
  }

  /**
   * Set dialog loading state
   * @param {boolean} loading - Loading state
   * @returns {void}
   */
  const setDialogLoading = loading => {
    const state = dialogRegistry.get(uniqueDialogName)
    state.loading = loading

    dialogLogger.debug(`Dialog loading state: ${uniqueDialogName}`, { loading })
  }

  /**
   * Get dialog history
   * @returns {Array} Dialog history
   */
  const getDialogHistory = () => {
    const state = dialogRegistry.get(uniqueDialogName)
    return [...state.history]
  }

  /**
   * Clear dialog history
   * @returns {void}
   */
  const clearDialogHistory = () => {
    const state = dialogRegistry.get(uniqueDialogName)
    state.history = []

    dialogLogger.debug(`Dialog history cleared: ${uniqueDialogName}`)
  }

  /**
   * Reset dialog to initial state
   * @returns {Promise<void>}
   */
  const resetDialog = async () => {
    const state = dialogRegistry.get(uniqueDialogName)

    state.isOpen = false
    state.loading = false
    state.data = null
    state.options = {}
    state.history = []

    dialogLogger.debug(`Dialog reset: ${uniqueDialogName}`)
    await nextTick()
  }

  // Computed properties for convenience
  const isOpen = computed(() => dialogState.value?.isOpen || false)
  const isLoading = computed(() => dialogState.value?.loading || false)
  const data = computed(() => dialogState.value?.data)
  const options = computed(() => dialogState.value?.options || {})

  return {
    // Dialog name
    dialogName: uniqueDialogName,

    // State
    isOpen,
    isLoading,
    data,
    options,
    dialogState,

    // Actions
    openDialog,
    closeDialog,
    toggleDialog,
    updateDialogData,
    updateDialogOptions,
    setDialogLoading,
    resetDialog,

    // History
    getDialogHistory,
    clearDialogHistory,
  }
}

/**
 * Global dialog manager for managing multiple dialogs
 */
export function useGlobalDialogManager () {
  /**
   * Get all active dialogs
   * @returns {Array} Array of active dialog names
   */
  const getActiveDialogs = () => {
    return Array.from(dialogRegistry.entries())
      .filter(([, state]) => state.isOpen)
      .map(([name]) => name)
  }

  /**
   * Close all dialogs
   * @param {boolean} clearData - Whether to clear dialog data
   * @returns {Promise<void>}
   */
  const closeAllDialogs = async (clearData = true) => {
    const activeDialogs = getActiveDialogs()

    dialogLogger.info(`Closing ${activeDialogs.length} active dialogs`, activeDialogs)

    const promises = activeDialogs.map(async dialogName => {
      const { closeDialog } = useUniversalDialog(dialogName)
      return closeDialog(clearData)
    })

    await Promise.all(promises)
  }

  /**
   * Check if any dialog is open
   * @returns {boolean} True if any dialog is open
   */
  const hasOpenDialogs = () => {
    return getActiveDialogs().length > 0
  }

  /**
   * Get dialog by name
   * @param {string} dialogName - Dialog name
   * @returns {Object|null} Dialog state or null if not found
   */
  const getDialog = dialogName => {
    return dialogRegistry.get(dialogName) || null
  }

  /**
   * Remove dialog from registry
   * @param {string} dialogName - Dialog name to remove
   * @returns {boolean} Success state
   */
  const removeDialog = dialogName => {
    const success = dialogRegistry.delete(dialogName)

    if (success) {
      dialogLogger.debug(`Dialog removed from registry: ${dialogName}`)
    }

    return success
  }

  /**
   * Get all registered dialogs
   * @returns {Array} Array of all dialog names
   */
  const getAllDialogs = () => {
    return Array.from(dialogRegistry.keys())
  }

  /**
   * Clear dialog registry (use with caution)
   * @returns {void}
   */
  const clearRegistry = () => {
    dialogRegistry.clear()
    dialogLogger.warn('Dialog registry cleared')
  }

  return {
    // State
    activeDialogs: computed(() => getActiveDialogs()),
    hasOpenDialogs: computed(() => hasOpenDialogs()),
    allDialogs: computed(() => getAllDialogs()),

    // Actions
    closeAllDialogs,
    getDialog,
    removeDialog,
    clearRegistry,

    // Getters
    getActiveDialogs,
    getAllDialogs,
  }
}

/**
 * Predefined dialog types for common use cases
 */
export const DialogTypes = {
  CONFIRM: 'confirm',
  ALERT: 'alert',
  FORM: 'form',
  DETAILS: 'details',
  EDIT: 'edit',
  CREATE: 'create',
  DELETE: 'delete',
  LOADING: 'loading',
}

/**
 * Create typed dialog composables for common patterns
 */
export function useConfirmDialog (dialogName = 'confirm-dialog') {
  const dialog = useUniversalDialog(dialogName)

  const confirm = async (message, title = 'Confirm Action', options = {}) => {
    return new Promise(resolve => {
      dialog.openDialog({
        type: DialogTypes.CONFIRM,
        message,
        title,
        onConfirm: () => {
          dialog.closeDialog()
          resolve(true)
        },
        onCancel: () => {
          dialog.closeDialog()
          resolve(false)
        },
      }, options)
    })
  }

  return {
    ...dialog,
    confirm,
  }
}

export function useFormDialog (dialogName = 'form-dialog') {
  const dialog = useUniversalDialog(dialogName)

  const openForm = async (formData = {}, options = {}) => {
    return dialog.openDialog({
      type: DialogTypes.FORM,
      formData,
      ...options,
    }, options)
  }

  return {
    ...dialog,
    openForm,
  }
}

export function useDetailsDialog (dialogName = 'details-dialog') {
  const dialog = useUniversalDialog(dialogName)

  const showDetails = async (item, options = {}) => {
    return dialog.openDialog({
      type: DialogTypes.DETAILS,
      item,
      ...options,
    }, options)
  }

  return {
    ...dialog,
    showDetails,
  }
}
