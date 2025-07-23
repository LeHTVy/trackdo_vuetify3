<template>
  <!-- Event Details Dialog -->
  <v-dialog
    v-model="isOpen"
    max-width="400"
    transition="dialog-bottom-transition"
  >
    <v-card v-if="selectedEvent" class="event-dialog">
      <v-card-title class="d-flex align-center">
        <v-icon
          :color="selectedEvent.color || 'primary'"
          class="mr-2"
          icon="mdi-calendar-check"
        />
        {{ selectedEvent.name }}
      </v-card-title>

      <v-divider />

      <v-card-text class="py-4">
        <div v-if="selectedEvent.details" class="mb-3">
          <v-icon class="mr-2" size="16" icon="mdi-text" />
          {{ selectedEvent.details }}
        </div>

        <div class="event-time-info">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2" size="16" icon="mdi-clock-start" />
            <strong>Bắt đầu:</strong>
            <span class="ml-2">{{ formatDateTime(selectedEvent.start) }}</span>
          </div>

          <div
            v-if="selectedEvent.end && selectedEvent.end !== selectedEvent.start"
            class="d-flex align-center"
          >
            <v-icon class="mr-2" size="16" icon="mdi-clock-end" />
            <strong>End:</strong>
            <span class="ml-2">{{ formatDateTime(selectedEvent.end) }}</span>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="onClose"
        >
          Close
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="onEdit"
        >
          Chỉnh sửa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedEvent: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'edit', 'close'])

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const formatDateTime = (dateTime) => {
  if (!dateTime) return ''

  const date = new Date(dateTime)
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onClose = () => {
  emit('close')
}

const onEdit = () => {
  emit('edit')
}
</script>

<style scoped>
.event-dialog {
  background: rgb(var(--v-theme-surface));
}

.event-time-info {
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.event-time-info strong {
  color: rgb(var(--v-theme-primary));
  min-width: 80px;
  display: inline-block;
}

.event-time-info span {
  color: rgb(var(--v-theme-on-surface));
}

/* Dark mode support */
.v-theme--dark .event-time-info {
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>
