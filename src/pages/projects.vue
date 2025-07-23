<template>
  <div class="projects-tracking-page app-background">
    <!-- Header Section -->
    <ProjectsHeader @add-project="showAddDialog = true" />

    <!-- Stats Overview -->
    <ProjectsStats
      :total-projects="totalProjects"
      :active-projects="activeProjects"
      :completed-projects="completedProjects"
      :on-hold-projects="onHoldProjects"
    />

    <!-- Main Content -->
    <ProjectsList
      :projects="projects"
      :recent-activities="recentActivities"
      @add-project="showAddDialog = true"
      @edit-project="editProject"
      @delete-project="deleteProject"
      @view-project="viewProject"
    />

    <!-- Project Dialog -->
    <ProjectDialog
      :show-dialog="showAddDialog"
      :editing-project="editingProject"
      :initial-data="initialData"
      @close="closeDialog"
      @save="saveProject"
    />

    <!-- Draggable Floating Action Button -->
    <v-btn
      fab
      color="primary"
      size="large"
      class="floating-add-btn"
      :class="{ 'dragging': isDragging }"
      :style="fabStyle"
      @click="handleNewProject"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <v-icon icon="mdi-plus" size="24"></v-icon>
    </v-btn>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useProjectsStore } from '@/stores/projects'
  import { useDraggableFab } from '@/composables/useDraggableFab'
  import ProjectsHeader from '@/components/projects/ProjectsHeader.vue'
  import ProjectsStats from '@/components/projects/ProjectsStats.vue'
  import ProjectsList from '@/components/projects/ProjectsList.vue'
  import ProjectDialog from '@/components/projects/ProjectDialog.vue'

  const projectsStore = useProjectsStore()
  const showAddDialog = ref(false)
  const editingProject = ref(null)

  // Draggable FAB
  const { isDragging, fabStyle, startDrag } = useDraggableFab({
    storageKey: 'projectsFabPosition'
  })

  const projects = computed(() => projectsStore.projects)
  const totalProjects = computed(() => projects.value.length)
  const activeProjects = computed(() => projects.value.filter(p => p.status === 'Active').length)
  const completedProjects = computed(() => projects.value.filter(p => p.status === 'Completed').length)
  const onHoldProjects = computed(() => projects.value.filter(p => p.status === 'On Hold').length)
  const recentActivities = computed(() => projectsStore.recentActivities)

  // Initial data for new projects
  const initialData = computed(() => ({
    name: '',
    description: '',
    status: 'Active',
    progress: 0,
    budget: null,
    startDate: '',
    endDate: ''
  }))

  // Methods
  const handleNewProject = () => {
    // Only trigger if not dragging
    if (!isDragging.value) {
      showAddDialog.value = true
    }
  }

  const viewProject = (project) => {
    console.log('View project:', project.name)
  }

  const editProject = (project) => {
    editingProject.value = project
    showAddDialog.value = true
  }

  const deleteProject = async (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsStore.deleteProject(projectId)
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const saveProject = async (projectData) => {
    try {
      if (editingProject.value) {
        await projectsStore.updateProject(editingProject.value.id, projectData)
      } else {
        await projectsStore.addProject(projectData)
      }
      closeDialog()
    } catch (error) {
      console.error('Error saving project:', error)
    }
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
.projects-tracking-page {
  min-height: 100vh;
  padding-bottom: 2rem;
}

/* Floating Action Button Styles */
.floating-add-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.4) !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.floating-add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.6) !important;
}

.floating-add-btn.dragging {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.7) !important;
  transition: none !important;
}

.floating-add-btn:active {
  transform: scale(0.95);
}

/* Pulse animation for attention */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.4);
  }
  50% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.8);
  }
  100% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.4);
  }
}

.floating-add-btn:not(.dragging):not(:hover) {
  animation: pulse 2s infinite;
}

/* Dark mode adjustments */
.v-theme--dark .floating-add-btn {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}

.v-theme--dark .floating-add-btn:hover {
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.5) !important;
}

.v-theme--dark .floating-add-btn.dragging {
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.6) !important;
}
</style>
