<template>
  <v-row class="mb-6">
    <v-col v-for="stat in stats" :key="stat.label" cols="12" md="3">
      <v-card class="stat-card h-100" elevation="4">
        <v-card-text class="text-center">
          <v-icon class="mb-2" :color="stat.color" size="40">{{ stat.icon }}</v-icon>
          <div class="stat-number" :class="`text-${stat.color}`">{{ stat.value }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ stat.label }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
  const props = defineProps({
    totalTasks: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    pendingTasks: {
      type: Number,
      default: 0,
    },
    overdueTasks: {
      type: Number,
      default: 0,
    },
  })

  const stats = computed(() => [
    {
      icon: 'mdi-format-list-checks',
      label: 'Total Tasks',
      value: props.totalTasks,
      color: 'primary',
    },
    {
      icon: 'mdi-check-circle',
      label: 'Completed',
      value: props.completedTasks,
      color: 'success',
    },
    {
      icon: 'mdi-clock-outline',
      label: 'Pending',
      value: props.pendingTasks,
      color: 'warning',
    },
    {
      icon: 'mdi-alert-circle',
      label: 'Overdue',
      value: props.overdueTasks,
      color: 'error',
    },
  ])
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
