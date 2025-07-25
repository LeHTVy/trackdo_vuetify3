import { computed } from 'vue'

export function useConfirmModalConfig(type, title, message, confirmText) {
  // Icon mapping
  const iconMap = {
    delete: 'mdi-delete-alert',
    update: 'mdi-update',
    warning: 'mdi-alert',
    info: 'mdi-information'
  }

  // Color mapping
  const colorMap = {
    delete: 'error',
    update: 'primary',
    warning: 'warning',
    info: 'info'
  }

  // Default titles
  const defaultTitles = {
    delete: 'Confirm Deletion',
    update: 'Confirm Update',
    warning: 'Warning',
    info: 'Information'
  }

  // Default messages
  const defaultMessages = {
    delete: 'Are you sure you want to delete this item? This action cannot be undone.',
    update: 'Are you sure you want to update this item?',
    warning: 'Please review the following information before proceeding.',
    info: 'Please confirm to continue.'
  }

  // Default confirm texts
  const defaultConfirmTexts = {
    delete: 'Delete',
    update: 'Update',
    warning: 'Proceed',
    info: 'OK'
  }

  // Computed properties
  const icon = computed(() => iconMap[type.value] || 'mdi-help-circle')
  const iconColor = computed(() => colorMap[type.value] || 'grey')
  const confirmColor = computed(() => colorMap[type.value] || 'primary')

  const displayTitle = computed(() =>
    title.value || defaultTitles[type.value] || 'Confirm Action'
  )

  const displayMessage = computed(() =>
    message.value || defaultMessages[type.value] || 'Are you sure you want to proceed?'
  )

  const displayConfirmText = computed(() =>
    confirmText.value || defaultConfirmTexts[type.value] || 'Confirm'
  )

  const confirmVariant = computed(() => 'flat')

  return {
    icon,
    iconColor,
    confirmColor,
    confirmVariant,
    displayTitle,
    displayMessage,
    displayConfirmText
  }
}
