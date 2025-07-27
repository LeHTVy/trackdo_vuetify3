<template>
  <div class="tasks-stats" :style="cssVars">
    <v-row class="ma-0">
      <v-col
        v-for="stat in stats"
        :key="stat.label"
        cols="12"
        sm="6"
        md="3"
        class="pa-2"
      >
        <div class="stat-card" @click="stat.onClick">
          <div class="stat-content">
            <div class="stat-icon-wrapper">
              <v-icon
                :icon="stat.icon"
                size="28"
                class="stat-icon"
              />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
          <div class="stat-progress">
            <div
              class="stat-progress-bar"
              :style="{ width: `${stat.percentage}%` }"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskColors, useTaskFormatting } from '@/composables'

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
  inProgressTasks: {
    type: Number,
    default: 0,
  }
})

const emit = defineEmits(['filter-change'])

// Use composables
const { cssVars, applyCssVars } = useTaskColors('stats')

// Apply CSS variables
applyCssVars()

// Calculate completion percentage
const completionPercentage = computed(() => {
  if (props.totalTasks === 0) return 0
  return Math.round((props.completedTasks / props.totalTasks) * 100)
})

// Stats configuration
const stats = computed(() => [
  {
    icon: 'mdi-format-list-checks',
    label: 'Total Tasks',
    value: props.totalTasks,
    percentage: 100,
    onClick: () => emit('filter-change', { status: 'all' })
  },
  {
    icon: 'mdi-check-circle',
    label: 'Completed',
    value: props.completedTasks,
    percentage: completionPercentage.value,
    onClick: () => emit('filter-change', { status: 'completed' })
  },
  {
    icon: 'mdi-progress-clock',
    label: 'In Progress',
    value: props.inProgressTasks,
    percentage: props.totalTasks > 0 ? Math.round((props.inProgressTasks / props.totalTasks) * 100) : 0,
    onClick: () => emit('filter-change', { status: 'in-progress' })
  },
  {
    icon: 'mdi-alert-circle',
    label: 'Overdue',
    value: props.overdueTasks,
    percentage: props.totalTasks > 0 ? Math.round((props.overdueTasks / props.totalTasks) * 100) : 0,
    onClick: () => emit('filter-change', { status: 'overdue' })
  }
])
</script>

<style scoped>
.tasks-stats {
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--task-stats-bg);
  border: 1px solid var(--task-stats-border);
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.stat-card:hover {
  background: var(--task-stats-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-icon {
  color: var(--task-stats-icon);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--task-stats-text);
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--task-stats-label);
  opacity: 0.9;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.stat-card:hover .stat-value {
  color: var(--task-stats-text-hover);
}

.stat-card:hover .stat-label {
  color: var(--task-stats-label-hover);
  opacity: 1;
}

.stat-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.stat-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--task-stats-icon), rgba(255, 255, 255, 0.8));
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .stat-card {
    padding: 1.25rem;
  }

  .stat-content {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

  .stat-icon {
    font-size: 24px;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .tasks-stats {
    margin-bottom: 1.5rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-content {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .stat-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .stat-icon {
    font-size: 20px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }
}
</style>
