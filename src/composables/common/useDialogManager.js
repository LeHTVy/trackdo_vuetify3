import { DialogTypes, useUniversalDialog } from './useUniversalDialog'
import logger from '@/services/logger'

const dialogLogger = logger.createLogger('DialogManager')

export function useDialogManager () {
  // Use universal dialog system
  const eventDialogManager = useUniversalDialog('event-dialog')
  const eventDetailsDialogManager = useUniversalDialog('event-details-dialog')
  const projectDialogManager = useUniversalDialog('project-dialog')
  const projectDetailsDialogManager = useUniversalDialog('project-details-dialog')

  // Legacy refs for backwards compatibility
  const eventDialog = eventDialogManager.isOpen
  const eventDetailsDialog = eventDetailsDialogManager.isOpen
  const selectedEvent = eventDetailsDialogManager.data
  const projectDialog = projectDialogManager.isOpen
  const projectDetailsDialog = projectDetailsDialogManager.isOpen
  const selectedProject = projectDetailsDialogManager.data

  // Event dialog methods
  const openEventDialog = async (eventData = null) => {
    dialogLogger.debug('Opening event dialog', eventData)
    return eventDialogManager.openDialog(eventData, { type: DialogTypes.FORM })
  }

  const closeEventDialog = async () => {
    dialogLogger.debug('Closing event dialog')
    return eventDialogManager.closeDialog()
  }

  const openEventDetailsDialog = async (event = null) => {
    dialogLogger.debug('Opening event details dialog', event)
    return eventDetailsDialogManager.openDialog(event, { type: DialogTypes.DETAILS })
  }

  const closeEventDetailsDialog = async () => {
    dialogLogger.debug('Closing event details dialog')
    return eventDetailsDialogManager.closeDialog()
  }

  const showEventDetails = async event => {
    dialogLogger.debug('Showing event details', event)
    return eventDetailsDialogManager.openDialog(event, { type: DialogTypes.DETAILS })
  }

  const showEventMenu = async event => {
    return showEventDetails(event)
  }

  const switchToEditDialog = async () => {
    dialogLogger.debug('Switching from details to edit dialog')
    const eventData = eventDetailsDialogManager.data.value
    await eventDetailsDialogManager.closeDialog(false)
    return eventDialogManager.openDialog(eventData, { type: DialogTypes.EDIT })
  }

  // Project dialog methods
  const openProjectDialog = async (projectData = null) => {
    dialogLogger.debug('Opening project dialog', projectData)
    return projectDialogManager.openDialog(projectData, { type: DialogTypes.FORM })
  }

  const closeProjectDialog = async () => {
    dialogLogger.debug('Closing project dialog')
    return projectDialogManager.closeDialog()
  }

  const openProjectDetailsDialog = async (project = null) => {
    dialogLogger.debug('Opening project details dialog', project)
    return projectDetailsDialogManager.openDialog(project, { type: DialogTypes.DETAILS })
  }

  const closeProjectDetailsDialog = async () => {
    dialogLogger.debug('Closing project details dialog')
    return projectDetailsDialogManager.closeDialog()
  }

  const showProjectDetails = async project => {
    dialogLogger.debug('Showing project details', project)
    return projectDetailsDialogManager.openDialog(project, { type: DialogTypes.DETAILS })
  }

  const switchToEditProjectDialog = async () => {
    dialogLogger.debug('Switching from project details to edit dialog')
    const projectData = projectDetailsDialogManager.data.value
    await projectDetailsDialogManager.closeDialog(false)
    return projectDialogManager.openDialog(projectData, { type: DialogTypes.EDIT })
  }

  const closeAllDialogs = async () => {
    dialogLogger.debug('Closing all dialogs')
    await Promise.all([
      eventDialogManager.closeDialog(),
      eventDetailsDialogManager.closeDialog(),
      projectDialogManager.closeDialog(),
      projectDetailsDialogManager.closeDialog(),
    ])
  }

  const hasOpenDialog = () => {
    return eventDialogManager.isOpen.value ||
           eventDetailsDialogManager.isOpen.value ||
           projectDialogManager.isOpen.value ||
           projectDetailsDialogManager.isOpen.value
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
    hasOpenDialog,
  }
}
