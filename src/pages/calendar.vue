<template>
  <v-app>
    <!-- Calendar Header Component -->
    <CalendarHeader
      @toggle-drawer="drawer = !drawer"
      @add-event="showAddDialog = true"
    />

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      class="navigation-drawer"
    >
      <v-container class="pa-4 drawer-content">
        <!-- Date Picker Calendar - Compact -->
        <div class="date-picker-section">
          <DatePickerCalendar
            v-model="selectedDate"
            :events="eventsStore.events"
            @add-event="showAddDialog = true"
            @date-click="handleDateClick"
          />
        </div>

        <!-- Events List -->
        <div class="events-section">
          <EventsList
            :today-events="todayEvents"
            :upcoming-events="upcomingEvents"
            @edit-event="editEvent"
          />
        </div>
      </v-container>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-4">
        <CustomCalendar
          default-view="week"
          :selected-date="scheduleXSelectedDate"
          @date-click="handleScheduleXDateClick"
          @event-click="handleScheduleXEventClick"
          @event-create="handleEventCreate"
          @event-update="handleEventUpdate"
        />
      </v-container>
    </v-main>

    <!-- Event Dialog -->
    <EventDialog
      :editing-event="editingEvent"
      :initial-data="newEvent"
      :show-dialog="showAddDialog"
      @close="closeDialog"
      @save="saveEvent"
    />
  </v-app>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import CalendarHeader from '@/components/calendar/CalendarHeader.vue'
  import DatePickerCalendar from '@/components/calendar/DatePickerCalendar.vue'
  import EventDialog from '@/components/calendar/EventDialog.vue'
  import EventsList from '@/components/calendar/EventsList.vue'
  import CustomCalendar from '@/components/calendar/CustomCalendar.vue'
  import { useEventsStore } from '@/stores/events'
  import { formatEventForDisplay } from '@/utils/eventUtils.js'

  const eventsStore = useEventsStore()
  const showAddDialog = ref(false)
  const editingEvent = ref(null)
  const selectedDate = ref(new Date())
  const drawer = ref(true)

  const newEvent = ref({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    type: 'meeting',
    priority: 'Medium',
    location: '',
    attendees: [],
    color: '#1976D2',
    recurring: {
      enabled: false,
      frequency: 'weekly',
      interval: 1,
      endDate: '',
    },
    reminders: [],
    status: 'confirmed',
  })

  const todayEvents = computed(() => {
    return eventsStore.todayEvents.map(event =>
      formatEventForDisplay(event, { includeTime: true, includeColor: true, includeIcon: true })
    )
  })

  const upcomingEvents = computed(() => {
    return eventsStore.upcomingEvents.map(event =>
      formatEventForDisplay(event, { includeDate: true, includeColor: true, includeIcon: true })
    )
  })

  const scheduleXSelectedDate = computed(() => new Date().toISOString().split('T')[0])

  const handleScheduleXEventClick = event => {
    editEvent(event)
  }

  const handleScheduleXDateClick = date => {
    const selectedDateObj = new Date(date)
    newEvent.value.start = selectedDateObj.toISOString().slice(0, 16)
    newEvent.value.end = selectedDateObj.toISOString().slice(0, 16)
    showAddDialog.value = true
  }

  const handleEventCreate = ({ start }) => {
    const startDate = new Date(start)
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 1)

    newEvent.value.start = startDate.toISOString().slice(0, 16)
    newEvent.value.end = endDate.toISOString().slice(0, 16)
    showAddDialog.value = true
  }

  const handleEventUpdate = async (updatedEvent) => {
    try {
      console.log('Updating event via drag & drop:', updatedEvent)
      await eventsStore.updateEvent(updatedEvent.id, updatedEvent)
    } catch (error) {
      console.error('Error updating event via drag & drop:', error)
    }
  }

  const handleDateClick = ({ date, dateString, events, hasEvents }) => {
    console.log('Date clicked:', date)
    console.log('Date string:', dateString)
    console.log('Events for this date:', events)
    console.log('Has events:', hasEvents)

    selectedDate.value = date

    const selectedDateObj = new Date(date)
    newEvent.value.start = selectedDateObj.toISOString().slice(0, 16)
    newEvent.value.end = selectedDateObj.toISOString().slice(0, 16)
    showAddDialog.value = true
  }

  const saveEvent = async eventData => {
    if (!eventData || !eventData.title?.trim()) {
      console.warn('Event data is invalid or title is empty')
      return
    }

    try {
      if (!eventData.start) {
        console.error('Event start time is required')
        return
      }

      await (editingEvent.value
        ? eventsStore.updateEvent(editingEvent.value.id, eventData)
        : eventsStore.addEvent(eventData)
      )
      closeDialog()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const editEvent = event => {
    if (!event) {
      console.warn('Cannot edit null event')
      return
    }
    editingEvent.value = event
    newEvent.value = { ...event }
    showAddDialog.value = true
  }

  const closeDialog = () => {
    newEvent.value = {
      title: '',
      description: '',
      start: '',
      end: '',
      allDay: false,
      type: 'meeting',
      priority: 'Medium',
      location: '',
      attendees: [],
      color: '#1976D2',
      recurring: {
        enabled: false,
        frequency: 'weekly',
        interval: 1,
        endDate: '',
      },
      reminders: [],
      status: 'confirmed',
    }
    editingEvent.value = null
    showAddDialog.value = false
  }

  onMounted(async () => {
    try {
      if (typeof eventsStore.initializeStore === 'function') {
        await eventsStore.initializeStore()
      }
      if (typeof eventsStore.fetchEvents === 'function') {
        await eventsStore.fetchEvents()
      } else {
        console.warn('fetchEvents method not available in events store')
      }
    } catch (error) {
      console.error('Error initializing calendar:', error)
    }

    const today = new Date()
    newEvent.value.start = today.toISOString().slice(0, 16)
    newEvent.value.end = today.toISOString().slice(0, 16)
  })
</script>

<style scoped>
/* Navigation Drawer Styling */
.navigation-drawer {
  width: 300px;
  background: transparent;
  border-right: 1px solid rgba(var(--v-theme-primary), 0.1) !important;
  overflow: hidden !important;
}

.drawer-content {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 8px !important;
}

/* Date Picker Section - Compact */
.date-picker-section {
  flex-shrink: 0;
  margin-bottom: 8px;
  padding: 4px;
}

/* Events Section - Flexible */
.events-section {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

/* Main Content Area */
.main-content {
  background: linear-gradient(135deg,
    rgba(var(--v-theme-background), 0.8) 0%,
    rgba(var(--v-theme-surface), 0.9) 100%);
  min-height: 100vh;
  backdrop-filter: blur(10px);
}

/* Dark Theme Support */
.v-theme--dark .navigation-drawer {
  background: linear-gradient(135deg, rgb(30 41 59 / 95%) 0%, rgb(15 23 42 / 95%) 100%);
  border-right-color: rgb(71 85 105 / 30%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}


.v-theme--dark .main-content {
  background: linear-gradient(135deg,
    rgba(18, 18, 18, 0.8) 0%,
    rgba(25, 25, 25, 0.9) 100%);
}

/* Main content styling */
.v-main {
  background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #fff8e1 100%);
  min-height: 100vh;
}

.v-theme--dark .v-main {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #2a2a2a 100%);
}

/* Responsive Design */
@media (max-width: 960px) {
  .drawer-content {
    padding: 6px !important;
  }

  .date-picker-section {
    margin-bottom: 6px;
    padding: 2px;
  }

  .events-section {
    margin-top: 2px;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .v-navigation-drawer {
    width: 320px !important;
  }
}

/* Animation for drawer */
.v-navigation-drawer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Remove scrollbar styling since we're disabling scroll */
.drawer-no-scroll :deep(.v-navigation-drawer__content) {
  overflow: hidden !important;
}
</style>
