import { useEventsStore } from './events.js'
import { useProjectsStore } from './projects.js'
import { useTasksStore } from './tasks.js'

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

    console.log('✅ All stores initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing stores:', error)
  }
}

export const checkMongoDBConnection = async () => {
  try {
    const { mongoService } = await import('@/services/mongodb.js')
    const isConnected = await mongoService.isConnected()
    console.log('MongoDB connection status:', isConnected ? '✅ Connected' : '❌ Disconnected')
    return isConnected
  } catch (error) {
    console.error('❌ Error checking MongoDB connection:', error)
    return false
  }
}
