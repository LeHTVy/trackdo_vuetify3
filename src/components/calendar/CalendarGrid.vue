<template>
  <v-card class="calendar-card mb-6" elevation="4">
    <v-card-title class="d-flex align-center justify-space-between">
      <span class="text-h5 font-weight-bold text-primary">Calendar</span>
      <v-btn
        color="secondary"
        prepend-icon="mdi-plus"
        variant="elevated"
        @click="$emit('add-event')"
      >
        Add Event
      </v-btn>
    </v-card-title>

    <v-card-text>
      <!-- Calendar Navigation -->
      <div class="d-flex align-center justify-space-between mb-4">
        <v-btn
          icon
          variant="text"
          @click="$emit('previous-month')"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <h3 class="text-h5 font-weight-medium">
          {{ currentMonthYear }}
        </h3>

        <v-btn
          icon
          variant="text"
          @click="$emit('next-month')"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <!-- Weekday Headers -->
        <div
          v-for="day in weekdays"
          :key="day"
          class="weekday-header"
        >
          {{ day }}
        </div>

        <!-- Calendar Days -->
        <div
          v-for="day in calendarDays"
          :key="`${day.date}-${day.month}`"
          class="calendar-day"
          :class="{
            'other-month': day.otherMonth,
            'today': day.isToday,
            'has-events': day.events.length > 0
          }"
          @click="$emit('select-day', day)"
        >
          <div class="day-number">{{ day.date }}</div>
          <div v-if="day.events.length > 0" class="event-indicators">
            <div
              v-for="event in day.events.slice(0, 3)"
              :key="event.id"
              class="event-dot"
              :style="{ backgroundColor: event.color }"
            />
            <span v-if="day.events.length > 3" class="event-more">
              +{{ day.events.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  defineProps({
    currentMonthYear: {
      type: String,
      required: true,
    },
    calendarDays: {
      type: Array,
      required: true,
    },
  })

  defineEmits(['add-event', 'previous-month', 'next-month', 'select-day'])

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
</script>

<style scoped>
.calendar-card {
  border-radius: 16px;
  background: rgb(255 255 255 / 95%);
  backdrop-filter: blur(10px);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.weekday-header {
  background: #232e3e;
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.calendar-day {
  background: white;
  min-height: 80px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-day:hover {
  background: #f5f5f5;
  transform: scale(1.02);
}

.calendar-day.other-month {
  background: #fafafa;
  color: #bbb;
}

.calendar-day.today {
  background: #e3f2fd;
  border: 2px solid #2196f3;
}

.calendar-day.has-events {
  background: #fff3e0;
}

.day-number {
  font-weight: 500;
  margin-bottom: 4px;
}

.event-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  align-items: center;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.event-more {
  font-size: 10px;
  color: #666;
  font-weight: bold;
}

/* Dark theme adjustments */
.v-theme--dark .calendar-card {
  background: rgb(45 55 72 / 95%);
}

.v-theme--dark .calendar-day {
  background: #2d3748;
  color: white;
}

.v-theme--dark .calendar-day.other-month {
  background: #1a202c;
  color: #718096;
}

.v-theme--dark .calendar-day:hover {
  background: #4a5568;
}

/* Responsive design */
@media (max-width: 768px) {
  .calendar-grid {
    gap: 0;
  }

  .calendar-day {
    min-height: 60px;
    padding: 4px;
  }

  .weekday-header {
    padding: 8px 4px;
    font-size: 0.75rem;
  }
}
</style>
