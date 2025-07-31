<template>
  <v-dialog
    class="project-dialog"
    max-height="90vh"
    max-width="700px"
    :model-value="showDialog"
    persistent
    scrollable
    transition="dialog-bottom-transition"
    @update:model-value="$emit('close')"
  >
    <v-card class="dialog-project-card d-flex flex-column" elevation="24" style="height: 90vh;">
      <!-- Header with gradient -->
      <v-card-title class="dialog-header pa-6 flex-shrink-0">
        <div class="d-flex align-center">
          <v-avatar
            class="mr-4 header-avatar"
            :color="getPrimaryColor()"
            size="40"
          >
            <v-icon
              color="white"
              :icon="editingProject ? 'mdi-pencil' : 'mdi-folder-plus'"
              size="20"
            />
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
        <v-container class="pa-0" fluid>
          <v-form ref="form" v-model="valid">
            <v-row>
              <!-- Project Title -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.title"
                  class="input-field"
                  :color="getPrimaryColor()"
                  hide-details="auto"
                  label="Project Title"
                  prepend-inner-icon="mdi-folder"
                  required
                  :rules="[rules.title]"
                  variant="outlined"
                />
              </v-col>

              <!-- Project Description -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  auto-grow
                  class="input-field"
                  :color="getPrimaryColor()"
                  hide-details="auto"
                  label="Project Description"
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  variant="outlined"
                />
              </v-col>

              <!-- Status & Progress -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.status"
                  class="input-field"
                  :color="getPrimaryColor()"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="statusOptions"
                  label="Project Status"
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
                <v-text-field
                  v-model="formData.progress"
                  class="input-field"
                  :color="getPrimaryColor()"
                  label="Progress (%)"
                  max="100"
                  min="0"
                  prepend-inner-icon="mdi-percent"
                  :rules="[rules.progress]"
                  step="1"
                  :suffix="`${formData.progress || 0}%`"
                  type="number"
                  variant="outlined"
                  @blur="handleProgressBlur"
                  @input="validateProgressInput"
                />
              </v-col>

              <!-- Date Fields -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.startDate"
                  class="input-field"
                  :color="getPrimaryColor()"
                  label="Start Date"
                  prepend-inner-icon="mdi-calendar-start"
                  required
                  :rules="[rules.startDate]"
                  type="date"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.endDate"
                  class="input-field"
                  :color="getPrimaryColor()"
                  label="End Date"
                  prepend-inner-icon="mdi-calendar-end"
                  required
                  :rules="[rules.endDate]"
                  type="date"
                  variant="outlined"
                />
              </v-col>

              <!-- Budget & Priority -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.budget"
                  class="input-field"
                  :color="getPrimaryColor()"
                  hide-details="auto"
                  label="Budget (Optional)"
                  prefix="$"
                  prepend-inner-icon="mdi-currency-usd"
                  type="number"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.priority"
                  class="input-field"
                  :color="getPrimaryColor()"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="priorityOptions"
                  label="Priority Level"
                  prepend-inner-icon="mdi-star"
                  variant="outlined"
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-icon :color="item.raw.color" icon="mdi-star" />
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
                      <v-icon class="mr-1" icon="mdi-star" size="12" />
                      {{ item.raw.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>

              <!-- Project Category -->
              <v-col cols="12">
                <v-select
                  v-model="formData.category"
                  class="input-field"
                  :color="getPrimaryColor()"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="categoryOptions"
                  label="Project Category"
                  prepend-inner-icon="mdi-tag"
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
                      class="mr-2 category-chip"
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

              <!-- Team Members -->
              <v-col cols="12">
                <v-combobox
                  v-model="formData.teamMembers"
                  chips
                  class="input-field"
                  closable-chips
                  :color="getPrimaryColor()"
                  hide-details="auto"
                  hint="Press Enter to add team members"
                  label="Team Members"
                  multiple
                  persistent-hint
                  prepend-inner-icon="mdi-account-group"
                  :return-object="false"
                  variant="outlined"
                >
                  <template #chip="{ props: chipProps, item }">
                    <v-chip
                      v-bind="chipProps"
                      class="mr-1 mb-1"
                      :color="getPrimaryColor()"
                      size="small"
                      variant="elevated"
                    >
                      <v-icon class="mr-1" icon="mdi-account" size="12" />
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
        <v-spacer />
        <v-btn
          class="action-btn mr-3"
          color="grey-darken-1"
          :disabled="loading"
          size="large"
          variant="outlined"
          @click="$emit('close')"
        >
          <v-icon class="mr-1" icon="mdi-close" />
          Cancel
        </v-btn>
        <v-btn
          class="action-btn"
          :color="getPrimaryColor()"
          :disabled="!isFormValid || loading"
          :loading="loading"
          size="large"
          variant="elevated"
          @click="saveProject"
        >
          <v-icon class="mr-1" :icon="editingProject ? 'mdi-content-save' : 'mdi-plus'" />
          {{ editingProject ? 'Update Project' : 'Create Project' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { onMounted, toRef, watch } from 'vue'
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
    validateProgressInput,
    handleProgressBlur,
    resetForm,
    validateAndSubmit,
    getPrimaryColor,
    applyCssVars,
  } = useProjectDialog(toRef(props, 'editingProject'))

  // Watch for dialog changes
  watch(() => props.showDialog, newVal => {
    if (newVal) {
      resetForm(props.initialData, props.editingProject)
    }
  })

  // Watch for editing project changes
  watch(() => props.editingProject, newProject => {
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
    console.log('saveProject called')
    console.log('isFormValid:', isFormValid.value)
    console.log('loading:', loading.value)
    console.log('formData:', formData.value)
    
    await validateAndSubmit(async projectData => {
      console.log('validateAndSubmit callback called with:', projectData)
      emit('save', projectData)
    })
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
