<template>
  <v-container class="py-4">
    <v-row>
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center" elevation="3">
          <v-card-text class="pa-4">
            <div class="stat-number text-primary">{{ totalEvents }}</div>
            <div class="text-body-2 text-medium-emphasis">Total Events</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center" elevation="3">
          <v-card-text class="pa-4">
            <div class="stat-number text-success">{{ todayEvents }}</div>
            <div class="text-body-2 text-medium-emphasis">Today</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center" elevation="3">
          <v-card-text class="pa-4">
            <div class="stat-number text-warning">{{ upcomingEvents }}</div>
            <div class="text-body-2 text-medium-emphasis">Upcoming</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="stat-card text-center" elevation="3">
          <v-card-text class="pa-4">
            <div class="stat-number text-info">{{ thisWeekEvents }}</div>
            <div class="text-body-2 text-medium-emphasis">This Week</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  defineProps({
    totalEvents: {
      type: Number,
      default: 0,
    },
    todayEvents: {
      type: Number,
      default: 0,
    },
    upcomingEvents: {
      type: Number,
      default: 0,
    },
    thisWeekEvents: {
      type: Number,
      default: 0,
    },
  })
</script>

<style scoped>
.stat-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: rgb(255 255 255 / 95%);
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgb(0 0 0 / 15%);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

/* Dark theme adjustments */
.v-theme--dark .stat-card {
  background: rgb(45 55 72 / 95%);
}
</style>
