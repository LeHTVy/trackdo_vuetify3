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
        <v-icon
          class="mr-2"
          :color="weatherError ? 'error' : 'primary'"
        >
          {{ weatherData ? getWeatherIcon(weatherData.weatherCode) : 'mdi-weather-partly-cloudy' }}
        </v-icon>
        <div v-if="weatherLoading" class="d-flex align-center">
          <v-progress-circular
            class="mr-2"
            color="primary"
            indeterminate
            size="20"
            width="2"
          />
          <span class="text-body-2">Loading weather...</span>
        </div>
        <div v-else-if="weatherData" class="weather-info">
          <div class="text-h6 font-weight-bold">{{ weatherData.temperature }}°C</div>
          <div v-if="weatherData.windSpeed" class="text-caption">
            Wind: {{ weatherData.windSpeed }} km/h
          </div>
        </div>
        <div v-else class="text-body-2 text-error">
          {{ weatherError || 'Weather unavailable' }}
        </div>
      </div>

      <v-spacer />

      <!-- View Selector -->
      <div class="view-selector d-flex align-center mr-4">
        <v-btn-toggle
          v-model="currentView"
          class="view-toggle"
          density="compact"
          mandatory
          variant="outlined"
          @update:model-value="onViewChange"
        >
          <v-btn
            prepend-icon="mdi-calendar-month"
            size="small"
            value="monthly"
          >
            Month
          </v-btn>
          <v-btn
            prepend-icon="mdi-calendar-week"
            size="small"
            value="weekly"
          >
            Week
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Navigation Controls -->
      <div class="navigation-controls d-flex align-center">
        <v-btn
          class="mr-2"
          color="primary"
          prepend-icon="mdi-calendar-today"
          variant="outlined"
          @click="goToToday"
        >
          Today
        </v-btn>

        <v-btn-group density="compact" variant="outlined">
          <v-btn
            :disabled="loading"
            icon="mdi-chevron-left"
            @click="navigatePrev"
          />
          <v-btn
            :disabled="loading"
            icon="mdi-chevron-right"
            @click="navigateNext"
          />
        </v-btn-group>
      </div>
    </v-sheet>

    <!-- Calendar Content -->
    <v-sheet class="calendar-content" color="background">
      <div class="custom-calendar">
        <!-- Calendar Header with Month/Year -->
        <div class="calendar-month-header">
          <h3 class="month-title">{{ getViewTitle }}</h3>
        </div>

        <!-- Weekday Headers  -->
        <div
          class="weekday-headers"
          :class="{ 'weekly-headers': currentView === 'weekly' }"
        >
          <div
            v-for="day in weekdayLabels"
            :key="day"
            class="weekday-header"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div
          class="calendar-grid"
          :class="{
            'monthly-grid': currentView === 'monthly',
            'weekly-grid': currentView === 'weekly'
          }"
        >
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
            @dragenter.prevent
            @dragover.prevent
            @drop="onDrop($event, day.date)"
          >
            <div class="day-content">
              <div class="day-number">{{ day.date.getDate() }}</div>
              <div v-if="getVisibleDayEvents(day.date).totalCount > 0" class="day-events">
                <div
                  v-for="(event, index) in getVisibleDayEvents(day.date).events"
                  :key="`${event.id || event._id || event.title}-${day.date.getTime()}-${index}`"
                  class="event-item"
                  :class="{
                    'multi-day-event': event.isMultiDay,
                    'event-start': event.isFirstDay,
                    'event-end': event.isLastDay,
                    'event-continuation': event.isContinuation,
                    'dragging': dragState.isDragging && dragState.draggedEvent?.id === event.id
                  }"
                  :draggable="!event.isContinuation"
                  :style="{ backgroundColor: event.color || '#1976d2' }"
                  @click.stop="onEventClick({ event })"
                  @dragend="onEventDragEnd"
                  @dragstart="onEventDragStart($event, event)"
                >
                  <!-- Resize handle for start date -->
                  <div
                    v-if="event.isFirstDay && event.isMultiDay"
                    class="resize-handle resize-start"
                    title=" Resize handle for start date"
                    @mousedown.stop="onResizeStart($event, event, 'start')"
                  />

                  <span v-if="!event.isContinuation" class="event-dot" />
                  <span class="event-text">
                    {{ event.isContinuation ? '' : (event.name || event.title) }}
                  </span>

                  <!-- Resize handle for end date  -->
                  <div
                    v-if="event.isLastDay && event.isMultiDay"
                    class="resize-handle resize-end"
                    title="Resize handle for end date"
                    @mousedown.stop="onResizeStart($event, event, 'end')"
                  />
                </div>
                <div
                  v-if="getVisibleDayEvents(day.date).hasMore"
                  class="more-events"
                  @click.stop="onShowMore($event, { date: day.date, events: getDayEvents(day.date) })"
                >
                  +{{ getVisibleDayEvents(day.date).moreCount }} more
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
  import { computed, onMounted, onUnmounted, watch } from 'vue'
  import { useDialogManager } from '@/composables/common/useDialogManager'
  import { useEventFilters } from '@/composables/CalendarCommon/useEventFilters'
  import { useCalendarEvents } from '@/composables/CalendarCommon/useCalendarEvents'
  import { useEventDragDrop } from '@/composables/CalendarMain/useEventDragDrop'
  import { useWeatherData } from '@/composables/CalendarMain/useWeatherData'
  import { useCalendarGrid } from '@/composables/CalendarMain/useCalendarGrid'
  import { useCalendarNavigation } from '@/composables/CalendarMain/useCalendarNavigation'
  import { useDayEvents } from '@/composables/CalendarMain/useDayEvents'

  // Props
  const props = defineProps({
    events: {
      type: Array,
      default: () => [],
    },
    defaultView: {
      type: String,
      default: 'monthly',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  // Emits
  const emit = defineEmits([
    'date-selected',
    'event-clicked',
    'range-changed',
    'edit-event',
    'view-changed',
    'show-more-events',
    'event-updated',
  ])

  // Refs
  // (removed unused calendarRef and currentWeekdays)

  // Composables
  const dialogManager = useDialogManager()
  const { formattedEvents } = useEventFilters(computed(() => props.events))
  const { handleEventClick, handleDateClick, handleShowMore } = useCalendarEvents()
  const { dragState, startEventDrag, startResize, handleDrop, handleDragEnd } = useEventDragDrop()

  // Weather composable
  const {
    weatherData,
    weatherLoading,
    weatherError,
    getWeatherIcon,
    setupAutoRefresh,
  } = useWeatherData()

  // Calendar navigation composable
  const {
    currentDate: currentValue,
    calendarType: currentView,
    navigatePrev,
    navigateNext,
    goToToday,
    getViewTitle,
    changeView,
  } = useCalendarNavigation(new Date(), props.defaultView)

  // Calendar grid composable
  const {
    calendarDays,
    weekdayLabels,
    isToday,
  } = useCalendarGrid(currentValue, currentView)

  // Day events composable
  const {
    getDayEvents,
    getVisibleDayEvents,
  } = useDayEvents(formattedEvents, currentView)

  // Auto refresh weather setup
  let weatherInterval = null
  onMounted(() => {
    weatherInterval = setupAutoRefresh()
  })

  onUnmounted(() => {
    if (weatherInterval) {
      clearInterval(weatherInterval)
    }
  })

  // Methods
  const onEventClick = eventData => {
    handleEventClick(eventData, emit, dialogManager)
  }

  const onDateClick = day => {
    const dateData = { date: day.date }
    handleDateClick(dateData, emit)
  }

  const onShowMore = (nativeEvent, moreData) => {
    handleShowMore({ nativeEvent, ...moreData }, emit)
  }

  // Drag and Drop Methods
  const onEventDragStart = (nativeEvent, event) => {
    startEventDrag(event, 'move', nativeEvent)
  }

  const onEventDragEnd = () => {
    handleDragEnd()
  }

  const onDrop = async nativeEvent => {
    const updatedEvent = handleDrop(nativeEvent)
    if (updatedEvent) {
      emit('event-updated', updatedEvent)
    }
  }

  const onResizeStart = (nativeEvent, event, direction) => {
    nativeEvent.preventDefault()
    startResize(event, direction, nativeEvent)
  }

  // View change handler
  const onViewChange = newView => {
    changeView(newView)
    emit('view-changed', newView)
  }

  // Watchers
  watch(currentView, newView => {
    emit('view-changed', newView)
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

.view-selector {
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid rgba(var(--v-border-color), 0.2);
}

.view-toggle .v-btn {
  border-radius: 8px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
}

.view-toggle .v-btn--active {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.3) !important;
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
  flex: 1;
  min-height: 600px;
}

/* Monthly view grid */
.calendar-grid.monthly-grid {
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

/* Weekly view grid */
.calendar-grid.weekly-grid {
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 1fr;
  min-height: 400px;
}

.calendar-grid.weekly-grid .calendar-day {
  min-height: 350px;
  border-radius: 8px;
  margin: 4px;
}

.calendar-grid.weekly-grid .day-number {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.calendar-grid.weekly-grid .calendar-day.is-today .day-number {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.calendar-grid.weekly-grid .day-events {
  gap: 4px;
}

.calendar-grid.weekly-grid .event-item {
  padding: 6px 8px;
  font-size: 12px;
  margin-bottom: 3px;
}

/* Weekly headers styling */
.weekday-headers.weekly-headers {
  background: rgba(var(--v-theme-primary), 0.15);
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
