import { defineStore } from 'pinia'
import { mongoService } from '@/services/mongodb.js'
import { isEventToday, isEventUpcoming } from '@/utils/dateUtils.js'
import { useAuthStore } from './auth.js'
import { storeLogger } from '@/services/logger.js'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Filter events by current user
    getUserEvents: state => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return []
      return state.events.filter(event =>
        event.userId === authStore.currentUser?.id ||
        event.userId === authStore.currentUser?._id
      )
    },

    getEvents: state => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return []
      return state.events.filter(event =>
        event.userId === authStore.currentUser?.id ||
        event.userId === authStore.currentUser?._id
      )
    },

    getEventById: state => id => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return null
      return state.events.find(event =>
        ((event.id === id) || (event._id === id)) &&
        (event.userId === authStore.currentUser?.id || event.userId === authStore.currentUser?._id)
      )
    },

    // Enhanced getters using dateUtils
    getTodayEvents: state => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return []
      const userEvents = state.events.filter(event =>
        event.userId === authStore.currentUser?.id ||
        event.userId === authStore.currentUser?._id
      )
      return userEvents.filter(event => isEventToday(event))
        .sort((a, b) => new Date(a.start) - new Date(b.start))
    },

    getUpcomingEvents: state => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return []
      const userEvents = state.events.filter(event =>
        event.userId === authStore.currentUser?.id ||
        event.userId === authStore.currentUser?._id
      )
      return userEvents.filter(event => isEventUpcoming(event))
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 5) // Limit to 5 upcoming events
    },

    getEventsByDate: state => date => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return []
      const userEvents = state.events.filter(event =>
        event.userId === authStore.currentUser?.id ||
        event.userId === authStore.currentUser?._id
      )
      const targetDate = new Date(date).toISOString().split('T')[0]
      return userEvents.filter(event => {
        const eventDate = new Date(event.start).toISOString().split('T')[0]
        return eventDate === targetDate
      }).sort((a, b) => new Date(a.start) - new Date(b.start))
    },

    getEventsByDateRange: state => (startDate, endDate) => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return []
      const userEvents = state.events.filter(event =>
        event.userId === authStore.currentUser?.id ||
        event.userId === authStore.currentUser?._id
      )
      const start = new Date(startDate)
      const end = new Date(endDate)
      return userEvents.filter(event => {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end || event.start)
        return eventStart <= end && eventEnd >= start
      }).sort((a, b) => new Date(a.start) - new Date(b.start))
    },
  },

  actions: {
    async initializeStore () {
      try {
        this.loading = true
        this.error = null

        // Only fetch if user is authenticated
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) {
          this.events = []
          this.loading = false
          return
        }

        const result = await mongoService.events.getAll()
        if (result.success && result.data) {
          // Filter events by current user and ensure ID consistency
          const currentUserId = authStore.currentUser?.id || authStore.currentUser?._id
          this.events = result.data
            .filter(event => event.userId === currentUserId)
            .map(event => {
              // Ensure both id and _id are present for consistency
              const transformedEvent = {
                ...event,
                id: event.id || event._id,
                _id: event._id || event.id,
              }
              return transformedEvent
            })
          storeLogger.success('User events loaded from MongoDB', {
            count: this.events.length,
            userId: currentUserId,
          })
        } else {
          throw new Error(result.message || 'Failed to load events from MongoDB')
        }
      } catch (error) {
        this.error = error.message || 'Failed to initialize events'
        console.error('Events store initialization error:', error)
        this.events = []
      } finally {
        this.loading = false
      }
    },

    async addEvent (event) {
      try {
        this.loading = true
        this.error = null

        // Add userId to event data
        const authStore = useAuthStore()
        const eventWithUser = {
          ...event,
          userId: authStore.currentUser?.id || authStore.currentUser?._id,
        }

        const result = await mongoService.events.create(eventWithUser)
        if (result.success && result.data) {
          // Ensure both id and _id are present for consistency
          const transformedEvent = {
            ...result.data,
            id: result.data.id || result.data._id,
            _id: result.data._id || result.data.id,
          }
          this.events.push(transformedEvent)
          storeLogger.success('Event added to MongoDB', { title: event.title || event.name })
          return transformedEvent
        } else {
          throw new Error(result.message || 'Failed to add event to MongoDB')
        }
      } catch (error) {
        this.error = error.message || 'Failed to add event'
        console.error('Error adding event:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEvent (updatedEvent) {
      try {
        this.loading = true
        this.error = null

        // Debug logging to track the event data structure
        console.log('🔍 updateEvent called with full data:', {
          updatedEvent: JSON.stringify(updatedEvent, null, 2),
          keys: Object.keys(updatedEvent || {}),
          id: updatedEvent?.id,
          _id: updatedEvent?._id,
          type: typeof updatedEvent,
        })

        const eventId = updatedEvent?.id || updatedEvent?._id

        // Debug logging to track the event ID
        console.log('🔍 updateEvent ID extraction:', {
          extractedEventId: eventId,
          hasId: !!updatedEvent?.id,
          has_id: !!updatedEvent?._id,
          idType: typeof eventId,
        })

        if (!eventId) {
          console.error('❌ No event ID found in updatedEvent:', updatedEvent)
          throw new Error('Event ID is required for update')
        }

        const result = await mongoService.events.update(eventId, updatedEvent)
        if (result.success && result.data) {
          // Ensure both id and _id are present for consistency
          const transformedEvent = {
            ...result.data,
            id: result.data.id || result.data._id,
            _id: result.data._id || result.data.id,
          }
          const index = this.events.findIndex(e => (e.id === eventId) || (e._id === eventId))
          if (index !== -1) {
            this.events[index] = transformedEvent
          }
          storeLogger.success('Event updated in MongoDB', {
            id: eventId,
            title: updatedEvent.title || updatedEvent.name,
          })
          return true
        } else {
          throw new Error(result.message || 'Failed to update event in MongoDB')
        }
      } catch (error) {
        this.error = error.message || 'Failed to update event'
        console.error('Error updating event:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEvent (eventId) {
      try {
        this.loading = true
        this.error = null

        const localIndex = this.events.findIndex(e => (e.id === eventId) || (e._id === eventId))
        if (localIndex === -1) {
          console.warn(`Event ${eventId} not found in local state`)
          return true
        }

        const result = await mongoService.events.delete(eventId)
        if (result.success) {
          this.events.splice(localIndex, 1)
          storeLogger.success('Event deleted from MongoDB and local state', { id: eventId })
          return true
        } else {
          throw new Error(result.error || 'Failed to delete event from MongoDB')
        }
      } catch (error) {
        this.error = error.message || 'Failed to delete event'
        console.error('Error deleting event:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError () {
      this.error = null
    },
  },
})
