import { ref, computed } from 'vue'

export function useProjectFilters(projects) {
  // Filter state
  const filter = ref('all')

  // Available filter options
  const filterOptions = [
    { value: 'all', label: 'All', icon: 'mdi-view-grid' },
    { value: 'Active', label: 'Active', icon: 'mdi-play-circle' },
    { value: 'Completed', label: 'Completed', icon: 'mdi-check-circle' },
    { value: 'On Hold', label: 'On Hold', icon: 'mdi-pause-circle' }
  ]

  // Filtered projects computed property
  const filteredProjects = computed(() => {
    if (!projects.value || filter.value === 'all') {
      return projects.value || []
    }
    return projects.value.filter(project => project.status === filter.value)
  })

  // Filter methods
  const setFilter = (newFilter) => {
    filter.value = newFilter
  }

  const resetFilter = () => {
    filter.value = 'all'
  }

  // Filter statistics
  const filterStats = computed(() => {
    const allProjects = projects.value || []
    return {
      all: allProjects.length,
      active: allProjects.filter(p => p.status === 'Active').length,
      completed: allProjects.filter(p => p.status === 'Completed').length,
      onHold: allProjects.filter(p => p.status === 'On Hold').length
    }
  })

  return {
    // State
    filter,
    filterOptions,

    // Computed
    filteredProjects,
    filterStats,

    // Methods
    setFilter,
    resetFilter
  }
}
