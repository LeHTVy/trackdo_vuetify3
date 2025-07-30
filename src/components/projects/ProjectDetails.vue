<template>
  <!-- Project Details Dialog -->
  <v-dialog
    v-model="isOpen"
    max-width="550px"
    transition="dialog-top-transition"
    class="details-dialog"
  >
    <v-card v-if="selectedProject && projectTitle" class="details-card" elevation="16">
      <v-card-title class="details-header pa-6" :class="`bg-${getProjectStatusColor(selectedProject.status)}`">
        <div class="d-flex align-center">
          <v-avatar size="36" color="white" class="mr-3">
            <v-icon :icon="getProjectStatusIcon(selectedProject.status)" :color="getProjectStatusColor(selectedProject.status)"></v-icon>
          </v-avatar>
          <div>
            <h3 class="text-h6 font-weight-bold text-white mb-1">{{ projectTitle }}</h3>
            <p class="text-body-2 text-white opacity-90 mb-0">{{ projectStatus }}</p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Project Title -->
        <div class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-format-title" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Project Title</span>
          </div>
          <p class="text-body-1 ml-8">{{ projectTitle }}</p>
        </div>

        <!-- Description -->
        <div v-if="hasDescription" class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-text" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Description</span>
          </div>
          <p class="text-body-1 ml-8">{{ projectDescription }}</p>
        </div>

        <!-- Progress -->
        <div v-if="selectedProject.progress !== undefined" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-chart-line" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Progress</span>
          </div>
          <div class="ml-8">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-body-1">{{ selectedProject.progress || 0 }}% Complete</span>
            </div>
            <v-progress-linear
              :color="getProjectStatusColor(selectedProject.status)"
              height="8"
              :model-value="selectedProject.progress || 0"
              rounded
            />
          </div>
        </div>

        <!-- Team Members -->
        <div v-if="selectedProject.team && selectedProject.team.length > 0" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-account-group" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Team Members</span>
          </div>
          <div class="ml-8">
            <v-chip-group>
              <v-chip
                v-for="member in selectedProject.team"
                :key="member"
                size="small"
                color="primary"
                variant="outlined"
              >
                {{ member }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>

        <!-- Created Date -->
        <div v-if="selectedProject.createdAt" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-plus" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Created Date</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedProject.createdAt) }}</p>
        </div>

        <!-- Updated Date -->
        <div v-if="selectedProject.updatedAt" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-edit" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Last Updated</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedProject.updatedAt) }}</p>
        </div>

        <!-- Start Date -->
        <div v-if="selectedProject.startDate" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-start" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Start Date</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedProject.startDate) }}</p>
        </div>

        <!-- End Date -->
        <div v-if="hasEndDate" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-end" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">End Date</span>
          </div>
          <p class="text-body-1 ml-8">{{ formatDate(selectedProject.endDate) }}</p>
        </div>

        <!-- Priority -->
        <div v-if="hasPriority" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-flag" :color="getPriorityColor(selectedProject.priority)" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Priority Level</span>
          </div>
          <v-chip
            :color="getPriorityColor(selectedProject.priority)"
            size="small"
            class="ml-8"
            variant="elevated"
          >
            {{ selectedProject.priority }}
          </v-chip>
        </div>

        <!-- Budget -->
        <div v-if="hasBudget" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-currency-usd" :color="getThemeColor('success')" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Budget</span>
          </div>
          <p class="text-body-1 ml-8 font-weight-medium">{{ formatBudget(selectedProject.budget) }}</p>
        </div>

        <!-- Category -->
        <div v-if="hasCategory" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-tag" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Category</span>
          </div>
          <v-chip
            color="primary"
            size="small"
            class="ml-8"
            variant="outlined"
          >
            {{ selectedProject.category }}
          </v-chip>
        </div>

        <!-- Team Members -->
        <div v-if="hasTeamMembers" class="mb-3">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-account-group" :color="getPrimaryColor()" class="mr-2"></v-icon>
            <span class="text-subtitle2 font-weight-medium">Team Members</span>
          </div>
          <div class="ml-8">
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="(member, index) in selectedProject.teamMembers"
                :key="index"
                :color="getTeamMemberColor(index)"
                size="small"
                variant="tonal"
                class="ma-1"
              >
                <v-icon start icon="mdi-account"></v-icon>
                {{ member }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="outlined"
          @click="handleDeleteProject"
          class="action-btn mr-3"
        >
          <v-icon icon="mdi-delete" class="mr-1"></v-icon>
          Delete
        </v-btn>
        <v-btn
          :color="getPrimaryColor()"
          variant="elevated"
          @click="editProject"
          class="action-btn mr-3"
        >
          <v-icon icon="mdi-pencil" class="mr-1"></v-icon>
          Edit
        </v-btn>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
          class="action-btn"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useProjectDetailsDialog } from '@/composables/ProjectCommon/useProjectDetailsDialog'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedProject: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'delete-project', 'edit-project', 'duplicate-project', 'close'])

const {
  // Theme colors
  getPrimaryColor,
  getThemeColor,

  // State
  isOpen,

  // Computed properties
  projectTitle,
  projectDescription,
  projectStatus,
  hasEndDate,
  hasPriority,
  hasDescription,
  hasBudget,
  hasCategory,
  hasTeamMembers,

  // Methods
  getProjectStatusIcon,
  getProjectStatusColor,
  getPriorityColor,
  formatDate,
  formatBudget,
  closeDialog,
  editProject,
  duplicateProject
} = useProjectDetailsDialog(props, emit)

// Team member colors
const teamMemberColors = ['primary', 'secondary', 'accent', 'info', 'warning', 'success', 'error']

// Get color for team member chip
const getTeamMemberColor = (index) => {
  return teamMemberColors[index % teamMemberColors.length]
}

const handleDeleteProject = () => {
  console.log('Delete button clicked!')
  console.log('Selected project:', props.selectedProject)

  const project = props.selectedProject
  if (!project) {
    console.error('No project selected for deletion')
    return
  }

  // Emit delete event directly - let parent handle confirmation
  const projectId = project._id || project.id
  console.log('ProjectDetails handleDeleteProject - ID:', projectId)
  emit('delete-project', projectId)
  closeDialog()
}
</script>

<style scoped>
/* Dialog Animations & Styling */
.details-dialog .v-overlay__content {
  animation: slideInDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideInDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Card Styling */
.details-card {
  border-radius: 20px !important;
  overflow: hidden;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

/* Header Styling */
.details-header {
  position: relative;
  overflow: hidden;
}

.details-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 100%);
  pointer-events: none;
}

/* Action Button Styling */
.action-btn {
  border-radius: 16px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(0);
}

/* Dark Mode Adjustments */
.v-theme--dark .details-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .action-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 600px) {
  .details-card {
    border-radius: 12px !important;
    margin: 16px;
  }

  .action-btn {
    min-width: 100px;
    font-size: 0.875rem;
  }
}

/* Loading State */
.action-btn.v-btn--loading {
  pointer-events: none;
}

.action-btn.v-btn--loading :deep(.v-btn__overlay) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
</style>
