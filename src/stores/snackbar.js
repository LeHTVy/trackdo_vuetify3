import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  // State
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
  })

  // Actions
  const showMessage = (message, color = 'success') => {
    console.log('🔔 Global Snackbar - Showing message:', { message, color })

    snackbar.value = {
      show: true,
      message,
      color
    }

    // Force reactivity update
    setTimeout(() => {
      if (snackbar.value.show) {
        console.log('✅ Global Snackbar is visible:', snackbar.value)
      }
    }, 100)
  }

  const hideMessage = () => {
    console.log('🔕 Global Snackbar - Hiding message')
    snackbar.value.show = false
  }

  const showSuccessMessage = (message) => {
    showMessage(message, 'success')
  }

  const showErrorMessage = (message) => {
    showMessage(message, 'error')
  }

  const showWarningMessage = (message) => {
    showMessage(message, 'warning')
  }

  const showInfoMessage = (message) => {
    showMessage(message, 'info')
  }

  return {
    // State
    snackbar,

    // Actions
    showMessage,
    hideMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
    showInfoMessage
  }
})
