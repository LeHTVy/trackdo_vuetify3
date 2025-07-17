<template>
  <div class="calendar-container">
    <!-- Header Section -->
    <CalendarHeader />

    <!-- Quick Stats -->
    <CalendarStats
      :this-week-events="thisWeekEvents"
      :today-events="todayEvents"
      :total-events="totalEvents"
      :upcoming-events="upcomingEvents.length"
    />

    <!-- Calendar and Events Section -->
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" md="8">
          <!-- Calendar Grid -->
          <CalendarGrid
            :calendar-days="calendarDays"
            :current-month-year="currentMonthYear"
            @add-event="showAddDialog = true"
            @next-month="nextMonth"
            @previous-month="previousMonth"
            @select-day="selectDay"
          />
        </v-col>

        <v-col cols="12" md="4">
          <!-- Events List -->
          <EventsList
            :today-events="todayEventsList"
            :upcoming-events="upcomingEvents"
            @edit-event="editEvent"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Event Dialog -->
    <EventDialog
      :editing-event="editingEvent"
      :initial-data="newEvent"
      :show-dialog="showAddDialog"
      @close="closeDialog"
      @save="saveEvent"
    />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
  import CalendarHeader from '@/components/calendar/CalendarHeader.vue'
  import CalendarStats from '@/components/calendar/CalendarStats.vue'
  import EventDialog from '@/components/calendar/EventDialog.vue'
  import EventsList from '@/components/calendar/EventsList.vue'
  import { useEventsStore } from '@/stores/events'

  const eventsStore = useEventsStore()
  const showAddDialog = ref(false)
  const editingEvent = ref(null)
  const currentDate = ref(new Date())

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

  const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric',
    })
  })

  const totalEvents = computed(() => eventsStore.totalEvents)

  const todayEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return eventsStore.events.filter(event =>
      event && event.start && event.start.split('T')[0] === today,
    ).length
  })

  const todayEventsList = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return eventsStore.events.filter(event =>
      event && event.start && event.start.split('T')[0] === today,
    )
  })

  const upcomingEvents = computed(() => {
    return eventsStore.upcomingEvents || []
  })

  const thisWeekEvents = computed(() => {
    const today = new Date()
    const currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() - today.getDay())
    currentWeekStart.setHours(0, 0, 0, 0)

    const currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6)
    currentWeekEnd.setHours(23, 59, 59, 999)

    return eventsStore.events.filter(event => {
      if (!event || !event.start) return false
      try {
        const eventDate = new Date(event.start)
        return eventDate >= currentWeekStart && eventDate <= currentWeekEnd
      } catch {
        console.warn('Invalid event date:', event)
        return false
      }
    }).length
  })

  const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1)
    // const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    const dayOfWeek = firstDay.getDay()
    startDate.setDate(firstDay.getDate() - dayOfWeek)
    const days = []
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate)
      currentDay.setDate(startDate.getDate() + i)
      const dateStr = currentDay.toISOString().split('T')[0]
      const dayEvents = eventsStore.events.filter(event => {
        if (!event || !event.start) return false
        try {
          return event.start.split('T')[0] === dateStr
        } catch {
          console.warn('Invalid event start date:', event)
          return false
        }
      })

      days.push({
        date: currentDay.getDate(),
        month: currentDay.getMonth(),
        year: currentDay.getFullYear(),
        fullDate: dateStr,
        otherMonth: currentDay.getMonth() !== month,
        isToday: dateStr === todayStr,
        events: dayEvents,
      })
    }

    return days
  })

  // Methods
  const previousMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentDate.value = newDate
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentDate.value = newDate
  }

  const selectDay = day => {
    if (day.events.length > 0) {
      console.log('Day events:', day.events)
    } else {
      const selectedDate = new Date(day.fullDate)
      newEvent.value.start = selectedDate.toISOString().slice(0, 16)
      newEvent.value.end = selectedDate.toISOString().slice(0, 16)
      showAddDialog.value = true
    }
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
.calendar-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #fff8e1 100%);
}

/* Dark theme adjustments */
.v-theme--dark .calendar-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #2a2a2a 100%);
}
</style>
