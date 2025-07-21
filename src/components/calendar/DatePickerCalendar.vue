<template>
  <div class="calendar-container">
    <div class="calendar-header mb-2">
      <div class="d-flex align-center justify-space-between">
        <v-btn
          color="secondary"
          prepend-icon="mdi-plus"
          rounded="lg"
          size="x-small"
          variant="elevated"
          @click="handleAddEvent"
        >
          Add
        </v-btn>
      </div>
    </div>

    <div class="date-picker-container">
      <v-date-picker
        v-model="selectedDate"
        class="custom-date-picker"
        color="primary"
        elevation="0"
        show-adjacent-months
        width="100%"
        @update:model-value="handleDateClick"
      />

      <!-- Event indicators overlay -->
      <div class="events-overlay">
        <div
          v-for="(dayEvents, date) in eventsByDate"
          :key="date"
          class="day-events"
          :style="getDayPosition(date)"
        >
          <div
            v-for="event in dayEvents.slice(0, 3)"
            :key="event.id"
            class="event-dot"
            :style="{ backgroundColor: event.color || 'rgb(var(--v-theme-primary))' }"
          />
          <span
            v-if="dayEvents.length > 3"
            class="event-more text-caption"
          >
            +{{ dayEvents.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { toRef } from 'vue'
  import { useDatePicker } from '@/composables/useDatePicker'

  const props = defineProps({
    events: {
      type: Array,
      default: () => [],
      validator: events => Array.isArray(events),
    },
    modelValue: {
      type: Date,
      default: () => new Date(),
      validator: date => date instanceof Date,
    },
  })

  const emit = defineEmits(['add-event', 'date-click', 'update:modelValue'])

  const eventsRef = toRef(props, 'events')
  const modelValueRef = toRef(props, 'modelValue')

  const {
    selectedDate,
    eventsByDate,
    handleDateClick,
    handleAddEvent,
    getDayPosition,
  } = useDatePicker(eventsRef, modelValueRef, emit)
</script>

<style scoped>
.calendar-container {
  background: transparent;
  max-width: 350px;
  margin: 0 auto;
}

.calendar-header h3 {
  margin: 0;
  padding: 0;
  font-size: 1.1rem;
}

/* Date Picker Container - Compact */
.date-picker-container {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
  padding: 4px;
}

/* Custom Date Picker Styling - More Compact */
.custom-date-picker {
  width: 100% !important;
  max-width: 280px !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* Make date picker more compact */
:deep(.v-date-picker) {
  max-width: 280px !important;
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.v-date-picker-header) {
  padding: 6px 8px !important;
  min-height: 32px !important;
  font-size: 0.875rem !important;
}

:deep(.v-date-picker-table) {
  padding: 2px !important;
}

:deep(.v-date-picker-table .v-btn) {
  min-height: 28px !important;
  min-width: 28px !important;
  font-size: 11px !important;
  margin: 0.5px !important;
}

/* Custom Date Button Styling */
:deep(.v-date-picker-table .v-btn) {
  color: rgb(var(--v-theme-on-surface)) !important;
  font-weight: 500 !important;
  opacity: 1 !important;
}

/* Events Overlay */
.events-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.day-events {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1px;
  align-items: center;
  pointer-events: none;
}

.event-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.event-more {
  font-size: 6px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-surface), 0.9);
  padding: 1px 2px;
  border-radius: 2px;
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  margin-left: 1px;
}

/* Date Picker Header Styling */
:deep(.v-date-picker-header) {
  background: transparent;
  padding: 8px;
}

:deep(.v-date-picker-header .v-btn) {
  color: #1976D2;
  font-weight: 600;
  font-size: 0.75rem;
}

/* Weekday Headers */
:deep(.v-date-picker-table thead th) {
  color: #1976D2 !important;
  font-weight: 600 !important;
  font-size: 10px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 2px;
}

/* Adjacent Month Days */
:deep(.v-date-picker-table .v-btn--disabled) {
  opacity: 0.4;
  color: #999999 !important;
}

/* Responsive Design */
@media (max-width: 600px) {
  .calendar-container {
    margin: 0 4px;
    max-width: 260px;
  }

  :deep(.v-date-picker-table .v-btn) {
    min-height: 26px !important;
    min-width: 26px !important;
    font-size: 10px !important;
  }

  .event-dot {
    width: 2px;
    height: 2px;
  }

  .event-more {
    font-size: 5px;
  }
}

/* Dark Theme Support */
.v-theme--dark :deep(.v-date-picker-table .v-btn) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.v-theme--dark .event-more {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

/* Accessibility Improvements */
:deep(.v-date-picker-table .v-btn):focus-visible {
  outline: 1px solid #1976D2;
  outline-offset: 1px;
}
</style>
