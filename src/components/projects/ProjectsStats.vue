<template>
  <v-container fluid class="stats-section">
    <v-row class="stats-grid justify-center">
      <v-col cols="12" sm="6" md="3" lg="2" v-for="(stat, index) in stats" :key="stat.label">
        <v-card
          class="stat-card"
          :class="`stat-card--${stat.type}`"
          elevation="0"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <v-card-text class="stat-content">
            <div class="stat-header">
              <div class="stat-icon-wrapper" :class="`bg-${stat.color}`">
                <v-icon :color="stat.color" size="24">{{ stat.icon }}</v-icon>
              </div>
            </div>
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <v-progress-linear
              :color="stat.color"
              height="4"
              :model-value="stat.progress"
              rounded
              class="stat-progress"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    totalProjects: {
      type: Number,
      default: 0,
    },
    activeProjects: {
      type: Number,
      default: 0,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    onHoldProjects: {
      type: Number,
      default: 0,
    },
  })

  const stats = computed(() => [
    {
      label: 'Total Projects',
      value: props.totalProjects,
      icon: 'mdi-folder-multiple',
      color: 'primary',
      type: 'total',
      progress: 100
    },
    {
      label: 'Active Projects',
      value: props.activeProjects,
      icon: 'mdi-play-circle',
      color: 'project-active',
      type: 'active',
      progress: props.totalProjects > 0 ? (props.activeProjects / props.totalProjects) * 100 : 0
    },
    {
      label: 'Completed',
      value: props.completedProjects,
      icon: 'mdi-check-circle',
      color: 'project-completed',
      type: 'completed',
      progress: props.totalProjects > 0 ? (props.completedProjects / props.totalProjects) * 100 : 0
    },
    {
      label: 'On Hold',
      value: props.onHoldProjects,
      icon: 'mdi-pause-circle',
      color: 'project-onhold',
      type: 'onhold',
      progress: props.totalProjects > 0 ? (props.onHoldProjects / props.totalProjects) * 100 : 0
    }
  ])
</script>

<style scoped>
/* Stats Section */
.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  gap: 1.5rem;
}

.stat-card {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.stat-content {
  padding: 1.5rem;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: rgb(var(--v-theme-on-surface));
}

.stat-label {
  font-size: 0.875rem;
  color: #232e3e;
  margin-bottom: 1rem;
  font-weight: 500;
}

.stat-progress {
  margin-top: 0.5rem;
}

/* Animations */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode enhancements */
.v-theme--dark .stat-card {
  background: rgba(var(--v-theme-surface), 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .stat-card:hover {
  background: rgba(var(--v-theme-surface), 0.8);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .stat-label {
  color: #fed44f;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    gap: 1rem;
  }

  .stats-grid .v-col {
    flex: 0 0 auto;
    max-width: none;
  }

  .stat-content {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-icon-wrapper {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .stats-section {
    margin-bottom: 2rem;
  }

  .stats-grid {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .stats-grid .v-col {
    min-width: 140px;
  }
}
</style>
