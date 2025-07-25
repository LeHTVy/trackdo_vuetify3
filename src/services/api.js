import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  },
)

export const apiService = {
  // GET request
  async get (url, config = {}) {
    try {
      const response = await api.get(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // POST request
  async post (url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // PUT request
  async put (url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // DELETE request
  async delete (url, config = {}) {
    try {
      const response = await api.delete(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Error handler
  handleError (error) {
    const errorMessage = error.response?.data?.message
      || error.message
      || 'An unexpected error occurred'

    const errorObj = new Error(errorMessage)
    errorObj.status = error.response?.status
    errorObj.data = error.response?.data

    return errorObj
  },
}

// Specific API endpoints
export const tasksAPI = {
  getAll: () => apiService.get('/tasks'),
  getById: id => apiService.get(`/tasks/${id}`),
  create: task => apiService.post('/tasks', task),
  update: (id, task) => apiService.put(`/tasks/${id}`, task),
  delete: id => apiService.delete(`/tasks/${id}`),
  getByProject: projectId => apiService.get(`/tasks?project=${projectId}`),
  getByStatus: status => apiService.get(`/tasks?status=${status}`),
}

export const projectsAPI = {
  getAll: () => apiService.get('/projects'),
  getById: id => apiService.get(`/projects/${id}`),
  create: project => apiService.post('/projects', project),
  update: (id, project) => apiService.put(`/projects/${id}`, project),
  delete: id => apiService.delete(`/projects/${id}`),
  getMembers: id => apiService.get(`/projects/${id}/members`),
  addMember: (id, member) => apiService.post(`/projects/${id}/members`, member),
  removeMember: (id, memberId) => apiService.delete(`/projects/${id}/members/${memberId}`),
}

export const eventsAPI = {
  getAll: () => apiService.get('/events'),
  getById: id => apiService.get(`/events/${id}`),
  create: event => apiService.post('/events', event),
  update: (id, event) => apiService.put(`/events/${id}`, event),
  delete: id => apiService.delete(`/events/${id}`),
  getByDateRange: (start, end) => apiService.get(`/events?start=${start}&end=${end}`),
  getByProject: projectId => apiService.get(`/events?project=${projectId}`),
}

export default api
