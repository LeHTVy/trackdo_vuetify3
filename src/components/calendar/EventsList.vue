<template>
  <div>
    <!-- Today's Events -->
    <v-card class="events-card mb-4" elevation="3">
      <v-card-title class="text-h6 font-weight-bold text-primary">
        <v-icon class="mr-2">mdi-calendar-today</v-icon>
        Today's Events
      </v-card-title>
      <v-card-text>
        <v-list v-if="todayEvents.length > 0">
          <v-list-item
            v-for="event in todayEvents"
            :key="event.id"
            class="event-item"
          >
            <template #prepend>
              <v-avatar
                :color="event.color"
                size="12"
              />
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ event.title }}
            </v-list-item-title>

            <v-list-item-subtitle>
              <v-icon class="mr-1" size="14">mdi-clock-outline</v-icon>
              {{ event.time || 'All day' }}
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="$emit('edit-event', event)"
              >
                <v-icon size="16">mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <div v-else class="text-center py-4">
          <v-icon color="grey-lighten-1" size="48">mdi-calendar-blank</v-icon>
          <p class="text-body-2 text-medium-emphasis mt-2">No events today</p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Upcoming Events -->
    <v-card class="events-card" elevation="3">
      <v-card-title class="text-h6 font-weight-bold text-primary">
        <v-icon class="mr-2">mdi-calendar-clock</v-icon>
        Upcoming Events
      </v-card-title>
      <v-card-text>
        <v-list v-if="upcomingEvents.length > 0">
          <v-list-item
            v-for="event in upcomingEvents.slice(0, 5)"
            :key="event.id"
            class="event-item"
          >
            <template #prepend>
              <v-avatar
                :color="event.color"
                size="12"
              />
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ event.title }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ formatEventDate(event.date) }}
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="$emit('edit-event', event)"
              >
                <v-icon size="16">mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <div v-else class="text-center py-4">
          <v-icon color="grey-lighten-1" size="48">mdi-calendar-plus</v-icon>
          <p class="text-body-2 text-medium-emphasis mt-2">No upcoming events</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
  defineProps({
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

  const formatEventDate = dateStr => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
</script>

<style scoped>
.events-card {
  border-radius: 16px;
  background: rgb(255 255 255 / 95%);
  backdrop-filter: blur(10px);
}

.event-item {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.event-item:hover {
  background: rgb(25 118 210 / 5%);
}

/* Dark theme adjustments */
.v-theme--dark .events-card {
  background: rgb(45 55 72 / 95%);
}
</style>
