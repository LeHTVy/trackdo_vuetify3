<template>
  <v-card class="feature-card h-100" elevation="4">
    <v-card-text class="text-center pa-8">
      <div class="feature-icon-container mb-5">
        <v-avatar class="feature-icon" :color="color" size="72">
          <v-icon color="white" size="36">{{ icon }}</v-icon>
        </v-avatar>
        <div class="icon-glow" :class="`${color}-glow`" />
      </div>
      <h3 class="text-h5 font-weight-bold mb-4" :class="`text-${color}`">{{ title }}</h3>
      <p class="text-body-1 text-medium-emphasis">
        {{ description }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
  defineProps({
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
  })
</script>

<style scoped>
.feature-card {
  border-radius: 18px;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  height: 300px;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon-container {
  position: relative;
  display: inline-block;
}

.feature-icon {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover .icon-glow {
  opacity: 0.3;
}

.primary-glow {
  background: radial-gradient(circle, #1976D2 0%, transparent 70%);
}

.success-glow {
  background: radial-gradient(circle, #4CAF50 0%, transparent 70%);
}

.secondary-glow {
  background: radial-gradient(circle, #FFC107 0%, transparent 70%);
}

/* Dark theme adjustments */
.v-theme--dark .feature-card {
  background: rgba(45, 55, 72, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
