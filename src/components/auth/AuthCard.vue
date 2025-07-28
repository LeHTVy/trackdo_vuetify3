<template>
  <v-card class="auth-card" elevation="12">
    <!-- Header
    <v-card-title class="auth-header text-center pa-6">
      <div class="d-flex flex-column align-center">
        <v-icon class="auth-logo mb-3" color="primary" size="48">
          mdi-check-circle
        </v-icon>
        <h2 class="text-h4 font-weight-bold text-primary mb-2">
          Track<span class="text-accent">Do</span>
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          {{ isLogin ? 'Welcome back!' : 'Create new account' }}
        </p>
      </div>
    </v-card-title>-->

    <!-- Tabs -->
    <v-tabs
      v-model="tab"
      class="auth-tabs"
      color="primary"
      centered
      grow
    >
      <v-tab value="login">
        <v-icon class="mr-2">mdi-login</v-icon>
        Login
      </v-tab>
      <v-tab value="signup">
        <v-icon class="mr-2">mdi-account-plus</v-icon>
        Sign Up
      </v-tab>
    </v-tabs>

    <v-card-text class="pa-6 pt-8">
      <v-window v-model="tab">
        <!-- Login Form -->
        <v-window-item value="login">
          <div class="form-container mt-4">
            <v-form ref="loginForm" v-model="loginValid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="loginData.username"
                :rules="[rules.required]"
                label="Username or Email"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                class="mb-3"
                :loading="authStore.isLoading"
              />

              <v-text-field
                v-model="loginData.password"
                :rules="[rules.required]"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                variant="outlined"
                class="mb-4"
                :loading="authStore.isLoading"
                @click:append-inner="togglePasswordVisibility()"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="auth-btn mb-3"
                :loading="authStore.isLoading"
                :disabled="!loginValid"
              >
                <v-icon class="mr-2">mdi-login</v-icon>
                Login
              </v-btn>

              <div class="text-center">
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click="switchTab('signup')"
                >
                  Don't have an account? Sign up now
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-window-item>

        <!-- Signup Form -->
        <v-window-item value="signup">
          <div class="form-container mt-4">
            <v-form ref="signupForm" v-model="signupValid" @submit.prevent="handleSignup">
              <!-- Name Fields with better spacing -->
              <v-row class="mb-2">
                <v-col cols="12" sm="6" class="pb-2">
                  <v-text-field
                    v-model="signupData.firstName"
                    :rules="[rules.required]"
                    label="First Name"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    density="comfortable"
                    :loading="authStore.isLoading"
                  />
                </v-col>
                <v-col cols="12" sm="6" class="pb-2">
                  <v-text-field
                    v-model="signupData.lastName"
                    :rules="[rules.required]"
                    label="Last Name"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    density="comfortable"
                    :loading="authStore.isLoading"
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="signupData.username"
                :rules="[rules.required, rules.username]"
                label="Username"
                prepend-inner-icon="mdi-at"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                :loading="authStore.isLoading"
              />

              <v-text-field
                v-model="signupData.email"
                :rules="[rules.required, rules.email]"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                :loading="authStore.isLoading"
              />

              <v-text-field
                v-model="signupData.password"
                :rules="[rules.required, rules.password]"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                :loading="authStore.isLoading"
                @click:append-inner="togglePasswordVisibility()"
              />

              <v-text-field
                v-model="signupData.confirmPassword"
                :rules="[rules.required, rules.confirmPassword]"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirm Password"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :loading="authStore.isLoading"
                @click:append-inner="togglePasswordVisibility('confirm')"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="auth-btn mb-3"
                :loading="authStore.isLoading"
                :disabled="!signupValid"
              >
                <v-icon class="mr-2">mdi-account-plus</v-icon>
                Sign Up
              </v-btn>

              <div class="text-center">
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click="switchTab('login')"
                >
                  Already have an account? Login
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useAuth } from '@/composables/common/useAuth'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Use the auth composable
const {
  // State
  tab,
  showPassword,
  showConfirmPassword,
  loginValid,
  signupValid,
  loginData,
  signupData,

  // Computed
  isLogin,

  // Validation
  rules,

  // Methods
  handleLogin,
  handleSignup,
  switchTab,
  togglePasswordVisibility
} = useAuth()
</script>

<style scoped>
.auth-card {
  border-radius: 16px !important;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  border: none;
  transition: all 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.auth-header {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.auth-logo {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.auth-tabs {
  background-color: rgba(var(--v-theme-primary-rgb), 0.05);
  border-bottom: 1px solid rgba(var(--v-theme-primary-rgb), 0.1);
}

.auth-btn {
  border-radius: 12px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary-rgb), 0.3);
}

:deep(.v-field),
:deep(.v-field--outlined) {
  border-radius: 12px !important;
  background-color: rgb(var(--v-theme-surface));
}

:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
}

:deep(.v-tab--selected) {
  color: rgb(var(--v-theme-primary)) !important;
}

.text-accent {
  color: rgb(var(--v-theme-accent-yellow)) !important;
}

/* Improved form spacing */
:deep(.v-row) {
  margin-left: -8px !important;
  margin-right: -8px !important;
}

:deep(.v-col) {
  padding-left: 8px !important;
  padding-right: 8px !important;
}

/* Better field spacing for name fields */
:deep(.v-field--density-comfortable) {
  --v-field-padding-top: 12px;
  --v-field-padding-bottom: 12px;
}

/* Ensure proper spacing between form elements */
.v-window-item .v-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Mobile responsive improvements */
@media (max-width: 600px) {
  :deep(.v-col) {
    padding-left: 4px !important;
    padding-right: 4px !important;
  }

  .auth-card {
    margin: 0.5rem;
  }
}
</style>
