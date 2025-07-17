<template>
  <div class="projects-container">
    <!-- Header Section with proper spacing -->
    <div class="header-section">
      <ProjectsHeader />
    </div>

    <!-- Main Content Area -->
    <div class="content-wrapper">
      <v-row class="main-content-row">
        <!-- Left Column - Stats -->
        <v-col class="stats-column" cols="12" lg="4" md="5">
          <div class="stats-section">
            <ProjectsStats
              :active-projects="activeProjects"
              :completed-projects="completedProjects"
              :on-hold-projects="onHoldProjects"
              :total-projects="totalProjects"
            />
          </div>
        </v-col>

        <!-- Right Column - Projects List -->
        <v-col class="projects-column" cols="12" lg="8" md="7">
          <div class="projects-section">
            <ProjectsList
              :filter="filter"
              :projects="projects"
              @add-project="showAddDialog = true"
              @delete-project="deleteProject"
              @edit-project="editProject"
              @filter-change="filter = $event"
              @view-project="viewProject"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Project Dialog -->
    <ProjectDialog
      :editing-project="editingProject"
      :initial-data="initialData"
      :show-dialog="showAddDialog"
      @close="closeDialog"
      @save="saveProject"
    />

    <!-- Floating Action Button -->
    <v-fab
      class="fab-add"
      color="primary"
      icon="mdi-plus"
      location="bottom end"
      size="large"
      @click="showAddDialog = true"
    />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import ProjectDialog from '@/components/projects/ProjectDialog.vue'
  import ProjectsHeader from '@/components/projects/ProjectsHeader.vue'
  import ProjectsList from '@/components/projects/ProjectsList.vue'
  import ProjectsStats from '@/components/projects/ProjectsStats.vue'
  import { useProjectsStore } from '@/stores/projects'

  const showAddDialog = ref(false)
  const editingProject = ref(null)
  const filter = ref('all')
  const projectsStore = useProjectsStore()
  const projects = computed(() => projectsStore.projects)
  const totalProjects = computed(() => projects.value.length)
  const activeProjects = computed(() => projects.value.filter(p => p.status === 'Active').length)
  const completedProjects = computed(() => projects.value.filter(p => p.status === 'Completed').length)
  const onHoldProjects = computed(() => projects.value.filter(p => p.status === 'On Hold').length)
  const initialData = computed(() => {
    if (editingProject.value) {
      return {
        name: editingProject.value.name,
        description: editingProject.value.description,
        status: editingProject.value.status,
        progress: editingProject.value.progress,
        startDate: editingProject.value.startDate,
        endDate: editingProject.value.endDate,
        budget: editingProject.value.budget,
      }
    }
    return {
      name: '',
      description: '',
      status: 'Planning',
      progress: 0,
      startDate: '',
      endDate: '',
      budget: 0,
    }
  })

  // Methods
  const viewProject = project => {
    console.log('View project:', project.name)
  }

  const editProject = project => {
    editingProject.value = project
    showAddDialog.value = true
  }

  const deleteProject = async projectId => {
    await projectsStore.deleteProject(projectId)
  }

  const saveProject = async projectData => {
    await (editingProject.value ? projectsStore.updateProject(editingProject.value.id, projectData) : projectsStore.addProject(projectData))
    closeDialog()
  }

  const closeDialog = () => {
    showAddDialog.value = false
    editingProject.value = null
  }

  onMounted(async () => {
    await projectsStore.fetchProjects()
  })
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.projects-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 25%, #fef7cd 50%, #f0f9ff 75%, #f8fafc 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite, fadeIn 0.8s ease-out;
  position: relative;
  overflow-x: hidden;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.projects-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgb(120 119 198 / 10%) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgb(255 119 198 / 10%) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgb(120 219 255 / 10%) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.header-section {
  position: relative;
  z-index: 10;
  margin-bottom: 2rem;
  animation: slideInDown 0.8s ease-out;
}

.content-wrapper {
  position: relative;
  z-index: 5;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.main-content-row {
  margin: 0;
  align-items: flex-start;
}

.stats-column {
  padding-right: 0.75rem;
  flex: 0 0 auto;
}

.projects-column {
  padding-left: 0.75rem;
  flex: 1 1 auto;
  min-width: 0;
}

.stats-section {
  animation: slideInUp 0.8s ease-out 0.2s both;
  position: sticky;
  top: 2rem;
}

.projects-section {
  animation: slideInUp 0.8s ease-out 0.4s both;
  width: 100%;
  max-width: 100%;
}

.fab-add {
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 1s ease-out 0.6s both;
}

.fab-add:hover {
  transform: translateY(-4px) scale(1.1);
}

.fab-add:active {
  transform: translateY(-2px) scale(1.05);
  border: none !important;
  outline: none !important;
}

.fab-add:focus {
  border: none !important;
  outline: none !important;
  box-shadow: 0 8px 25px rgb(59 130 246 / 30%) !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .header-section {
    margin-bottom: 1.5rem;
  }

  .main-content-row {
    gap: 1rem;
  }

  .stats-column,
  .projects-column {
    padding-left: 0;
    padding-right: 0;
  }

  .stats-section {
    position: static;
    margin-bottom: 1.5rem;
  }

  .fab-add {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 0.75rem;
  }

  .header-section {
    margin-bottom: 1rem;
  }

  .stats-section {
    margin-bottom: 1.5rem;
  }

  .fab-add {
    bottom: 1rem;
    right: 1rem;
    transform: scale(0.9);
  }
}

/* Dark theme adjustments */
.v-theme--dark .projects-container {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #374151 50%, #1f2937 75%, #111827 100%);
}

.v-theme--dark .projects-container::before {
  background:
    radial-gradient(circle at 20% 80%, rgb(59 130 246 / 15%) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgb(168 85 247 / 15%) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgb(34 197 94 / 15%) 0%, transparent 50%);
}

.v-theme--dark .fab-add {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
  box-shadow: 0 8px 25px rgb(30 64 175 / 40%) !important;
  border: none !important;
  outline: none !important;
}

.v-theme--dark .fab-add:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
  box-shadow: 0 12px 35px rgb(29 78 216 / 50%) !important;
  border: none !important;
  outline: none !important;
}

.v-theme--dark .fab-add:focus {
  border: none !important;
  outline: none !important;
  box-shadow: 0 8px 25px rgb(30 64 175 / 40%) !important;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
