<template>
  <v-card
    :class="componentClasses"
    :elevation="accessibility.reducedMotionMode ? 0 : elevation"
    v-bind="cardProps"
  >
    <!-- Skip link for keyboard navigation -->
    <a
      v-if="showSkipLink"
      class="skip-link"
      :href="`#${componentId}-content`"
      @click="skipToContent"
    >
      Skip to {{ title || 'content' }}
    </a>

    <!-- Loading state with accessibility -->
    <v-overlay
      v-if="loading"
      class="align-center justify-center"
      contained
      :model-value="loading"
    >
      <v-progress-circular
        :aria-label="`Loading ${title || 'content'}`"
        color="primary"
        indeterminate
        :size="64"
        :width="4"
      />
      <v-card-text class="sr-only">
        Loading {{ title || 'content' }}. Please wait.
      </v-card-text>
    </v-overlay>

    <!-- Error state with retry capability -->
    <v-alert
      v-if="error && !loading"
      class="ma-4"
      closable
      :text="errorMessage"
      :title="errorTitle"
      type="error"
      variant="tonal"
      @click:close="clearError"
    >
      <template #append>
        <v-btn
          v-if="showRetry"
          :aria-label="`Retry ${title || 'action'}`"
          size="small"
          variant="outlined"
          @click="retryAction"
        >
          <v-icon start>mdi-refresh</v-icon>
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Header with accessibility -->
    <v-card-title
      v-if="title"
      :id="`${componentId}-title`"
      :class="titleClasses"
      v-bind="titleProps"
    >
      <component
        :is="titleTag"
        :class="titleTextClasses"
      >
        {{ title }}
      </component>

      <!-- Actions slot -->
      <v-spacer v-if="$slots.actions" />
      <div
        v-if="$slots.actions"
        :aria-label="`${title} actions`"
        class="d-flex align-center gap-2"
        role="toolbar"
      >
        <slot name="actions" />
      </div>
    </v-card-title>

    <!-- Content with proper landmarks -->
    <v-card-text
      :id="`${componentId}-content`"
      :aria-describedby="description ? `${componentId}-description` : undefined"
      :aria-labelledby="title ? `${componentId}-title` : undefined"
      :class="contentClasses"
      :role="contentRole"
      v-bind="contentProps"
    >
      <!-- Description -->
      <p
        v-if="description"
        :id="`${componentId}-description`"
        :class="descriptionClasses"
      >
        {{ description }}
      </p>

      <!-- Main content slot -->
      <slot
        :accessibility="accessibility"
        :component-id="componentId"
        :theme="theme"
        :validation="validation"
      />

      <!-- Empty state -->
      <div
        v-if="showEmptyState"
        :aria-label="emptyStateMessage"
        :class="emptyStateClasses"
        role="status"
      >
        <v-icon
          class="mb-4"
          :color="emptyStateIconColor"
          :size="emptyStateIconSize"
        >
          {{ emptyStateIcon }}
        </v-icon>
        <h3 class="text-h6 mb-2">{{ emptyStateTitle }}</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ emptyStateMessage }}
        </p>
        <v-btn
          v-if="emptyStateAction"
          :color="emptyStateActionColor"
          :variant="emptyStateActionVariant"
          @click="emptyStateAction"
        >
          {{ emptyStateActionText }}
        </v-btn>
      </div>
    </v-card-text>

    <!-- Actions area -->
    <v-card-actions
      v-if="$slots.cardActions"
      :class="actionsClasses"
    >
      <slot name="cardActions" />
    </v-card-actions>

    <!-- Keyboard shortcuts help -->
    <v-dialog
      v-model="showKeyboardHelp"
      max-width="500"
      :persistent="false"
    >
      <v-card>
        <v-card-title>Keyboard Shortcuts</v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item
              v-for="shortcut in keyboardShortcuts"
              :key="shortcut.key"
              :subtitle="shortcut.key"
              :title="shortcut.description"
            >
              <template #prepend>
                <v-chip size="small" variant="outlined">
                  {{ shortcut.key }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showKeyboardHelp = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import {
    useAccessibility,
    useEnhancedTheme,
    useEnhancedValidation,
  } from '@/composables'
  import logger from '@/services/logger'

  // Component logger
  const componentLogger = logger.createLogger('EnhancedComponent')

  // Props with comprehensive validation
  const props = defineProps({
    // Content props
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    titleTag: {
      type: String,
      default: 'h2',
      validator: value => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value),
    },

    // State props
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: [String, Error, null],
      default: null,
    },

    // Accessibility props
    contentRole: {
      type: String,
      default: 'region',
    },
    showSkipLink: {
      type: Boolean,
      default: false,
    },

    // Styling props
    elevation: {
      type: [Number, String],
      default: 2,
    },
    variant: {
      type: String,
      default: 'elevated',
    },

    // Empty state props
    showEmptyState: {
      type: Boolean,
      default: false,
    },
    emptyStateTitle: {
      type: String,
      default: 'No data available',
    },
    emptyStateMessage: {
      type: String,
      default: 'There is no data to display at this time.',
    },
    emptyStateIcon: {
      type: String,
      default: 'mdi-inbox-outline',
    },
    emptyStateAction: {
      type: Function,
      default: null,
    },
    emptyStateActionText: {
      type: String,
      default: 'Take action',
    },

    // Retry functionality
    showRetry: {
      type: Boolean,
      default: true,
    },
    retryAction: {
      type: Function,
      default: null,
    },
  })

  // Emits with validation
  const emit = defineEmits({
    'error-cleared': null,
    'retry-clicked': null,
    'content-focused': id => typeof id === 'string',
  })

  // Composables
  const accessibility = useAccessibility()
  const theme = useEnhancedTheme()

  // Component state
  const componentId = ref(`enhanced-component-${Date.now()}`)
  const showKeyboardHelp = ref(false)

  // Computed properties with theme awareness
  const componentClasses = computed(() => [
    'enhanced-component',
    {
      'enhanced-component--loading': props.loading,
      'enhanced-component--error': !!props.error,
      'enhanced-component--high-contrast': accessibility.highContrastMode.value,
      'enhanced-component--reduced-motion': accessibility.reducedMotionMode.value,
      'enhanced-component--keyboard-nav': accessibility.keyboardNavigationActive.value,
    },
  ])

  const titleClasses = computed(() => [
    'd-flex align-center',
    {
      'text-high-emphasis': !accessibility.highContrastMode.value,
      'text-contrast': accessibility.highContrastMode.value,
    },
  ])

  const titleTextClasses = computed(() => [
    'text-h5',
    {
      'font-weight-medium': !accessibility.highContrastMode.value,
      'font-weight-bold': accessibility.highContrastMode.value,
    },
  ])

  const contentClasses = computed(() => [
    'enhanced-component__content',
    {
      'pa-6': !accessibility.reducedMotionMode.value,
      'pa-4': accessibility.reducedMotionMode.value,
    },
  ])

  const descriptionClasses = computed(() => [
    'text-body-1 text-medium-emphasis mb-4',
    {
      'text-high-emphasis': accessibility.highContrastMode.value,
    },
  ])

  const emptyStateClasses = computed(() => [
    'd-flex flex-column align-center justify-center text-center py-8',
    {
      'min-height-200': !accessibility.reducedMotionMode.value,
    },
  ])

  const actionsClasses = computed(() => [
    'px-4 pb-4',
    {
      'pt-0': true,
    },
  ])

  // Dynamic props based on theme and accessibility
  const cardProps = computed(() => ({
    variant: props.variant,
    ...(accessibility.highContrastMode.value && {
      outlined: true,
      'border-width': '2',
    }),
  }))

  const titleProps = computed(() => ({
    ...(accessibility.accessibilityState.value.screenReaderActive && {
      'aria-level': props.titleTag.replace('h', ''),
    }),
  }))

  const contentProps = computed(() => ({
    tabindex: accessibility.keyboardNavigationActive.value ? '0' : undefined,
  }))

  // Error handling
  const errorTitle = computed(() => {
    if (!props.error) return ''
    return props.error instanceof Error ? 'Error' : 'Warning'
  })

  const errorMessage = computed(() => {
    if (!props.error) return ''
    return props.error instanceof Error ? props.error.message : String(props.error)
  })

  // Empty state computed properties
  const emptyStateIconSize = computed(() =>
    accessibility.accessibilityState.value.navigationMode === 'touch' ? 80 : 64
  )

  const emptyStateIconColor = computed(() =>
    accessibility.highContrastMode.value ? 'high-emphasis' : 'medium-emphasis'
  )

  const emptyStateActionColor = computed(() =>
    accessibility.highContrastMode.value ? 'primary' : 'primary'
  )

  const emptyStateActionVariant = computed(() =>
    accessibility.highContrastMode.value ? 'outlined' : 'elevated'
  )

  // Keyboard shortcuts
  const keyboardShortcuts = computed(() => [
    { key: 'Alt + H', description: 'Show keyboard shortcuts help' },
    { key: 'Alt + 1', description: 'Skip to main content' },
    { key: 'Escape', description: 'Close dialogs or return to previous state' },
  ])

  // Methods
  const clearError = () => {
    emit('error-cleared')
    accessibility.announce('Error cleared', 'polite')
    componentLogger.debug('Error cleared by user')
  }

  const skipToContent = event => {
    event.preventDefault()
    accessibility.manageFocus.setFocus(`#${componentId.value}-content`)
    emit('content-focused', componentId.value)
  }

  // Keyboard shortcut handlers
  const handleKeyboardShortcut = event => {
    if (event.altKey && event.key.toLowerCase() === 'h') {
      event.preventDefault()
      showKeyboardHelp.value = true
      accessibility.announce('Keyboard shortcuts help opened', 'polite')
    }
  }

  // Watchers for accessibility announcements
  watch(() => props.loading, (newLoading, oldLoading) => {
    if (newLoading && !oldLoading) {
      accessibility.announce(`Loading ${props.title || 'content'}`, 'polite')
    } else if (!newLoading && oldLoading) {
      accessibility.announce(`Finished loading ${props.title || 'content'}`, 'polite')
    }
  })

  watch(() => props.error, (newError, oldError) => {
    if (newError && !oldError) {
      accessibility.announce(`Error: ${errorMessage.value}`, 'assertive')
    }
  })

  // Lifecycle
  onMounted(() => {
    // Register keyboard shortcuts
    const shortcutId = accessibility.keyboardNavigation.registerShortcut(
      'alt+h',
      handleKeyboardShortcut,
      'Show keyboard shortcuts help'
    )

    // Announce component ready
    if (props.title) {
      accessibility.announce(`${props.title} component ready`, 'polite')
    }

    componentLogger.debug('Enhanced component mounted', {
      id: componentId.value,
      title: props.title,
      hasError: !!props.error,
      loading: props.loading,
    })

    // Cleanup function
    onUnmounted(() => {
      accessibility.keyboardNavigation.unregisterShortcut(shortcutId)
      componentLogger.debug('Enhanced component unmounted')
    })
  })

  // Enhanced validation example (if needed)
  const formData = ref({})
  const validation = useEnhancedValidation(formData, {}, {
    accessibilityMode: true,
    showSuccessStates: true,
  })
</script>

<style scoped>
.enhanced-component {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-component--reduced-motion {
  transition: none !important;
}

.enhanced-component--high-contrast {
  border: 2px solid currentColor !important;
}

.enhanced-component--keyboard-nav {
  outline-offset: 2px;
}

.enhanced-component--keyboard-nav:focus-within {
  outline: 2px solid var(--v-theme-primary);
}

.enhanced-component__content {
  position: relative;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--v-theme-primary);
  color: var(--v-theme-on-primary);
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  font-weight: 500;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}

.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* High contrast mode enhancements */
.enhanced-component--high-contrast .text-medium-emphasis {
  color: var(--v-theme-on-surface) !important;
}

.enhanced-component--high-contrast .v-btn {
  border: 2px solid currentColor !important;
}

/* Reduced motion enhancements */
.enhanced-component--reduced-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Touch-friendly enhancements */
@media (pointer: coarse) {
  .enhanced-component .v-btn {
    min-height: 48px;
    min-width: 48px;
  }

  .enhanced-component .v-list-item {
    min-height: 48px;
  }
}

/* Print styles */
@media print {
  .enhanced-component {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #000 !important;
  }

  .skip-link,
  .v-overlay {
    display: none !important;
  }
}
</style>
