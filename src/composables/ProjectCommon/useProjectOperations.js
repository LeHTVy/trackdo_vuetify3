import { ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'

export function useProjectOperations() {
  const projectsStore = useProjectsStore()
  const loading = ref(false)
  const error = ref(null)

  // Computed properties for project data
  const projects = computed(() => projectsStore.projects)
  const recentActivities = computed(() => projectsStore.recentActivities)

  // Project CRUD operations
  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      await projectsStore.fetchProjects()
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
      console.error('Error fetching projects:', err)
    } finally {
      loading.value = false
    }
  }

  const saveProject = async (projectData, editingProject = null) => {
    loading.value = true
    error.value = null
    try {
      if (editingProject) {
        const projectId = projectData._id || editingProject._id
        console.log('Updating project with ID:', projectId)
        await projectsStore.updateProject(projectId, projectData)
      } else {
        await projectsStore.addProject(projectData)
      }
    } catch (err) {
      error.value = err.message || 'Failed to save project'
      console.error('Error saving project:', err)
      throw err // Re-throw to handle in component
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (projectId) => {
    console.log('Deleting project with ID:', projectId)

    if (!projectId) {
      console.error('No project ID provided for deletion')
      error.value = 'No project ID provided for deletion'
      return false
    }

    loading.value = true
    error.value = null
    try {
      await projectsStore.deleteProject(projectId)
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete project'
      console.error('Error deleting project:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const viewProject = (project) => {
    console.log('View project:', project.title || project.name)
    // TODO: Implement project view logic
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
    category: 'General'
  })

  return {
    // State
    loading,
    error,

    // Computed
    projects,
    recentActivities,

    // Methods
    fetchProjects,
    saveProject,
    deleteProject,
    viewProject,
    getInitialProjectData
  }
}
