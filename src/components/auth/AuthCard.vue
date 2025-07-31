<template>
  <v-card class="auth-card" elevation="12">
    <!-- Tabs -->
    <v-tabs
      centered
      class="auth-tabs"
      color="primary"
      grow
      :model-value="tab"
      @update:model-value="switchTab"
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
      <v-window :model-value="tab">
        <!-- Login Form -->
        <v-window-item value="login">
          <div class="form-container mt-8">
            <v-form ref="loginForm" :model-value="loginValid" @submit.prevent="handleLoginSubmit">
              <v-text-field
                v-model="loginData.username"
                class="mb-3"
                label="Username or Email"
                :loading="authStore.isLoading"
                prepend-inner-icon="mdi-account"
                :rules="usernameRules"
                variant="outlined"
              />

              <v-text-field
                v-model="loginData.password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                class="mb-4"
                label="Password"
                :loading="authStore.isLoading"
                prepend-inner-icon="mdi-lock"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="togglePasswordVisibility()"
              />

              <v-btn
                block
                class="auth-btn mb-3"
                color="primary"
                :disabled="!loginValid"
                :loading="authStore.isLoading"
                size="large"
                type="submit"
              >
                <v-icon class="mr-2">mdi-login</v-icon>
                Login
              </v-btn>

              <div class="text-center">
                <v-btn
                  color="primary"
                  size="small"
                  variant="text"
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
            <v-form ref="signupForm" :model-value="signupValid" @submit.prevent="handleSignupSubmit">
              <!-- Name Fields with better spacing -->
              <v-row class="mb-2">
                <v-col class="pb-2" cols="12" sm="6">
                  <v-text-field
                    v-model="signupData.firstName"
                    density="comfortable"
                    label="First Name"
                    :loading="authStore.isLoading"
                    prepend-inner-icon="mdi-account"
                    :rules="firstNameRules"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-2" cols="12" sm="6">
                  <v-text-field
                    v-model="signupData.lastName"
                    density="comfortable"
                    label="Last Name"
                    :loading="authStore.isLoading"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="lastNameRules"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="signupData.username"
                class="mb-3"
                density="comfortable"
                label="Username"
                :loading="authStore.isLoading"
                prepend-inner-icon="mdi-at"
                :rules="signupUsernameRules"
                variant="outlined"
              />

              <v-text-field
                v-model="signupData.email"
                class="mb-3"
                density="comfortable"
                label="Email"
                :loading="authStore.isLoading"
                prepend-inner-icon="mdi-email"
                :rules="emailRules"
                variant="outlined"
              />

              <v-text-field
                v-model="signupData.password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                class="mb-3"
                density="comfortable"
                label="Password"
                :loading="authStore.isLoading"
                prepend-inner-icon="mdi-lock"
                :rules="signupPasswordRules"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="togglePasswordVisibility()"
              />

              <v-text-field
                v-model="signupData.confirmPassword"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                class="mb-4"
                density="comfortable"
                label="Confirm Password"
                :loading="authStore.isLoading"
                prepend-inner-icon="mdi-lock-check"
                :rules="confirmPasswordRules"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="togglePasswordVisibility('confirm')"
              />

              <v-btn
                block
                class="auth-btn mb-3"
                color="primary"
                :disabled="!signupValid"
                :loading="authStore.isLoading"
                size="large"
                type="submit"
              >
                <v-icon class="mr-2">mdi-account-plus</v-icon>
                Sign Up
              </v-btn>

              <div class="text-center">
                <v-btn
                  color="primary"
                  size="small"
                  variant="text"
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
  import { computed } from 'vue'
  import { useAuth } from '@/composables/common/useAuth'
  import { useAuthStore } from '@/stores/auth'
  import { useSnackbarStore } from '@/stores/snackbar'

  const authStore = useAuthStore()
  const snackbarStore = useSnackbarStore()

  // Get state and methods from useAuth (excluding snackbar)
  const {
    // State
    tab,
    showPassword,
    showConfirmPassword,
    loginData,
    signupData,

    // Validation
    loginValidation,
    signupValidation,

    // Methods
    handleLogin,
    handleSignup,
    switchTab,
    togglePasswordVisibility,
  } = useAuth()

  // Message methods from store
  const showErrorMessage = message => {
    snackbarStore.showErrorMessage(message)
  }

  // Computed validation states
  const loginValid = computed(() => {
    return loginValidation.validationState.value.isValid
  })

  const signupValid = computed(() => {
    return signupValidation.validationState.value.isValid
  })

  // Enhanced validation rules with better error messages
  const usernameRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'Username or email is required'
      if (value.length < 3) return 'Username must be at least 3 characters'
      return true
    },
  ])

  const passwordRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'Password is required'
      if (value.length < 6) return 'Password must be at least 6 characters'
      return true
    },
  ])

  const firstNameRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'First name is required'
      if (value.length < 2) return 'First name must be at least 2 characters'
      return true
    },
  ])

  const lastNameRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'Last name is required'
      if (value.length < 2) return 'Last name must be at least 2 characters'
      return true
    },
  ])

  const signupUsernameRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'Username is required'
      if (value.length < 3) return 'Username must be at least 3 characters'
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores'
      return true
    },
  ])

  const emailRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'Email is required'
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(value)) return 'Please enter a valid email address'
      return true
    },
  ])

  const signupPasswordRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'Password is required'
      if (value.length < 6) return 'Password must be at least 6 characters'
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
      return true
    },
  ])

  const confirmPasswordRules = computed(() => [
    value => {
      if (!value || value.trim() === '') return 'Password confirmation is required'
      if (value !== signupData.value.password) return 'Password confirmation does not match'
      return true
    },
  ])

  // Enhanced form submission handlers with better error handling
  const handleLoginSubmit = async () => {
    console.log('🔄 AuthCard: Login form submitted')

    try {
      // Validate form first
      if (!loginValid.value) {
        showErrorMessage('Please fix validation errors before submitting')
        return
      }

      // Call the useAuth handleLogin method
      const result = await handleLogin()
      console.log('🔄 AuthCard: Login result:', result)

      if (!result.success) {
        console.log('❌ AuthCard: Login failed, error should be shown by useAuth')
      }
    } catch (error) {
      console.log('💥 AuthCard: Login error:', error)
      showErrorMessage('An unexpected error occurred during login')
    }
  }

  const handleSignupSubmit = async () => {
    console.log('🔄 AuthCard: Signup form submitted')

    try {
      // Validate form first
      if (!signupValid.value) {
        showErrorMessage('Please fix validation errors before submitting')
        return
      }

      // Call the useAuth handleSignup method
      const result = await handleSignup()
      console.log('🔄 AuthCard: Signup result:', result)

      if (!result.success) {
        console.log('❌ AuthCard: Signup failed, error should be shown by useAuth')
      }
    } catch (error) {
      console.log('💥 AuthCard: Signup error:', error)
      showErrorMessage('An unexpected error occurred during registration')
    }
  }
</script>

<style scoped>
.auth-card {
  border-radius: 16px !important;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
  min-height: 600px;
  box-sizing: border-box;
  border: none;
  transition: all 0.3s ease;
  margin: 0 auto;
  margin-top: 5rem;
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
  padding: 1.5rem 0;
}

/* Add more top spacing for form container */
.form-container {
  padding-top: 2rem;
}

/* Add more padding to card content */
:deep(.v-card-text) {
  padding: 2rem 2.5rem !important;
}

/* Mobile responsive improvements */
@media (max-width: 600px) {
  :deep(.v-col) {
    padding-left: 4px !important;
    padding-right: 4px !important;
  }

  .auth-card {
    margin: 0.5rem;
    max-width: 95%;
    min-height: 550px;
  }

  :deep(.v-card-text) {
    padding: 1.5rem 1.5rem !important;
  }

  .v-window-item .v-form {
    padding: 1rem 0;
  }
}
</style>
