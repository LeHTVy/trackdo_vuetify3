<template>
  <v-card
    v-if="hasData"
    class="progress-card"
    elevation="2"
  >
    <v-card-title class="progress-header">
      <v-icon class="mr-2" color="primary">mdi-chart-donut</v-icon>
      <span class="progress-title">Progress Overview</span>
    </v-card-title>

    <v-card-text class="progress-body">
      <div class="progress-content">
        <!-- Progress Chart -->
        <div class="chart-container">
          <v-progress-circular
            class="progress-circle"
            color="primary"
            :model-value="completionPercentage"
            :size="100"
            :width="8"
          >
            <div class="progress-text">
              <div class="progress-percentage">{{ Math.round(completionPercentage) }}%</div>
              <div class="progress-label">Complete</div>
            </div>
          </v-progress-circular>
        </div>

        <!-- Progress Details -->
        <div class="progress-details">
          <div
            v-for="item in progressItems"
            :key="item.key"
            class="progress-item"
          >
            <div class="item-header">
              <v-icon
                class="item-icon"
                :color="item.color"
                size="18"
              >
                {{ item.icon }}
              </v-icon>
              <span class="item-label">{{ item.label }}</span>
            </div>
            <div class="item-count">{{ item.count }}</div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <!-- Empty State -->
  <v-card
    v-else
    class="progress-card empty-state"
    elevation="2"
  >
    <v-card-text class="text-center pa-6">
      <v-icon color="grey-lighten-1" size="48">mdi-chart-donut</v-icon>
      <h4 class="text-grey-lighten-1 mt-2">No Tasks Yet</h4>
      <p class="text-grey-lighten-2 text-body-2 mt-1">Create your first task to see progress</p>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { useTaskProgress } from '@/composables/TaskCommon/useTaskProgress'

  // Props
  const props = defineProps({
    tasksStore: {
      type: Object,
      required: true,
    },
  })

  const {
    completionPercentage,
    progressItems,
    hasData,
    progressStats,
  } = useTaskProgress(props.tasksStore)

  defineExpose({
    progressStats,
  })
</script>

<style scoped>
.progress-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.progress-header {
  background: rgba(var(--v-theme-task-header), 0.3);
  padding: 1rem 1.5rem;
}

.progress-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.progress-body {
  padding: 1.5rem;
}

.progress-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}

.progress-circle {
  position: relative;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-percentage {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1;
}

.progress-label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-secondary));
  margin-top: 0.25rem;
}

.progress-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.progress-item {
  padding: 1rem;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.progress-item:hover {
  background: rgba(var(--v-theme-surface), 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.item-icon {
  flex-shrink: 0;
}

.item-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-secondary));
}

.item-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

/* Empty State */
.empty-state {
  background: rgba(var(--v-theme-surface), 0.3);
}

/* Dark mode adjustments */
.v-theme--dark .progress-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.v-theme--dark .progress-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .progress-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .progress-body {
    padding: 1rem;
  }

  .progress-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .progress-item {
    padding: 0.75rem;
  }

  .item-count {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .progress-header {
    padding: 0.75rem 1rem;
  }

  .progress-title {
    font-size: 1rem;
  }

  .chart-container {
    padding: 0.5rem 0;
  }

  .progress-percentage {
    font-size: 1rem;
  }

  .progress-label {
    font-size: 0.625rem;
  }
}
</style>
