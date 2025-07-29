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

    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      location="top"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/common/useAuth'
import AuthCard from '@/components/auth/AuthCard.vue'
import AppPreview from '@/components/auth/AppPreview.vue'

// Use the auth composable
const {
  // State
  snackbar,

  // Methods
  checkAuthAndRedirect
} = useAuth()

// Check authentication on mount
onMounted(() => {
  checkAuthAndRedirect()
})
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
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
}
</style>
