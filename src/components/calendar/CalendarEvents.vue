<template>
  <div class="calendar-container">
    <!-- Header Section -->
    <v-card class="calendar-header mb-6" elevation="4">
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="text-h4 font-weight-bold text-primary mb-2">
              <v-icon class="mr-3" color="secondary" size="32">mdi-calendar-month</v-icon>
              Event <span class="text-secondary">Calendar</span>
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              Manage your schedule and stay organized
            </p>
          </v-col>
          <v-col class="text-md-right" cols="12" md="6">
            <div class="calendar-controls">
              <v-btn-toggle
                v-model="viewMode"
                class="mr-4 mb-2"
                color="primary"
                divided
                variant="outlined"
              >
                <v-btn size="small" value="month">
                  <v-icon>mdi-calendar-month</v-icon>
                  Month
                </v-btn>
                <v-btn size="small" value="week">
                  <v-icon>mdi-calendar-week</v-icon>
                  Week
                </v-btn>
              </v-btn-toggle>

              <v-btn
                class="add-event-btn"
                color="secondary"
                prepend-icon="mdi-plus"
                variant="elevated"
                @click="openEventDialog()"
              >
                Add Event
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row>

      <!-- Calendar Component -->
      <v-card class="calendar-card" elevation="4">
        <v-card-text class="pa-0">
          <v-calendar
            ref="calendar"
            v-model="selectedDate"
            :attributes="calendarAttributes"
            class="custom-calendar"
            :max-date="new Date(2025, 11, 31)"
            :min-date="new Date(2024, 0, 1)"
            :view="viewMode"
            @dayclick="onDayClick"
            @update:pages="onPageChange"
          >
            <template #day-content="{ day }">
              <div class="day-content">
                <span class="day-number">{{ day.day }}</span>
                <div v-if="getDayEvents(day).length > 0" class="event-indicators">
                  <div
                    v-for="event in getDayEvents(day).slice(0, 3)"
                    :key="event.id"
                    class="event-dot"
                    :style="{ backgroundColor: event.color }"
                    @click.stop="openEventDetails(event)"
                  />
                  <div
                    v-if="getDayEvents(day).length > 3"
                    class="event-more"
                  >
                    +{{ getDayEvents(day).length - 3 }}
                  </div>
                </div>
              </div>
            </template>
          </v-calendar>
        </v-card-text>
      </v-card>

      <!-- Event List -->
      <v-card class="mt-6" elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
          Upcoming Events
        </v-card-title>
        <v-card-text>
          <v-list v-if="upcomingEvents.length > 0">
            <v-list-item
              v-for="event in upcomingEvents"
              :key="event.id"
              class="event-item"
              @click="openEventDetails(event)"
            >
              <template #prepend>
                <v-avatar
                  class="mr-3"
                  :color="event.color"
                  size="12"
                />
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ event.title }}
              </v-list-item-title>

              <v-list-item-subtitle>
                <v-icon class="mr-1" size="16">mdi-clock-outline</v-icon>
                {{ formatEventTime(event) }}
              </v-list-item-subtitle>

              <template #append>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click.stop="editEvent(event)"
                />
                <v-btn
                  color="error"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click.stop="deleteEvent(event.id)"
                />
              </template>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-8">
            <v-icon color="grey-lighten-1" size="64">mdi-calendar-blank</v-icon>
            <p class="text-h6 text-medium-emphasis mt-4">No upcoming events</p>
            <p class="text-body-2 text-disabled">Click "Add Event" to create your first event</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Add/Edit Event Dialog -->
      <v-dialog v-model="showEventDialog" max-width="600">
        <v-card>
          <v-card-title class="text-h5">
            {{ editingEvent ? 'Edit Event' : 'Add New Event' }}
          </v-card-title>

          <v-card-text>
            <v-form ref="eventForm" v-model="formValid">
              <v-text-field
                v-model="eventForm.title"
                class="mb-4"
                label="Event Title"
                prepend-icon="mdi-format-title"
                :rules="[v => !!v || 'Title is required']"
                variant="outlined"
              />

              <v-textarea
                v-model="eventForm.description"
                class="mb-4"
                label="Description"
                prepend-icon="mdi-text"
                rows="3"
                variant="outlined"
              />

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="eventForm.date"
                    label="Date"
                    prepend-icon="mdi-calendar"
                    :rules="[v => !!v || 'Date is required']"
                    type="date"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="eventForm.time"
                    label="Time"
                    prepend-icon="mdi-clock"
                    type="time"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-select
                v-model="eventForm.color"
                class="mb-4"
                :items="colorOptions"
                label="Color"
                prepend-icon="mdi-palette"
                variant="outlined"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-avatar class="mr-3" :color="item.value" size="20" />
                    </template>
                  </v-list-item>
                </template>

                <template #selection="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar class="mr-3" :color="item.value" size="20" />
                    {{ item.title }}
                  </div>
                </template>
              </v-select>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="closeEventDialog"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!formValid"
              variant="elevated"
              @click="saveEvent"
            >
              {{ editingEvent ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Event Details Dialog -->
      <v-dialog v-model="showDetailsDialog" max-width="500">
        <v-card v-if="selectedEvent">
          <v-card-title class="d-flex align-center">
            <v-avatar class="mr-3" :color="selectedEvent.color" size="24" />
            {{ selectedEvent.title }}
          </v-card-title>

          <v-card-text>
            <div class="mb-3">
              <v-icon class="mr-2">mdi-calendar</v-icon>
              {{ formatDate(selectedEvent.date) }}
            </div>

            <div v-if="selectedEvent.time" class="mb-3">
              <v-icon class="mr-2">mdi-clock</v-icon>
              {{ selectedEvent.time }}
            </div>

            <div v-if="selectedEvent.description">
              <v-icon class="mr-2">mdi-text</v-icon>
              {{ selectedEvent.description }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="showDetailsDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              @click="editEventFromDetails"
            >
              Edit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row></div>
</template>

<script setup>
  import { Calendar as VCalendar } from 'v-calendar'
  import { computed, onMounted, ref } from 'vue'
  import { useEventsStore } from '@/stores/events'
  import 'v-calendar/style.css'

  const selectedDate = ref(new Date())
  const viewMode = ref('month')
  const showEventDialog = ref(false)
  const showDetailsDialog = ref(false)
  const formValid = ref(false)
  const editingEvent = ref(null)
  const selectedEvent = ref(null)
  const calendar = ref(null)

  // Use events store instead of local data
  const eventsStore = useEventsStore()
  const events = computed(() => eventsStore.events)

  // Form data
  const eventForm = ref({
    title: '',
    description: '',
    date: '',
    time: '',
    color: '#2196F3',
  })

  // Color options
  const colorOptions = [
    { title: 'Blue', value: '#2196F3' },
    { title: 'Green', value: '#4CAF50' },
    { title: 'Red', value: '#F44336' },
    { title: 'Orange', value: '#FF9800' },
    { title: 'Purple', value: '#9C27B0' },
    { title: 'Teal', value: '#009688' },
    { title: 'Pink', value: '#E91E63' },
    { title: 'Indigo', value: '#3F51B5' },
  ]

  const createLocalDate = dateStr => {
    if (!dateStr || typeof dateStr !== 'string') {
      console.warn('Invalid dateStr provided to createLocalDate:', dateStr)
      return new Date()
    }

    try {
      const [year, month, day] = dateStr.split('-').map(Number)
      if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
        console.warn('Invalid date format in createLocalDate:', dateStr)
        return new Date() // Return current date as fallback
      }
      return new Date(year, month - 1, day) // month is 0-indexed
    } catch (error) {
      console.error('Error parsing date in createLocalDate:', dateStr, error)
      return new Date() // Return current date as fallback
    }
  }

  // Helper function to format day object to date string consistently
  const formatDayToDateString = day => {
    let year, month, dayNum

    if (day.date) {
      // v-calendar sometimes passes a Date object
      year = day.date.getFullYear()
      month = day.date.getMonth() + 1
      dayNum = day.date.getDate()
    } else {
      // v-calendar sometimes passes separate properties
      year = day.year
      month = day.month
      dayNum = day.day
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
  }

  // Computed properties
  const calendarAttributes = computed(() => {
    return events.value
      .filter(event => {
        // Only include events with valid dates
        if (!event || !event.date) {
          console.warn('Event missing date property:', event)
          return false
        }
        return true
      })
      .map(event => {
        try {
          return {
            key: event.id,
            dates: createLocalDate(event.date),
            dot: {
              color: event.color || '#2196F3',
              class: 'custom-dot',
            },
          }
        } catch (error) {
          console.error('Error creating calendar attribute for event:', event, error)
          return null
        }
      })
      .filter(attr => attr !== null) // Remove any failed mappings
  })

  const upcomingEvents = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    return events.value
      .filter(event => {
        // Check if event and event.date exist
        if (!event || !event.date) {
          console.warn('Event missing date property:', event)
          return false
        }

        try {
          const eventDate = createLocalDate(event.date)
          eventDate.setHours(0, 0, 0, 0)
          return eventDate >= today
        } catch (error) {
          console.error('Error processing event date:', event.date, error)
          return false
        }
      })
      .sort((a, b) => {
        try {
          return createLocalDate(a.date) - createLocalDate(b.date)
        } catch (error) {
          console.error('Error sorting events:', error)
          return 0
        }
      })
      .slice(0, 5)
  })

  // Methods
  const getDayEvents = day => {
    const dayStr = formatDayToDateString(day)
    return events.value.filter(event => event.date === dayStr)
  }

  const onDayClick = day => {
    console.log('Day clicked:', day) // Debug log

    const dayStr = formatDayToDateString(day)
    console.log('Generated date string:', dayStr) // Debug log

    const dayEvents = events.value.filter(event => event.date === dayStr)

    if (dayEvents.length === 1) {
      openEventDetails(dayEvents[0])
    } else if (dayEvents.length > 1) {
      // Show events list for that day
      console.log('Multiple events on this day:', dayEvents)
    } else {
      // Create new event for this day
      openEventDialog(dayStr)
    }
  }

  const onPageChange = pages => {
    console.log('Page changed:', pages)
  }

  const openEventDetails = event => {
    selectedEvent.value = event
    showDetailsDialog.value = true
  }

  const openEventDialog = (date = null) => {
    editingEvent.value = null
    eventForm.value = {
      title: '',
      description: '',
      date: date || eventForm.value.date,
      time: '',
      color: '#2196F3',
    }
    showEventDialog.value = true
  }

  const editEvent = event => {
    editingEvent.value = event
    eventForm.value = { ...event }
    showEventDialog.value = true
  }

  const editEventFromDetails = () => {
    showDetailsDialog.value = false
    editEvent(selectedEvent.value)
  }

  const deleteEvent = async eventId => {
    if (confirm('Are you sure you want to delete this event?')) {
      await eventsStore.deleteEvent(eventId)
    }
  }

  const saveEvent = async () => {
    await (editingEvent.value
      ? eventsStore.updateEvent(editingEvent.value.id, eventForm.value)
      : eventsStore.addEvent(eventForm.value))

    closeEventDialog()
  }

  const closeEventDialog = () => {
    showEventDialog.value = false
    editingEvent.value = null
    eventForm.value = {
      title: '',
      description: '',
      date: '',
      time: '',
      color: '#2196F3',
    }
  }

  const formatEventTime = event => {
    if (!event || !event.date) {
      return 'Invalid date'
    }

    try {
      const date = createLocalDate(event.date)
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })

      if (event.time) {
        return `${dateStr} at ${event.time}`
      }
      return dateStr
    } catch (error) {
      console.error('Error formatting event time:', event, error)
      return 'Invalid date'
    }
  }

  const formatDate = dateStr => {
    if (!dateStr) {
      return 'Invalid date'
    }

    try {
      const date = createLocalDate(dateStr)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date:', dateStr, error)
      return 'Invalid date'
    }
  }

  onMounted(async () => {
    // Initialize with today's date using local timezone
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`
    eventForm.value.date = todayStr

    // Fetch events from MongoDB
    await eventsStore.fetchEvents()
  })
</script>

<style scoped>
.calendar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.calendar-header {
  text-align: center;
  margin-bottom: 32px;
}

.calendar-card {
  border-radius: 16px;
  overflow: hidden;
}

.custom-calendar {
  width: 100%;
  border: none;
  font-family: 'Roboto', sans-serif;
}

.day-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
}

.day-number {
  font-weight: 500;
  margin-bottom: 2px;
}

.event-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  align-items: center;
  min-height: 16px;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.event-dot:hover {
  transform: scale(1.3);
}

.event-more {
  font-size: 10px;
  color: #666;
  font-weight: bold;
}

.event-item {
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}

.event-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Custom calendar styling */
:deep(.vc-container) {
  border: none;
  border-radius: 16px;
}

:deep(.vc-header) {
  background-color: #232E3E;
  color: white;
  padding: 16px;
  border-radius: 16px 16px 0 0;
}

:deep(.vc-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

:deep(.vc-arrow) {
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

:deep(.vc-arrow:hover) {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

:deep(.vc-weeks) {
  padding: 16px;
}

:deep(.vc-weekday) {
  color: #232E3E;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 8px 0;
}

:deep(.vc-day) {
  min-height: 60px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

:deep(.vc-day:hover) {
  background-color: rgba(35, 46, 62, 0.05);
  transform: scale(1.02);
}

:deep(.vc-day.is-today) {
  background-color: rgba(35, 46, 62, 0.1);
  border-color: #232E3E;
}

:deep(.vc-day.is-today .day-number) {
  color: #232E3E;
  font-weight: 700;
}

:deep(.vc-day-content) {
  padding: 4px;
  height: 100%;
}

/* Dark theme support */n.theme--dark .calendar-container {
  color: white;
}

.theme--dark :deep(.vc-day) {
  border-color: #424242;
}

.theme--dark :deep(.vc-day:hover) {
  background-color: rgba(255, 255, 255, 0.05);
}

.theme--dark :deep(.vc-weekday) {
  color: #E0E0E0;
}

/* Responsive design */
@media (max-width: 768px) {
  .calendar-container {
    padding: 16px;
  }

  :deep(.vc-day) {
    min-height: 50px;
  }

  .day-content {
    padding: 2px;
  }

  .event-dot {
    width: 4px;
    height: 4px;
  }
}
</style>
