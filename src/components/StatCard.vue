<template>
  <v-card class="stat-card" :color="color" elevation="3" variant="tonal">
    <v-card-text class="text-center">
      <v-icon class="mb-2" :color="iconColor" :icon="icon" size="48" />
      <div class="stat-number" :class="`text-${textColor}`">
        {{ formattedValue }}
      </div>
      <div class="text-subtitle-1 font-weight-medium">
        {{ title }}
      </div>
      <div v-if="subtitle" class="text-caption text-grey">
        {{ subtitle }}
      </div>

      <!-- Trend indicator -->
      <div v-if="trend" class="d-flex align-center justify-center mt-2">
        <v-icon
          class="mr-1"
          :color="trend.direction === 'up' ? 'success' : 'error'"
          :icon="trend.direction === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'"
          size="small"
        />
        <span
          class="text-caption"
          :class="trend.direction === 'up' ? 'text-success' : 'text-error'"
        >
          {{ trend.value }}%
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    iconColor: {
      type: String,
      default: '',
    },
    textColor: {
      type: String,
      default: 'primary',
    },
    subtitle: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'number', // number, currency, percentage
      validator: value => ['number', 'currency', 'percentage'].includes(value),
    },
    trend: {
      type: Object,
      default: null,
      validator: value => {
        if (!value) return true
        return value.direction && ['up', 'down'].includes(value.direction)
          && typeof value.value === 'number'
      },
    },
  })

  const formattedValue = computed(() => {
    const numValue = typeof props.value === 'string' ? Number.parseFloat(props.value) : props.value

    switch (props.format) {
      case 'currency': {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numValue)
      }

      case 'percentage': {
        return `${numValue}%`
      }

      default: {
        return new Intl.NumberFormat('en-US').format(numValue)
      }
    }
  })
</script>

<style scoped>
.stat-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

/* Dark theme adjustments */
.v-theme--dark .stat-card {
  background: rgba(45, 55, 72, 0.95);
}
</style>
