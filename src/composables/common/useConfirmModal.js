import { ref, reactive } from 'vue'
import { useConfirmModalConfig } from './useConfirmModalConfig'

export function useConfirmModal() {
  const isOpen = ref(false)
  const loading = ref(false)

  const modalConfig = reactive({
    type: 'delete',
    title: '',
    message: '',
    details: '',
    confirmText: '',
    cancelText: 'Cancel'
  })

  // Use config composable
  const config = useConfirmModalConfig(
    computed(() => modalConfig.type),
    computed(() => modalConfig.title),
    computed(() => modalConfig.message),
    computed(() => modalConfig.confirmText)
  )

  let resolvePromise = null
  let rejectPromise = null

  const openModal = (configOptions = {}) => {
    return new Promise((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject

      Object.assign(modalConfig, {
        type: 'delete',
        title: '',
        message: '',
        details: '',
        confirmText: '',
        cancelText: 'Cancel',
        ...configOptions
      })

      isOpen.value = true
    })
  }

  const confirm = async () => {
    if (resolvePromise) {
      loading.value = true
      try {
        resolvePromise(true)
        closeModal()
      } catch (error) {
        console.error('Confirm modal error:', error)
      } finally {
        loading.value = false
      }
    }
  }

  const cancel = () => {
    if (rejectPromise) {
      rejectPromise(false)
    }
    closeModal()
  }

  const closeModal = () => {
    isOpen.value = false
    loading.value = false
    resolvePromise = null
    rejectPromise = null
  }

  // Predefined modal types
  const confirmDelete = (itemName = 'item', details = '') => {
    return openModal({
      type: 'delete',
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${itemName}"?`,
      details: details || 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })
  }

  const confirmUpdate = (itemName = 'item', details = '') => {
    return openModal({
      type: 'update',
      title: 'Confirm Update',
      message: `Are you sure you want to update "${itemName}"?`,
      details,
      confirmText: 'Update',
      cancelText: 'Cancel'
    })
  }

  const confirmAction = (title, message, details = '') => {
    return openModal({
      type: 'warning',
      title,
      message,
      details,
      confirmText: 'Proceed',
      cancelText: 'Cancel'
    })
  }

  return {
    // State
    isOpen,
    loading,
    modalConfig,

    // Config
    ...config,

    // Methods
    openModal,
    confirm,
    cancel,
    closeModal,
    confirmDelete,
    confirmUpdate,
    confirmAction
  }
}
