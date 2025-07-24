<template>
  <v-sheet class="calendar-main" color="surface">
    <!-- Header Controls -->
    <v-sheet
      class="calendar-header d-flex align-center pa-4"
      color="surface"
      elevation="1"
    >
      <!-- Weather Display -->
      <div class="weather-display d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-weather-partly-cloudy</v-icon>
        <div v-if="weatherLoading" class="d-flex align-center">
          <v-progress-circular size="20" width="2" indeterminate color="primary" class="mr-2" />
          <span class="text-body-2">Loading weather...</span>
        </div>
        <div v-else-if="weatherData" class="weather-info">
          <div class="text-h6 font-weight-bold">{{ weatherData.temperature }}°C</div>
        </div>
        <div v-else class="text-body-2 text-error">
          Weather unavailable
        </div>
      </div>

      <v-spacer />

      <!-- Navigation Controls -->
      <div class="navigation-controls d-flex align-center">
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-calendar-today"
          @click="goToToday"
          class="mr-2"
        >
          Today
        </v-btn>

        <v-btn-group variant="outlined" density="compact">
          <v-btn
            icon="mdi-chevron-left"
            @click="navigatePrev"
            :disabled="loading"
          />
          <v-btn
            icon="mdi-chevron-right"
            @click="navigateNext"
            :disabled="loading"
          />
        </v-btn-group>
      </div>
    </v-sheet>

    <!-- Calendar Content -->
    <v-sheet class="calendar-content" color="background">
      <div class="custom-calendar">
        <!-- Calendar Header with Month/Year -->
        <div class="calendar-month-header">
          <h3 class="month-title">{{ formatMonthYear(currentValue) }}</h3>
        </div>

        <!-- Weekday Headers -->
        <div class="weekday-headers">
          <div
            v-for="day in weekdayLabels"
            :key="day"
            class="weekday-header"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <div
            v-for="day in calendarDays"
            :key="`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`"
            class="calendar-day"
            :class="{
              'is-today': isToday(day.date),
              'is-other-month': !day.isCurrentMonth,
              'has-events': getDayEvents(day.date).length > 0,
              'drag-over': dragState.isDragging
            }"
            :data-date="day.date.toISOString()"
            @click="onDateClick(day)"
            @drop="onDrop($event, day.date)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div class="day-content">
              <div class="day-number">{{ day.date.getDate() }}</div>
              <div v-if="getDayEvents(day.date).length > 0" class="day-events">
                <div
                  v-for="event in getDayEvents(day.date).slice(0, 3)"
                  :key="`${event.id}-${day.date.getTime()}`"
                  class="event-item"
                  :class="{
                    'multi-day-event': event.isMultiDay,
                    'event-start': event.isFirstDay,
                    'event-end': event.isLastDay,
                    'event-continuation': event.isContinuation,
                    'dragging': dragState.isDragging && dragState.draggedEvent?.id === event.id
                  }"
                  :style="{ backgroundColor: event.color || '#1976d2' }"
                  :draggable="!event.isContinuation"
                  @click.stop="onEventClick({ event })"
                  @dragstart="onEventDragStart($event, event)"
                  @dragend="onEventDragEnd"
                >
                  <!-- Resize handle for start date (only on first day) -->
                  <div
                    v-if="event.isFirstDay && event.isMultiDay"
                    class="resize-handle resize-start"
                    @mousedown.stop="onResizeStart($event, event, 'start')"
                    title="Kéo để thay đổi ngày bắt đầu"
                  ></div>
                  
                  <span v-if="!event.isContinuation" class="event-dot"></span>
                  <span class="event-text">
                    {{ event.isContinuation ? '' : (event.name || event.title) }}
                  </span>
                  
                  <!-- Resize handle for end date (only on last day) -->
                  <div
                    v-if="event.isLastDay && event.isMultiDay"
                    class="resize-handle resize-end"
                    @mousedown.stop="onResizeStart($event, event, 'end')"
                    title="Kéo để thay đổi ngày kết thúc"
                  ></div>
                </div>
                <div
                  v-if="getDayEvents(day.date).length > 3"
                  class="more-events"
                  @click.stop="onShowMore($event, { date: day.date, events: getDayEvents(day.date) })"
                >
                  +{{ getDayEvents(day.date).length - 3 }} more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDialogManager } from '@/composables/useDialogManager'
import { useEventFilters } from '@/composables/useEventFilters'
import { useCalendarUtils } from '@/composables/useCalendarUtils'
import { useCalendarEvents } from '@/composables/useCalendarEvents'
import { useEventDragDrop } from '@/composables/useEventDragDrop'

// Props
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  defaultView: {
    type: String,
    default: 'monthly'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'date-selected',
  'event-clicked',
  'range-changed',
  'edit-event',
  'view-changed',
  'show-more-events',
  'event-updated'
])

// Refs
const calendarRef = ref(null)
const currentValue = ref(new Date())
const currentView = ref(props.defaultView)
const currentWeekdays = ref([0, 1, 2, 3, 4, 5, 6])

// Weather data
const weatherData = ref(null)
const weatherLoading = ref(false)

// Weather API function
const fetchWeatherData = async () => {
  weatherLoading.value = true
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-25.85891&longitude=28.18577&current=temperature_2m')
    const data = await response.json()

    if (data.current && data.current.temperature_2m !== undefined) {
      weatherData.value = {
        temperature: data.current.temperature_2m,
        time: data.current.time
      }
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    weatherData.value = null
  } finally {
    weatherLoading.value = false
  }
}

// Composables
const dialogManager = useDialogManager()
const { formattedEvents } = useEventFilters(computed(() => props.events))
const { formatDateTime } = useCalendarUtils()
const { handleEventClick, handleDateClick, handleShowMore, handleRangeChange, editEvent } = useCalendarEvents()
const { dragState, startEventDrag, startResize, handleDrop, handleDragEnd } = useEventDragDrop()

// Weekday labels (Monday first)
const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Computed properties
const calendarDays = computed(() => {
  const year = currentValue.value.getFullYear()
  const month = currentValue.value.getMonth()

  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)

  // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
  // Convert to Monday = 0 format
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7

  const days = []

  // Add days from previous month to fill the first week
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date,
      isCurrentMonth: false
    })
  }

  // Add all days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    days.push({
      date,
      isCurrentMonth: true
    })
  }

  // Add days from next month to fill the last week
  const remainingDays = 42 - days.length // 6 weeks * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      date,
      isCurrentMonth: false
    })
  }

  return days
})

// Helper method to get events for a specific day
const getDayEvents = (date) => {
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  return formattedEvents.value.filter(event => {
    const eventStartDate = new Date(event.start)
    eventStartDate.setHours(0, 0, 0, 0)

    const eventEndDate = new Date(event.end || event.start)
    eventEndDate.setHours(0, 0, 0, 0)

    // Event hiển thị trên tất cả ngày từ start đến end
    return targetDate.getTime() >= eventStartDate.getTime() &&
           targetDate.getTime() <= eventEndDate.getTime()
  }).map(event => {
    // Thêm thông tin về vị trí của event trong khoảng thời gian
    const eventStartDate = new Date(event.start)
    eventStartDate.setHours(0, 0, 0, 0)

    const eventEndDate = new Date(event.end || event.start)
    eventEndDate.setHours(0, 0, 0, 0)

    const isFirstDay = targetDate.getTime() === eventStartDate.getTime()
    const isLastDay = targetDate.getTime() === eventEndDate.getTime()
    const isMultiDay = eventStartDate.getTime() !== eventEndDate.getTime()

    return {
      ...event,
      isFirstDay,
      isLastDay,
      isMultiDay,
      isContinuation: !isFirstDay && isMultiDay
    }
  })
}

// Helper method to check if date is today
const isToday = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return today.getTime() === checkDate.getTime()
}

// Helper method to format month and year
const formatMonthYear = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

// Methods
const onEventClick = (eventData) => {
  handleEventClick(eventData, emit, dialogManager)
}

const onDateClick = (day) => {
  const dateData = { date: day.date }
  handleDateClick(dateData, emit)
}

const onShowMore = (nativeEvent, moreData) => {
  handleShowMore({ nativeEvent, ...moreData }, emit)
}

const onRangeChange = (pages) => {
  const rangeData = {
    start: pages[0]?.range?.start,
    end: pages[0]?.range?.end
  }
  handleRangeChange(rangeData, emit)
}

const navigatePrev = () => {
  const currentDate = new Date(currentValue.value)
  if (currentView.value === 'monthly') {
    currentDate.setMonth(currentDate.getMonth() - 1)
  } else if (currentView.value === 'weekly') {
    currentDate.setDate(currentDate.getDate() - 7)
  }
  currentValue.value = currentDate
}

const navigateNext = () => {
  const currentDate = new Date(currentValue.value)
  if (currentView.value === 'monthly') {
    currentDate.setMonth(currentDate.getMonth() + 1)
  } else if (currentView.value === 'weekly') {
    currentDate.setDate(currentDate.getDate() + 7)
  }
  currentValue.value = currentDate
}

const goToToday = () => {
  currentValue.value = new Date()
}

const onEditEvent = () => {
  editEvent(dialogManager.selectedEvent.value, emit, dialogManager)
}

// Drag and Drop Methods
const onEventDragStart = (nativeEvent, event) => {
  startEventDrag(event, 'move', nativeEvent)
}

const onEventDragEnd = () => {
  handleDragEnd()
}

const onDrop = async (nativeEvent, dropDate) => {
  const updatedEvent = handleDrop(nativeEvent)
  if (updatedEvent) {
    emit('event-updated', updatedEvent)
  }
}

const onResizeStart = (nativeEvent, event, direction) => {
  nativeEvent.preventDefault()
  startResize(event, direction, nativeEvent)
}

// Watchers
watch(currentView, (newView) => {
  emit('view-changed', newView)
})

// Lifecycle
onMounted(() => {
  fetchWeatherData()
  // Refresh weather data every 10 minutes
  setInterval(fetchWeatherData, 10 * 60 * 1000)
})

</script>

<style scoped>
.calendar-main {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.calendar-header {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  min-height: 80px;
  flex-shrink: 0;
}

.weather-display {
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.view-selector,
.weekday-selector {
  max-width: 200px;
}

.navigation-controls {
  gap: 8px;
}

.calendar-content {
  flex: 1;
  padding: 16px;
  min-height: 0;
}

.custom-calendar {
  min-height: 720px;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  overflow: visible;
}

.calendar-month-header {
  padding: 16px 20px;
  background: rgb(var(--v-theme-navbar-bg));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  flex-shrink: 0;
}

.month-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.weekday-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: rgba(var(--v-theme-primary), 0.1);
  flex-shrink: 0;
}

.weekday-header {
  padding: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: rgb(var(--v-theme-primary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-right: 1px solid rgba(var(--v-border-color), 0.12);
}

.weekday-header:last-child {
  border-right: none;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
  min-height: 600px;
}

.calendar-day {
  border-right: 1px solid rgba(var(--v-border-color), 0.12);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  min-height: 100px;
  background: rgb(var(--v-theme-surface));
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day:hover {
  background: rgb(var(--v-theme-card-hover));
}

.calendar-day.is-today {
  background: rgba(var(--v-theme-primary), 0.1);
  border: 2px solid rgb(var(--v-theme-primary));
}

.calendar-day.is-other-month {
  background: rgba(var(--v-theme-progress-bg), 0.5);
}

.calendar-day.is-other-month .day-number {
  color: rgba(var(--v-theme-on-surface), 0.4);
}

.day-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.day-number {
  font-weight: 600;
  font-size: 16px;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 24px;
}

.calendar-day.is-today .day-number {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.day-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.event-item {
  background: rgb(var(--v-theme-primary));
  color: white !important;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  position: relative;
}

/* Multi-day event styling */
.event-item.multi-day-event {
  border-radius: 0;
  margin-left: -9px;
  margin-right: -9px;
  padding-left: 12px;
  padding-right: 12px;
  position: relative;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.event-item.event-start {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: 0;
  padding-left: 8px;
}

.event-item.event-end {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-right: 0;
  padding-right: 8px;
}

/* multi-day events */
.event-item.multi-day-event:not(.event-start):not(.event-end) {
  margin-left: -9px;
  margin-right: -9px;
}

.event-item.multi-day-event:not(.event-end) {
  margin-right: -9px;
}

.event-item.multi-day-event:not(.event-start) {
  margin-left: -9px;
}

.event-item.event-continuation {
  opacity: 0.8;
  min-height: 20px;
  justify-content: center;
}

.event-item.event-continuation::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: rgb(var(--v-theme-primary));
  border-radius: 50%;
  opacity: 0.6;
}

.event-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  opacity: 0.8;
  flex-shrink: 0;
}

.event-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
  opacity: 0.9;
}

.more-events {
  background: rgb(var(--v-theme-progress-bg));
  color: rgb(var(--v-theme-on-surface));
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(var(--v-border-color), 0.3);
  margin-top: 2px;
}

.more-events:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.custom-event {
  width: 100%;
  cursor: pointer;
}

.event-chip {
  font-size: 11px !important;
  font-weight: 500;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-dialog {
  border-radius: 16px;
}

.event-time-info {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  padding: 12px;
}

/* Drag and Drop Styles */
.calendar-day.drag-over {
  position: relative;
}

.calendar-day.drop-zone-active {
  background: rgba(var(--v-theme-primary), 0.1);
  border: 2px dashed rgba(var(--v-theme-primary), 0.5);
}

.calendar-day.drop-zone-valid {
  background: rgba(var(--v-theme-success), 0.1);
  border-color: rgba(var(--v-theme-success), 0.5);
}

.calendar-day.drop-zone-invalid {
  background: rgba(var(--v-theme-error), 0.1);
  border-color: rgba(var(--v-theme-error), 0.5);
}

.event-item.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: grabbing;
}

.event-item[draggable="true"] {
  cursor: grab;
  position: relative;
}

.event-item[draggable="true"]:hover {
  transform: translateY(-1px) scale(1.02);
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  cursor: col-resize;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.resize-handle:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.6);
}

.resize-start {
  left: 0;
  border-radius: 8px 0 0 8px;
}

.resize-end {
  right: 0;
  border-radius: 0 8px 8px 0;
}

.event-item:hover .resize-handle {
  opacity: 0.7;
}

.event-item.multi-day-event:hover .resize-handle {
  opacity: 1;
}

/* Ghost element for drag feedback */
.event-drag-ghost {
  pointer-events: none;
  user-select: none;
  font-family: inherit;
  font-weight: 500;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Disable text selection during drag */
.calendar-day.drag-over * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch !important;
  }

  .view-selector,
  .weekday-selector {
    max-width: 100%;
  }

  .navigation-controls {
    justify-content: center;
  }

  .calendar-main {
    min-height: calc(100vh - 100px);
  }

  .custom-calendar {
    min-height: 600px;
    border-radius: 4px;
  }

  .calendar-month-header {
    padding: 12px 16px;
  }

  .month-title {
    font-size: 18px;
  }

  .weekday-header {
    padding: 8px 4px;
    font-size: 12px;
  }

  .calendar-grid {
    min-height: 480px;
  }

  .calendar-day {
    min-height: 80px;
  }

  .day-content {
    padding: 6px;
  }

  .day-number {
    font-size: 14px;
    min-height: 20px;
  }

  .calendar-day.is-today .day-number {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .event-item {
    padding: 3px 6px;
    font-size: 10px;
    border-radius: 8px;
  }

  .event-dot {
    width: 4px;
    height: 4px;
  }

  .more-events {
    padding: 2px 6px;
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .calendar-content {
    padding: 8px;
  }

  .custom-calendar {
    min-height: 500px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .calendar-month-header {
    padding: 10px 12px;
  }

  .month-title {
    font-size: 16px;
  }

  .weekday-header {
    padding: 6px 2px;
    font-size: 11px;
  }

  .calendar-grid {
    min-height: 390px;
  }

  .calendar-day {
    min-height: 65px;
  }

  .day-content {
    padding: 4px;
  }

  .day-number {
    font-size: 12px;
    min-height: 18px;
  }

  .calendar-day.is-today .day-number {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .event-item {
    padding: 2px 4px;
    font-size: 9px;
    border-radius: 6px;
    margin-bottom: 1px;
  }

  .event-dot {
    width: 3px;
    height: 3px;
  }

  .more-events {
    padding: 1px 4px;
    font-size: 8px;
    margin-top: 1px;
  }
}
</style>
