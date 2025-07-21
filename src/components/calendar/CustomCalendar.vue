<template>
  <v-card class="custom-calendar-wrapper" elevation="2">
    <v-card-text class="pa-0">
      <!-- Calendar Header -->
      <div class="calendar-header">
        <div class="header-navigation">
          <v-btn
            icon
            variant="text"
            size="small"
            @click="previousPeriod"
            class="nav-button"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          
          <div class="header-title">
            <h3 class="text-h6 font-weight-medium">{{ currentPeriodTitle }}</h3>
          </div>
          
          <v-btn
            icon
            variant="text"
            size="small"
            @click="nextPeriod"
            class="nav-button"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        
        <div class="header-controls">
          <v-btn
            variant="outlined"
            size="small"
            @click="goToToday"
            class="today-button"
          >
            Hôm nay
          </v-btn>
          
          <v-btn-toggle
            v-model="currentView"
            mandatory
            variant="outlined"
            density="compact"
            class="view-selector"
          >
            <v-btn value="day" size="small">Ngày</v-btn>
            <v-btn value="week" size="small">Tuần</v-btn>
            <v-btn value="month" size="small">Tháng</v-btn>
          </v-btn-toggle>
        </div>
      </div>
      
      <!-- Calendar Content -->
      <div class="calendar-content">
        <!-- Day View -->
        <div v-if="currentView === 'day'" class="day-view">
          <div class="time-grid">
            <div class="time-labels">
              <div
                v-for="hour in hours"
                :key="hour"
                class="time-label"
              >
                {{ formatHour(hour) }}
              </div>
            </div>
            <div class="day-column">
              <div class="day-header">
                <div class="day-date">
                  {{ formatDayHeader(selectedDate) }}
                </div>
              </div>
              <div class="day-grid">
                <div
                    v-for="hour in hours"
                    :key="hour"
                    class="hour-slot"
                    :class="{ 'drag-over': isDragOver(hour) }"
                    @click="createEvent(hour)"
                    @dragover="handleDragOver($event, hour)"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop($event, hour)"
                  >
                    <div
                      v-for="event in getEventsForHour(hour)"
                      :key="event.id"
                      class="event-item"
                      :style="getEventStyle(event)"
                      draggable="true"
                      @dragstart="handleDragStart($event, event)"
                      @dragend="handleDragEnd"
                      @click.stop="editEvent(event)"
                    >
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-time">{{ formatEventTime(event) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Week View -->
        <div v-if="currentView === 'week'" class="week-view">
          <div class="week-header">
            <div class="time-header"></div>
            <div
              v-for="day in weekDays"
              :key="day.date"
              class="day-header"
              :class="{ 'today': isToday(day.date) }"
            >
              <div class="day-name">{{ day.name }}</div>
              <div class="day-number">{{ day.number }}</div>
            </div>
          </div>
          <div class="week-grid">
            <div class="time-labels">
              <div
                v-for="hour in hours"
                :key="hour"
                class="time-label"
              >
                {{ formatHour(hour) }}
              </div>
            </div>
            <div class="week-columns">
              <div
                v-for="day in weekDays"
                :key="day.date"
                class="day-column"
              >
                <div
                    v-for="hour in hours"
                    :key="hour"
                    class="hour-slot"
                    :class="{ 'drag-over': isDragOver(hour, day.date) }"
                    @click="createEvent(hour, day.date)"
                    @dragover="handleDragOver($event, hour, day.date)"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop($event, hour, day.date)"
                  >
                    <div
                      v-for="event in getEventsForDayHour(day.date, hour)"
                      :key="event.id"
                      class="event-item"
                      :style="getEventStyle(event)"
                      draggable="true"
                      @dragstart="handleDragStart($event, event)"
                      @dragend="handleDragEnd"
                      @click.stop="editEvent(event)"
                    >
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-time">{{ formatEventTime(event) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Month View -->
        <div v-if="currentView === 'month'" class="month-view">
          <div class="month-header">
            <div
              v-for="dayName in dayNames"
              :key="dayName"
              class="month-day-header"
            >
              {{ dayName }}
            </div>
          </div>
          <div class="month-grid">
            <div
              v-for="week in monthWeeks"
              :key="week[0].date"
              class="month-week"
            >
              <div
                v-for="day in week"
                :key="day.date"
                class="month-day"
                :class="{
                  'today': isToday(day.date),
                  'other-month': !day.currentMonth,
                  'selected': isSelected(day.date),
                  'drag-over': isDragOver(0, day.date)
                }"
                @click="selectDate(day.date)"
                @dragover="handleDragOver($event, 0, day.date)"
                @dragleave="handleDragLeave"
                @drop="handleDrop($event, 0, day.date)"
              >
                <div class="day-number">{{ day.number }}</div>
                <div class="day-events">
                  <div
                    v-for="event in getEventsForDay(day.date).slice(0, 3)"
                    :key="event.id"
                    class="month-event"
                    :style="getEventStyle(event)"
                    draggable="true"
                    @dragstart="handleDragStart($event, event)"
                    @dragend="handleDragEnd"
                    @click.stop="editEvent(event)"
                  >
                    {{ event.title }}
                  </div>
                  <div
                    v-if="getEventsForDay(day.date).length > 3"
                    class="more-events"
                  >
                    +{{ getEventsForDay(day.date).length - 3 }} khác
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useDragAndDrop } from '@/composables/useDragAndDrop'

const props = defineProps({
  selectedDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  defaultView: {
    type: String,
    default: 'week',
  },
})

const emit = defineEmits(['event-click', 'date-click', 'event-create', 'event-update'])

const eventsStore = useEventsStore()
const currentView = ref(props.defaultView)
const selectedDate = ref(new Date(props.selectedDate))

// Use drag and drop composable
const {
  draggedEvent,
  dragOverSlot,
  isDragging,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragOver,
  resetDragState
} = useDragAndDrop()

// Hours for time grid (6 AM to 11 PM)
const hours = Array.from({ length: 18 }, (_, i) => i + 6)

// Day names for month view
const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// Computed properties
const currentPeriodTitle = computed(() => {
  const date = selectedDate.value
  const options = { 
    year: 'numeric', 
    month: 'long',
    day: currentView.value === 'day' ? 'numeric' : undefined
  }
  
  if (currentView.value === 'week') {
    const startOfWeek = getStartOfWeek(date)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} tháng ${startOfWeek.getMonth() + 1}, ${startOfWeek.getFullYear()}`
    } else {
      return `${startOfWeek.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}, ${startOfWeek.getFullYear()}`
    }
  }
  
  return date.toLocaleDateString('vi-VN', options)
})

const weekDays = computed(() => {
  const startOfWeek = getStartOfWeek(selectedDate.value)
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    days.push({
      date: date.toISOString().split('T')[0],
      name: dayNames[i],
      number: date.getDate()
    })
  }
  
  return days
})

const monthWeeks = computed(() => {
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = getStartOfWeek(firstDay)
  
  const weeks = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= lastDay || weeks.length < 6) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push({
        date: currentDate.toISOString().split('T')[0],
        number: currentDate.getDate(),
        currentMonth: currentDate.getMonth() === month
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(week)
    
    if (weeks.length >= 6) break
  }
  
  return weeks
})

// Methods
const getStartOfWeek = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

const isToday = (dateString) => {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

const isSelected = (dateString) => {
  return dateString === selectedDate.value.toISOString().split('T')[0]
}

const formatHour = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const formatDayHeader = (date) => {
  return date.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
}

const formatEventTime = (event) => {
  try {
    if (!event || !event.start || !event.end) return 'Thời gian không xác định'
    
    const start = new Date(event.start)
    const end = new Date(event.end)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Thời gian không hợp lệ'
    }
    
    return `${start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
  } catch (error) {
    console.warn('Error formatting event time:', event, error)
    return 'Thời gian không hợp lệ'
  }
}

// Drag and Drop functions - Updated to use composable
const handleDragStart = (event, eventData) => {
  onDragStart(event, eventData)
}

const handleDragOver = (event, hour, dateStr = null) => {
  onDragOver(event, hour, dateStr)
}

const handleDragLeave = (event) => {
  onDragLeave(event)
}

const handleDrop = async (event, hour, dateStr = null) => {
  const success = await onDrop(event, hour, dateStr, emit)
  if (success) {
    console.log('Event dropped successfully')
  }
}

const handleDragEnd = (event) => {
  onDragEnd(event)
}

const getEventStyle = (event) => {
  const style = {
    backgroundColor: event.color || 'rgb(var(--v-theme-primary))',
    borderLeft: `4px solid ${event.color || 'rgb(var(--v-theme-primary))'}`,
  }
  
  // Calculate event duration and position for multi-day events
  if (event.start && event.end) {
    try {
      const start = new Date(event.start)
      const end = new Date(event.end)
      
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const duration = (end - start) / (1000 * 60) // duration in minutes
        const startMinutes = start.getHours() * 60 + start.getMinutes()
        
        // For day/week view, calculate height based on duration
        if (currentView.value === 'day' || currentView.value === 'week') {
          const hourHeight = 60 // 60px per hour
          const height = Math.max(20, (duration / 60) * hourHeight) // minimum 20px height
          const top = ((startMinutes - 6 * 60) / 60) * hourHeight // offset from 6 AM
          
          style.height = `${height}px`
          style.top = `${Math.max(0, top)}px`
          style.position = 'absolute'
          style.width = 'calc(100% - 8px)'
          style.left = '4px'
          style.zIndex = '10'
        }
      }
    } catch (error) {
      console.warn('Error calculating event style:', error)
    }
  }
  
  return style
}

const isEventInTimeSlot = (event, dateStr, hour) => {
  if (!event || !event.start) return false
  
  try {
    const eventStart = new Date(event.start)
    const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 60 * 60 * 1000) // default 1 hour
    
    if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) return false
    
    const slotStart = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:00:00`)
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000) // 1 hour slot
    
    // Check if event overlaps with this time slot
    return eventStart < slotEnd && eventEnd > slotStart
  } catch (error) {
    console.warn('Error checking event in time slot:', error)
    return false
  }
}

const getEventsForHour = (hour) => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return eventsStore.events.filter(event => isEventInTimeSlot(event, dateStr, hour))
}

const getEventsForDayHour = (dateStr, hour) => {
  return eventsStore.events.filter(event => isEventInTimeSlot(event, dateStr, hour))
}

const getEventsForDay = (dateStr) => {
  return eventsStore.events.filter(event => {
    if (!event || !event.start) return false
    try {
      const eventStart = new Date(event.start)
      const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 24 * 60 * 60 * 1000)
      
      if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) return false
      
      const dayStart = new Date(`${dateStr}T00:00:00`)
      const dayEnd = new Date(`${dateStr}T23:59:59`)
      
      // Check if event overlaps with this day
      return eventStart <= dayEnd && eventEnd >= dayStart
    } catch (error) {
      console.warn('Invalid event date:', event.start, error)
      return false
    }
  })
}

// Navigation and event handling
const previousPeriod = () => {
  const newDate = new Date(selectedDate.value)
  
  switch (currentView.value) {
    case 'day':
      newDate.setDate(newDate.getDate() - 1)
      break
    case 'week':
      newDate.setDate(newDate.getDate() - 7)
      break
    case 'month':
      newDate.setMonth(newDate.getMonth() - 1)
      break
  }
  
  selectedDate.value = newDate
}

const nextPeriod = () => {
  const newDate = new Date(selectedDate.value)
  
  switch (currentView.value) {
    case 'day':
      newDate.setDate(newDate.getDate() + 1)
      break
    case 'week':
      newDate.setDate(newDate.getDate() + 7)
      break
    case 'month':
      newDate.setMonth(newDate.getMonth() + 1)
      break
  }
  
  selectedDate.value = newDate
}

const goToToday = () => {
  selectedDate.value = new Date()
}

const selectDate = (dateStr) => {
  selectedDate.value = new Date(dateStr)
  emit('date-click', dateStr)
}

const createEvent = (hour, dateStr = null) => {
  const date = dateStr || selectedDate.value.toISOString().split('T')[0]
  const startTime = `${date}T${hour.toString().padStart(2, '0')}:00:00`
  emit('event-create', { start: startTime })
}

const editEvent = (event) => {
  emit('event-click', event)
}

// Initialize events on mount
onMounted(async () => {
  try {
    if (typeof eventsStore.fetchEvents === 'function') {
      await eventsStore.fetchEvents()
    }
  } catch (error) {
    console.error('Error fetching events in Custom Calendar:', error)
  }
})

// Watch for prop changes
watch(() => props.selectedDate, (newDate) => {
  selectedDate.value = new Date(newDate)
})

watch(() => props.defaultView, (newView) => {
  currentView.value = newView
})
</script>

<style scoped>
.custom-calendar-wrapper {
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, rgb(var(--v-theme-surface) / 95%) 0%, rgb(var(--v-theme-background) / 95%) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgb(var(--v-theme-surface) / 20);
  box-shadow: 0 8px 32px rgb(var(--v-theme-primary) / 8%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Calendar Header */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 20%);
}

.header-navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-button {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.header-title {
  min-width: 200px;
  text-align: center;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.today-button {
  color: rgb(var(--v-theme-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

.view-selector {
  border: 1px solid rgb(var(--v-theme-outline) / 30%) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

/* Calendar Content */
.calendar-content {
  height: 600px;
  overflow: auto;
  background: rgb(var(--v-theme-surface));
  position: relative;
}

/* Enhanced Grid Pattern */
.calendar-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(to right, rgb(var(--v-theme-outline) / 15%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--v-theme-outline) / 15%) 1px, transparent 1px);
  background-size: 60px 60px; /* Match hour slot size */
  pointer-events: none;
  z-index: 1;
}

/* Additional fine grid */
.calendar-content::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(to right, rgb(var(--v-theme-outline) / 8%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--v-theme-outline) / 8%) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 1;
}

/* Day View */
.day-view {
  height: 100%;
}

.time-grid {
  display: flex;
  height: 100%;
}

.time-labels {
  width: 80px;
  border-right: 1px solid rgb(var(--v-theme-outline) / 20%);
  background: rgb(var(--v-theme-surface));
}

.time-label {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface) / 70%);
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 10%);
}

.day-column {
  flex: 1;
}

.day-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 20%);
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.day-grid {
  height: calc(100% - 60px);
}

.hour-slot {
  height: 60px;
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 30%);
  border-right: 1px solid rgb(var(--v-theme-outline) / 25%);
  border-top: 1px solid rgb(var(--v-theme-outline) / 20%);
  border-left: 1px solid rgb(var(--v-theme-outline) / 20%);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgb(var(--v-theme-surface));
  z-index: 2;
  box-shadow: inset 0 0 0 1px rgb(var(--v-theme-outline) / 10%);
}

.hour-slot:hover {
  background: rgb(var(--v-theme-primary) / 8%);
}

.hour-slot.drag-over {
  background: rgb(var(--v-theme-primary) / 15%) !important;
  border: 2px dashed rgb(var(--v-theme-primary)) !important;
  transform: scale(1.02);
}

/* Week View */
.week-view {
  height: 100%;
}

.week-header {
  display: flex;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 20%);
}

.time-header {
  width: 80px;
  height: 60px;
  border-right: 1px solid rgb(var(--v-theme-outline) / 20%);
}

.day-header {
  flex: 1;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgb(var(--v-theme-outline) / 10%);
  color: rgb(var(--v-theme-on-surface));
}

.day-header.today {
  background: rgb(var(--v-theme-primary) / 10%);
  color: rgb(var(--v-theme-primary));
}

.day-name {
  font-size: 12px;
  font-weight: 500;
}

.day-number {
  font-size: 18px;
  font-weight: 600;
  margin-top: 2px;
}

.week-grid {
  display: flex;
  height: calc(100% - 60px);
}

.week-columns {
  display: flex;
  flex: 1;
}

.day-column {
  flex: 1;
  border-right: 1px solid rgb(var(--v-theme-outline) / 10%);
}

/* Month View */
.month-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.month-header {
  display: flex;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 20%);
}

.month-day-header {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
  border-right: 1px solid rgb(var(--v-theme-outline) / 10%);
}

.month-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.month-week {
  display: flex;
  flex: 1;
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 10%);
}

.month-day {
  flex: 1;
  border-right: 1px solid rgb(var(--v-theme-outline) / 40%);
  border-bottom: 1px solid rgb(var(--v-theme-outline) / 40%);
  border-top: 1px solid rgb(var(--v-theme-outline) / 30%);
  border-left: 1px solid rgb(var(--v-theme-outline) / 30%);
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 100px;
  background: rgb(var(--v-theme-surface));
  position: relative;
  box-shadow: inset 0 0 0 1px rgb(var(--v-theme-outline) / 15%);
}

.month-day.drag-over {
  background: rgb(var(--v-theme-primary) / 15%) !important;
  border: 2px dashed rgb(var(--v-theme-primary)) !important;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgb(var(--v-theme-primary) / 30%);
}

.month-day:hover {
  background: rgb(var(--v-theme-primary) / 8%);
  transform: scale(1.01);
}

.month-day.today {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 15%) 0%, rgb(var(--v-theme-primary) / 8%) 100%);
  border: 2px solid rgb(var(--v-theme-primary) / 30%);
}

.month-day.today .day-number {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  font-size: 16px;
}

.month-day.other-month {
  opacity: 0.4;
  background: rgb(var(--v-theme-surface) / 50%);
}

.month-day.selected {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary) / 20%) 0%, rgb(var(--v-theme-primary) / 10%) 100%);
  border: 2px solid rgb(var(--v-theme-primary));
  transform: scale(1.02);
}

.day-number {
  font-weight: 500;
  margin-bottom: 4px;
  color: rgb(var(--v-theme-on-surface));
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.month-event {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: white;
  cursor: grab;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s ease;
  margin-bottom: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.month-event:hover {
  opacity: 0.9;
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.month-event:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.more-events {
  font-size: 10px;
  color: rgb(var(--v-theme-on-surface) / 70%);
  padding: 2px 6px;
}

/* Event Items */
.event-item {
  position: absolute;
  left: 4px;
  right: 4px;
  background: rgb(var(--v-theme-primary));
  color: white;
  border-radius: 6px;
  padding: 6px 10px;
  margin: 2px 0;
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.event-item:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 15;
}

.event-item:active,
.event-item[draggable="true"]:active {
  cursor: grabbing;
  transform: rotate(2deg) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.event-item.dragging {
  opacity: 0.7;
  transform: rotate(5deg) scale(1.1);
}

.event-title {
  font-weight: 500;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-time {
  font-size: 10px;
  opacity: 0.9;
  margin-top: 2px;
}

/* Dark Theme */
.v-theme--dark .custom-calendar-wrapper {
  background: linear-gradient(135deg, rgb(var(--v-theme-surface) / 95%) 0%, rgb(var(--v-theme-background) / 95%) 100%);
  border-color: rgb(var(--v-theme-primary) / 30%);
  box-shadow: 0 8px 32px rgb(var(--v-theme-primary) / 20%);
}

.v-theme--dark .calendar-header {
  background: rgb(var(--v-theme-surface));
  border-color: rgb(var(--v-theme-outline) / 30%);
}

.v-theme--dark .calendar-content {
  background: rgb(var(--v-theme-surface));
}

.v-theme--dark .time-labels {
  background: rgb(var(--v-theme-surface));
  border-color: rgb(var(--v-theme-outline) / 30%);
}

.v-theme--dark .time-label {
  color: rgb(var(--v-theme-on-surface) / 70%);
  border-color: rgb(var(--v-theme-outline) / 20%);
}

.v-theme--dark .day-header {
  background: rgb(var(--v-theme-surface));
  border-color: rgb(var(--v-theme-outline) / 30%);
  color: rgb(var(--v-theme-on-surface));
}

.v-theme--dark .hour-slot {
  border-color: rgb(var(--v-theme-outline) / 20%);
}

.v-theme--dark .hour-slot:hover {
  background: rgb(var(--v-theme-primary) / 10%);
}

.v-theme--dark .month-day {
  color: rgb(var(--v-theme-on-surface));
}

.v-theme--dark .month-day:hover {
  background: rgb(var(--v-theme-primary) / 10%);
}

.v-theme--dark .month-day.today {
  background: rgb(var(--v-theme-primary) / 15%);
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .header-navigation {
    order: 2;
  }
  
  .header-controls {
    order: 1;
    justify-content: center;
  }
  
  .calendar-content {
    height: 500px;
  }
  
  .time-labels {
    width: 60px;
  }
  
  .time-label {
    font-size: 10px;
  }
  
  .day-number {
    font-size: 16px;
  }
  
  .month-day {
    min-height: 80px;
    padding: 4px;
  }
}
</style>