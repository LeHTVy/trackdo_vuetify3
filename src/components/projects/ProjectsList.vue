<template>
  <v-container fluid class="main-content">
    <v-row>
      <v-col cols="12" lg="8">
        <!-- Active Projects -->
        <div class="projects-section">
          <div class="section-header">
            <h2 class="section-title">Active Projects</h2>
            <div class="filter-controls">
              <v-btn-toggle
                v-model="filter"
                color="primary"
                variant="outlined"
                divided
                mandatory
              >
                <v-btn value="all" size="small">All</v-btn>
                <v-btn value="Active" size="small">Active</v-btn>
                <v-btn value="Completed" size="small">Completed</v-btn>
                <v-btn value="On Hold" size="small">On Hold</v-btn>
              </v-btn-toggle>
            </div>
          </div>
          <!-- Projects Grid -->
          <div class="projects-grid">
            <v-card
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-card"
                :class="`project-card--${project.status.toLowerCase().replace(' ', '-')}`"
                elevation="0"
                @click="showProjectDetails(project)"
              >
              <div class="project-card-header">
                <div class="project-info">
                  <h3 class="project-name">{{ project.title || project.name }}</h3>
                  <v-chip
                    :color="getStatusColor(project.status)"
                    size="small"
                    variant="flat"
                    class="status-chip"
                  >
                    {{ project.status }}
                  </v-chip>
                </div>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-dots-vertical"
                      size="small"
                      variant="text"
                      @click.stop
                    />
                  </template>
                  <v-list>
                    <v-list-item @click="$emit('edit-project', project)">
                      <v-list-item-title>
                        <v-icon start>mdi-pencil</v-icon>
                        Edit
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="handleDeleteProjectWithConfirm(project)">
                      <v-list-item-title>
                        <v-icon start>mdi-delete</v-icon>
                        Delete
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <div class="project-description">
                {{ project.description || 'No description available' }}
              </div>

              <div class="project-progress">
                <div class="progress-header">
                  <span class="progress-label">Progress</span>
                  <span class="progress-value">{{ project.progress || 0 }}%</span>
                </div>
                <v-progress-linear
                  :color="getStatusColor(project.status)"
                  height="8"
                  :model-value="project.progress || 0"
                  rounded
                  class="progress-bar"
                />
              </div>

              <div class="project-dates" v-if="project.startDate || project.endDate">
                <div class="date-item" v-if="project.startDate">
                  <v-icon size="16" color="primary">mdi-calendar-start</v-icon>
                  <span>{{ formatDate(project.startDate) }}</span>
                </div>
                <div class="date-item" v-if="project.endDate">
                  <v-icon size="16" color="primary">mdi-calendar-end</v-icon>
                  <span>{{ formatDate(project.endDate) }}</span>
                </div>
              </div>

              <div class="project-budget" v-if="project.budget">
                <v-icon size="16" color="success">mdi-currency-usd</v-icon>
                <span class="budget-amount">${{ project.budget.toLocaleString() }}</span>
              </div>
            </v-card>

            <!-- Empty State -->
            <div v-if="filteredProjects.length === 0" class="empty-state">
              <v-icon size="80" color="secondary">mdi-folder-multiple-outline</v-icon>
              <h3 class="empty-title">No projects found</h3>
              <p class="empty-subtitle">
                {{ filter === 'all' ? 'Create your first project to get started!' : 'No projects match the current filter.' }}
              </p>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                variant="elevated"
                @click="$emit('add-project')"
              >
                Create Project
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" lg="4">
        <div class="sidebar">
          <!-- Recent Activity -->
          <v-card class="activity-card" elevation="0">
            <v-card-title class="activity-header">
              <v-icon start>mdi-clock-outline</v-icon>
              Recent Activity
            </v-card-title>
            <v-card-text class="activity-content">
              <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                <div class="activity-icon" :class="`bg-${activity.color}`">
                  <v-icon :color="activity.color" size="16">{{ activity.icon }}</v-icon>
                </div>
                <div class="activity-details">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Progress Overview -->
          <v-card class="progress-overview-card" elevation="0">
            <v-card-title class="overview-header">
              <v-icon start>mdi-chart-donut</v-icon>
              Progress Overview
            </v-card-title>
            <v-card-text class="overview-content">
              <div class="overall-progress">
                <div class="overall-progress-text">
                  <span class="overall-label">Overall Progress</span>
                  <span class="overall-value">{{ overallProgress }}%</span>
                </div>
                <v-progress-circular
                  :value="overallProgress"
                  :size="120"
                  :width="8"
                  color="primary"
                  class="overall-progress-circle"
                >
                  <span class="progress-text">{{ overallProgress }}%</span>
                </v-progress-circular>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Project Details Dialog -->
  <ProjectDetails
    v-model="projectDetailsDialog"
    :selected-project="selectedProject"
    @edit-project="handleEditProject"
    @delete-project="handleDeleteProject"
    @close="closeProjectDetails"
  />

  <!-- Confirm Modal -->
  <ConfirmModal
    v-model="confirmModalOpen"
    :title="confirmModalConfig.title"
    :message="confirmModalConfig.message"
    :details="confirmModalConfig.details"
    :confirm-text="confirmModalConfig.confirmText"
    :cancel-text="confirmModalConfig.cancelText"
    :loading="confirmModalLoading"
    @confirm="confirmModalConfirm"
    @cancel="confirmModalCancel"
  />
</template>

<script setup>
  import { computed } from 'vue'
  import { useDialogManager } from '@/composables/common/useDialogManager'
  import { useProjectOperations } from '@/composables/ProjectCommon/useProjectOperations'
  import { useProjectFilters } from '@/composables/ProjectCommon/useProjectFilters'
  import { useProjectFormatting } from '@/composables/ProjectCommon/useProjectFormatting'
  import ProjectDetails from './ProjectDetails.vue'
  import ConfirmModal from '@/components/common/ConfirmModal.vue'

  const props = defineProps({
    projects: {
      type: Array,
      default: () => [],
    },
    recentActivities: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits([
    'add-project',
    'edit-project',
    'delete-project',
    'view-project',
  ])

  const projectsRef = computed(() => props.projects)

  // Use composables
  const {
    projectDetailsDialog,
    selectedProject,
    showProjectDetails,
    closeProjectDetailsDialog
  } = useDialogManager()

  const {
    confirmModalOpen,
    confirmModalLoading,
    confirmModalConfig,
    confirmModalConfirm,
    confirmModalCancel,
    deleteProjectWithConfirm
  } = useProjectOperations()

  const {
    filter,
    filteredProjects
  } = useProjectFilters(projectsRef)

  const {
    formatDate,
    getStatusColor,
    overallProgress
  } = useProjectFormatting(projectsRef)


  const handleEditProject = (project) => {
    closeProjectDetailsDialog()
    emit('edit-project', project)
  }

  const handleDeleteProjectWithConfirm = async (project) => {
    const success = await deleteProjectWithConfirm(project, props.projects)
    if (success) {
      emit('delete-project', project._id || project.id)
    }
  }

  const handleDeleteProject = async (projectIdOrProject) => {
    closeProjectDetailsDialog()

    const project = typeof projectIdOrProject === 'string'
      ? props.projects.find(p => (p._id || p.id) === projectIdOrProject)
      : projectIdOrProject

    if (!project) {
      console.error('Project not found for deletion')
      return
    }

    await handleDeleteProjectWithConfirm(project)
  }

  const closeProjectDetails = () => {
    closeProjectDetailsDialog()
  }
</script>

<style scoped>
/* Main Content */
.main-content {
  padding: 0;
}

/* Active Projects Section */
.projects-section {
  margin-bottom: 2rem;
  padding-left: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: rgb(var(--v-theme-primary));
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.status-chip {
  font-size: 0.75rem;
  font-weight: 500;
}

.project-description {
  color: rgb(var(--v-theme-primary));
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-progress {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-primary));
}

.progress-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.progress-bar {
  border-radius: 4px;
}

.project-dates {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface));
  font-weight: 500;
}

.project-budget {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.budget-amount {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-success));
}

/* Status-specific styling */
.project-card--active {
  border-left: 4px solid rgb(var(--v-theme-success));
}

.project-card--completed {
  border-left: 4px solid rgb(var(--v-theme-info));
}

.project-card--on-hold {
  border-left: 4px solid rgb(var(--v-theme-warning));
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 1rem 0 0.5rem 0;
}

.empty-subtitle {
  color: rgb(var(--v-theme-on-secondary));
  margin-bottom: 1.5rem;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Activity Card */
.activity-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 12px;
}

.activity-header {
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.activity-content {
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.activity-item:last-child {
  margin-bottom: 0;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-primary));
}

/* Progress Overview Card */
.progress-overview-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline-variant));
  border-radius: 12px;
}

.overview-header {
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.overview-content {
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
}

.overall-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.overall-progress-text {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
}

.overall-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-primary));
}

.overall-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.overall-progress-circle {
  margin-bottom: 0.5rem;
}

.progress-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

/* Activity icon backgrounds */
.bg-success {
  background-color: rgba(var(--v-theme-success), 0.1);
}

.bg-info {
  background-color: rgba(var(--v-theme-info), 0.1);
}

.bg-warning {
  background-color: rgba(var(--v-theme-warning), 0.1);
}

.bg-error {
  background-color: rgba(var(--v-theme-error), 0.1);
}

.bg-primary {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

/* Responsive Design */
@media (max-width: 960px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-dates {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 600px) {
  .project-card {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .filter-controls .v-btn-toggle {
    width: 100%;
  }

  .filter-controls .v-btn {
    flex: 1;
  }
}

/* Dark mode enhancements */
.v-theme--dark .project-card {
  background: rgb(var(--v-theme-surface));
  border-color: rgba(var(--v-theme-outline), 0.3);
}

.v-theme--dark .project-card:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .activity-card,
.v-theme--dark .progress-overview-card {
  background: rgb(var(--v-theme-surface));
  border-color: rgba(var(--v-theme-outline), 0.3);
}
</style>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.projects-card {
  border-radius: 20px;
  background: linear-gradient(135deg, rgb(255 255 255 / 95%) 0%, rgb(248 250 252 / 95%) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgb(255 255 255 / 20);
  box-shadow: 0 8px 32px rgb(0 0 0 / 8%);
  animation: fadeInUp 0.6s ease-out;
  width: 100%;
  max-width: 100%;
}

.project-card {
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgb(226 232 240 / 50%);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    rgb(var(--v-theme-project-card-gradient-start)),
    rgb(var(--v-theme-project-card-gradient-middle)),
    rgb(var(--v-theme-project-card-gradient-end))
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(var(--v-theme-project-card-hover-shadow), 0.15);
  border-color: rgba(var(--v-theme-project-card-hover-border), 0.3);
}

.project-card.completed {
  opacity: 0.85;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.project-card.completed::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

/* Enhanced button styles */
.v-btn {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

/* Progress bar enhancements */
.v-progress-linear {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgb(0 0 0 / 10%);
}

/* Chip enhancements */
.v-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

/* Filter menu enhancements */
.v-menu .v-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgb(59 130 246 / 30%);
}

.v-menu .v-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgb(59 130 246 / 40%);
}

/* Empty state enhancements */
.text-center {
  animation: fadeInUp 0.8s ease-out;
}

.text-center .v-icon {
  animation: pulse 2s infinite;
  filter: drop-shadow(0 4px 8px rgb(0 0 0 / 10%));
}

/* Card title enhancements */
.v-card-title {
  background: linear-gradient(135deg, rgb(255 255 255 / 80%) 0%, rgb(248 250 252 / 80%) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  padding: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.v-card-text {
  padding: 20px;
}

.v-card-actions {
  padding: 16px 20px;
  background: rgb(248 250 252 / 50%);
  border-radius: 0 0 16px 16px;
}

/* Dark theme adjustments */
.v-theme--dark .projects-card {
  background: linear-gradient(135deg, rgb(30 41 59 / 95%) 0%, rgb(15 23 42 / 95%) 100%);
  border-color: rgb(71 85 105 / 30%);
}

.v-theme--dark .project-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: rgb(71 85 105 / 30%);
}

.v-theme--dark .project-card:hover {
  border-color: rgba(var(--v-theme-project-card-hover-border), 0.5);
  box-shadow: 0 20px 40px rgba(var(--v-theme-project-card-hover-shadow), 0.3);
}

.v-theme--dark .project-card.completed {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
}

.v-theme--dark .v-card-title {
  background: linear-gradient(135deg, rgb(30 41 59 / 80%) 0%, rgb(15 23 42 / 80%) 100%);
}

.v-theme--dark .v-card-actions {
  background: rgb(15 23 42 / 50%);
}

.v-theme--dark .v-menu .v-btn {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
}

.v-theme--dark .v-menu .v-btn:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}
</style>
