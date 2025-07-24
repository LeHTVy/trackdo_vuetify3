<template>
  <div class="calendar-page app-background">
    <v-container fluid class="pa-4">
    <!-- Error Alert -->
    <v-alert
      v-if="operations.error.value"
      type="error"
      variant="tonal"
      closable
      @click:close="operations.clearError"
      class="mb-4"
    >
      {{ operations.error.value }}
    </v-alert>

    <!-- Calendar Header -->
    <CalendarHeader
      :current-date="navigation.currentDate.value"
    />

    <v-row>
      <!-- Main Calendar -->
      <v-col cols="12" lg="8">
        <v-card elevation="2" class="calendar-card">
          <CalendarMain
            :events="filters.formattedEvents.value"
            :loading="operations.loading.value"
            @date-selected="handleDateSelected"
            @range-changed="handleRangeChanged"
            @event-clicked="dialogs.showEventDetails"
            @edit-event="handleEditEvent"
            @show-more-events="handleShowMoreEvents"
            @event-updated="handleEventUpdated"
          />
        </v-card>
      </v-col>

      <!-- Event Lists Sidebar -->
      <v-col cols="12" lg="4">
        <div class="events-sidebar">
          <CalendarList
            :events="filters.todayEvents.value"
            type="today"
            @event-click="dialogs.showEventDetails"
            @event-menu="dialogs.showEventMenu"
            @view-all="viewAllToday"
          />

          <CalendarList
            :events="filters.upcomingEvents.value"
            type="upcoming"
            @event-click="dialogs.showEventDetails"
            @event-menu="dialogs.showEventMenu"
            @view-all="viewAllUpcoming"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Draggable Floating Action Button -->
    <v-btn
      fab
      color="primary"
      size="large"
      class="floating-add-btn"
      :class="{ 'dragging': isDragging }"
      :style="fabStyle"
      :loading="operations.loading.value"
      @click="handleNewEvent"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <v-icon icon="mdi-plus" size="24"></v-icon>
    </v-btn>

    <!-- Calendar Dialogs -->
    <CalendarDialog
      v-model="dialogs.eventDialog.value"
      v-model:details-model-value="dialogs.eventDetailsDialog.value"
      :event="form.editedEvent"
      :selected-event="dialogs.selectedEvent.value"
      :edited-index="form.editedIndex.value"
      :loading="operations.loading.value"
      @save-event="handleSaveEvent"
      @delete-event="handleDeleteEvent"
      @edit-event="handleEditEvent"
      @close="handleDialogClose"
    />

    <!-- Day Events Modal -->
    <DayEventsModal
      v-model="dayEventsModal.isOpen"
      :selected-date="dayEventsModal.selectedDate"
      :events="dayEventsModal.events"
      @event-click="dialogs.showEventDetails"
      @event-menu="dialogs.showEventMenu"
    />
  </v-container>
  </div>
</template>

<script setup>
import { useEventsStore } from '@/stores/events.js'
import { useCalendarNavigation } from '@/composables/useCalendarNavigation'
import { useEventFilters } from '@/composables/useEventFilters'
import { useDialogManager } from '@/composables/useDialogManager'
import { useEventForm } from '@/composables/useEventForm'
import { useEventOperations } from '@/composables/useEventOperations'
import { useDraggableFab } from '@/composables/useDraggableFab'
import CalendarHeader from '@/components/calendar/CalendarHeader.vue'
import CalendarMain from '@/components/calendar/CalendarMain.vue'
import CalendarList from '@/components/calendar/CalendarList.vue'
import CalendarDialog from '@/components/calendar/CalendarDialog.vue'
import DayEventsModal from '@/components/calendar/DayEventsModal.vue'
import { computed, reactive } from 'vue'

// Store
const eventsStore = useEventsStore()

// Composables
const navigation = useCalendarNavigation()
const filters = useEventFilters(computed(() => eventsStore.events))
const dialogs = useDialogManager()
const form = useEventForm()
const operations = useEventOperations(eventsStore)

// Draggable FAB
const { isDragging, fabStyle, startDrag } = useDraggableFab({
  storageKey: 'calendarFabPosition'
})

// Day Events Modal State
const dayEventsModal = reactive({
  isOpen: false,
  selectedDate: new Date(),
  events: []
})

// Event Handlers
const handleDateSelected = ({ date }) => {
  form.initializeNewEvent(date)
  dialogs.openEventDialog()
}

const handleRangeChanged = ({ start, end }) => {
  console.log('Range changed:', start, end)
}

const handleShowMoreEvents = ({ date, events }) => {
  dayEventsModal.selectedDate = date
  dayEventsModal.events = events
  dayEventsModal.isOpen = true
}

const handleNewEvent = () => {
  if (!isDragging.value) {
    form.initializeNewEvent()
    dialogs.openEventDialog()
  }
}

const handleEditEvent = (event) => {
  // Find the index of the event in the store
  let index = eventsStore.events.findIndex(e => 
    (e.id && e.id === event.id) || 
    (e._id && e._id === event._id) ||
    (e.title === event.title && e.start === event.start)
  )
  
  // If not found, set index to 0 to indicate edit mode (not -1 which means create mode)
  if (index === -1) {
    index = 0
  }
  
  // Set the selected event for backup reference
  dialogs.selectedEvent.value = event
  
  form.initializeEditEvent(event, index)
  dialogs.switchToEditDialog()
}

const handleSaveEvent = async (eventData) => {
  const isEdit = form.isEditMode()
  
  // For edit mode, we need to get the original event data that contains the ID
  let selectedEvent = null
  if (isEdit) {
    // Try to get from dialogs first, then find in store
    selectedEvent = dialogs.selectedEvent.value
    if (!selectedEvent || (!selectedEvent.id && !selectedEvent._id)) {
      // Find the event in store using the form's editedEvent data
      selectedEvent = eventsStore.events.find(e => 
        (e.id && form.editedEvent.id && e.id === form.editedEvent.id) ||
        (e._id && form.editedEvent.id && e._id === form.editedEvent.id) ||
        (e.title === form.editedEvent.title && e.start === form.editedEvent.start)
      )
    }
  }
  
  const result = await operations.saveEvent(
    eventData,
    isEdit,
    selectedEvent
  )

  if (result.success) {
    form.resetForm()
    dialogs.closeEventDialog()
  }
}

const handleDeleteEvent = async (event) => {
  const result = await operations.deleteEvent(event)

  if (result.success) {
    dialogs.closeEventDetailsDialog()
  }
}

const handleDialogClose = () => {
  form.resetForm()
  dialogs.closeAllDialogs()
}

// Handle drag and drop event updates
const handleEventUpdated = async (updatedEvent) => {
  const result = await operations.saveEvent(
    updatedEvent,
    true, // isEdit = true for drag and drop updates
    updatedEvent // selectedEvent is the updated event itself
  )

  if (!result.success) {
    console.error('Failed to update event via drag and drop:', result.error)
  }
}

// List Actions
const viewAllToday = () => {
  console.log('View all today events')
}

const viewAllUpcoming = () => {
  console.log('View all upcoming events')
}
</script>

<style scoped>
.calendar-page {
  min-height: 100vh;
}

.calendar-card {
  border-radius: 12px;
  overflow: hidden;
}

.v-container {
  max-width: 1400px;
}

/* Events Container with Divider */
.events-sidebar {
  display: flex;
  flex-direction: column;
}

/* Floating Action Button Styles */
.floating-add-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.4) !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.floating-add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.6) !important;
}

.floating-add-btn.dragging {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.7) !important;
  transition: none !important;
}

.floating-add-btn:active {
  transform: scale(0.95);
}

/* Pulse animation for attention */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.4);
  }
  50% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.8);
  }
  100% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.4);
  }
}

.floating-add-btn:not(.dragging):not(:hover) {
  animation: pulse 2s infinite;
}

/* Dark mode adjustments */
.v-theme--dark .floating-add-btn {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}

.v-theme--dark .floating-add-btn:hover {
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.5) !important;
}

.v-theme--dark .floating-add-btn.dragging {
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.6) !important;
}
</style>
