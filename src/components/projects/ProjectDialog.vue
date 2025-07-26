<template>
  <v-dialog
    :model-value="showDialog"
    max-width="700px"
    max-height="90vh"
    persistent
    transition="dialog-bottom-transition"
    class="project-dialog"
    scrollable
    @update:model-value="$emit('close')"
  >
    <v-card class="dialog-project-card d-flex flex-column" elevation="24" style="height: 90vh;">
      <!-- Header with gradient -->
      <v-card-title class="dialog-header pa-6 flex-shrink-0">
        <div class="d-flex align-center">
          <v-avatar
            :color="getPrimaryColor()"
            size="40"
            class="mr-4 header-avatar"
          >
            <v-icon
              :icon="editingProject ? 'mdi-pencil' : 'mdi-folder-plus'"
              color="white"
              size="20"
            ></v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold text-white mb-1">
              {{ editingProject ? 'Edit Project' : 'Create New Project' }}
            </h2>
            <p class="text-body-2 text-white opacity-90 mb-0">
              {{ editingProject ? 'Update project information and settings' : 'Add a new project to your workspace' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6 flex-grow-1" style="overflow-y: auto;">
        <v-container fluid class="pa-0">
          <v-form ref="form" v-model="valid">
            <v-row>
              <!-- Project Title -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.title"
                  label="Project Title"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  required
                  :rules="[rules.title]"
                  prepend-inner-icon="mdi-folder"
                  class="input-field"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <!-- Project Description -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Project Description"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  rows="3"
                  auto-grow
                  prepend-inner-icon="mdi-text"
                  class="input-field"
                  hide-details="auto"
                ></v-textarea>
              </v-col>

              <!-- Status & Progress -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.status"
                  :items="statusOptions"
                  item-title="title"
                  item-value="value"
                  label="Project Status"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-flag"
                  class="input-field"
                  hide-details="auto"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :icon="item.raw.icon" :color="item.raw.color"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-chip
                      :color="item.raw.color"
                      size="small"
                      class="mr-2 status-chip"
                      variant="elevated"
                    >
                      <v-icon :icon="item.raw.icon" size="12" class="mr-1"></v-icon>
                      {{ item.raw.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.progress"
                  label="Progress (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-percent"
                  class="input-field"
                  :rules="[rules.progress]"
                  @input="validateProgressInput"
                  @blur="handleProgressBlur"
                  :suffix="`${formData.progress || 0}%`"
                ></v-text-field>
              </v-col>

              <!-- Date Fields -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.startDate"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-calendar-start"
                  class="input-field"
                  :rules="[rules.startDate]"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.endDate"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-calendar-end"
                  class="input-field"
                  :rules="[rules.endDate]"
                  required
                ></v-text-field>
              </v-col>

              <!-- Budget & Priority -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.budget"
                  label="Budget (Optional)"
                  type="number"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-currency-usd"
                  class="input-field"
                  hide-details="auto"
                  prefix="$"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.priority"
                  :items="priorityOptions"
                  item-title="title"
                  item-value="value"
                  label="Priority Level"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-star"
                  class="input-field"
                  hide-details="auto"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon icon="mdi-star" :color="item.raw.color"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-chip
                      :color="item.raw.color"
                      size="small"
                      class="mr-2 priority-chip"
                      variant="elevated"
                    >
                      <v-icon icon="mdi-star" size="12" class="mr-1"></v-icon>
                      {{ item.raw.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <!-- Project Category -->
              <v-col cols="12">
                <v-select
                  v-model="formData.category"
                  :items="categoryOptions"
                  item-title="title"
                  item-value="value"
                  label="Project Category"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-tag"
                  class="input-field"
                  hide-details="auto"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :icon="item.raw.icon" :color="item.raw.color"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-chip
                      :color="item.raw.color"
                      size="small"
                      class="mr-2 category-chip"
                      variant="elevated"
                    >
                      <v-icon :icon="item.raw.icon" size="12" class="mr-1"></v-icon>
                      {{ item.raw.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <!-- Team Members -->
              <v-col cols="12">
                <v-combobox
                  v-model="formData.teamMembers"
                  label="Team Members"
                  variant="outlined"
                  :color="getPrimaryColor()"
                  prepend-inner-icon="mdi-account-group"
                  class="input-field"
                  hide-details="auto"
                  multiple
                  chips
                  closable-chips
                  hint="Press Enter to add team members"
                  persistent-hint
                  :return-object="false"
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip
                      v-bind="props"
                      :color="getPrimaryColor()"
                      size="small"
                      variant="elevated"
                      class="mr-1 mb-1"
                    >
                      <v-icon icon="mdi-account" size="12" class="mr-1"></v-icon>
                      {{ typeof item === 'string' ? item : item.title || item.value || item }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-6 pt-0 flex-shrink-0" style="border-top: 1px solid rgba(0,0,0,0.12);">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          @click="$emit('close')"
          :disabled="loading"
          class="action-btn mr-3"
          size="large"
        >
          <v-icon icon="mdi-close" class="mr-1"></v-icon>
          Cancel
        </v-btn>
        <v-btn
          :color="getPrimaryColor()"
          variant="elevated"
          @click="saveProject"
          :disabled="!isFormValid || loading"
          :loading="loading"
          class="action-btn"
          size="large"
        >
          <v-icon :icon="editingProject ? 'mdi-content-save' : 'mdi-plus'" class="mr-1"></v-icon>
          {{ editingProject ? 'Update Project' : 'Create Project' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, watch, toRef } from 'vue'
import { useProjectDialog } from '@/composables'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  editingProject: {
    type: Object,
    default: null,
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'save'])

// Use the project dialog composable
const {
  form,
  valid,
  loading,
  formData,
  statusOptions,
  priorityOptions,
  categoryOptions,
  rules,
  isFormValid,
  formatProgress,
  isProgressValid,
  validateProgressInput,
  handleProgressBlur,
  resetForm,
  validateAndSubmit,
  getPrimaryColor,
  applyCssVars
} = useProjectDialog(toRef(props, 'editingProject'))

// Watch for dialog changes
watch(() => props.showDialog, newVal => {
  if (newVal) {
    resetForm(props.initialData, props.editingProject)
  }
})

// Watch for editing project changes
watch(() => props.editingProject, (newProject) => {
  if (props.showDialog) {
    resetForm(props.initialData, newProject)
  }
})

// Apply CSS variables when component mounts
onMounted(() => {
  applyCssVars()
})

// Handle save with validation
const saveProject = async () => {
  await validateAndSubmit(async (projectData) => {
    emit('save', projectData)
  })
}

// Handle close
const closeDialog = () => {
  emit('close')
}
</script>

<style scoped>
/* Dialog Styles */
.project-dialog :deep(.v-overlay__content) {
  margin: 24px;
}

.project-dialog :deep(.v-card) {
  border-radius: 50px !important;
  overflow: hidden !important;
}

.dialog-project-card {
  border-radius: 50px !important;
  overflow: hidden !important;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
}

/* Header Styles */
.dialog-header {
  background: rgba(var(--v-theme-primary), 100%);
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

.header-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.header-avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

/* Form Styles */
.input-field :deep(.v-field) {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.input-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1);
}

.input-field :deep(.v-field--focused) {
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.2);
}

/* Chip Styles */
.status-chip,
.priority-chip,
.category-chip {
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.status-chip:hover,
.priority-chip:hover,
.category-chip:hover {
  transform: scale(1.05);
}

/* Action Button Styles */
.action-btn {
  border-radius: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Dark Mode Adjustments */
.v-theme--dark .dialog-header {
  background: rgba(var(--v-theme-primary), 50%);
}

.v-theme--dark .header-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .input-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.v-theme--dark .input-field :deep(.v-field--focused) {
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .project-dialog :deep(.v-overlay__content) {
    margin: 12px;
  }

  .dialog-project-card {
    border-radius: 25px;
  }

  .dialog-header {
    padding: 1rem !important;
  }

  .action-btn {
    min-width: 100px;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .project-dialog :deep(.v-overlay__content) {
    margin: 8px;
  }

  .dialog-project-card {
    border-radius: 20px;
  }

  .header-avatar {
    width: 32px !important;
    height: 32px !important;
  }

  .header-avatar .v-icon {
    font-size: 16px !important;
  }

  .dialog-header h2 {
    font-size: 1.25rem !important;
  }

  .dialog-header p {
    font-size: 0.75rem !important;
  }
}

/* Animation */
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

.dialog-project-card {
  animation: fadeInUp 0.4s ease-out;
}

.input-field {
  animation: fadeInUp 0.6s ease-out;
}

.input-field:nth-child(1) { animation-delay: 0.1s; }
.input-field:nth-child(2) { animation-delay: 0.2s; }
.input-field:nth-child(3) { animation-delay: 0.3s; }
.input-field:nth-child(4) { animation-delay: 0.4s; }
</style>
