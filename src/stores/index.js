import { createPinia } from 'pinia'

import { useEventsStore } from './events.js'
import { useProjectsStore } from './projects.js'
import { useTasksStore } from './tasks.js'

export default createPinia()

export const useStores = () => ({
  events: useEventsStore(),
  projects: useProjectsStore(),
  tasks: useTasksStore(),
})
export { useEventsStore } from './events.js'
export { useProjectsStore } from './projects.js'
export { useTasksStore } from './tasks.js'
