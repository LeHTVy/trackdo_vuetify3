<template>
  <!-- Event Details Dialog -->
  <v-dialog
    v-model="isOpen"
    class="details-dialog"
    max-width="550px"
    transition="dialog-top-transition"
  >
    <v-card v-if="selectedEvent" class="details-card" elevation="16">
      <v-card-title class="details-header pa-6" :style="{ backgroundColor: selectedEvent.color }">
        <div class="d-flex align-center">
          <v-avatar class="mr-3" color="white" size="36">
            <v-icon :color="selectedEvent.color" :icon="getEventTypeIcon(selectedEvent.type)" />
          </v-avatar>
          <div>
            <h3 class="text-h6 font-weight-bold text-white mb-1">{{ eventTitle }}</h3>
            <p class="text-body-2 text-white opacity-90 mb-0">{{ eventType }}</p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <div v-if="hasDescription" class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2" :color="getPrimaryColor()" icon="mdi-text" />
            <span class="text-subtitle2 font-weight-medium">Description</span>
          </div>
          <p class="text-body-1 ml-8">{{ eventDescription }}</p>
        </div>

        <div class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2" :color="getPrimaryColor()" icon="mdi-calendar-start" />
            <span class="text-subtitle2 font-weight-medium">Start Date</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedEvent.start) }}</p>
        </div>

        <div v-if="hasEndDate" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2" :color="getPrimaryColor()" icon="mdi-calendar-end" />
            <span class="text-subtitle2 font-weight-medium">End Date</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedEvent.end) }}</p>
        </div>

        <div v-if="hasPriority" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2" :color="getPriorityColor(selectedEvent.priority)" icon="mdi-flag" />
            <span class="text-subtitle2 font-weight-medium">Priority Level</span>
          </div>
          <v-chip
            class="ml-8"
            :color="getPriorityColor(selectedEvent.priority)"
            size="small"
            variant="elevated"
          >
            {{ selectedEvent.priority }}
          </v-chip>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          class="action-btn mr-3"
          color="error"
          variant="outlined"
          @click="deleteEvent"
        >
          <v-icon class="mr-1" icon="mdi-delete" />
          Delete
        </v-btn>
        <v-btn
          class="action-btn mr-3"
          :color="getPrimaryColor()"
          variant="elevated"
          @click="editEvent"
        >
          <v-icon class="mr-1" icon="mdi-pencil" />
          Edit
        </v-btn>
        <v-btn
          class="action-btn"
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirm Modal -->
  <ConfirmModal
    v-model="confirmModalOpen"
    :details="selectedEvent?.title ? `Event: ${selectedEvent.title}` : ''"
    :loading="confirmModalLoading"
    :title="confirmModalConfig.title"
    :type="confirmModalConfig.type"
    @cancel="confirmModalCancel"
    @confirm="confirmModalConfirm"
  />
</template>

<script>
  import { useEventDetailsDialog } from '@/composables/CalendarDialog/useEventDetailsDialog'
  import ConfirmModal from '@/components/common/ConfirmModal.vue'

  export default {
    name: 'EventDetailsDialog',
    components: {
      ConfirmModal,
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      selectedEvent: {
        type: Object,
        default: null,
      },
    },
    emits: ['update:modelValue', 'edit-event', 'duplicate-event', 'close'],
    setup (props, { emit }) {
      const {
        // Theme colors
        getPrimaryColor,
        getSecondaryColor,
        getAccentColor,
        getErrorColor,
        getWarningColor,
        getInfoColor,
        getSuccessColor,

        // State
        isOpen,

        // Confirm modal properties
        confirmModalOpen,
        confirmModalLoading,
        confirmModalConfig,
        confirmModalConfirm,
        confirmModalCancel,

        // Computed properties
        eventTitle,
        eventDescription,
        eventType,
        hasEndDate,
        hasPriority,
        hasDescription,

        // Methods
        getEventTypeIcon,
        getPriorityColor,
        formatDate,
        closeDialog,
        deleteEvent,
        editEvent,
        duplicateEvent,
      } = useEventDetailsDialog(props, emit)

      return {
        // Theme colors
        getPrimaryColor,
        getSecondaryColor,
        getAccentColor,
        getErrorColor,
        getWarningColor,
        getInfoColor,
        getSuccessColor,

        // State
        isOpen,

        // Confirm modal properties
        confirmModalOpen,
        confirmModalLoading,
        confirmModalConfig,
        confirmModalConfirm,
        confirmModalCancel,

        // Computed properties
        eventTitle,
        eventDescription,
        eventType,
        hasEndDate,
        hasPriority,
        hasDescription,

        // Methods
        getEventTypeIcon,
        getPriorityColor,
        formatDate,
        closeDialog,
        deleteEvent,
        editEvent,
        duplicateEvent,
      }
    },
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
