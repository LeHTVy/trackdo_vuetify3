import { ref, nextTick } from 'vue'

export function useDialogManager() {
  const eventDialog = ref(false)
  const eventDetailsDialog = ref(false)
  const selectedEvent = ref(null)

  const openEventDialog = () => {
    eventDialog.value = true
  }

  const closeEventDialog = async () => {
    eventDialog.value = false
    await nextTick()
    return true
  }

  const openEventDetailsDialog = (event = null) => {
    if (event) {
      selectedEvent.value = event
    }
    eventDetailsDialog.value = true
  }

  const closeEventDetailsDialog = () => {
    eventDetailsDialog.value = false
    selectedEvent.value = null
  }

  const showEventDetails = (event) => {
    selectedEvent.value = event
    eventDetailsDialog.value = true
  }

  const showEventMenu = (event) => {
    showEventDetails(event)
  }

  const switchToEditDialog = () => {
    eventDetailsDialog.value = false
    eventDialog.value = true
  }

  const closeAllDialogs = () => {
    eventDialog.value = false
    eventDetailsDialog.value = false
    selectedEvent.value = null
  }

  const hasOpenDialog = () => {
    return eventDialog.value || eventDetailsDialog.value
  }

  return {
    // State
    eventDialog,
    eventDetailsDialog,
    selectedEvent,

    // Methods
    openEventDialog,
    closeEventDialog,
    openEventDetailsDialog,
    closeEventDetailsDialog,
    showEventDetails,
    showEventMenu,
    switchToEditDialog,
    closeAllDialogs,
    hasOpenDialog
  }
}
