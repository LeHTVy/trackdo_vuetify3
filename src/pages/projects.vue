<template>
  <div class="projects-tracking-page app-background">
    <!-- Header Section -->
    <ProjectsHeader @add-project="showAddDialog = true" />

    <!-- Stats Overview -->
    <ProjectsStats :projects="projects" />

    <!-- Main Content -->
    <ProjectsList
      :projects="projects"
      :recent-activities="recentActivities"
      @add-project="showAddDialog = true"
      @edit-project="handleEditProject"
      @delete-project="handleDeleteProject"
      @view-project="viewProject"
    />

    <!-- Project Dialog -->
    <ProjectDialog
      :show-dialog="showAddDialog"
      :editing-project="editingProject"
      :initial-data="getInitialProjectData()"
      @close="closeDialog"
      @save="handleSaveProject"
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
  import { ref, onMounted } from 'vue'
  import { useDraggableFab } from '@/composables/common/useDraggableFab'
  import { useProjectOperations } from '@/composables'
  import ProjectsHeader from '@/components/projects/ProjectsHeader.vue'
  import ProjectsStats from '@/components/projects/ProjectsStats.vue'
  import ProjectsList from '@/components/projects/ProjectsList.vue'
  import ProjectDialog from '@/components/projects/ProjectDialog.vue'

  // Use project operations composable
  const {
    loading,
    error,
    projects,
    recentActivities,
    fetchProjects,
    saveProject,
    deleteProject,
    viewProject,
    getInitialProjectData
  } = useProjectOperations()

  // Dialog state
  const showAddDialog = ref(false)
  const editingProject = ref(null)

  // Draggable FAB
  const { isDragging, fabStyle, startDrag } = useDraggableFab({
    storageKey: 'projectsFabPosition'
  })

  // Methods
  const handleNewProject = () => {
    // Only trigger if not dragging
    if (!isDragging.value) {
      editingProject.value = null
      showAddDialog.value = true
    }
  }

  const handleEditProject = (project) => {
    editingProject.value = project
    showAddDialog.value = true
  }

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId)
  }

  const handleSaveProject = async (projectData) => {
    try {
      await saveProject(projectData, editingProject.value)
      closeDialog()
    } catch (error) {
      console.error('Error saving project:', error)
      // Error is already handled in the composable
    }
  }

  const closeDialog = () => {
    showAddDialog.value = false
    editingProject.value = null
  }

  // Initialize data
  onMounted(async () => {
    await fetchProjects()
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
