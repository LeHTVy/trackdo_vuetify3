<template>
  <v-card class="stat-card" color="card-bg" elevation="3">
    <v-card-text class="pa-6">
      <div class="stat-number mb-2" :class="`text-${color}`">{{ value }}</div>
      <div class="text-body-1 text-medium-emphasis">{{ label }}</div>

      <!-- Dynamic Progress Bars -->
      <div class="progress-container mt-3">
        <v-progress-linear
          :animated="progress > 80"
          :color="color"
          height="6"
          :model-value="progress"
          rounded
          :striped="progress > 80"
        />

        <!-- Progress percentage display -->
        <div class="progress-text mt-1">
          <span class="text-caption" :class="`text-${color}`">
            {{ progress }}% {{ getProgressLabel(progress) }}
          </span>
        </div>

        <!-- Multiple progress indicators for different metrics -->
        <div v-if="showMultipleProgress" class="multi-progress mt-2">
          <div class="progress-item">
            <span class="text-caption text-medium-emphasis">This Week</span>
            <v-progress-linear
              class="mt-1"
              :color="color"
              height="3"
              :model-value="weeklyProgress"
              rounded
            />
          </div>
          <div class="progress-item mt-1">
            <span class="text-caption text-medium-emphasis">This Month</span>
            <v-progress-linear
              class="mt-1"
              :color="color"
              height="3"
              :model-value="monthlyProgress"
              rounded
            />
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>

  // Props
  defineProps({
    value: {
      type: [Number, String],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    progress: {
      type: Number,
      default: 0,
    },
    showMultipleProgress: {
      type: Boolean,
      default: false,
    },
    weeklyProgress: {
      type: Number,
      default: 0,
    },
    monthlyProgress: {
      type: Number,
      default: 0,
    },
  })

  // Methods
  const getProgressLabel = progress => {
    if (progress >= 90) return '🔥 Excellent!'
    if (progress >= 75) return '✨ Great!'
    if (progress >= 50) return '👍 Good'
    if (progress >= 25) return '📈 Growing'
    return '🚀 Getting Started'
  }
</script>

<style scoped>
  .stat-card {
    transition: all 0.3s ease;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    background: linear-gradient(45deg, currentColor, currentColor);
    background-clip: text;
    -webkit-background-clip: text;
  }

  .progress-container {
    position: relative;
  }

  .progress-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .multi-progress {
    padding: 8px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .progress-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Dark mode adjustments */
  .v-theme--dark .stat-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .v-theme--dark .stat-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .v-theme--dark .multi-progress {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Progress bar animations */
  .v-progress-linear {
    transition: all 0.3s ease;
  }

  .v-progress-linear:hover {
    transform: scaleY(1.2);
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .stat-number {
      font-size: 2rem;
    }

    .multi-progress {
      padding: 6px 0;
    }
  }
</style>
