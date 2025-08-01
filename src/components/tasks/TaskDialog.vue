<template>
  <v-dialog
    class="task-dialog"
    max-width="650px"
    :model-value="showDialog"
    persistent
    transition="dialog-bottom-transition"
    @update:model-value="$emit('close')"
  >
    <v-card class="dialog-card" elevation="24">
      <!-- Header with gradient -->
      <v-card-title class="dialog-header pa-6">
        <div class="d-flex align-center">
          <v-avatar
            class="mr-4 header-avatar"
            color="primary"
            size="40"
          >
            <v-icon color="white" :icon="editingTask ? 'mdi-pencil' : 'mdi-plus'" size="20" />
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold text-white mb-1">
              {{ editingTask ? 'Edit Task' : 'Create New Task' }}
            </h2>
            <p class="text-body-2 text-white opacity-90 mb-0">
              {{ editingTask ? 'Update task details' : 'Add a new task to your list' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-container class="pa-0" fluid>
          <v-form ref="form">
            <v-row>
              <!-- Task Title -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.title"
                  class="input-field"
                  color="primary"
                  hide-details="auto"
                  label="Task Title"
                  placeholder="Enter task title..."
                  prepend-inner-icon="mdi-format-title"
                  required
                  :rules="titleRules"
                  variant="outlined"
                />
              </v-col>

              <!-- Task Description -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  auto-grow
                  class="input-field"
                  color="primary"
                  hide-details="auto"
                  label="Task Description"
                  placeholder="Describe your task..."
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  :rules="descriptionRules"
                  variant="outlined"
                />
              </v-col>

              <!-- Status & Priority -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.status"
                  class="input-field"
                  color="primary"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="statusOptions"
                  label="Status"
                  prepend-inner-icon="mdi-flag"
                  variant="outlined"
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-icon :color="item.raw.color" :icon="item.raw.icon" />
                      </template>
                    </v-list-item>
                  </template>
                  <template #selection="{ item }">
                    <v-chip
                      class="mr-2 status-chip"
                      :color="item.raw.color"
                      size="small"
                      variant="elevated"
                    >
                      <v-icon class="mr-1" :icon="item.raw.icon" size="12" />
                      {{ item.raw.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.priority"
                  class="input-field"
                  color="primary"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="priorityOptions"
                  label="Priority"
                  prepend-inner-icon="mdi-alert"
                  variant="outlined"
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-icon :color="item.raw.color" icon="mdi-alert" />
                      </template>
                    </v-list-item>
                  </template>
                  <template #selection="{ item }">
                    <v-chip
                      class="mr-2 priority-chip"
                      :color="item.raw.color"
                      size="small"
                      variant="elevated"
                    >
                      <v-icon class="mr-1" icon="mdi-alert" size="12" />
                      {{ item.raw.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <!-- Due Date & Estimated Hours -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.dueDate"
                  class="input-field"
                  color="primary"
                  hide-details="auto"
                  label="Due Date"
                  prepend-inner-icon="mdi-calendar"
                  :rules="dueDateRules"
                  type="date"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.estimatedHours"
                  class="input-field"
                  color="primary"
                  hide-details="auto"
                  label="Estimated Hours"
                  min="0"
                  prepend-inner-icon="mdi-clock-outline"
                  :rules="estimatedHoursRules"
                  step="0.5"
                  type="number"
                  variant="outlined"
                />
              </v-col>

              <!-- Project Assignment -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.project"
                  class="input-field"
                  clearable
                  color="primary"
                  hide-details="auto"
                  :items="projectOptions"
                  label="Project (Optional)"
                  prepend-inner-icon="mdi-folder"
                  :rules="projectRules"
                  variant="outlined"
                />
              </v-col>

              <!-- Tags -->
              <v-col cols="12">
                <v-combobox
                  v-model="formData.tags"
                  chips
                  class="input-field"
                  closable-chips
                  color="primary"
                  hide-details="auto"
                  label="Tags"
                  multiple
                  placeholder="Add tags..."
                  prepend-inner-icon="mdi-tag-multiple"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          class="action-btn mr-3"
          color="grey-darken-1"
          size="large"
          variant="outlined"
          @click="$emit('close')"
        >
          <v-icon class="mr-1" icon="mdi-close" />
          Cancel
        </v-btn>
        <v-btn
          class="action-btn"
          color="primary"
          :disabled="!isFormValid"
          size="large"
          variant="elevated"
          @click="saveTask"
        >
          <v-icon class="mr-1" :icon="editingTask ? 'mdi-content-save' : 'mdi-plus'" />
          {{ editingTask ? 'Update Task' : 'Create Task' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useTaskColors, useTaskValidation } from '@/composables'
  import { useProjectsStore } from '@/stores/projects'

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false,
    },
    editingTask: {
      type: Object,
      default: null,
    },
    initialData: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['close', 'save'])

  // Stores
  const projectsStore = useProjectsStore()

  // Refs
  const form = ref(null)

  // Form data
  const formData = ref({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    estimatedHours: '',
    project: '',
    tags: [],
  })

  // Use composables
  const { applyCssVars } = useTaskColors('dialog')
  const {
    titleRules,
    descriptionRules,
    dueDateRules,
    estimatedHoursRules,
    projectRules,
    isFormValid,
  } = useTaskValidation(formData)

  // Apply CSS variables
  applyCssVars()

  // Options
  const statusOptions = computed(() => {
    const baseOptions = [
      { title: 'To Do', value: 'todo', icon: 'mdi-circle-outline', color: 'grey' },
      { title: 'In Progress', value: 'in-progress', icon: 'mdi-progress-clock', color: 'blue' },
    ]

    // Only show "Completed" and "Cancelled" options when editing existing tasks
    if (props.editingTask?.id || props.editingTask?._id) {
      baseOptions.push(
        { title: 'Completed', value: 'completed', icon: 'mdi-check-circle', color: 'green' },
        { title: 'Cancelled', value: 'cancelled', icon: 'mdi-close-circle', color: 'red' }
      )
    }

    return baseOptions
  })

  const priorityOptions = [
    { title: 'Low', value: 'low', color: 'green' },
    { title: 'Medium', value: 'medium', color: 'orange' },
    { title: 'High', value: 'high', color: 'red' },
    { title: 'Critical', value: 'critical', color: 'purple' },
  ]

  const projectOptions = computed(() => {
    return projectsStore.projects.map(project => ({
      title: project.title || project.name,
      value: project.title || project.name,
    }))
  })

  // Watch for dialog opening and reset form
  watch(() => props.showDialog, newVal => {
    if (newVal) {
      resetForm()
    }
  })

  const resetForm = () => {
    if (props.editingTask) {
      formData.value = {
        ...props.editingTask,
        tags: props.editingTask.tags || [],
      }
      // Format date for input
      if (formData.value.dueDate) {
        formData.value.dueDate = new Date(formData.value.dueDate).toISOString().split('T')[0]
      }
    } else {
      formData.value = {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        estimatedHours: '',
        project: '',
        tags: [],
        ...props.initialData,
      }
    }
  }

  const saveTask = async () => {
    if (form.value) {
      const { valid } = await form.value.validate()
      if (valid) {
        const taskData = { ...formData.value }

        // Convert date string to Date object
        if (taskData.dueDate) {
          taskData.dueDate = new Date(taskData.dueDate)
        }

        // Convert estimated hours to number
        if (taskData.estimatedHours) {
          taskData.estimatedHours = parseFloat(taskData.estimatedHours)
        }

        emit('save', taskData)
      }
    }
  }
</script>

<style scoped>
/* Dialog Animations & Styling */
.task-dialog .v-overlay__content {
  animation: slideInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideInUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Card Styling */
.dialog-card {
  border-radius: 24px !important;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header Styling */
.dialog-header {
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary), 0.8) 100%) !important;
  position: relative;
  overflow: hidden;
}

.dialog-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 100%);
  pointer-events: none;
}

/* Avatar Animation */
.header-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-avatar:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* Input Field Styling */
.input-field {
  margin-bottom: 8px;
}

.input-field :deep(.v-field) {
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field :deep(.v-field:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-field :deep(.v-field--focused) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.2);
}

/* Chip Styling */
.status-chip,
.priority-chip {
  border-radius: 20px !important;
  font-weight: 600;
  transition: all 0.2s ease;
}

.status-chip:hover,
.priority-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.status-chip {
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.3px;
}

.priority-chip {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
.v-theme--dark .dialog-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .input-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.v-theme--dark .input-field :deep(.v-field--focused) {
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.3);
}

.v-theme--dark .action-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 600px) {
  .dialog-card {
    border-radius: 16px !important;
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

/* Focus States */
.input-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 3px;
}

/* Selection Styling */
.input-field :deep(.v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.input-field :deep(.v-list-item:hover) {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

/* Tags Chip Styling */
.input-field :deep(.v-chip) {
  border-radius: 12px !important;
  font-weight: 500;
}

/* Textarea Styling */
.input-field :deep(.v-field--variant-outlined .v-field__field) {
  padding-top: 12px;
}
</style>
