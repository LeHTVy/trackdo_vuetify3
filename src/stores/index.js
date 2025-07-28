import { createPinia } from 'pinia'
import { useProjectsStore } from './projects.js'
import { useTasksStore } from './tasks.js'
import { useEventsStore } from './events.js'
import { useAuthStore } from './auth.js'

export default createPinia()

export const useStores = () => ({
  projects: useProjectsStore(),
  tasks: useTasksStore(),
  events: useEventsStore(),
  auth: useAuthStore(),
})
export { useProjectsStore } from './projects.js'
export { useTasksStore } from './tasks.js'
export { useEventsStore } from './events.js'
export { useAuthStore } from './auth.js'
