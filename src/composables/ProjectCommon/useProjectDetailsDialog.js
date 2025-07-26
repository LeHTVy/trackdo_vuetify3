import { computed } from 'vue'
import { useThemeColors } from '@/composables/CalendarCommon/useThemeColors'
import { useDialogManager } from '@/composables/common/useDialogManager'
import { useConfirmModal } from '@/composables/common/useConfirmModal'

export function useProjectDetailsDialog(props, emit) {
  const themeColors = useThemeColors('modal')
  const dialogManager = useDialogManager()
  const {
    isOpen: confirmModalOpen,
    loading: confirmModalLoading,
    modalConfig: confirmModalConfig,
    confirmDelete,
    confirmUpdate,
    confirmAction,
    confirm: confirmModalConfirm,
    cancel: confirmModalCancel
  } = useConfirmModal()

  // Dialog state - use from dialogManager
  const isOpen = computed({
    get: () => props.modelValue || dialogManager.projectDetailsDialog.value,
    set: (value) => {
      emit('update:modelValue', value)
      if (!value) {
        dialogManager.closeProjectDetailsDialog()
      }
    }
  })

  // Computed properties for project data
  const projectTitle = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return project?.title || project?.name || 'Untitled Project'
  })

  const projectDescription = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return project?.description || project?.details || ''
  })

  const projectStatus = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return project?.status || 'Unknown'
  })

  const hasEndDate = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return !!(project?.endDate)
  })

  const hasPriority = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return project?.priority
  })

  const hasDescription = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return !!(project?.description || project?.details)
  })

  const hasBudget = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return !!(project?.budget)
  })

  const hasCategory = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return !!(project?.category)
  })

  const hasTeamMembers = computed(() => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    return !!(project?.teamMembers && project.teamMembers.length > 0)
  })

  // Project status icon getter
  const getProjectStatusIcon = (status) => {
    const statusIcons = {
      'Active': 'mdi-play-circle',
      'Completed': 'mdi-check-circle',
      'On Hold': 'mdi-pause-circle',
      'Cancelled': 'mdi-close-circle',
      'Planning': 'mdi-lightbulb-outline'
    }
    return statusIcons[status] || 'mdi-folder'
  }

  // Project status color getter
  const getProjectStatusColor = (status) => {
    const statusColors = {
      'Active': 'success',
      'Completed': 'primary',
      'On Hold': 'warning',
      'Cancelled': 'error',
      'Planning': 'info'
    }
    return statusColors[status] || 'grey'
  }

  // Priority color getter - use from themeColors
  const getPriorityColor = themeColors.getPriorityColor

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format budget
  const formatBudget = (budget) => {
    if (!budget) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(budget)
  }

  // Dialog methods - use from dialogManager
  const closeDialog = () => {
    dialogManager.closeProjectDetailsDialog()
    emit('close')
  }

  // Delete project without confirmation dialog
  const deleteProject = async () => {
    const project = props.selectedProject || dialogManager.selectedProject.value

    if (!project) {
      console.error('No project selected for deletion')
      return
    }

    const projectId = project._id || project.id
    if (!projectId) {
      console.error('No valid project ID found:', project)
      return
    }

    console.log('ProjectDetailsDialog deleteProject - ID:', projectId)
    emit('delete-project', projectId)
    closeDialog()
  }

  const editProject = () => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    emit('edit-project', project)
    closeDialog()
  }

  const duplicateProject = () => {
    const project = props.selectedProject || dialogManager.selectedProject.value
    emit('duplicate-project', project)
    closeDialog()
  }

  return {
    // Theme colors
    ...themeColors,

    // Dialog manager
    ...dialogManager,

    // State
    isOpen,

    // Confirm modal properties
    confirmModalOpen,
    confirmModalLoading,
    confirmModalConfig,
    confirmModalConfirm,
    confirmModalCancel,

    // Computed properties
    projectTitle,
    projectDescription,
    projectStatus,
    hasEndDate,
    hasPriority,
    hasDescription,
    hasBudget,
    hasCategory,
    hasTeamMembers,

    // Methods
    getProjectStatusIcon,
    getProjectStatusColor,
    getPriorityColor,
    formatDate,
    formatBudget,
    closeDialog,
    deleteProject,
    editProject,
    duplicateProject
  }
}
