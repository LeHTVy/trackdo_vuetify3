<template>
  <v-dialog
    v-model="dialog"
    max-width="650px"
    persistent
    transition="dialog-bottom-transition"
    class="calendar-dialog"
  >
    <v-card class="dialog-card" elevation="24">
      <!-- Header with gradient -->
      <v-card-title class="dialog-header pa-6">
        <div class="d-flex align-center">
          <v-avatar
            :color="$vuetify.theme.current.colors.primary"
            size="40"
            class="mr-4 header-avatar"
          >
            <v-icon icon="mdi-calendar-plus" color="white" size="20"></v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold text-white mb-1">{{ formTitle }}</h2>
            <p class="text-body-2 text-white opacity-90 mb-0">
              {{ editedIndex === -1 ? 'Create a new calendar event' : 'Update event details' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-container fluid class="pa-0">
          <v-row>
            <!-- Event Title -->
            <v-col cols="12">
              <v-text-field
                v-model="editedEvent.title"
                label="Event Title"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                required
                :rules="[v => !!v || 'Event title is required']"
                prepend-inner-icon="mdi-format-title"
                class="input-field"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <!-- Event Description -->
            <v-col cols="12">
              <v-textarea
                v-model="editedEvent.description"
                label="Event Description"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                rows="3"
                auto-grow
                prepend-inner-icon="mdi-text"
                class="input-field"
                hide-details="auto"
              ></v-textarea>
            </v-col>

            <!-- Date Fields -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedEvent.start"
                label="Start Date"
                type="date"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                required
                prepend-inner-icon="mdi-calendar-start"
                class="input-field"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedEvent.end"
                label="End Date"
                type="date"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                required
                prepend-inner-icon="mdi-calendar-end"
                class="input-field"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <!-- Event Type & Priority -->
            <v-col cols="12" sm="6">
              <v-select
                v-model="editedEvent.type"
                :items="eventTypes"
                item-title="text"
                item-value="value"
                label="Event Type"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                prepend-inner-icon="mdi-tag"
                class="input-field"
                hide-details="auto"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :icon="item.raw.icon" :color="item.raw.color"></v-icon>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  <v-chip
                    :color="item.raw.color"
                    size="small"
                    class="mr-2 type-chip"
                    variant="elevated"
                  >
                    <v-icon :icon="item.raw.icon" size="12" class="mr-1"></v-icon>
                    {{ item.raw.text }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="editedEvent.priority"
                :items="priorityLevels"
                item-title="text"
                item-value="value"
                label="Priority"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                prepend-inner-icon="mdi-flag"
                class="input-field"
                hide-details="auto"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-flag" :color="item.raw.color"></v-icon>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  <v-chip
                    :color="item.raw.color"
                    size="small"
                    class="mr-2 priority-chip"
                    variant="elevated"
                  >
                    <v-icon icon="mdi-flag" size="12" class="mr-1"></v-icon>
                    {{ item.raw.text }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>

            <!-- Event Color -->
            <v-col cols="12">
              <v-select
                v-model="editedEvent.color"
                :items="eventColors"
                item-title="text"
                item-value="value"
                label="Event Color"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                prepend-inner-icon="mdi-palette"
                class="input-field"
                hide-details="auto"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar size="24" :color="item.raw.value">
                        <v-icon icon="mdi-circle" size="16" color="white"></v-icon>
                      </v-avatar>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  <v-chip
                    :color="item.raw.value"
                    size="small"
                    class="mr-2 color-chip"
                    variant="elevated"
                  >
                    <v-icon icon="mdi-circle" size="12" class="mr-1"></v-icon>
                    {{ item.raw.text }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          @click="closeDialog"
          :disabled="loading"
          class="action-btn mr-3"
          size="large"
        >
          <v-icon icon="mdi-close" class="mr-1"></v-icon>
          Cancel
        </v-btn>
        <v-btn
          :color="$vuetify.theme.current.colors.primary"
          variant="elevated"
          @click="saveEvent"
          :disabled="!editedEvent.title || loading"
          :loading="loading"
          class="action-btn"
          size="large"
        >
          <v-icon :icon="editedIndex === -1 ? 'mdi-plus' : 'mdi-content-save'" class="mr-1"></v-icon>
          {{ editedIndex === -1 ? 'Create Event' : 'Update Event' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Event Details Dialog Component -->
  <EventDetailsDialog
    v-model="detailsDialog"
    :selected-event="selectedEvent"
    @delete-event="deleteEvent"
    @edit-event="editEvent"
    @close="detailsDialog = false"
  />
</template>

<script>
import EventDetailsDialog from './EventDetailsDialog.vue'

export default {
  name: 'CalendarDialog',
  components: {
    EventDetailsDialog
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    detailsModelValue: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: () => ({})
    },
    selectedEvent: {
      type: Object,
      default: null
    },
    editedIndex: {
      type: Number,
      default: -1
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'update:detailsModelValue', 'save-event', 'delete-event', 'edit-event', 'close'],
  data() {
    return {
      editedEvent: {
        title: '',
        description: '',
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10),
        color: '#1976D2',
        type: 'meeting',
        priority: 'Medium',
      },
      eventTypes: [
        { text: 'Meeting', value: 'meeting', icon: 'mdi-account-group', color: '#1976D2' },
        { text: 'Work', value: 'work', icon: 'mdi-briefcase', color: '#2196F3' },
        { text: 'Social', value: 'social', icon: 'mdi-account-heart', color: '#E91E63' },
        { text: 'Milestone', value: 'milestone', icon: 'mdi-flag-checkered', color: '#4CAF50' },
        { text: 'Deadline', value: 'deadline', icon: 'mdi-clock-alert', color: '#F44336' },
      ],
      priorityLevels: [
        { text: 'Low', value: 'Low', color: '#4CAF50' },
        { text: 'Medium', value: 'Medium', color: '#FF9800' },
        { text: 'High', value: 'High', color: '#F44336' },
      ],
      eventColors: [
        { text: 'Blue', value: '#1976D2' },
        { text: 'Green', value: '#388E3C' },
        { text: 'Orange', value: '#F57C00' },
        { text: 'Red', value: '#D32F2F' },
        { text: 'Purple', value: '#7B1FA2' },
        { text: 'Teal', value: '#00796B' },
        { text: 'Pink', value: '#C2185B' },
        { text: 'Indigo', value: '#303F9F' },
      ]
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    detailsDialog: {
      get() {
        return this.detailsModelValue
      },
      set(value) {
        this.$emit('update:detailsModelValue', value)
      }
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Event' : 'Edit Event'
    }
  },
  watch: {
    event: {
      handler(newEvent) {
        // Map old field names to new ones for backward compatibility
        this.editedEvent = {
          title: newEvent.title || newEvent.name || '',
          description: newEvent.description || newEvent.details || '',
          start: newEvent.start || new Date().toISOString().substr(0, 10),
          end: newEvent.end || new Date().toISOString().substr(0, 10),
          color: newEvent.color || '#1976D2',
          type: newEvent.type || 'meeting',
          priority: newEvent.priority || 'Medium',
        }
      },
      deep: true,
      immediate: true
    },
    editedIndex: {
      handler(newIndex) {
        // When editedIndex changes to edit mode and we have event data, update the form
        if (newIndex !== -1 && this.event && Object.keys(this.event).length > 0) {
          this.editedEvent = {
            title: this.event.title || this.event.name || '',
            description: this.event.description || this.event.details || '',
            start: this.event.start || new Date().toISOString().substr(0, 10),
            end: this.event.end || new Date().toISOString().substr(0, 10),
            color: this.event.color || '#1976D2',
            type: this.event.type || 'meeting',
            priority: this.event.priority || 'Medium',
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.editedEvent = {
        title: '',
        description: '',
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10),
        color: '#1976D2',
        type: 'meeting',
        priority: 'Medium',
      }
    },
    saveEvent() {
      // Validate dates
      if (new Date(this.editedEvent.end) < new Date(this.editedEvent.start)) {
        this.editedEvent.end = this.editedEvent.start
      }

      // Ensure we have the correct field mapping for backend
      const eventData = {
        title: this.editedEvent.title,
        name: this.editedEvent.title, // Add name field for backward compatibility
        description: this.editedEvent.description,
        start: this.editedEvent.start,
        end: this.editedEvent.end,
        color: this.editedEvent.color,
        type: this.editedEvent.type,
        priority: this.editedEvent.priority,
      }

      // Add ID if in edit mode
      if (this.editedIndex !== -1 && this.event) {
        eventData.id = this.event.id || this.event._id
      }

      this.$emit('save-event', eventData)
      this.closeDialog()
    },
    deleteEvent() {
      if (confirm('Are you sure you want to delete this event?')) {
        console.log('Selected event for deletion:', this.selectedEvent)
        console.log('Event ID:', this.selectedEvent?.id || this.selectedEvent?._id)
        this.$emit('delete-event', this.selectedEvent)
        this.detailsDialog = false
      }
    },
    editEvent() {
      this.$emit('edit-event', this.selectedEvent)
      this.detailsDialog = false
    }
  }
}
</script>

<style scoped>
/* Dialog Animations & Styling */
.calendar-dialog .v-overlay__content {
  animation: slideInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideInUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Card Styling */
.dialog-card {
  border-radius: 24px !important;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header Styling */
.dialog-header {
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary), 0.8) 100%) !important;
  position: relative;
  overflow: hidden;
}

.dialog-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 100%);
  pointer-events: none;
}

/* Avatar Animation */
.header-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-avatar:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* Input Field Styling */
.input-field {
  margin-bottom: 8px;
}

.input-field :deep(.v-field) {
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field :deep(.v-field:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-field :deep(.v-field--focused) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.2);
}

/* Color Chip Styling */
.color-chip,
.type-chip,
.priority-chip {
  border-radius: 20px !important;
  font-weight: 600;
  transition: all 0.2s ease;
}

.color-chip:hover,
.type-chip:hover,
.priority-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.type-chip {
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.3px;
}

.priority-chip {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
.v-theme--dark .dialog-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .input-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.v-theme--dark .input-field :deep(.v-field--focused) {
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.3);
}

.v-theme--dark .action-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 600px) {
  .dialog-card {
    border-radius: 16px !important;
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

/* Focus States */
.input-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 3px;
}

/* Selection Styling */
.input-field :deep(.v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.input-field :deep(.v-list-item:hover) {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}
</style>
