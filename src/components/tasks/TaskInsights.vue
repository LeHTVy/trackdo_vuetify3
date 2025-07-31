<template>
  <v-card class="insights-card" elevation="2">
    <v-card-title class="insights-header">
      <v-icon class="mr-2" color="primary">mdi-lightbulb-on</v-icon>
      <span class="insights-title">Task Insights</span>
    </v-card-title>

    <v-card-text class="insights-content">
      <!-- No insights message -->
      <div v-if="!hasInsights" class="no-insights">
        <v-icon color="grey-lighten-1" size="48">mdi-information-outline</v-icon>
        <p class="text-grey-lighten-1 mt-2">No insights available</p>
      </div>

      <!-- Today's Events -->
      <div v-if="todayEvents.length > 0" class="insight-section">
        <div class="section-header">
          <v-icon class="section-icon" color="blue">mdi-calendar-today</v-icon>
          <h4 class="section-title">Today's Events</h4>
        </div>

        <div class="events-list">
          <div
            v-for="event in todayEvents"
            :key="event.id || event._id"
            class="event-item"
          >
            <div class="event-indicator" :style="{ backgroundColor: getEventColor(event) }" />
            <div class="event-content">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-time">{{ formatEventTime(event) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Projects -->
      <div v-if="recentProjects.length > 0" class="insight-section">
        <div class="section-header">
          <v-icon class="section-icon" color="green">mdi-folder-plus</v-icon>
          <h4 class="section-title">Recent Projects</h4>
        </div>

        <div class="projects-list">
          <div
            v-for="project in recentProjects"
            :key="project.id || project._id"
            class="project-item"
          >
            <div class="project-header">
              <div class="project-title">{{ project.title || project.name }}</div>
              <v-chip
                class="project-status"
                :color="getProjectStatusColor(project.status)"
                size="x-small"
                variant="flat"
              >
                {{ project.status }}
              </v-chip>
            </div>
            <div class="project-meta">
              <span class="project-progress">{{ project.progress }}% complete</span>
              <span class="project-date">{{ formatRelativeTime(project.createdAt || project.startDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- High Completion Projects -->
      <div v-if="highCompletionProjects.length > 0" class="insight-section">
        <div class="section-header">
          <v-icon class="section-icon" color="orange">mdi-chart-line</v-icon>
          <h4 class="section-title">Near Completion</h4>
        </div>

        <div class="projects-list">
          <div
            v-for="project in highCompletionProjects"
            :key="project.id || project._id"
            class="project-item"
          >
            <div class="project-header">
              <div class="project-title">{{ project.title || project.name }}</div>
              <v-chip
                class="project-priority"
                :color="getPriorityColor(project.priority)"
                size="x-small"
                variant="flat"
              >
                {{ project.priority }}
              </v-chip>
            </div>
            <div class="project-meta">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: project.progress + '%' }" />
              </div>
              <span class="project-progress">{{ project.progress }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Suggestion -->
      <div v-if="hasInsights" class="action-suggestion">
        <v-icon class="suggestion-icon" color="primary">mdi-lightbulb</v-icon>
        <p class="suggestion-text">
          Consider creating tasks for upcoming events or pushing near-complete projects to finish line!
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useEventsStore } from '@/stores/events'
  import { useProjectsStore } from '@/stores/projects'
  import { useTaskInsights } from '@/composables/TaskCommon/useTaskInsights'

  // Initialize stores
  const eventsStore = useEventsStore()
  const projectsStore = useProjectsStore()

  // Use composable
  const {
    todayEvents,
    recentProjects,
    highCompletionProjects,
    hasInsights,
    formatEventTime,
    formatRelativeTime,
    getEventColor,
    getProjectStatusColor,
    getPriorityColor,
  } = useTaskInsights()

  onMounted(async () => {
    try {
      if (eventsStore.events.length === 0) {
        await eventsStore.initializeStore()
      }
      if (projectsStore.projects.length === 0) {
        await projectsStore.initializeStore()
      }
    } catch (error) {
      console.error('Error initializing stores in TaskInsights:', error)
    }
  })
</script>

<style scoped>
.insights-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(var(--v-theme-background), 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.insights-header {
  background: rgba(var(--v-theme-task-header), 0.3);
  padding: 1rem 1.5rem;
}

.insights-title {
  font-size: 1.125rem;
  font-weight: 600;

}

.insights-content {
  padding: 1.5rem;
}

.no-insights {
  text-align: center;
  padding: 2rem 1rem;
}

.insight-section {
  margin-bottom: 1.5rem;
}

.insight-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-icon {
  margin-right: 0.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
}

/* Events Styles */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

.event-item:hover {
  background: rgba(var(--v-theme-surface), 0.8);
  transform: translateX(2px);
}

.event-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.event-content {
  flex: 1;
}

.event-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 0.25rem;
}

.event-time {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Projects Styles */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-item {
  padding: 1rem;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.project-item:hover {
  background: rgba(var(--v-theme-surface), 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.project-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  flex: 1;
  margin-right: 0.5rem;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 2px;
  margin-right: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.project-progress {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-secondary));
}

.project-date {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-secondary));
}

/* Action Suggestion */
.action-suggestion {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 8px;
  border: 1px solid rgba(103, 126, 234, 0.2);
  display: flex;
  align-items: flex-start;
}

.suggestion-icon {
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.suggestion-text {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-secondary));
  margin: 0;
  line-height: 1.4;
}

/* Dark mode adjustments */
.v-theme--dark .insights-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.v-theme--dark .event-item,
.v-theme--dark .project-item {
  background: rgba(255, 255, 255, 0.05);
}

.v-theme--dark .event-item:hover,
.v-theme--dark .project-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .insights-content {
    padding: 1rem;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .project-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .progress-bar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.25rem;
  }
}
</style>
