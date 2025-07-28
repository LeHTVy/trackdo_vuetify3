/**
 * Composable for authentication logic
 * Handles login, signup, validation, and form management
 */
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Reactive data
  const tab = ref('login')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const loginValid = ref(false)
  const signupValid = ref(false)

  const loginData = ref({
    username: '',
    password: ''
  })

  const signupData = ref({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
  })

  // Computed
  const isLogin = computed(() => tab.value === 'login')
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // Validation rules
  const rules = {
    required: value => !!value || 'This field is required',
    email: value => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Invalid email format'
    },
    username: value => {
      const pattern = /^[a-zA-Z0-9_]{3,20}$/
      return pattern.test(value) || 'Username must be 3-20 characters, containing only letters, numbers and underscores'
    },
    password: value => {
      return value.length >= 6 || 'Password must be at least 6 characters'
    },
    confirmPassword: value => {
      return value === signupData.value.password || 'Password confirmation does not match'
    }
  }

  // Methods
  const showMessage = (message, color = 'success') => {
    snackbar.value = {
      show: true,
      message,
      color
    }
  }

  const resetForms = () => {
    loginData.value = { username: '', password: '' }
    signupData.value = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
    showPassword.value = false
    showConfirmPassword.value = false
  }

  const handleLogin = async () => {
    if (!loginValid.value) return

    try {
      const result = await authStore.login(loginData.value)

      if (result.success) {
        showMessage('Login successful!', 'success')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        showMessage(result.error || 'Login failed', 'error')
      }
    } catch (error) {
      showMessage('An error occurred during login', 'error')
      console.error('Login error:', error)
    }
  }

  const handleSignup = async () => {
    if (!signupValid.value) return

    try {
      const result = await authStore.register(signupData.value)

      if (result.success) {
        showMessage('Registration successful!', 'success')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        showMessage(result.error || 'Registration failed', 'error')
      }
    } catch (error) {
      showMessage('An error occurred during registration', 'error')
      console.error('Registration error:', error)
    }
  }

  const switchTab = (newTab) => {
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

    // Methods
    showMessage,
    resetForms,
    handleLogin,
    handleSignup,
    switchTab,
    togglePasswordVisibility,
    checkAuthAndRedirect
  }
}
