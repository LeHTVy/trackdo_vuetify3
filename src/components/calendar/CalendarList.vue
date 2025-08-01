<template>
  <v-container class="calendar-list-container pa-0">
    <v-card
      class="calendar-list"
      :class="[listClasses, containerClasses]"
      elevation="2"
    >
      <v-card-title
        class="pa-4 list-header"
        :class="headerClasses"
        :style="headerStyles"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2" :icon="titleIcon" />
          {{ title }}
          <v-chip
            class="event-count-chip ml-2"
            :color="chipColor"
            size="small"
            variant="elevated"
          >
            {{ events.length }}
          </v-chip>
        </div>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-list v-if="events.length > 0" class="py-0 event-list">
          <template v-for="(event, index) in events" :key="event.id || index">
            <v-list-item
              class="event-item"
              :class="eventItemClasses"
              :ripple="true"
              @click="$emit('event-click', event)"
            >
              <template #prepend>
                <v-avatar
                  class="mr-3 event-avatar"
                  :color="event.color || avatarColor"
                  size="40"
                >
                  <v-icon color="white" icon="mdi-calendar" size="20" />
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium event-title">
                {{ event.name || event.title }}
              </v-list-item-title>

              <v-list-item-subtitle class="mt-1 event-subtitle">
                <div class="d-flex align-center">
                  <v-icon
                    class="mr-1"
                    :color="timeIconColor"
                    icon="mdi-clock-outline"
                    size="14"
                  />
                  {{ formatEventTime(event) }}
                </div>
                <div v-if="event.details" class="text-truncate mt-1 event-details">
                  {{ event.details }}
                </div>
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex flex-column align-center event-actions">
                  <v-chip
                    class="mb-1 status-chip"
                    :color="getEventStatus(event).color"
                    size="x-small"
                    variant="flat"
                  >
                    {{ getEventStatus(event).text }}
                  </v-chip>
                  <v-btn
                    class="action-btn"
                    icon="mdi-dots-vertical"
                    size="small"
                    variant="text"
                    @click.stop="$emit('event-menu', event)"
                  />
                </div>
              </template>
            </v-list-item>
          </template>
        </v-list>

        <v-empty-state
          v-else
          class="my-8 empty-state"
          :icon="emptyIcon"
          :text="emptyText"
          :title="emptyTitle"
        />
      </v-card-text>

      <v-card-actions v-if="showActions" class="pa-4 list-actions">
        <v-spacer />
        <v-btn
          class="view-all-btn"
          :color="actionButtonColor"
          variant="text"
          @click="$emit('view-all')"
        >
          View All
          <v-icon class="ml-1" icon="mdi-arrow-right" />
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Divider -->
    <v-divider
      v-if="type === 'today'"
      class="my-4 custom-divider"
      :color="dividerColor"
      :thickness="6"
    />
  </v-container>
</template>

<script setup>
  import { computed } from 'vue'
  import { useCalendarList } from '@/composables/CalendarList/useCalendarList.js'
  import { useThemeColors } from '@/composables/CalendarCommon/useThemeColors.js'

  // Props
  const props = defineProps({
    events: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'upcoming',
      validator: value => ['upcoming', 'today'].includes(value),
    },
    showActions: {
      type: Boolean,
      default: true,
    },
  })

  // Emits
  defineEmits(['event-click', 'event-menu', 'view-all'])

  // Composables
  const calendarList = useCalendarList(props.type)
  const themeColors = useThemeColors(props.type)

  // Computed properties
  const title = computed(() => calendarList.getTitle())
  const titleIcon = computed(() => calendarList.getTitleIcon())
  const emptyIcon = computed(() => calendarList.getEmptyIcon())
  const emptyTitle = computed(() => calendarList.getEmptyTitle())
  const emptyText = computed(() => calendarList.getEmptyText())

  // Styling computed properties
  const headerStyles = computed(() => themeColors.getHeaderStyles())
  const chipColor = computed(() => themeColors.getChipColor())
  const avatarColor = computed(() => themeColors.getAvatarColor())
  const timeIconColor = computed(() => themeColors.getTimeIconColor())
  const actionButtonColor = computed(() => themeColors.getActionButtonColor())
  const dividerColor = computed(() => themeColors.getDividerColor())

  // CSS classes
  const listClasses = computed(() => calendarList.listClasses)
  const headerClasses = computed(() => calendarList.headerClasses)
  const eventItemClasses = computed(() => calendarList.eventItemClasses)

  const containerClasses = computed(() => ({
    'events-container-item': true,
    'today-events-container': props.type === 'today',
    'upcoming-events-container': props.type === 'upcoming',
  }))

  // Methods
  const formatEventTime = event => calendarList.formatEventTime(event)
  const getEventStatus = event => calendarList.getEventStatus(event)
</script>

<style scoped>
/* Calendar List Container */
.calendar-list-container {
  width: 100%;
}

/* Base Calendar List Styles */
.calendar-list {
  border: 1px solid rgb(var(--v-theme-primary), 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 16px;
}

/* Custom Divider */
.custom-divider {
  opacity: 0.6;
  transition: opacity 0.3s ease;
  width: 60% !important;
  margin: 16px auto !important;
  border-radius: 8px !important;
  height: 3px !important;
}

/* Generic Header Styles */
.list-header {
  position: relative;
  transition: all 0.3s ease;
}

/* Event Count Chip */
.event-count-chip {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Event List Styles */
.event-list {
  background: rgb(var(--v-theme-surface));
}

/* Generic Event Item Styles  */
.event-item {
  transition: all 0.2s ease;
  cursor: pointer;
  border-left: 3px solid transparent;
  position: relative;
}

.event-item:hover {
  background-color: rgb(var(--v-theme-card-hover), 0.5);
  transform: translateX(2px);
}

/* Event Avatar */
.event-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.event-item:hover .event-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Event Title and Subtitle */
.event-title {
  color: rgb(var(--v-theme-title-text));
  font-weight: 600;
  transition: color 0.2s ease;
}

.event-subtitle {
  color: rgb(var(--v-theme-subtitle-text));
}

.event-details {
  max-width: 250px;
  opacity: 0.8;
  font-size: 0.875rem;
}

/* Event Actions */
.event-actions {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.event-item:hover .event-actions {
  opacity: 1;
}

.status-chip {
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.action-btn {
  opacity: 0.6;
  transition: all 0.2s ease;
}

.action-btn:hover {
  opacity: 1;
  background-color: rgb(var(--v-theme-primary), 0.1);
}

/* Empty State */
.empty-state {
  opacity: 0.7;
  padding: 2rem;
}

/* List Actions */
.list-actions {
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgb(var(--v-border-color), 0.12);
}

.view-all-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  transform: translateX(2px);
}

/* Dark Mode Adjustments  */
.v-theme--dark .calendar-list {
  border-color: rgb(var(--v-theme-primary), 0.2);
}

.v-theme--dark .custom-divider {
  opacity: 0.8;
}

.v-theme--dark .event-item:hover {
  background-color: rgb(var(--v-theme-card-hover), 0.3);
}

.v-theme--dark .event-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .event-count-chip {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .event-details {
    max-width: 200px;
  }

  .event-actions {
    opacity: 1;
  }

  .status-chip {
    font-size: 0.7rem;
    min-width: 50px;
  }
}

/* Animation for seamless transition */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.event-item {
  animation: slideIn 0.3s ease-out;
}

.event-item:nth-child(odd) {
  animation-delay: 0.1s;
}

.event-item:nth-child(even) {
  animation-delay: 0.2s;
}
</style>
