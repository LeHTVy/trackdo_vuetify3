<template>
  <v-dialog
    v-model="isOpen"
    max-width="550"
    persistent
    transition="dialog-bottom-transition"
    class="day-events-modal"
  >
    <v-card class="day-events-card" elevation="24">
      <!-- Header with gradient -->
      <v-card-title class="day-events-header pa-6">
        <div class="d-flex align-center">
          <v-avatar
            :color="$vuetify.theme.current.colors.primary"
            size="40"
            class="mr-4 header-avatar"
          >
            <v-icon icon="mdi-calendar-multiple" color="white" size="20"></v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold text-white mb-1">{{ formatDate(selectedDate) }}</h2>
            <p class="text-body-2 text-white opacity-90 mb-0">
              {{ events.length }} {{ events.length === 1 ? 'event' : 'events' }} scheduled
            </p>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          color="white"
          class="close-btn"
          @click="closeModal"
        ></v-btn>
      </v-card-title>

      <v-card-text class="pa-0 day-events-content">
        <v-list class="py-0">
          <template v-for="(event, index) in events" :key="event.id || index">
            <v-list-item
              class="event-list-item"
              @click="onEventClick(event)"
              :ripple="true"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="event.color || '#1976d2'"
                  size="44"
                  class="mr-4 event-avatar"
                >
                  <v-icon
                    :icon="getEventTypeIcon(event.type)"
                    color="white"
                    size="20"
                  ></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold event-title">
                {{ event.name || event.title }}
              </v-list-item-title>

              <v-list-item-subtitle class="mt-2">
                <div class="d-flex align-center mb-1">
                  <v-icon
                    icon="mdi-clock-outline"
                    size="16"
                    :color="$vuetify.theme.current.colors.primary"
                    class="mr-2"
                  ></v-icon>
                  <span class="time-text">{{ formatEventTime(event) }}</span>
                </div>
                <div v-if="event.description || event.details" class="description-text">
                  {{ event.description || event.details }}
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-center">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    class="menu-btn"
                    @click.stop="onEventMenu(event)"
                  ></v-btn>
                </div>
              </template>
            </v-list-item>
            <v-divider v-if="index < events.length - 1" class="event-divider"></v-divider>
          </template>
        </v-list>
      </v-card-text>

      <v-card-actions class="pa-6 pt-4">
        <v-spacer></v-spacer>
        <v-btn
          :color="$vuetify.theme.current.colors.primary"
          variant="elevated"
          @click="closeModal"
          class="action-btn"
          size="large"
        >
          <v-icon icon="mdi-close" class="mr-1"></v-icon>
          Close
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
  selectedDate: {
    type: Date,
    default: () => new Date()
  },
  events: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'event-click', 'event-menu'])

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const closeModal = () => {
  isOpen.value = false
}

const onEventClick = (event) => {
  emit('event-click', event)
  closeModal()
}

const onEventMenu = (event) => {
  emit('event-menu', event)
}

const formatDate = (date) => {
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatEventTime = (event) => {
  if (!event.start) return ''

  const startDate = new Date(event.start)
  const endDate = new Date(event.end || event.start)

  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  if (event.end && event.end !== event.start) {
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return `${startTime} - ${endTime}`
  }

  return startTime
}

const getEventTypeIcon = (type) => {
  const typeMap = {
    meeting: 'mdi-account-group',
    work: 'mdi-briefcase',
    social: 'mdi-account-heart',
    milestone: 'mdi-flag-checkered',
    deadline: 'mdi-clock-alert'
  }
  return typeMap[type] || 'mdi-calendar'
}
</script>

<style scoped>
/* Dialog Animations & Styling */
.day-events-modal .v-overlay__content {
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
.day-events-card {
  border-radius: 24px !important;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header Styling */
.day-events-header {
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary), 0.8) 100%) !important;
  position: relative;
  overflow: hidden;
}

.day-events-header::before {
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

/* Close Button */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Content Area */
.day-events-content {
  max-height: 450px;
  overflow-y: auto;
}

/* Event List Items */
.event-list-item {
  padding: 16px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
  cursor: pointer;
}

.event-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
  transform: translateX(4px);
}

/* Event Avatar */
.event-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.event-list-item:hover .event-avatar {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

/* Event Title */
.event-title {
  font-size: 16px !important;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  transition: color 0.2s ease;
}

.event-list-item:hover .event-title {
  color: rgb(var(--v-theme-primary));
}

/* Time Text */
.time-text {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  font-size: 13px;
}

/* Description Text */
.description-text {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Priority Chip */
.priority-chip {
  border-radius: 20px !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.priority-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Menu Button */
.menu-btn {
  transition: all 0.2s ease;
  border-radius: 12px !important;
}

.menu-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  transform: scale(1.1);
}

/* Event Divider */
.event-divider {
  margin: 0 24px;
  opacity: 0.3;
}

/* Action Button */
.action-btn {
  border-radius: 16px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.4);
}

.action-btn:active {
  transform: translateY(0);
}

/* Custom scrollbar */
.day-events-content::-webkit-scrollbar {
  width: 8px;
}

.day-events-content::-webkit-scrollbar-track {
  background: rgba(var(--v-border-color), 0.1);
  border-radius: 4px;
  margin: 8px 0;
}

.day-events-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,
    rgba(var(--v-theme-primary), 0.6) 0%,
    rgba(var(--v-theme-primary), 0.4) 100%);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.day-events-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg,
    rgba(var(--v-theme-primary), 0.8) 0%,
    rgba(var(--v-theme-primary), 0.6) 100%);
}

/* Dark Mode Adjustments */
.v-theme--dark .day-events-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .event-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.12) !important;
}

.v-theme--dark .description-text {
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .event-divider {
  border-color: rgba(255, 255, 255, 0.12);
}

/* Responsive Design */
@media (max-width: 600px) {
  .day-events-card {
    margin: 16px;
    border-radius: 20px !important;
  }

  .day-events-header {
    padding: 20px !important;
  }

  .event-list-item {
    padding: 12px 16px;
  }

  .event-avatar {
    width: 36px !important;
    height: 36px !important;
  }

  .action-btn {
    min-width: 100px;
  }
}

/* Loading Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading .event-list-item {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Focus States for Accessibility */
.event-list-item:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.action-btn:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 4px;
}
</style>
