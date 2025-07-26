import { ref, nextTick } from 'vue'

export function useDialogManager() {
  const eventDialog = ref(false)
  const eventDetailsDialog = ref(false)
  const selectedEvent = ref(null)
  
  // Project dialog states
  const projectDialog = ref(false)
  const projectDetailsDialog = ref(false)
  const selectedProject = ref(null)

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

  // Project dialog methods
  const openProjectDialog = () => {
    projectDialog.value = true
  }

  const closeProjectDialog = async () => {
    projectDialog.value = false
    await nextTick()
    return true
  }

  const openProjectDetailsDialog = (project = null) => {
    if (project) {
      selectedProject.value = project
    }
    projectDetailsDialog.value = true
  }

  const closeProjectDetailsDialog = () => {
    projectDetailsDialog.value = false
    selectedProject.value = null
  }

  const showProjectDetails = (project) => {
    selectedProject.value = project
    projectDetailsDialog.value = true
  }

  const switchToEditProjectDialog = () => {
    projectDetailsDialog.value = false
    projectDialog.value = true
  }

  const closeAllDialogs = () => {
    eventDialog.value = false
    eventDetailsDialog.value = false
    selectedEvent.value = null
    projectDialog.value = false
    projectDetailsDialog.value = false
    selectedProject.value = null
  }

  const hasOpenDialog = () => {
    return eventDialog.value || eventDetailsDialog.value || projectDialog.value || projectDetailsDialog.value
  }

  return {
    // Event state
    eventDialog,
    eventDetailsDialog,
    selectedEvent,

    // Project state
    projectDialog,
    projectDetailsDialog,
    selectedProject,

    // Event methods
    openEventDialog,
    closeEventDialog,
    openEventDetailsDialog,
    closeEventDetailsDialog,
    showEventDetails,
    showEventMenu,
    switchToEditDialog,

    // Project methods
    openProjectDialog,
    closeProjectDialog,
    openProjectDetailsDialog,
    closeProjectDetailsDialog,
    showProjectDetails,
    switchToEditProjectDialog,

    // Common methods
    closeAllDialogs,
    hasOpenDialog
  }
}