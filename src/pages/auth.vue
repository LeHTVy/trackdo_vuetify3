<template>
  <v-container class="auth-container fill-height" fluid>
    <v-row class="fill-height" no-gutters>
      <!-- Left Side - Auth Form -->
      <v-col cols="12" md="6" class="auth-form-section">
        <div class="form-wrapper">
          <AuthCard />
        </div>
      </v-col>

      <!-- Right Side - Visual/Animation -->
      <v-col cols="12" md="6" class="auth-visual-section">
        <AuthVisual />
      </v-col>
    </v-row>

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
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/common/useAuth'
import { useAuthStore } from '@/stores/auth'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthVisual from '@/components/auth/AuthVisual.vue'

const authStore = useAuthStore()

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
  background-color: rgb(var(--v-theme-app-background));
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  max-width: 100vw;
}

.auth-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  max-width: 100%;
  background-color: rgb(var(--v-theme-primary));
}

.auth-visual-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  max-width: 100%;
}

.auth-form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary-rgb), 0.03) 0%,
    rgba(var(--v-theme-secondary-rgb), 0.02) 50%,
    rgba(var(--v-theme-primary-rgb), 0.03) 100%
  );
  backdrop-filter: blur(5px);
}

.form-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
  padding: 2rem;
}

.auth-visual-section {
  padding: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .auth-visual-section {
    display: none;
  }
}

@media (max-width: 600px) {
  .form-wrapper {
    padding: 1rem;
  }
}
</style>
