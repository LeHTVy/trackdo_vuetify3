import { apiService, eventsAPI, projectsAPI, tasksAPI } from './api.js'

export class MongoDBService {
  constructor () {
    this.isConnected = false
    this.connectionStatus = 'disconnected'
  }

  /**
   * Initialize connection (check API health)
   */
  async connect () {
    try {
      const response = await apiService.get('/health')
      this.isConnected = true
      this.connectionStatus = 'connected'
      console.log('✅ Connected to MongoDB via API', response.status || 'OK')
      return { success: true, message: 'Connected successfully', data: response.data }
    } catch (error) {
      this.isConnected = false
      this.connectionStatus = 'error'
      console.error('❌ Failed to connect to MongoDB:', error.message)
      return { success: false, message: error.message }
    }
  }

  /**
   * Get connection status
   */
  getStatus () {
    return {
      connected: this.isConnected,
      status: this.connectionStatus,
    }
  }

  // Projects Operations
  projects = {
    async getAll () {
      try {
        const response = await projectsAPI.getAll()
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error('Error fetching projects:', error)
        return { success: false, error: error.message, data: [] }
      }
    },

    async getById (id) {
      try {
        const response = await projectsAPI.getById(id)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error(`Error fetching project ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },

    async create (projectData) {
      try {
        const response = await projectsAPI.create(projectData)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error('Error creating project:', error)
        return { success: false, error: error.message, data: null }
      }
    },

    async update (id, updates) {
      try {
        const response = await projectsAPI.update(id, updates)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error(`Error updating project ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },

    async delete (id) {
      try {
        const response = await projectsAPI.delete(id)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error(`Error deleting project ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },
  }

  // Tasks Operations
  tasks = {
    async getAll () {
      try {
        const response = await tasksAPI.getAll()
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error('Error fetching tasks:', error)
        return { success: false, error: error.message, data: [] }
      }
    },

    async getById (id) {
      try {
        const response = await tasksAPI.getById(id)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error(`Error fetching task ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },

    async getByProject (projectId) {
      try {
        const response = await tasksAPI.getByProject(projectId)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error(`Error fetching tasks for project ${projectId}:`, error)
        return { success: false, error: error.message, data: [] }
      }
    },

    async create (taskData) {
      try {
        const response = await tasksAPI.create(taskData)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error('Error creating task:', error)
        return { success: false, error: error.message, data: null }
      }
    },

    async update (id, updates) {
      try {
        const response = await tasksAPI.update(id, updates)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error(`Error updating task ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },

    async delete (id) {
      try {
        const response = await tasksAPI.delete(id)
        return { success: true, data: response.data || response }
      } catch (error) {
        console.error(`Error deleting task ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },
  }

  // Events Operations
  events = {
    async getAll () {
      try {
        const response = await eventsAPI.getAll()
        return { success: true, data: response }
      } catch (error) {
        console.error('Error fetching events:', error)
        return { success: false, error: error.message, data: [] }
      }
    },

    async getById (id) {
      try {
        const response = await eventsAPI.getById(id)
        return { success: true, data: response }
      } catch (error) {
        console.error(`Error fetching event ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },

    async getByDateRange (startDate, endDate) {
      try {
        const response = await eventsAPI.getByDateRange(startDate, endDate)
        return { success: true, data: response }
      } catch (error) {
        console.error('Error fetching events by date range:', error)
        return { success: false, error: error.message, data: [] }
      }
    },

    async getByProject (projectId) {
      try {
        const response = await eventsAPI.getByProject(projectId)
        return { success: true, data: response }
      } catch (error) {
        console.error(`Error fetching events for project ${projectId}:`, error)
        return { success: false, error: error.message, data: [] }
      }
    },

    async create (eventData) {
      try {
        const response = await eventsAPI.create(eventData)
        return { success: true, data: response }
      } catch (error) {
        console.error('Error creating event:', error)
        return { success: false, error: error.message, data: null }
      }
    },

    async update (id, updates) {
      try {
        const response = await eventsAPI.update(id, updates)
        return { success: true, data: response }
      } catch (error) {
        console.error(`Error updating event ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },

    async delete (id) {
      try {
        const response = await eventsAPI.delete(id)
        return { success: true, data: response }
      } catch (error) {
        console.error(`Error deleting event ${id}:`, error)
        return { success: false, error: error.message, data: null }
      }
    },
  }
}

export const mongoService = new MongoDBService()
mongoService.connect().catch(console.error)

export default mongoService
