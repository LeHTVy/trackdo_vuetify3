import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: 'All',
    priority: 'All',
    search: '',
    tags: [],
  })

  const totalProjects = computed(() => projects.value.length)

  const activeProjects = computed(() =>
    projects.value.filter(project => project.status === 'Active'),
  )

  const completedProjects = computed(() =>
    projects.value.filter(project => project.status === 'Completed'),
  )

  const planningProjects = computed(() =>
    projects.value.filter(project => project.status === 'Planning'),
  )

  const onHoldProjects = computed(() =>
    projects.value.filter(project => project.status === 'On Hold'),
  )

  const filteredProjects = computed(() => {
    let filtered = projects.value

    if (filters.value.status !== 'All') {
      filtered = filtered.filter(project => project.status === filters.value.status)
    }

    if (filters.value.priority !== 'All') {
      filtered = filtered.filter(project => project.priority === filters.value.priority)
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(search)
        || project.description.toLowerCase().includes(search),
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
    const totalBudget = projects.value.reduce((sum, project) => sum + project.budget, 0)
    const totalSpent = projects.value.reduce((sum, project) => sum + project.spent, 0)
    const avgProgress = projects.value.length > 0
      ? Math.round(projects.value.reduce((sum, project) => sum + project.progress, 0) / projects.value.length)
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
      totalTeamMembers: new Set(projects.value.flatMap(p => p.teamMembers)).size,
    }
  })

  const allTags = computed(() => {
    const tagSet = new Set()
    for (const project of projects.value) {
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
    for (const project of projects.value) {
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

    for (const project of projects.value) {
      if (project.milestones) {
        for (const milestone of project.milestones) {
          const milestoneDate = new Date(milestone.date)
          if (!milestone.completed && milestoneDate <= nextMonth) {
            milestones.push({
              ...milestone,
              projectId: project.id,
              projectName: project.name,
              projectColor: project.color,
            })
          }
        }
      }
    }

    return milestones.sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  const fetchProjects = async () => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.projects.getAll()
      if (result.success) {
        projects.value = result.data
        console.log('✅ Projects loaded from MongoDB:', result.data.length)
      } else {
        console.warn('⚠️ Failed to load from MongoDB')
        error.value = result.error
      }
    } catch (error_) {
      console.error('❌ Error fetching projects:', error_)
      error.value = error_.message
    } finally {
      loading.value = false
    }
  }

  const addProject = async projectData => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.projects.create(projectData)
      if (result.success) {
        projects.value.push(result.data)
        console.log('✅ Project created in MongoDB:', result.data)
        return result.data
      } else {
        console.error('❌ Failed to create project:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error creating project:', error_)
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
        const index = projects.value.findIndex(project => project.id === projectId)
        if (index !== -1) {
          projects.value[index] = result.data
        }
        console.log('✅ Project updated in MongoDB:', result.data)
        return result.data
      } else {
        console.error('❌ Failed to update project:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error updating project:', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async projectId => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.projects.delete(projectId)
      if (result.success) {
        const index = projects.value.findIndex(project => project.id === projectId)
        if (index !== -1) {
          const deletedProject = projects.value.splice(index, 1)[0]
          console.log('✅ Project deleted from MongoDB:', deletedProject)
          return deletedProject
        }
      } else {
        console.error('❌ Failed to delete project:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error deleting project:', error_)
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
