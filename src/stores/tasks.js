import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: 'All',
    priority: 'All',
    search: '',
    tags: [],
  })

  const totalTasks = computed(() => tasks.value.length)

  const completedTasks = computed(() =>
    tasks.value.filter(task => task.status === 'completed'),
  )

  const inProgressTasks = computed(() =>
    tasks.value.filter(task => task.status === 'in-progress'),
  )

  const pendingTasks = computed(() =>
    tasks.value.filter(task => task.status === 'todo'),
  )

  const overdueTasks = computed(() =>
    tasks.value.filter(task => task.status !== 'completed' && isOverdue(task)),
  )

  const filteredTasks = computed(() => {
    let filtered = tasks.value

    if (filters.value.status !== 'All') {
      switch (filters.value.status) {
        case 'Completed': {
          filtered = filtered.filter(task => task.status === 'completed')
          break
        }
        case 'In Progress': {
          filtered = filtered.filter(task => task.status === 'in-progress')
          break
        }
        case 'Pending': {
          filtered = filtered.filter(task => task.status === 'todo')
          break
        }
        case 'Overdue': {
          filtered = filtered.filter(task => task.status !== 'completed' && isOverdue(task))
          break
        }
      }
    }

    if (filters.value.priority !== 'All') {
      filtered = filtered.filter(task => task.priority === filters.value.priority)
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search)
        || task.description.toLowerCase().includes(search),
      )
    }

    if (filters.value.tags.length > 0) {
      filtered = filtered.filter(task =>
        filters.value.tags.some(tag => task.tags.includes(tag)),
      )
    }

    return filtered
  })

  const taskStats = computed(() => ({
    total: totalTasks.value.length,
    completed: completedTasks.value.length,
    pending: pendingTasks.value.length,
    'in-progress': inProgressTasks.value.length,
    overdue: overdueTasks.value.length,
    completionRate: totalTasks.value.length > 0 ? Math.round((completedTasks.value.length / totalTasks.value.length) * 100) : 0,
    totalEstimatedHours: tasks.value.reduce((sum, task) => sum + (task.estimatedHours || 0), 0),
    completedHours: completedTasks.value.reduce((sum, task) => sum + (task.estimatedHours || 0), 0),
  }))

  const allTags = computed(() => {
    const tagSet = new Set()
    for (const task of tasks.value) {
      if (task.tags) {
        for (const tag of task.tags) {
          tagSet.add(tag)
        }
      }
    }
    return Array.from(tagSet).sort()
  })

  const fetchTasks = async () => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.tasks.getAll()
      if (result.success) {
        tasks.value = result.data
        console.log('✅ Tasks loaded from MongoDB:', result.data.length)
      } else {
        console.warn('⚠️ Failed to load from MongoDB')
        error.value = result.error
      }
    } catch (error_) {
      console.error('❌ Error fetching tasks:', error_)
      error.value = error_.message
    } finally {
      loading.value = false
    }
  }

  const addTask = async taskData => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.tasks.create(taskData)
      if (result.success) {
        tasks.value.push(result.data)
        console.log('✅ Task created in MongoDB:', result.data)
        return result.data
      } else {
        console.error('❌ Failed to create task:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error creating task:', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (taskId, updates) => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.tasks.update(taskId, updates)
      if (result.success) {
        const index = tasks.value.findIndex(task => task._id === taskId)
        if (index !== -1) {
          tasks.value[index] = result.data
        }
        console.log('✅ Task updated in MongoDB:', result.data)
        return result.data
      } else {
        console.error('❌ Failed to update task:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error updating task:', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async taskId => {
    loading.value = true
    error.value = null

    try {
      const { mongoService } = await import('@/services/mongodb.js')
      const result = await mongoService.tasks.delete(taskId)
      if (result.success) {
        const index = tasks.value.findIndex(task => task._id === taskId)
        if (index !== -1) {
          const deletedTask = tasks.value.splice(index, 1)[0]
          console.log('✅ Task deleted from MongoDB:', deletedTask)
          return deletedTask
        }
      } else {
        console.error('❌ Failed to delete task:', result.error)
        error.value = result.error
        return null
      }
    } catch (error_) {
      console.error('❌ Error deleting task:', error_)
      error.value = error_.message
      return null
    } finally {
      loading.value = false
    }
  }

  const initializeStore = async () => {
    await fetchTasks()
  }

  const toggleTaskCompletion = taskId => {
    const task = tasks.value.find(task => task._id === taskId)
    if (task) {
      task.completed = !task.completed
      task.updatedAt = new Date().toISOString()
      return task
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

  const getTaskById = taskId => {
    return tasks.value.find(task => task._id === taskId)
  }

  const getTasksByPriority = priority => {
    return tasks.value.filter(task => task.priority === priority)
  }

  const getTasksByTag = tag => {
    return tasks.value.filter(task => task.tags?.includes(tag))
  }

  const isOverdue = task => {
    const today = new Date().toISOString().split('T')[0]
    return task.dueDate < today
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

  return {
    tasks,
    loading,
    error,
    filters,

    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    overdueTasks,
    filteredTasks,
    taskStats,
    allTags,

    initializeStore,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,

    toggleTaskCompletion,
    setFilter,
    clearFilters,
    getTaskById,
    getTasksByPriority,
    getTasksByTag,

    isOverdue,
    getPriorityColor,
  }
})
