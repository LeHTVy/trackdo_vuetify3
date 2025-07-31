import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  const login = async credentials => {
    isLoading.value = true
    try {
      const response = await api.post('/auth/login', credentials)

      user.value = response.data.user
      token.value = response.data.token

      // Store in localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true, user: user.value }
    } catch (error) {
      console.error('Login error:', error)

      // Better error handling
      let errorMessage = 'Login failed'

      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const data = error.response.data

        // Use the exact message from backend if available
        if (data?.message) {
          errorMessage = data.message
        } else {
          switch (status) {
            case 401:
              errorMessage = 'Invalid username or password. Please check your credentials and try again.'
              break
            case 404:
              errorMessage = 'User not found. Please check your username or sign up for a new account.'
              break
            case 429:
              errorMessage = 'Too many login attempts. Please try again later.'
              break
            case 500:
              errorMessage = 'Server error. Please try again later.'
              break
            default:
              errorMessage = `Login failed (Error ${status})`
          }
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred during login.'
      }

      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const register = async userData => {
    isLoading.value = true
    try {
      const response = await api.post('/auth/register', userData)

      user.value = response.data.user
      token.value = response.data.token

      // Store in localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true, user: user.value }
    } catch (error) {
      console.error('Registration error:', error)

      // Better error handling
      let errorMessage = 'Registration failed'

      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const data = error.response.data

        // Use the exact message from backend if available
        if (data?.message) {
          errorMessage = data.message
        } else {
          switch (status) {
            case 400:
              errorMessage = 'Invalid registration data. Please check your information and try again.'
              break
            case 409:
              errorMessage = 'Username or email already exists. Please choose a different one.'
              break
            case 422:
              errorMessage = 'Invalid data format. Please check your information and try again.'
              break
            case 500:
              errorMessage = 'Server error. Please try again later.'
              break
            default:
              errorMessage = `Registration failed (Error ${status})`
          }
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred during registration.'
      }

      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Clear all stores data when logout
    clearAllStoresData()
  }

  const clearAllStoresData = () => {
    // Import stores dynamically to avoid circular dependency
    import('./tasks.js').then(({ useTasksStore }) => {
      const tasksStore = useTasksStore()
      tasksStore.$patch({ tasks: [] })
    })

    import('./projects.js').then(({ useProjectsStore }) => {
      const projectsStore = useProjectsStore()
      projectsStore.$patch({ projects: [] })
    })

    import('./events.js').then(({ useEventsStore }) => {
      const eventsStore = useEventsStore()
      eventsStore.$patch({ events: [] })
    })
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        token.value = savedToken
        user.value = parsedUser
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }

  initializeAuth()

  return {
    // State
    user,
    token,
    isLoading,

    // Getters
    isAuthenticated,
    currentUser,

    // Actions
    login,
    register,
    logout,
    initializeAuth,
  }
})
