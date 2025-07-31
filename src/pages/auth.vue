<template>
  <div class="auth-container app-background">
    <!-- Background Content with App Preview -->
    <div class="background-content">
      <div class="visual-content-wrapper">
        <!-- Header Text -->
        <div class="hero-text-section">
          <h1 class="hero-title">
            The first productivity app<br>
            for everyone with <span class="brand-text">TrackDo</span>
          </h1>
          <p class="hero-subtitle">
            Innovative software for smart task and project management
          </p>
        </div>

        <!-- App Preview -->
        <AppPreview />
      </div>
    </div>

    <!-- Overlay Auth Form -->
    <div class="auth-overlay">
      <AuthCard />
    </div>

    <!-- Enhanced Snackbar with better visibility -->
    <v-snackbar
      v-model="snackbar.show"
      class="auth-snackbar"
      :color="snackbar.color"
      elevation="6"
      location="top center"
      rounded="lg"
      :timeout="snackbar.color === 'error' ? 8000 : snackbar.color === 'warning' ? 6000 : 4000"
    >
      <div class="d-flex align-center">
        <v-icon
          class="me-2"
          :icon="getSnackbarIcon(snackbar.color)"
          size="20"
        />
        <span class="font-weight-medium">{{ snackbar.message }}</span>
      </div>

      <template #actions>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="hideMessage"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
  import { computed, onMounted } from 'vue'
  import { useSnackbarStore } from '@/stores/snackbar'
  import AuthCard from '@/components/auth/AuthCard.vue'
  import AppPreview from '@/components/auth/AppPreview.vue'

  // Use snackbar store
  const snackbarStore = useSnackbarStore()
  const snackbar = computed(() => snackbarStore.snackbar)

  const hideMessage = () => {
    snackbarStore.hideMessage()
  }

  // Method to get appropriate icon for snackbar
  const getSnackbarIcon = color => {
    switch (color) {
      case 'success':
        return 'mdi-check-circle'
      case 'error':
        return 'mdi-alert-circle'
      case 'warning':
        return 'mdi-alert'
      case 'info':
        return 'mdi-information'
      default:
        return 'mdi-information'
    }
  }

  // Check authentication on mount
  onMounted(() => {
    console.log('🔧 Auth page mounted, snackbar state:', snackbar.value)
  })
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.auth-snackbar {
  z-index: 9999 !important;
}

.auth-snackbar .v-snackbar__wrapper {
  min-width: 300px;
  max-width: 500px;
}

.auth-snackbar .v-snackbar__content {
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.4;
}

/* Ensure snackbar is always visible */
.v-snackbar--active {
  transform: translateY(0) !important;
  opacity: 1 !important;
}

/* Color variants for better visibility */
.v-snackbar.v-theme--light.success {
  background-color: #4caf50 !important;
  color: white !important;
}

.v-snackbar.v-theme--light.error {
  background-color: #f44336 !important;
  color: white !important;
}

.v-snackbar.v-theme--light.warning {
  background-color: #ff9800 !important;
  color: white !important;
}

.v-snackbar.v-theme--light.info {
  background-color: #2196f3 !important;
  color: white !important;
}

.background-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg,
    rgb(var(--v-theme-background)) 0%,
    rgba(var(--v-theme-primary-rgb), 0.05) 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 1;
}

.auth-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.visual-content-wrapper {
  max-width: 800px;
  width: 100%;
  margin-left: 2rem;
}

.hero-text-section {
  margin-top: 30rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: rgb(var(--v-theme-title-text));
  margin-bottom: 1rem;
}

.brand-text {
  color: rgb(var(--v-theme-primary));
  background: linear-gradient(45deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgb(var(--v-theme-subtitle-text));
  line-height: 1.6;
}


/* Responsive Design */
@media (max-width: 1200px) {
  .auth-overlay {
    width: 45%;
  }
}

@media (max-width: 960px) {
  .auth-container {
    display: flex;
    flex-direction: column;
  }

  .background-content {
    position: relative;
    height: auto;
    min-height: 50vh;
    order: 2;
  }

  .auth-overlay {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 50vh;
    order: 1;
    background: rgb(var(--v-theme-surface));
    backdrop-filter: none;
    border-left: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .hero-title {
    font-size: 2rem;
  }

  .visual-content-wrapper {
    margin-left: 0;
  }


}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .auth-overlay {
    padding: 1rem;
  }

  .background-content {
    padding: 1rem;
  }

    .hero-text-section {
    margin-top: 20rem;
  }
}
</style>
