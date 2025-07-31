import { computed, ref } from 'vue'

/**
 * Task Filtering and Sorting Utilities
 * @param {Ref} tasksRef - Reactive reference to tasks array
 * @returns {Object} Filtering and sorting utilities
 */
export function useTaskFilters (tasksRef) {
  // Filter states
  const searchQuery = ref('')
  const selectedStatus = ref([])
  const selectedPriority = ref([])
  const selectedProject = ref('all')
  const sortBy = ref('dueDate')
  const sortOrder = ref('asc')
  const showOverdueOnly = ref(false)
  const showCompletedTasks = ref(true)

  // Filter options
  const statusOptions = [
    { value: 'todo', title: 'To Do', color: 'info', icon: 'mdi-circle-outline' },
    { value: 'in-progress', title: 'In Progress', color: 'warning', icon: 'mdi-clock-outline' },
    { value: 'completed', title: 'Completed', color: 'success', icon: 'mdi-check-circle' },
    { value: 'cancelled', title: 'Cancelled', color: 'error', icon: 'mdi-cancel' },
  ]

  const priorityOptions = [
    { value: 'low', title: 'Low', color: 'blue-grey', icon: 'mdi-arrow-down' },
    { value: 'medium', title: 'Medium', color: 'orange', icon: 'mdi-minus' },
    { value: 'high', title: 'High', color: 'deep-orange', icon: 'mdi-arrow-up' },
    { value: 'critical', title: 'Critical', color: 'red', icon: 'mdi-alert' },
  ]

  const sortOptions = [
    { value: 'dueDate', title: 'Due Date' },
    { value: 'priority', title: 'Priority' },
    { value: 'title', title: 'Title' },
    { value: 'createdAt', title: 'Created Date' },
    { value: 'updatedAt', title: 'Updated Date' },
  ]

  // Get unique projects from tasks
  const projectOptions = computed(() => {
    if (!tasksRef.value) return [{ value: 'all', title: 'All Projects' }]

    const projects = [...new Set(
      tasksRef.value
        .filter(task => task.project)
        .map(task => task.project)
    )]

    return [
      { value: 'all', title: 'All Projects' },
      ...projects.map(project => ({ value: project, title: project })),
    ]
  })

  // Priority weight for sorting
  const getPriorityWeight = priority => {
    const weights = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1,
    }
    return weights[priority?.toLowerCase()] || 0
  }

  // Filtered and sorted tasks
  const filteredTasks = computed(() => {
    if (!tasksRef.value) return []

    let filtered = [...tasksRef.value]

    // Search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (selectedStatus.value.length > 0) {
      filtered = filtered.filter(task => selectedStatus.value.includes(task.status))
    }

    // Priority filter
    if (selectedPriority.value.length > 0) {
      filtered = filtered.filter(task => selectedPriority.value.includes(task.priority))
    }

    // Project filter
    if (selectedProject.value !== 'all') {
      filtered = filtered.filter(task => task.project === selectedProject.value)
    }

    // Overdue filter
    if (showOverdueOnly.value) {
      const today = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(task =>
        task.status !== 'completed' &&
        task.dueDate &&
        task.dueDate < today
      )
    }

    // Completed tasks filter
    if (!showCompletedTasks.value) {
      filtered = filtered.filter(task => task.status !== 'completed')
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy.value) {
        case 'priority':
          aValue = getPriorityWeight(a.priority)
          bValue = getPriorityWeight(b.priority)
          break
        case 'title':
          aValue = a.title?.toLowerCase() || ''
          bValue = b.title?.toLowerCase() || ''
          break
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31')
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31')
          break
        case 'createdAt':
          aValue = new Date(a.createdAt || 0)
          bValue = new Date(b.createdAt || 0)
          break
        case 'updatedAt':
          aValue = new Date(a.updatedAt || 0)
          bValue = new Date(b.updatedAt || 0)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  })

  // Filter statistics
  const filterStats = computed(() => {
    const filtered = filteredTasks.value
    const total = filtered.length
    const completed = filtered.filter(task => task.status === 'completed').length
    const pending = filtered.filter(task => task.status === 'todo').length
    const inProgress = filtered.filter(task => task.status === 'in-progress').length

    const today = new Date().toISOString().split('T')[0]
    const overdue = filtered.filter(task =>
      task.status !== 'completed' &&
      task.dueDate &&
      task.dueDate < today
    ).length

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  // Check if any filters are active
  const hasActiveFilters = computed(() => {
    return searchQuery.value.trim() !== '' ||
           selectedStatus.value.length > 0 ||
           selectedPriority.value.length > 0 ||
           selectedProject.value !== 'all' ||
           showOverdueOnly.value ||
           !showCompletedTasks.value
  })

  // Clear all filters
  const clearFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = []
    selectedPriority.value = []
    selectedProject.value = 'all'
    showOverdueOnly.value = false
    showCompletedTasks.value = true
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  // Set sort by field
  const setSortBy = field => {
    if (sortBy.value === field) {
      toggleSortOrder()
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
  }

  return {
    // Filter states
    searchQuery,
    selectedStatus,
    selectedPriority,
    selectedProject,
    sortBy,
    sortOrder,
    showOverdueOnly,
    showCompletedTasks,

    // Filter options
    statusOptions,
    priorityOptions,
    sortOptions,
    projectOptions,

    // Computed properties
    filteredTasks,
    filterStats,
    hasActiveFilters,

    // Methods
    clearFilters,
    toggleSortOrder,
    setSortBy,
  }
}
