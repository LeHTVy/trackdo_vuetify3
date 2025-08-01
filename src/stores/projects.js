import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { storeLogger } from '@/services/logger'
import { useAuthStore } from './auth.js'

export const useProjectsStore = defineStore('projects', () => {
  const authStore = useAuthStore()
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: 'All',
    priority: 'All',
    search: '',
    tags: [],
  })

  const totalProjects = computed(() => userProjects.value.length)

  // Filter projects by current user
  const userProjects = computed(() => {
    if (!authStore.isAuthenticated) return []
    return projects.value.filter(project =>
      project.userId === authStore.currentUser?.id ||
      project.userId === authStore.currentUser?._id
    )
  })

  const activeProjects = computed(() =>
    userProjects.value.filter(project => project.status === 'Active'),
  )

  const completedProjects = computed(() =>
    userProjects.value.filter(project => project.status === 'Completed'),
  )

  const planningProjects = computed(() =>
    userProjects.value.filter(project => project.status === 'Planning'),
  )

  const onHoldProjects = computed(() =>
    userProjects.value.filter(project => project.status === 'On Hold'),
  )

  const filteredProjects = computed(() => {
    let filtered = userProjects.value

    if (filters.value.status !== 'All') {
      filtered = filtered.filter(project => project.status === filters.value.status)
    }

    if (filters.value.priority !== 'All') {
      filtered = filtered.filter(project => project.priority === filters.value.priority)
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(project =>
        (project.title || project.name || '').toLowerCase().includes(search)
        || (project.description || '').toLowerCase().includes(search),
      )
    }

    if (filters.value.tags.length > 0) {
      filtered = filtered.filter(project =>
        filters.value.tags.some(tag => project.tags.includes(tag)),
      )
    }

    return filtered
  })

  const projectStats = computed(() => {
    const userProjectsList = userProjects.value
    const totalBudget = userProjectsList.reduce((sum, project) => sum + project.budget, 0)
    const totalSpent = userProjectsList.reduce((sum, project) => sum + project.spent, 0)
    const avgProgress = userProjectsList.length > 0
      ? Math.round(userProjectsList.reduce((sum, project) => sum + project.progress, 0) / userProjectsList.length)
      : 0

    return {
      total: totalProjects.value,
      active: activeProjects.value.length,
      completed: completedProjects.value.length,
      planning: planningProjects.value.length,
      onHold: onHoldProjects.value.length,
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      avgProgress,
      totalTeamMembers: new Set(userProjectsList.flatMap(p => p.teamMembers)).size,
    }
  })

  const allTags = computed(() => {
    const tagSet = new Set()
    for (const project of userProjects.value) {
      if (project.tags) {
        for (const tag of project.tags) {
          tagSet.add(tag)
        }
      }
    }
    return Array.from(tagSet).sort()
  })

  const allTeamMembers = computed(() => {
    const memberSet = new Set()
    for (const project of userProjects.value) {
      if (project.teamMembers) {
        for (const member of project.teamMembers) {
          memberSet.add(member)
        }
      }
    }
    return Array.from(memberSet).sort()
  })

  const upcomingMilestones = computed(() => {
    const milestones = []
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

    for (const project of userProjects.value) {
      if (project.milestones) {
        for (const milestone of project.milestones) {
          const milestoneDate = new Date(milestone.date)
          if (!milestone.completed && milestoneDate <= nextMonth) {
            milestones.push({
              ...milestone,
              projectId: project.id,
              projectName: project.title || project.name,
              projectColor: project.color,
            })
          }
        }
      }
    }

    return milestones.sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  const recentActivities = computed(() => {
    const activities = []
    const sortedProjects = [...userProjects.value].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || a.startDate || 0)
      const dateB = new Date(b.updatedAt || b.createdAt || b.startDate || 0)
      return dateB - dateA
    })
    const recentProjects = sortedProjects.slice(0, 5)
    recentProjects.forEach(project => {
      const projectDate = new Date(project.updatedAt || project.createdAt || project.startDate)
      const timeAgo = getTimeAgo(projectDate)

      if (project.status === 'Completed') {
        activities.push({
          id: `completed-${project.id}`,
          text: `Project "${project.title || project.name}" has been completed`,
          time: timeAgo,
          icon: 'mdi-check-circle',
          color: 'success',
        })
      } else if (project.status === 'Active') {
        if (project.progress > 80) {
          activities.push({
            id: `near-completion-${project.id}`,
            text: `Project "${project.title || project.name}" is ${project.progress}% complete`,
            time: timeAgo,
            icon: 'mdi-progress-check',
            color: 'info',
          })
        } else if (project.progress > 0) {
          activities.push({
            id: `progress-${project.id}`,
            text: `Project "${project.title || project.name}" progress updated to ${project.progress}%`,
            time: timeAgo,
            icon: 'mdi-chart-line',
            color: 'primary',
          })
        } else {
          activities.push({
            id: `started-${project.id}`,
            text: `Project "${project.title || project.name}" has been started`,
            time: timeAgo,
            icon: 'mdi-play-circle',
            color: 'success',
          })
        }
      } else if (project.status === 'On Hold') {
        activities.push({
          id: `hold-${project.id}`,
          text: `Project "${project.title || project.name}" has been put on hold`,
          time: timeAgo,
          icon: 'mdi-pause-circle',
          color: 'warning',
        })
      } else if (project.status === 'Planning') {
        activities.push({
          id: `planning-${project.id}`,
          text: `Project "${project.title || project.name}" is in planning phase`,
          time: timeAgo,
          icon: 'mdi-clipboard-text',
          color: 'info',
        })
      } else {
        activities.push({
          id: `created-${project.id}`,
          text: `Project "${project.title || project.name}" was created`,
          time: timeAgo,
          icon: 'mdi-plus-circle',
          color: 'primary',
        })
      }
    })

    if (activities.length === 0) {
      activities.push({
        id: 'no-activity',
        text: 'No recent activity',
        time: '',
        icon: 'mdi-clock-outline',
        color: 'grey',
      })
    }

    return activities
  })

  const getTimeAgo = date => {
    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US')
    }
  }

  const fetchProjects = async () => {
    loading.value = true
    error.value = null

    try {
      if (!authStore.isAuthenticated) {
        projects.value = []
        loading.value = false
        return
      }

      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.projects.getAll()
      if (result.success) {
        const currentUserId = authStore.currentUser?.id || authStore.currentUser?._id
        const userProjects = result.data.filter(project =>
          project.userId === currentUserId
        )

        projects.value = userProjects.map(project => ({
          ...project,
          id: project._id || project.id,
          _id: project._id || project.id,
        }))
        storeLogger.success('User projects loaded from MongoDB', {
          count: projects.value.length,
          userId: currentUserId,
        })
      } else {
        storeLogger.warn('Failed to load from MongoDB', result.error)
        error.value = result.error
      }
    } catch (error_) {
      storeLogger.error('Error fetching projects', error_)
      error.value = error_.message
    } finally {
      loading.value = false
    }
  }

  const addProject = async projectData => {
    loading.value = true
    error.value = null

    try {
      // Add userId to project data
      const projectWithUser = {
        ...projectData,
        userId: authStore.currentUser?.id || authStore.currentUser?._id,
      }

      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.projects.create(projectWithUser)
      if (result.success) {
        // Ensure the new project has both _id and id for compatibility
        const newProject = {
          ...result.data,
          id: result.data._id || result.data.id,
          _id: result.data._id || result.data.id,
        }
        projects.value.push(newProject)
        storeLogger.success('Project created in MongoDB', { title: newProject.title, id: newProject._id })
        return newProject
      } else {
        storeLogger.error('Failed to create project', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      storeLogger.error('Error creating project', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (projectId, updates) => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.projects.update(projectId, updates)
      if (result.success) {
        const index = projects.value.findIndex(project =>
          project._id === projectId || project.id === projectId
        )
        if (index !== -1) {
          const updatedProject = {
            ...result.data,
            id: result.data._id || result.data.id,
            _id: result.data._id || result.data.id,
          }
          projects.value[index] = updatedProject
          storeLogger.success('Project updated in MongoDB', { title: updatedProject.title, id: projectId })
          return updatedProject
        } else {
          storeLogger.warn('Project not found in local array', { id: projectId })
          await fetchProjects()
          return result.data
        }
      } else {
        storeLogger.error('Failed to update project', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      storeLogger.error('Error updating project', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async projectId => {
    loading.value = true
    error.value = null

    storeLogger.debug('Store deleteProject - received ID', { id: projectId })

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.projects.delete(projectId)
      if (result.success) {
        const index = projects.value.findIndex(project =>
          project._id === projectId || project.id === projectId
        )
        if (index !== -1) {
          const deletedProject = projects.value.splice(index, 1)[0]
          storeLogger.success('Project deleted from MongoDB', { id: projectId })
          return deletedProject
        } else {
          storeLogger.warn('Project not found in local array for deletion', { id: projectId })
        }
      } else {
        storeLogger.error('Failed to delete project', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      storeLogger.error('Error deleting project', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const initializeStore = async () => {
    await fetchProjects()
  }

  const updateProjectProgress = (projectId, progress) => {
    const project = projects.value.find(project => project.id === projectId)
    if (project) {
      project.progress = Math.max(0, Math.min(100, progress))
      project.updatedAt = new Date().toISOString()

      if (project.progress === 100) {
        project.status = 'Completed'
      } else if (project.progress > 0 && project.status === 'Planning') {
        project.status = 'Active'
      }

      return project
    }
    return null
  }

  const addMilestone = (projectId, milestoneData) => {
    const project = projects.value.find(project => project.id === projectId)
    if (project) {
      const newMilestone = {
        id: Date.now(),
        title: milestoneData.title,
        date: milestoneData.date,
        completed: false,
      }

      if (!project.milestones) {
        project.milestones = []
      }

      project.milestones.push(newMilestone)
      project.updatedAt = new Date().toISOString()
      return newMilestone
    }
    return null
  }

  const toggleMilestone = (projectId, milestoneId) => {
    const project = projects.value.find(project => project.id === projectId)
    if (project && project.milestones) {
      const milestone = project.milestones.find(m => m.id === milestoneId)
      if (milestone) {
        milestone.completed = !milestone.completed
        project.updatedAt = new Date().toISOString()
        return milestone
      }
    }
    return null
  }

  const addTeamMember = (projectId, memberName) => {
    const project = projects.value.find(project => project.id === projectId)
    if (project && !project.teamMembers.includes(memberName)) {
      project.teamMembers.push(memberName)
      project.updatedAt = new Date().toISOString()
      return project
    }
    return null
  }

  const removeTeamMember = (projectId, memberName) => {
    const project = projects.value.find(project => project.id === projectId)
    if (project) {
      const index = project.teamMembers.indexOf(memberName)
      if (index !== -1) {
        project.teamMembers.splice(index, 1)
        project.updatedAt = new Date().toISOString()
        return project
      }
    }
    return null
  }

  const setFilter = (filterType, value) => {
    filters.value[filterType] = value
  }

  const clearFilters = () => {
    filters.value = {
      status: 'All',
      priority: 'All',
      search: '',
      tags: [],
    }
  }

  const getProjectById = projectId => {
    return projects.value.find(project => project.id === projectId)
  }

  const getProjectsByStatus = status => {
    return projects.value.filter(project => project.status === status)
  }

  const getProjectsByTag = tag => {
    return projects.value.filter(project => project.tags?.includes(tag))
  }

  const getProjectsByTeamMember = memberName => {
    return projects.value.filter(project => project.teamMembers?.includes(memberName))
  }

  const getStatusColor = status => {
    switch (status) {
      case 'Active': {
        return 'success'
      }
      case 'Completed': {
        return 'primary'
      }
      case 'Planning': {
        return 'warning'
      }
      case 'On Hold': {
        return 'error'
      }
      default: {
        return 'grey'
      }
    }
  }

  const getPriorityColor = priority => {
    switch (priority) {
      case 'High': {
        return 'error'
      }
      case 'Medium': {
        return 'warning'
      }
      case 'Low': {
        return 'success'
      }
      default: {
        return 'primary'
      }
    }
  }

  const isProjectOverdue = project => {
    const today = new Date().toISOString().split('T')[0]
    return project.endDate && project.endDate < today && project.status !== 'Completed'
  }

  const getProjectDuration = project => {
    const start = new Date(project.startDate)
    const end = new Date(project.endDate || new Date())
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return {
    projects,
    loading,
    error,
    filters,

    totalProjects,
    activeProjects,
    completedProjects,
    planningProjects,
    onHoldProjects,
    filteredProjects,
    projectStats,
    allTags,
    allTeamMembers,
    upcomingMilestones,
    recentActivities,

    initializeStore,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,

    updateProjectProgress,
    addMilestone,
    toggleMilestone,
    addTeamMember,
    removeTeamMember,
    setFilter,
    clearFilters,
    getProjectById,
    getProjectsByStatus,
    getProjectsByTag,
    getProjectsByTeamMember,

    getStatusColor,
    getPriorityColor,
    isProjectOverdue,
    getProjectDuration,
  }
})
