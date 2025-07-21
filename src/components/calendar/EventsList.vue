<template>
  <div class="events-list-container">
    <!-- Header -->
    <div class="events-header">
      <v-icon size="16" color="primary" class="mr-2">mdi-calendar-check</v-icon>
      <h4 class="events-title">Events</h4>
    </div>

    <!-- Tabs -->
    <v-tabs
      v-model="activeTab"
      class="events-tabs"
      density="compact"
      color="primary"
      slider-color="primary"
    >
      <v-tab value="today" class="tab-item">
        <v-icon size="14" class="mr-1">mdi-calendar-today</v-icon>
        Today
      </v-tab>
      <v-tab value="upcoming" class="tab-item">
        <v-icon size="14" class="mr-1">mdi-calendar-clock</v-icon>
        Upcoming
      </v-tab>
    </v-tabs>

    <!-- Tab Content -->
    <div class="tab-content">
      <v-window v-model="activeTab" class="events-window">
        <!-- Today's Events -->
        <v-window-item value="today" class="window-item">
          <div class="events-content">
            <v-list v-if="todayEvents.length > 0" density="compact" class="events-list">
              <v-list-item
                v-for="event in todayEvents.slice(0, 4)"
                :key="event.id"
                class="event-item"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon size="12" :color="getEventColor(event)" class="event-icon">
                    {{ getEventIcon(event) }}
                  </v-icon>
                </template>

                <v-list-item-title class="event-title">
                  {{ event.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="event-time">
                  {{ formatEventTimeDisplay(event) }}
                </v-list-item-subtitle>
              </v-list-item>

              <div v-if="todayEvents.length > 4" class="more-events">
                +{{ todayEvents.length - 4 }} more events
              </div>
            </v-list>

            <div v-else class="no-events">
              <v-icon size="32" color="grey-lighten-1" class="mb-2">mdi-calendar-blank</v-icon>
              <p class="no-events-text">No events today</p>
            </div>
          </div>
        </v-window-item>

        <!-- Upcoming Events -->
        <v-window-item value="upcoming" class="window-item">
          <div class="events-content">
            <v-list v-if="upcomingEvents.length > 0" density="compact" class="events-list">
              <v-list-item
                v-for="event in upcomingEvents.slice(0, 5)"
                :key="event.id"
                class="event-item"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon size="12" :color="getEventColor(event)" class="event-icon">
                    {{ getEventIcon(event) }}
                  </v-icon>
                </template>

                <v-list-item-title class="event-title">
                  {{ event.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="event-time">
                  {{ formatEventDateDisplay(event) }}
                </v-list-item-subtitle>
              </v-list-item>

              <div v-if="upcomingEvents.length > 5" class="more-events">
                +{{ upcomingEvents.length - 5 }} more events
              </div>
            </v-list>

            <div v-else class="no-events">
              <v-icon size="32" color="grey-lighten-1" class="mb-2">mdi-calendar-plus</v-icon>
              <p class="no-events-text">No upcoming events</p>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>


<script setup>
  import { ref, computed } from 'vue'
  import { formatEventTime, formatEventDate } from '@/utils/dateUtils.js'
  import { getEventDisplayColor, getEventTypeIcon } from '@/utils/eventUtils.js'

  const props = defineProps({
    todayEvents: {
      type: Array,
      default: () => [],
    },
    upcomingEvents: {
      type: Array,
      default: () => [],
    },
  })

  defineEmits(['edit-event'])

  const activeTab = ref('today')

  // Use utility functions instead of local duplicates
  const formatEventTimeDisplay = (event) => {
    return formatEventTime(event)
  }

  const formatEventDateDisplay = (event) => {
    return formatEventDate(event)
  }

  const getEventColor = (event) => {
    return getEventDisplayColor(event)
  }

  const getEventIcon = (event) => {
    return getEventTypeIcon(event.type)
  }

  const hasEvents = computed(() => {
    return props.todayEvents.length > 0 || props.upcomingEvents.length > 0
  })
</script>

<style scoped>
.events-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.events-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 8px;
}

.events-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

.events-tabs {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.tab-item {
  text-transform: none;
  font-size: 0.75rem;
  min-height: 32px;
  padding: 0 8px;
}

.tab-content {
  flex: 1;
  min-height: 0;
}

.events-window {
  height: 100%;
}

.window-item {
  height: 100%;
}

.events-content {
  height: 100%;
  overflow-y: auto;
  padding: 4px 0;
}

.events-list {
  padding: 0;
}

.event-item {
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.8);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  transition: all 0.2s ease;
}

.event-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  transform: translateY(-1px);
}

.event-icon {
  margin-right: 8px;
}

.event-title {
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 2px;
}

.event-time {
  font-size: 0.7rem;
  opacity: 0.8;
  line-height: 1.1;
}

.more-events {
  text-align: center;
  padding: 8px;
  font-size: 0.7rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
}

.no-events {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  text-align: center;
}

.no-events-text {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 0;
}

/* Scrollbar styling */
.events-content::-webkit-scrollbar {
  width: 3px;
}

.events-content::-webkit-scrollbar-track {
  background: transparent;
}

.events-content::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-outline), 0.3);
  border-radius: 2px;
}

.events-content::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-outline), 0.5);
}
</style>
