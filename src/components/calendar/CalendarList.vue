<template>
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
        <v-icon :icon="titleIcon" class="mr-2"></v-icon>
        {{ title }}
        <v-chip
          :color="chipColor"
          size="small"
          variant="elevated"
          class="event-count-chip ml-2"
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
            @click="$emit('event-click', event)"
            :ripple="true"
          >
            <template v-slot:prepend>
              <v-avatar
                :color="event.color || avatarColor"
                size="40"
                class="mr-3 event-avatar"
              >
                <v-icon icon="mdi-calendar" color="white" size="20"></v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium event-title">
              {{ event.name || event.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="mt-1 event-subtitle">
              <div class="d-flex align-center">
                <v-icon
                  icon="mdi-clock-outline"
                  size="14"
                  :color="timeIconColor"
                  class="mr-1"
                ></v-icon>
                {{ formatEventTime(event) }}
              </div>
              <div v-if="event.details" class="text-truncate mt-1 event-details">
                {{ event.details }}
              </div>
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="d-flex flex-column align-center event-actions">
                <v-chip
                  :color="getEventStatus(event).color"
                  size="x-small"
                  variant="flat"
                  class="mb-1 status-chip"
                >
                  {{ getEventStatus(event).text }}
                </v-chip>
                <v-btn
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  class="action-btn"
                  @click.stop="$emit('event-menu', event)"
                ></v-btn>
              </div>
            </template>
          </v-list-item>
        </template>
      </v-list>

      <v-empty-state
        v-else
        :icon="emptyIcon"
        :title="emptyTitle"
        :text="emptyText"
        class="my-8 empty-state"
      ></v-empty-state>
    </v-card-text>

    <v-card-actions v-if="showActions" class="pa-4 list-actions">
      <v-spacer></v-spacer>
      <v-btn
        :color="actionButtonColor"
        variant="text"
        class="view-all-btn"
        @click="$emit('view-all')"
      >
        View All
        <v-icon icon="mdi-arrow-right" class="ml-1"></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useCalendarList } from '@/composables/useCalendarList.js'

export default {
  name: 'CalendarList',
  props: {
    events: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'upcoming',
      validator: value => ['upcoming', 'today'].includes(value)
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  emits: ['event-click', 'event-menu', 'view-all'],
  setup(props) {
    const calendarList = useCalendarList(props.type)
    return {
      ...calendarList
    }
  },
  computed: {
    title() {
      return this.getTitle()
    },
    titleIcon() {
      return this.getTitleIcon()
    },
    emptyIcon() {
      return this.getEmptyIcon()
    },
    emptyTitle() {
      return this.getEmptyTitle()
    },
    emptyText() {
      return this.getEmptyText()
    },

    headerStyles() {
      return this.getHeaderStyles(this.$vuetify.theme)
    },

    chipColor() {
      return this.getChipColor(this.$vuetify.theme)
    },

    avatarColor() {
      return this.getAvatarColor(this.$vuetify.theme)
    },

    timeIconColor() {
      return this.getTimeIconColor(this.$vuetify.theme)
    },

    actionButtonColor() {
      return this.getActionButtonColor(this.$vuetify.theme)
    },

    containerClasses() {
      return {
        'events-container-item': true,
        'today-events-container': this.type === 'today',
        'upcoming-events-container': this.type === 'upcoming'
      }
    }
  }
}
</script>

<style scoped>
/* Base Calendar List Styles */
.calendar-list {
  border: 1px solid rgb(var(--v-theme-primary), 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 16px;
}

/* Events Container Styles */
.events-container-item {
  position: relative;
}

.today-events-container {
  margin-bottom: 24px;
}

.upcoming-events-container {
  margin-top: 0;
}


/* Today List */
.today-list {
  border-bottom: none;
   border-radius: 16px;
}

.today-list .list-header {
  border-bottom: 2px solid rgb(var(--v-theme-secondary), 0.3);
}

/*  Upcoming List */
.upcoming-list {
  border-top: none;
  margin-top: 10px;
  border-radius: 16px;
}

.upcoming-list .list-header {
  border-top: 1px solid rgb(var(--v-theme-primary), 0.2);
}

/* Header Styles */
.list-header {
  position: relative;
  transition: all 0.3s ease;
}

.today-header {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.upcoming-header {
  background: rgb(var(--v-theme-secondary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
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

/* Event Item Styles */
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

.today-event-item:hover {
  border-left-color: rgb(var(--v-theme-primary));
  background: linear-gradient(90deg,
    rgb(var(--v-theme-primary), 0.05) 0%,
    transparent 100%);
}

.upcoming-event-item:hover {
  border-left-color: rgb(var(--v-theme-secondary));
  background: linear-gradient(90deg,
    rgb(var(--v-theme-secondary), 0.05) 0%,
    transparent 100%);
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

/* Event Divider */
.event-divider {
  margin: 0 16px;
  opacity: 0.3;
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

/* Dark Mode Adjustments */
.v-theme--dark .list-header{
  color: rgb(var(--v-theme-primary), 0.2);;
}

.v-theme--dark .calendar-list {
  border-color: rgb(var(--v-theme-primary), 0.2);
}

.v-theme--dark .today-header {
  background: rgb(var(--v-theme-primary)) !important;
}

.v-theme--dark .upcoming-header {
  background: rgb(var(--v-theme-secondary)) !important;
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
