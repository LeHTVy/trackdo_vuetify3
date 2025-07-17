<template>
  <v-container class="py-16">
    <v-row>
      <v-col class="text-center mb-8" cols="12">
        <h2 class="text-h3 font-weight-bold text-primary mb-4">
          Your Productivity at a <span class="text-secondary">Glance</span>
        </h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="stat in stats"
        :key="stat.id"
        class="text-center"
        cols="6"
        md="3"
      >
        <QuickStatCard
          :color="stat.color"
          :label="stat.label"
          :progress="stat.progress"
          :value="stat.value"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed } from 'vue'
  import { useEventsStore } from '@/stores/events'
  import { useProjectsStore } from '@/stores/projects'
  import { useTasksStore } from '@/stores/tasks'
  import QuickStatCard from './QuickStatCard.vue'

  const tasksStore = useTasksStore()
  const projectsStore = useProjectsStore()
  const eventsStore = useEventsStore()

  const totalTasks = computed(() => tasksStore.tasks.length)
  const completedTasks = computed(() => tasksStore.tasks.filter(task => task.status === 'completed').length)
  const upcomingEvents = computed(() => eventsStore.events.length)
  const activeProjects = computed(() => projectsStore.projects.filter(project => project.status === 'Active').length)

  const taskCompletionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const projectProgressRate = computed(() => {
    const totalProjects = projectsStore.projects.length
    if (totalProjects === 0) return 0
    return Math.round((activeProjects.value / totalProjects) * 100)
  })

  const eventsProgressRate = computed(() => {
    const maxEventsPerMonth = 30
    return Math.min(Math.round((upcomingEvents.value / maxEventsPerMonth) * 100), 100)
  })

  const overallProgressRate = computed(() => {
    const maxTasks = 50 // Assume max 50 tasks
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
      value: completedTasks.value,
      label: 'Completed',
      color: 'success',
      progress: taskCompletionRate.value,
    },
    {
      id: 3,
      value: upcomingEvents.value,
      label: 'Upcoming Events',
      color: 'info',
      progress: eventsProgressRate.value,
    },
    {
      id: 4,
      value: activeProjects.value,
      label: 'Active Projects',
      color: 'secondary',
      progress: projectProgressRate.value,
    },
  ])
</script>

<style scoped>
/* Styles are moved to QuickStatCard component */
</style>
