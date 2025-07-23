import { useProjectsStore } from './projects.js'
import { useTasksStore } from './tasks.js'
import { useEventsStore } from './events.js'

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
    const status = mongoService.getStatus()
    console.log('MongoDB connection status:', status.connected ? '✅ Connected' : '❌ Disconnected')
    return status.connected
  } catch (error) {
    console.error('❌ Error checking MongoDB connection:', error)
    return false
  }
}
