import { computed } from 'vue'

/**
 * @param {string} componentType - Type of component ('today', 'upcoming', etc.)
 * @param {Object} options - Additional options for class generation
 * @returns {Object} Computed CSS classes and class generation functions
 */
export function useComponentClasses(componentType = 'default', options = {}) {

  /**
   * Generate base component classes
   * @returns {Object}
   */
  const baseClasses = computed(() => ({
    [`${componentType}-component`]: true,
    'component-base': true
  }))

  /**
   * Generate list-specific classes
   * @returns {Object}
   */
  const listClasses = computed(() => ({
    'today-list': componentType === 'today',
    'upcoming-list': componentType === 'upcoming',
    'event-list': componentType.includes('event'),
    'task-list': componentType.includes('task'),
    'project-list': componentType.includes('project')
  }))

  /**
   * Generate header-specific classes
   * @returns {Object}
   */
  const headerClasses = computed(() => ({
    'today-header': componentType === 'today',
    'upcoming-header': componentType === 'upcoming',
    'list-header': true,
    'header-primary': componentType === 'today',
    'header-secondary': componentType === 'upcoming'
  }))

  /**
   * Generate item-specific classes
   * @returns {Object}
   */
  const itemClasses = computed(() => ({
    'today-event-item': componentType === 'today',
    'upcoming-event-item': componentType === 'upcoming',
    'event-item': componentType.includes('event'),
    'task-item': componentType.includes('task'),
    'project-item': componentType.includes('project'),
    'list-item': true
  }))

  /**
   * Generate container-specific classes
   * @returns {Object}
   */
  const containerClasses = computed(() => ({
    'events-container-item': true,
    'today-events-container': componentType === 'today',
    'upcoming-events-container': componentType === 'upcoming',
    'container-primary': componentType === 'today',
    'container-secondary': componentType === 'upcoming'
  }))

  /**
   * Generate state-based classes
   * @param {Object} state
   * @returns {Object}
   */
  const getStateClasses = (state = {}) => {
    return {
      'is-loading': state.loading || false,
      'is-error': state.error || false,
      'is-empty': state.empty || false,
      'is-disabled': state.disabled || false,
      'is-active': state.active || false,
      'is-selected': state.selected || false,
      'is-expanded': state.expanded || false,
      'is-collapsed': state.collapsed || false
    }
  }

  /**
   * Generate responsive classes
   * @param {Object} breakpoints
   * @returns {Object}
   */
  const getResponsiveClasses = (breakpoints = {}) => {
    return {
      'mobile-hidden': breakpoints.hideMobile || false,
      'tablet-hidden': breakpoints.hideTablet || false,
      'desktop-hidden': breakpoints.hideDesktop || false,
      'mobile-only': breakpoints.mobileOnly || false,
      'tablet-only': breakpoints.tabletOnly || false,
      'desktop-only': breakpoints.desktopOnly || false
    }
  }

  /**
   * Generate theme-based classes
   * @param {string} theme
   * @returns {Object}
   */
  const getThemeClasses = (theme = 'auto') => {
    return {
      'theme-light': theme === 'light',
      'theme-dark': theme === 'dark',
      'theme-auto': theme === 'auto'
    }
  }

  /**
   * Generate size-based classes
   * @param {string} size
   * @returns {Object}
   */
  const getSizeClasses = (size = 'medium') => {
    return {
      'size-small': size === 'small',
      'size-medium': size === 'medium',
      'size-large': size === 'large',
      'size-extra-large': size === 'xl'
    }
  }

  /**
   * Generate variant-based classes
   * @param {string} variant
   * @returns {Object}
   */
  const getVariantClasses = (variant = 'default') => {
    return {
      'variant-default': variant === 'default',
      'variant-outlined': variant === 'outlined',
      'variant-filled': variant === 'filled',
      'variant-text': variant === 'text',
      'variant-elevated': variant === 'elevated',
      'variant-flat': variant === 'flat'
    }
  }

  /**
   * Generate color-based classes
   * @param {string} color
   * @returns {Object}
   */
  const getColorClasses = (color = 'primary') => {
    return {
      [`color-${color}`]: true,
      'has-color': !!color
    }
  }

  /**
   * Generate animation classes
   * @param {Object} animations
   * @returns {Object}
   */
  const getAnimationClasses = (animations = {}) => {
    return {
      'animate-fade': animations.fade || false,
      'animate-slide': animations.slide || false,
      'animate-bounce': animations.bounce || false,
      'animate-pulse': animations.pulse || false,
      'animate-spin': animations.spin || false,
      'no-animation': animations.disabled || false
    }
  }

  /**
   * Combine all classes into a single object
   * @param {Object} additionalClasses
   * @returns {Object}
   */
  const getAllClasses = (additionalClasses = {}) => {
    return {
      ...baseClasses.value,
      ...listClasses.value,
      ...headerClasses.value,
      ...itemClasses.value,
      ...containerClasses.value,
      ...additionalClasses
    }
  }

  /**
   * Generate conditional classes based on props
   * @param {Object} props
   * @returns {Object}
   */
  const getConditionalClasses = (props = {}) => {
    return {
      'has-actions': props.showActions || false,
      'has-avatar': props.showAvatar || false,
      'has-icon': props.showIcon || false,
      'has-subtitle': props.showSubtitle || false,
      'has-divider': props.showDivider || false,
      'is-clickable': props.clickable || false,
      'is-draggable': props.draggable || false,
      'is-sortable': props.sortable || false
    }
  }

  /**
   * Generate utility classes
   * @param {Object} utilities
   * @returns {Object}
   */
  const getUtilityClasses = (utilities = {}) => {
    return {
      'text-center': utilities.textCenter || false,
      'text-left': utilities.textLeft || false,
      'text-right': utilities.textRight || false,
      'full-width': utilities.fullWidth || false,
      'full-height': utilities.fullHeight || false,
      'rounded': utilities.rounded || false,
      'shadow': utilities.shadow || false,
      'border': utilities.border || false
    }
  }

  return {
    // Computed base classes
    baseClasses,
    listClasses,
    headerClasses,
    itemClasses,
    containerClasses,

    // Dynamic class generators
    getStateClasses,
    getResponsiveClasses,
    getThemeClasses,
    getSizeClasses,
    getVariantClasses,
    getColorClasses,
    getAnimationClasses,
    getConditionalClasses,
    getUtilityClasses,

    // Utility functions
    getAllClasses
  }
}
