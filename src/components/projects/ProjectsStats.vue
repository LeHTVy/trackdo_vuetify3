<template>
  <v-container class="mb-4">
    <v-row class="stats-row">
      <v-col
        v-for="(stat, index) in stats"
        :key="stat.label"
        class="stat-col"
        cols="12"
        lg="12"
        md="12"
        sm="6"
        xs="12"
      >
        <v-card
          class="stat-card h-100"
          elevation="0"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <v-card-text class="text-center pa-6">
            <div class="stat-icon-wrapper mb-3" :class="`bg-${stat.color}`">
              <v-icon class="stat-icon" :color="stat.color" size="32">{{ stat.icon }}</v-icon>
            </div>
            <div class="stat-number" :class="`text-${stat.color}`">
              <span class="counter" :data-target="stat.value">0</span>
            </div>
            <div class="stat-label text-body-1 font-weight-medium">{{ stat.label }}</div>
            <div class="stat-progress mt-2">
              <v-progress-linear
                class="stat-progress-bar"
                :color="stat.color"
                height="3"
                :model-value="getProgressValue(stat.label, stat.value)"
                rounded
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted } from 'vue'

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
      icon: 'mdi-folder-multiple-outline',
      label: 'Total Projects',
      value: props.totalProjects,
      color: 'primary',
    },
    {
      icon: 'mdi-play-circle-outline',
      label: 'Active Projects',
      value: props.activeProjects,
      color: 'success',
    },
    {
      icon: 'mdi-check-circle-outline',
      label: 'Completed',
      value: props.completedProjects,
      color: 'info',
    },
    {
      icon: 'mdi-pause-circle-outline',
      label: 'On Hold',
      value: props.onHoldProjects,
      color: 'warning',
    },
  ])

  const getProgressValue = (label, value) => {
    const total = props.totalProjects || 1
    if (label === 'Total Projects') return 100
    return Math.round((value / total) * 100)
  }

  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter')
    for (const counter of counters) {
      const target = Number.parseInt(counter.dataset.target)
      const increment = target / 50
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          counter.textContent = target
          clearInterval(timer)
        } else {
          counter.textContent = Math.floor(current)
        }
      }, 30)
    }
  }

  onMounted(() => {
    setTimeout(animateCounters, 500)
  })
</script>

<style scoped>
.stats-row {
  gap: 0.75rem;
}

.stat-col {
  animation: slideInUp 0.6s ease-out both;
  margin-bottom: 0.5rem;
}

.stat-card {
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.bg-primary {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05));
}

.bg-success {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
}

.bg-info {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05));
}

.bg-warning {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05));
}

.stat-icon {
  animation: bounce 2s infinite;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family: 'Roboto', sans-serif;
}

.stat-label {
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-progress-bar {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.stat-card:hover .stat-progress-bar {
  opacity: 1;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Dark theme adjustments */
.v-theme--dark .stat-card {
  background: rgba(45, 55, 72, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .stat-card:hover {
  background: rgba(45, 55, 72, 0.95);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .stat-label {
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .bg-primary {
  background: linear-gradient(135deg, rgba(66, 165, 245, 0.15), rgba(66, 165, 245, 0.08));
}

.v-theme--dark .bg-success {
  background: linear-gradient(135deg, rgba(102, 187, 106, 0.15), rgba(102, 187, 106, 0.08));
}

.v-theme--dark .bg-info {
  background: linear-gradient(135deg, rgba(66, 165, 245, 0.15), rgba(66, 165, 245, 0.08));
}

.v-theme--dark .bg-warning {
  background: linear-gradient(135deg, rgba(255, 183, 77, 0.15), rgba(255, 183, 77, 0.08));
}

/* Responsive design for mobile */
@media (max-width: 768px) {
  .stats-row {
    gap: 0.5rem;
  }

  .stat-col {
    margin-bottom: 0.25rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .stat-icon {
    font-size: 24px !important;
  }
}

@media (max-width: 600px) {
  .v-container {
    padding: 0.5rem;
  }

  .stats-row {
    gap: 0.25rem;
  }

  .stat-col {
    margin-bottom: 0;
  }
}
</style>
