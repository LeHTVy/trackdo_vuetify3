import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'

export function useQuickStatsSection () {
  const authStore = useAuthStore()
  const tasksStore = useTasksStore()
  const projectsStore = useProjectsStore()
  const eventsStore = useEventsStore()
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const userTasks = computed(() => {
    if (!isAuthenticated.value) return []
    return tasksStore.tasks.filter(task => task.userId === authStore.user?.id)
  })

  const userProjects = computed(() => {
    if (!isAuthenticated.value) return []
    return projectsStore.projects.filter(project => project.userId === authStore.user?.id)
  })

  const userEvents = computed(() => {
    if (!isAuthenticated.value) return []
    return eventsStore.events.filter(event => event.userId === authStore.user?.id)
  })

  const totalTasks = computed(() => userTasks.value.length)

  const completedTasks = computed(() =>
    userTasks.value.filter(task => task.status === 'completed').length
  )

  const upcomingEvents = computed(() => userEvents.value.length)

  const activeProjects = computed(() =>
    userProjects.value.filter(project => project.status === 'Active').length
  )

  const taskCompletionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const projectProgressRate = computed(() => {
    const totalProjects = userProjects.value.length
    if (totalProjects === 0) return 0
    return Math.round((activeProjects.value / totalProjects) * 100)
  })

  const eventsProgressRate = computed(() => {
    const maxEventsPerMonth = 30
    return Math.min(Math.round((upcomingEvents.value / maxEventsPerMonth) * 100), 100)
  })

  const overallProgressRate = computed(() => {
    const maxTasks = 50
    const taskProgress = Math.min((totalTasks.value / maxTasks) * 100, 100)
    return Math.round(taskProgress)
  })

  const stats = computed(() => [
    {
      id: 1,
      value: totalTasks.value,
      label: 'Total Tasks',
      color: 'primary',
      progress: overallProgressRate.value,
    },
    {
      id: 2,
      value: upcomingEvents.value,
      label: 'Upcoming Events',
      color: 'info',
      progress: eventsProgressRate.value,
    },
    {
      id: 3,
      value: activeProjects.value,
      label: 'Active Projects',
      color: 'secondary',
      progress: projectProgressRate.value,
    },
  ])

  return {
    // Authentication state
    isAuthenticated,

    // Raw data
    userTasks,
    userProjects,
    userEvents,

    // Calculated values
    totalTasks,
    completedTasks,
    upcomingEvents,
    activeProjects,

    // Progress rates
    taskCompletionRate,
    projectProgressRate,
    eventsProgressRate,
    overallProgressRate,

    // Final stats array
    stats,
  }
}
