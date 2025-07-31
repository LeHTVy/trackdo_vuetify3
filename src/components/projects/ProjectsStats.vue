<template>
  <v-container class="stats-section" fluid>
    <v-row class="stats-grid justify-center">
      <v-col
        v-for="(stat, index) in stats"
        :key="stat.label"
        cols="12"
        lg="2"
        md="3"
        sm="6"
      >
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
              class="stat-progress"
              :color="stat.color"
              height="4"
              :model-value="stat.progress"
              rounded
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed } from 'vue'
  import { useProjectStats } from '@/composables/ProjectCommon/useProjectStats'

  const props = defineProps({
    projects: {
      type: Array,
      default: () => [],
    },
  })

  // Convert props to reactive ref for composable
  const projectsRef = computed(() => props.projects)

  // Use project stats composable
  const { statsConfig } = useProjectStats(projectsRef)

  // Alias for template compatibility
  const stats = statsConfig
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
