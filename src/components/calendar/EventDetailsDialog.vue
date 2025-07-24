<template>
  <!-- Event Details Dialog -->
  <v-dialog
    v-model="isOpen"
    max-width="550px"
    transition="dialog-top-transition"
    class="details-dialog"
  >
    <v-card v-if="selectedEvent" class="details-card" elevation="16">
      <v-card-title class="details-header pa-6" :style="{ backgroundColor: selectedEvent.color }">
        <div class="d-flex align-center">
          <v-avatar size="36" color="white" class="mr-3">
            <v-icon :icon="getEventTypeIcon(selectedEvent.type)" :color="selectedEvent.color"></v-icon>
          </v-avatar>
          <div>
            <h3 class="text-h6 font-weight-bold text-white mb-1">{{ selectedEvent.title || selectedEvent.name }}</h3>
            <p class="text-body-2 text-white opacity-90 mb-0">{{ selectedEvent.type || 'Event' }}</p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <div v-if="selectedEvent.description || selectedEvent.details" class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-text" :color="$vuetify.theme.current.colors.primary" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Description</span>
          </div>
          <p class="text-body-1 ml-8">{{ selectedEvent.description || selectedEvent.details }}</p>
        </div>

        <div class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-start" :color="$vuetify.theme.current.colors.primary" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Start Date</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedEvent.start) }}</p>
        </div>

        <div v-if="selectedEvent.end && selectedEvent.end !== selectedEvent.start" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-end" :color="$vuetify.theme.current.colors.primary" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">End Date</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedEvent.end) }}</p>
        </div>

        <div v-if="selectedEvent.priority" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-flag" :color="getPriorityColor(selectedEvent.priority)" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Priority</span>
          </div>
          <v-chip
            :color="getPriorityColor(selectedEvent.priority)"
            size="small"
            class="ml-8"
            variant="elevated"
          >
            {{ selectedEvent.priority }}
          </v-chip>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="outlined"
          @click="deleteEvent"
          class="action-btn mr-3"
        >
          <v-icon icon="mdi-delete" class="mr-1"></v-icon>
          Delete
        </v-btn>
        <v-btn
          :color="$vuetify.theme.current.colors.primary"
          variant="elevated"
          @click="editEvent"
          class="action-btn mr-3"
        >
          <v-icon icon="mdi-pencil" class="mr-1"></v-icon>
          Edit
        </v-btn>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
          class="action-btn"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EventDetailsDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    selectedEvent: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue', 'delete-event', 'edit-event', 'close'],
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    closeDialog() {
      this.isOpen = false
      this.$emit('close')
    },
    deleteEvent() {
      if (confirm('Are you sure you want to delete this event?')) {
        console.log('Selected event for deletion:', this.selectedEvent)
        console.log('Event ID:', this.selectedEvent?.id || this.selectedEvent?._id)
        this.$emit('delete-event', this.selectedEvent)
        this.closeDialog()
      }
    },
    editEvent() {
      this.$emit('edit-event', this.selectedEvent)
      this.closeDialog()
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getEventTypeIcon(type) {
      const typeMap = {
        meeting: 'mdi-account-group',
        work: 'mdi-briefcase',
        social: 'mdi-account-heart',
        milestone: 'mdi-flag-checkered',
        deadline: 'mdi-clock-alert'
      }
      return typeMap[type] || 'mdi-calendar'
    },
    getPriorityColor(priority) {
      const colorMap = {
        Low: 'success',
        Medium: 'warning',
        High: 'error'
      }
      return colorMap[priority] || 'primary'
    }
  }
}
</script>

<style scoped>
/* Dialog Animations & Styling */
.details-dialog .v-overlay__content {
  animation: slideInDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideInDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Card Styling */
.details-card {
  border-radius: 20px !important;
  overflow: hidden;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

/* Header Styling */
.details-header {
  position: relative;
  overflow: hidden;
}

.details-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 100%);
  pointer-events: none;
}

/* Action Button Styling */
.action-btn {
  border-radius: 16px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(0);
}

/* Dark Mode Adjustments */
.v-theme--dark .details-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .action-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 600px) {
  .details-card {
    border-radius: 12px !important;
    margin: 16px;
  }

  .action-btn {
    min-width: 100px;
    font-size: 0.875rem;
  }
}

/* Loading State */
.action-btn.v-btn--loading {
  pointer-events: none;
}

.action-btn.v-btn--loading :deep(.v-btn__overlay) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
</style>
