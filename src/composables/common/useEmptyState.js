/**
 * Composable for handling empty state logic and content
 * @param {string} type - Type of empty state ('today', 'upcoming', 'events', 'tasks')
 * @returns {Object} Empty state configuration and functions
 */
export function useEmptyState(type = 'default') {

  /**
   * Get empty state configuration for different types
   * @returns {Object}
   */
  const getEmptyStateConfig = () => {
    const configs = {
      today: {
        icon: 'mdi-calendar-blank',
        title: 'No events today',
        text: 'You have a free day! Enjoy your time.',
        actionText: 'Add Event',
        actionIcon: 'mdi-plus'
      },
      upcoming: {
        icon: 'mdi-calendar-remove',
        title: 'No upcoming events',
        text: 'All caught up! No upcoming events scheduled.',
        actionText: 'Create Event',
        actionIcon: 'mdi-calendar-plus'
      },
      events: {
        icon: 'mdi-calendar-blank-outline',
        title: 'No events found',
        text: 'Start by creating your first event.',
        actionText: 'Add Event',
        actionIcon: 'mdi-plus'
      },
      tasks: {
        icon: 'mdi-clipboard-text-outline',
        title: 'No tasks found',
        text: 'All tasks completed! Time to relax.',
        actionText: 'Add Task',
        actionIcon: 'mdi-plus'
      },
      projects: {
        icon: 'mdi-folder-outline',
        title: 'No projects found',
        text: 'Create your first project to get started.',
        actionText: 'New Project',
        actionIcon: 'mdi-folder-plus'
      },
      search: {
        icon: 'mdi-magnify',
        title: 'No results found',
        text: 'Try adjusting your search criteria.',
        actionText: 'Clear Search',
        actionIcon: 'mdi-close'
      },
      filter: {
        icon: 'mdi-filter-remove',
        title: 'No items match your filters',
        text: 'Try removing some filters to see more results.',
        actionText: 'Clear Filters',
        actionIcon: 'mdi-filter-off'
      },
      error: {
        icon: 'mdi-alert-circle-outline',
        title: 'Something went wrong',
        text: 'Unable to load data. Please try again.',
        actionText: 'Retry',
        actionIcon: 'mdi-refresh'
      },
      loading: {
        icon: 'mdi-loading',
        title: 'Loading...',
        text: 'Please wait while we fetch your data.',
        actionText: null,
        actionIcon: null
      },
      default: {
        icon: 'mdi-information-outline',
        title: 'No data available',
        text: 'There is no data to display at the moment.',
        actionText: 'Refresh',
        actionIcon: 'mdi-refresh'
      }
    }

    return configs[type] || configs.default
  }

  /**
   * Get empty state icon
   * @returns {string} Icon name
   */
  const getEmptyIcon = () => {
    return getEmptyStateConfig().icon
  }

  /**
   * Get empty state title
   * @returns {string} Title
   */
  const getEmptyTitle = () => {
    return getEmptyStateConfig().title
  }

  /**
   * Get empty state description text
   * @returns {string} Description
   */
  const getEmptyText = () => {
    return getEmptyStateConfig().text
  }

  /**
   * Get empty state action button text
   * @returns {string|null} Action button
   */
  const getEmptyActionText = () => {
    return getEmptyStateConfig().actionText
  }

  /**
   * Get empty state action button icon
   * @returns {string|null} Action button icon
   */
  const getEmptyActionIcon = () => {
    return getEmptyStateConfig().actionIcon
  }

  /**
   * Check if empty state should show action button
   * @returns {boolean}
   */
  const hasEmptyAction = () => {
    const config = getEmptyStateConfig()
    return config.actionText !== null && config.actionIcon !== null
  }

  /**
   * Get custom empty state configuration
   * @param {Object} customConfig
   * @returns {Object} Merged configuration
   */
  const getCustomEmptyState = (customConfig = {}) => {
    const defaultConfig = getEmptyStateConfig()
    return {
      ...defaultConfig,
      ...customConfig
    }
  }

  /**
   * @param {string} dataType - Type of data ('events', 'tasks', 'projects')
   * @param {number} count - Number of items
   * @returns {Object} Empty state configuration
   */
  const getDataEmptyState = (dataType, count = 0) => {
    if (count > 0) {
      return null
    }

    const configs = {
      events: getCustomEmptyState({
        title: 'No events scheduled',
        text: 'Your calendar is empty. Start by adding your first event.'
      }),
      tasks: getCustomEmptyState({
        title: 'No tasks assigned',
        text: 'All tasks completed! You\'re all caught up.'
      }),
      projects: getCustomEmptyState({
        title: 'No projects created',
        text: 'Start organizing your work by creating your first project.'
      })
    }

    return configs[dataType] || getEmptyStateConfig()
  }

  /**
   * Get empty state for filtered results
   * @param {string} filterType
   * @param {Object} filterValues
   * @returns {Object}
   */
  const getFilteredEmptyState = (filterType, filterValues = {}) => {
    const hasActiveFilters = Object.values(filterValues).some(value =>
      value !== null && value !== undefined && value !== ''
    )

    if (hasActiveFilters) {
      return getCustomEmptyState({
        icon: 'mdi-filter-remove',
        title: 'No results match your filters',
        text: 'Try adjusting your search criteria or removing some filters.',
        actionText: 'Clear Filters',
        actionIcon: 'mdi-filter-off'
      })
    }

    return getEmptyStateConfig()
  }

  /**
   * Get empty state for search results
   * @param {string} searchQuery
   * @returns {Object}
   */
  const getSearchEmptyState = (searchQuery = '') => {
    if (searchQuery.trim()) {
      return getCustomEmptyState({
        icon: 'mdi-magnify',
        title: `No results for "${searchQuery}"`,
        text: 'Try different keywords or check your spelling.',
        actionText: 'Clear Search',
        actionIcon: 'mdi-close'
      })
    }

    return getEmptyStateConfig()
  }

  return {
    // Main configuration functions
    getEmptyStateConfig,
    getCustomEmptyState,

    // Individual property getters
    getEmptyIcon,
    getEmptyTitle,
    getEmptyText,
    getEmptyActionText,
    getEmptyActionIcon,
    hasEmptyAction,

    // Specialized empty state functions
    getDataEmptyState,
    getFilteredEmptyState,
    getSearchEmptyState
  }
}
