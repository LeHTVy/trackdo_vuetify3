<template>
  <div class="calendar-page app-background">
    <v-container class="pa-4" fluid>
      <!-- Error Alert -->
      <v-alert
        v-if="operations.error.value"
        class="mb-4"
        closable
        type="error"
        variant="tonal"
        @click:close="operations.clearError"
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
          <v-card class="calendar-card" elevation="2">
            <CalendarMain
              :events="filters.formattedEvents.value"
              :loading="operations.loading.value"
              @date-selected="handleDateSelected"
              @edit-event="handleEditEvent"
              @event-clicked="dialogs.showEventDetails"
              @event-updated="handleEventUpdated"
              @range-changed="handleRangeChanged"
              @show-more-events="handleShowMoreEvents"
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
        class="floating-add-btn"
        :class="{ 'dragging': isDragging }"
        color="primary"
        fab
        :loading="operations.loading.value"
        size="large"
        :style="fabStyle"
        @click="handleNewEvent"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <v-icon icon="mdi-plus" size="24" />
      </v-btn>

      <!-- Calendar Dialogs -->
      <CalendarDialog
        v-model="dialogs.eventDialog.value"
        v-model:details-model-value="dialogs.eventDetailsDialog.value"
        :edited-index="form.editedIndex.value"
        :event="form.editedEvent"
        :loading="operations.loading.value"
        :selected-event="dialogs.selectedEvent.value"
        @close="handleDialogClose"
        @edit-event="handleEditEvent"
        @save-event="handleSaveEvent"
      />

      <!-- Day Events Modal -->
      <DayEventsModal
        v-model="dayEventsModal.isOpen"
        :events="dayEventsModal.events"
        :selected-date="dayEventsModal.selectedDate"
        @event-click="dialogs.showEventDetails"
        @event-menu="dialogs.showEventMenu"
      />
    </v-container>
  </div>
</template>

<script setup>
  import { useEventsStore } from '@/stores/events.js'
  import { useCalendarNavigation } from '@/composables/CalendarMain/useCalendarNavigation'
  import { useEventFilters } from '@/composables/CalendarCommon/useEventFilters'
  import { useDialogManager } from '@/composables/common/useDialogManager'
  import { useEventForm } from '@/composables/CalendarDialog/useEventForm'
  import { useEventOperations } from '@/composables/CalendarCommon/useEventOperations'
  import { useDraggableFab } from '@/composables/common/useDraggableFab'
  import { useEventUtils } from '@/composables/CalendarCommon/useEventUtils'
  import { useErrorHandler } from '@/composables/common/useErrorHandler'
  import CalendarHeader from '@/components/calendar/CalendarHeader.vue'
  import CalendarMain from '@/components/calendar/CalendarMain.vue'
  import CalendarList from '@/components/calendar/CalendarList.vue'
  import CalendarDialog from '@/components/calendar/CalendarDialog.vue'
  import DayEventsModal from '@/components/calendar/DayEventsModal.vue'
  import { computed, onMounted, reactive } from 'vue'

  // Store
  const eventsStore = useEventsStore()

  // Initialize store on component mount
  onMounted(async () => {
    await eventsStore.initializeStore()
  })

  // Composables
  const navigation = useCalendarNavigation()
  const filters = useEventFilters(computed(() => eventsStore.events))
  const dialogs = useDialogManager()
  const form = useEventForm()
  const operations = useEventOperations(eventsStore)
  const eventUtils = useEventUtils(eventsStore)
  const errorHandler = useErrorHandler()

  // Draggable FAB
  const { isDragging, fabStyle, startDrag } = useDraggableFab({
    storageKey: 'calendarFabPosition',
  })

  // Day Events Modal State
  const dayEventsModal = reactive({
    isOpen: false,
    selectedDate: new Date(),
    events: [],
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

  // Optimized Event Handlers
  const handleEditEvent = event => {
    const index = eventUtils.findEventIndex(event)
    dialogs.selectedEvent.value = event
    form.initializeEditEvent(event, index)
    dialogs.switchToEditDialog()
  }

  const handleSaveEvent = async eventData => {
    const isEdit = form.isEditMode()
    let selectedEvent = null

    if (isEdit) {
      selectedEvent = dialogs.selectedEvent.value ||
        eventUtils.findEventByReference(form.editedEvent)
    }

    const result = await errorHandler.handleAsyncError(
      () => operations.saveEvent(eventData, isEdit, selectedEvent),
      'Save event failed'
    )

    if (result.success) {
      form.resetForm()
      dialogs.closeEventDialog()
    }
  }

  const handleEventUpdated = async updatedEvent => {
    // Debug logging to track the event data
    console.log('🔄 handleEventUpdated called with:', {
      updatedEvent,
      hasId: !!updatedEvent.id,
      has_id: !!updatedEvent._id,
      eventId: updatedEvent.id || updatedEvent._id,
      eventKeys: Object.keys(updatedEvent),
      eventType: typeof updatedEvent,
    })

    // Ensure event has proper ID before updating
    if (!updatedEvent.id && !updatedEvent._id) {
      console.error('❌ Event missing both id and _id:', updatedEvent)
      return
    }

    await errorHandler.handleAsyncError(
      () => operations.saveEvent(updatedEvent, true, updatedEvent),
      'Failed to update event via drag and drop'
    )
  }

  const handleDialogClose = () => {
    form.resetForm()
    dialogs.closeAllDialogs()
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
