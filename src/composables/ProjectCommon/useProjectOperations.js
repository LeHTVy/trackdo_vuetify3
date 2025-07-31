import { computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useBaseOperations } from '@/composables/common/useBaseOperations'
import { useEventHandler } from '@/composables/common/useEventHandler'
import { useConfirmModal } from '@/composables/common/useConfirmModal'
import logger from '@/services/logger'

const projectLogger = logger.createLogger('ProjectOperations')

export function useProjectOperations () {
  const projectsStore = useProjectsStore()
  const baseOps = useBaseOperations(projectsStore, 'project')
  const eventHandler = useEventHandler('ProjectOperations')
  const {
    isOpen: confirmModalOpen,
    loading: confirmModalLoading,
    modalConfig: confirmModalConfig,
    confirmDelete,
    confirm: confirmModalConfirm,
    cancel: confirmModalCancel,
  } = useConfirmModal()
  const projects = computed(() => projectsStore.projects)
  const recentActivities = computed(() => projectsStore.recentActivities)
  const fetchProjects = async () => {
    return eventHandler.handleAsyncEvent(async () => {
      return baseOps.fetchItems({
        fetchMethod: 'fetchProjects',
        successMessage: 'Projects loaded successfully',
        errorMessage: 'Failed to fetch projects',
      })
    }, {
      actionName: 'fetch_projects',
    })
  }

  const saveProject = async (projectData, editingProject = null) => {
    return eventHandler.handleAsyncEvent(async () => {
      if (editingProject) {
        const projectId = projectData._id || editingProject._id
        projectLogger.debug('Updating project', { id: projectId, title: projectData.title })

        return baseOps.updateItem(projectData, projectId, {
          updateMethod: 'updateProject',
          successMessage: 'Project updated successfully',
          errorMessage: 'Failed to update project',
        })
      } else {
        projectLogger.debug('Creating new project', { title: projectData.title })

        return baseOps.createItem(projectData, {
          createMethod: 'addProject',
          successMessage: 'Project created successfully',
          errorMessage: 'Failed to create project',
        })
      }
    }, {
      actionName: editingProject ? 'update_project' : 'create_project',
      itemName: projectData.title || 'Project',
    })
  }

  const deleteProject = async (projectId, skipConfirm = false) => {
    return eventHandler.handleDelete(async () => {
      if (!projectId) {
        throw new Error('No project ID provided for deletion')
      }

      projectLogger.debug('Deleting project', { id: projectId })

      return baseOps.deleteItem(projectId, {
        deleteMethod: 'deleteProject',
        successMessage: 'Project deleted successfully',
        errorMessage: 'Failed to delete project',
      })
    }, {
      itemName: 'Project',
      confirmMessage: skipConfirm ? undefined : 'Are you sure you want to delete this project? This action cannot be undone.',
    })
  }

  // Delete project with confirm modal - for UI components
  const deleteProjectWithConfirm = async (projectOrId, projects = []) => {
    try {
      let project
      let projectId

      if (typeof projectOrId === 'string') {
        projectId = projectOrId
        // Try to find project in provided array first, then in store
        project = projects.find(p => (p._id || p.id) === projectId) ||
                 projectsStore.projects.find(p => (p._id || p.id) === projectId)
      } else {
        project = projectOrId
        projectId = project._id || project.id
      }

      // If project not found, still allow deletion by ID (timing issue handling)
      const projectName = project ? (project.title || project.name) : 'this project'

      await confirmDelete(
        projectName,
        'This action cannot be undone. All project data will be permanently removed.'
      )

      projectLogger.debug('Confirmed delete project', { id: projectId, name: projectName })

      await deleteProject(projectId, true)
      return true
    } catch (error) {
      projectLogger.debug('Delete cancelled or error:', error)
      return false
    }
  }

  const viewProject = project => {
    projectLogger.debug('View project', { title: project.title || project.name })
    // TODO: Implement project view logic
  }

  const duplicateProject = async project => {
    return eventHandler.handleDuplicate(async () => {
      return baseOps.duplicateItem(project, {
        createMethod: 'addProject',
        duplicateTransform: originalProject => ({
          ...originalProject,
          title: `${originalProject.title} (Copy)`,
          status: 'Active',
          progress: 0,
          startDate: '',
          endDate: '',
        }),
        successMessage: 'Project duplicated successfully',
        errorMessage: 'Failed to duplicate project',
      })
    }, {
      itemName: project.title || 'Project',
    })
  }

  // Initial data for new projects
  const getInitialProjectData = () => ({
    title: '',
    description: '',
    status: 'Active',
    progress: 0,
    budget: null,
    startDate: '',
    endDate: '',
    priority: 'Medium',
    category: 'General',
  })

  return {
    // State from base operations
    loading: baseOps.loading,
    error: baseOps.error,

    // Confirm modal properties
    confirmModalOpen,
    confirmModalLoading,
    confirmModalConfig,
    confirmModalConfirm,
    confirmModalCancel,

    // Computed
    projects,
    recentActivities,

    // Methods
    fetchProjects,
    saveProject,
    deleteProject,
    deleteProjectWithConfirm,
    duplicateProject,
    viewProject,
    getInitialProjectData,

    // Utilities
    clearError: baseOps.clearError,
    setError: baseOps.setError,
  }
}
