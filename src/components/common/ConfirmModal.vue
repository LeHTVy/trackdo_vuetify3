<template>
  <v-dialog
    v-model="isOpen"
    max-width="500"
    persistent
    @click:outside="handleCancel"
  >
    <v-card class="confirm-modal">
      <v-card-title class="d-flex align-center">
        <v-icon
          class="mr-3"
          :color="iconColor"
          :icon="icon"
          size="28"
        />
        <span class="text-h6">{{ displayTitle }}</span>
      </v-card-title>

      <v-card-text class="py-4">
        <p class="text-body-1 mb-0">{{ displayMessage }}</p>

        <!-- Additional details slot -->
        <div v-if="details" class="mt-3 pa-3 bg-grey-lighten-4 rounded">
          <p class="text-body-2 text-grey-darken-1 mb-0">{{ details }}</p>
        </div>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />

        <v-btn
          class="mr-2"
          color="grey"
          :disabled="loading"
          variant="outlined"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>

        <v-btn
          :color="confirmColor"
          :disabled="loading"
          :loading="loading"
          :variant="confirmVariant"
          @click="handleConfirm"
        >
          {{ displayConfirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, toRefs } from 'vue'
  import { useConfirmModalConfig } from '@/composables/common/useConfirmModalConfig'

  // Props
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'delete',
      validator: value => ['delete', 'update', 'warning', 'info'].includes(value),
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  // Emits
  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

  // Convert props to refs for composable
  const { type, title, message, confirmText } = toRefs(props)

  // Use config composable for business logic
  const {
    icon,
    iconColor,
    confirmColor,
    confirmVariant,
    displayTitle,
    displayMessage,
    displayConfirmText,
  } = useConfirmModalConfig(type, title, message, confirmText)

  // Component logic
  const isOpen = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const handleConfirm = () => {
    emit('confirm')
  }

  const handleCancel = () => {
    if (!props.loading) {
      emit('cancel')
      isOpen.value = false
    }
  }
</script>

<style scoped>
.confirm-modal {
  border-radius: 12px;
}

.v-card-title {
  background: rgba(var(--v-theme-surface), 0.8);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.v-card-actions {
  background: rgba(var(--v-theme-surface), 0.5);
}

/* Dark mode adjustments */
.v-theme--dark .v-card-title {
  background: rgba(var(--v-theme-surface), 0.9);
}

.v-theme--dark .v-card-actions {
  background: rgba(var(--v-theme-surface), 0.7);
}

/* Ensure button text is visible */
.v-btn {
  font-weight: 500 !important;
}

.v-btn.v-btn--variant-elevated {
  color: white !important;
}

.v-btn.v-btn--variant-elevated.v-btn--color-error {
  background-color: rgb(var(--v-theme-error)) !important;
  color: white !important;
}
</style>
