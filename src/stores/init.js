import { useProjectsStore } from './projects.js'
import { useTasksStore } from './tasks.js'
import { useEventsStore } from './events.js'
import { storeLogger } from '@/services/logger.js'

export const initializeStores = async () => {
  try {
    const eventsStore = useEventsStore()
    const projectsStore = useProjectsStore()
    const tasksStore = useTasksStore()

    await Promise.all([
      eventsStore.initializeStore(),
      projectsStore.initializeStore(),
      tasksStore.initializeStore(),
    ])

    storeLogger.success('All stores initialized successfully')
  } catch (error) {
    storeLogger.error('Error initializing stores', error)
  }
}

export const checkMongoDBConnection = async () => {
  try {
    const { mongoService } = await import('@/services/mongodb.js')
    const status = mongoService.getStatus()
    storeLogger.info('MongoDB connection status', { connected: status.connected })
    return status.connected
  } catch (error) {
    storeLogger.error('Error checking MongoDB connection', error)
    return false
  }
}
