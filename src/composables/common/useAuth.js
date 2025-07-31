import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSnackbarStore } from '@/stores/snackbar'
import { useValidation, validationSchemas } from '@/composables/common/useValidation'
import { authLogger } from '@/services/logger'

export function useAuth () {
  const router = useRouter()
  const authStore = useAuthStore()
  const snackbarStore = useSnackbarStore()

  // Reactive data
  const tab = ref('login')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)

  const loginData = ref({
    username: '',
    password: '',
  })

  const signupData = ref({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const snackbar = computed(() => snackbarStore.snackbar)
  const loginValidation = useValidation(loginData, validationSchemas.auth.login)
  const signupValidation = useValidation(signupData, {
    ...validationSchemas.auth.signup,
    confirmPassword: [
      value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Password confirmation is required' : true,
      value => value === signupData.value.password ? true : 'Password confirmation does not match',
    ],
  })

  // Computed
  const isLogin = computed(() => tab.value === 'login')
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const loginValid = computed(() => loginValidation.validationState.value.isValid)
  const signupValid = computed(() => signupValidation.validationState.value.isValid)

  // Legacy rules for backwards compatibility
  const rules = loginValidation.rules

  // Methods
  const showMessage = (message, color = 'success') => {
    snackbarStore.showMessage(message, color)
  }

  const hideMessage = () => {
    snackbarStore.hideMessage()
  }

  const showSuccessMessage = message => {
    snackbarStore.showSuccessMessage(message)
  }

  const showErrorMessage = message => {
    snackbarStore.showErrorMessage(message)
  }

  const showWarningMessage = message => {
    snackbarStore.showWarningMessage(message)
  }

  const showInfoMessage = message => {
    snackbarStore.showInfoMessage(message)
  }

  const resetForms = () => {
    loginData.value = { username: '', password: '' }
    signupData.value = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
    showPassword.value = false
    showConfirmPassword.value = false

    // Clear validation errors
    loginValidation.clearErrors()
    signupValidation.clearErrors()

    authLogger.debug('Forms reset')
  }

  const handleLogin = async () => {
    try {
      console.log('🚀 Starting login process...')

      // Reset any previous messages
      hideMessage()

      // Validate form
      if (!loginValidation.validateForm()) {
        const errorMsg = 'Please fix validation errors before submitting'
        console.log('❌ Validation failed:', loginValidation.validationState.value.errors)
        showErrorMessage(errorMsg)
        return { success: false, error: 'Validation failed' }
      }

      console.log('✅ Form validation passed')
      authLogger.debug('Attempting login', { username: loginData.value.username })

      // Show loading message
      showInfoMessage('Logging in...')

      const result = await authStore.login(loginData.value)
      console.log('🔄 Login result:', result)

      if (result.success) {
        console.log('✅ Login successful!')
        showSuccessMessage('Login successful! Welcome back!')
        authLogger.success('User logged in successfully', { username: loginData.value.username })

        // Reload user-specific data after successful login
        await reloadUserData()

        // Redirect after a short delay to show success message
        setTimeout(() => {
          console.log('🔄 Redirecting to home...')
          router.push('/')
        }, 1500) // Reduced timeout for better UX

        return result
      } else {
        console.log('❌ Login failed:', result.error)

        // Enhanced error message handling
        let errorMessage = 'Login failed'
        if (result.error) {
          // Use exact backend error message
          errorMessage = result.error

          // Add user-friendly context for common errors
          if (result.error.includes('No account found')) {
            errorMessage = `${result.error} Please check your username/email or sign up for a new account.`
          } else if (result.error.includes('Incorrect password')) {
            errorMessage = `${result.error} Please verify your password and try again.`
          } else if (result.error.includes('Network') || result.error.includes('connect')) {
            errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
          }
        }

        showErrorMessage(errorMessage)
        authLogger.error('Login failed', { error: result.error, username: loginData.value.username })

        console.log('❌ Login failed - staying on auth page for user to retry')
        return result
      }
    } catch (error) {
      console.log('💥 Login exception:', error)
      const errorMsg = error.message || 'An unexpected error occurred during login'
      showErrorMessage(errorMsg)
      authLogger.error('Login error', error)
      return { success: false, error: errorMsg }
    }
  }

  const handleSignup = async () => {
    try {
      hideMessage()
      if (!signupValidation.validateForm()) {
        const errorMsg = 'Please fix validation errors before submitting'
        console.log('❌ Validation failed:', signupValidation.validationState.value.errors)
        showErrorMessage(errorMsg)
        return { success: false, error: 'Validation failed' }
      }

      console.log('✅ Form validation passed')
      authLogger.debug('Attempting signup', { username: signupData.value.username, email: signupData.value.email })

      showInfoMessage('Creating your account...')

      const result = await authStore.register(signupData.value)
      console.log('🔄 Signup result:', result)

      if (result.success) {
        showSuccessMessage('Account created successfully! Logging you in...')
        authLogger.success('User registered successfully', {
          username: signupData.value.username,
          email: signupData.value.email,
        })

        try {
          const loginResult = await authStore.login({
            username: signupData.value.username,
            password: signupData.value.password,
          })

          if (loginResult.success) {
            showSuccessMessage('Welcome to TrackDo! Redirecting...')

            // Reload user-specific data after successful auto-login
            await reloadUserData()

            signupData.value = {
              firstName: '',
              lastName: '',
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }

            // Immediate redirect after auto-login
            setTimeout(() => {
              console.log('🔄 Redirecting to home...')
              router.push('/')
            }, 1000) // Shorter timeout for better UX
          } else {
            console.log('❌ Auto-login failed, user needs to login manually')
            showInfoMessage('Account created! Please login with your credentials.')
            // Switch to login tab
            tab.value = 'login'
            // Pre-fill username
            loginData.value.username = signupData.value.username
            // Clear signup form
            signupData.value = {
              firstName: '',
              lastName: '',
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }
          }
        } catch (loginError) {
          console.log('💥 Auto-login error:', loginError)
          showInfoMessage('Account created! Please login with your credentials.')
          tab.value = 'login'
          loginData.value.username = signupData.value.username
          signupData.value = {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          }
        }

        return result
      } else {
        console.log('❌ Signup failed:', result.error)

        let errorMessage = 'Registration failed'
        if (result.error) {
          errorMessage = result.error

          if (result.error.includes('already exists') || result.error.includes('already taken')) {
            errorMessage = `${result.error} Please try a different username or email.`
          } else if (result.error.includes('Password')) {
            errorMessage = `${result.error} Please ensure your password meets the requirements.`
          } else if (result.error.includes('Email')) {
            errorMessage = `${result.error} Please check your email format.`
          } else if (result.error.includes('Network') || result.error.includes('connect')) {
            errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
          }
        }

        showErrorMessage(errorMessage)
        authLogger.error('Signup failed', {
          error: result.error,
          username: signupData.value.username,
          email: signupData.value.email,
        })

        console.log('❌ Signup failed - staying on auth page for user to retry')
        return result
      }
    } catch (error) {
      console.log('💥 Signup exception:', error)
      const errorMsg = error.message || 'An unexpected error occurred during registration'
      showErrorMessage(errorMsg)
      authLogger.error('Signup error', error)
      return { success: false, error: errorMsg }
    }
  }

  const switchTab = newTab => {
    tab.value = newTab
  }

  const togglePasswordVisibility = (field = 'password') => {
    if (field === 'confirm') {
      showConfirmPassword.value = !showConfirmPassword.value
    } else {
      showPassword.value = !showPassword.value
    }
  }

  // Watch for tab changes to reset forms
  watch(tab, resetForms)

  // Auto redirect if already authenticated
  const checkAuthAndRedirect = () => {
    if (isAuthenticated.value) {
      router.push('/')
    }
  }

  // Reload user-specific data after login
  const reloadUserData = async () => {
    try {
      console.log('🔄 Reloading user-specific data...')

      // Import stores dynamically to avoid circular dependency
      const { initializeStores } = await import('@/stores/init.js')
      await initializeStores()

      console.log('✅ User data reloaded successfully')
    } catch (error) {
      console.error('❌ Error reloading user data:', error)
      authLogger.error('Failed to reload user data', error)
    }
  }

  return {
    // State
    tab,
    showPassword,
    showConfirmPassword,
    loginValid,
    signupValid,
    loginData,
    signupData,
    snackbar,

    // Computed
    isLogin,
    isAuthenticated,

    // Validation
    rules,
    loginValidation,
    signupValidation,

    // Methods
    showMessage,
    hideMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
    showInfoMessage,
    resetForms,
    handleLogin,
    handleSignup,
    switchTab,
    togglePasswordVisibility,
    checkAuthAndRedirect,
    reloadUserData,
  }
}
