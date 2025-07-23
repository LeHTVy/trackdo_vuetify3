<template>
  <v-dialog max-width="600px" :model-value="showDialog" @update:model-value="$emit('close')">
    <v-card>
      <v-card-title class="text-h5">
        {{ editingProject ? 'Edit Project' : 'Add New Project' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="formData.name"
            class="mb-4"
            label="Project Name"
            required
            :rules="[v => !!v || 'Name is required']"
            variant="outlined"
          />

          <v-textarea
            v-model="formData.description"
            class="mb-4"
            label="Description"
            rows="3"
            variant="outlined"
          />

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                class="mb-4"
                :items="statusOptions"
                label="Status"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.progress"
                class="mb-4"
                label="Progress (%)"
                max="100"
                min="0"
                type="number"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.startDate"
                class="mb-4"
                label="Start Date"
                type="date"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.endDate"
                class="mb-4"
                label="End Date"
                type="date"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.budget"
            class="mb-4"
            label="Budget (Optional)"
            prefix="$"
            type="number"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!valid"
          variant="elevated"
          @click="saveProject"
        >
          {{ editingProject ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'

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

  const form = ref(null)
  const valid = ref(false)

  const formData = ref({
    name: '',
    description: '',
    status: 'Active',
    progress: 0,
    startDate: '',
    endDate: '',
    budget: null,
  })

  const statusOptions = computed(() => {
    const baseOptions = [
      { title: 'Active', value: 'Active' },
      { title: 'Completed', value: 'Completed' },
      { title: 'On Hold', value: 'On Hold' }
    ]
    if (props.editingProject) {
      baseOptions.push({ title: 'Cancelled', value: 'Cancelled' })
    }

    return baseOptions
  })

  watch(() => props.showDialog, newVal => {
    if (newVal) {
      resetForm()
    }
  })

  const resetForm = () => {
    if (props.editingProject) {
      formData.value = { ...props.editingProject }
      if (formData.value.startDate) {
        formData.value.startDate = new Date(formData.value.startDate).toISOString().split('T')[0]
      }
      if (formData.value.endDate) {
        formData.value.endDate = new Date(formData.value.endDate).toISOString().split('T')[0]
      }
    } else {
      formData.value = {
        name: '',
        description: '',
        status: 'Active',
        progress: 0,
        startDate: '',
        endDate: '',
        budget: null,
        ...props.initialData,
      }
    }
  }

  const saveProject = async () => {
    if (form.value) {
      const { valid: isValid } = await form.value.validate()
      if (isValid) {
        const projectData = { ...formData.value }

        if (projectData.startDate) {
          projectData.startDate = new Date(projectData.startDate)
        }
        if (projectData.endDate) {
          projectData.endDate = new Date(projectData.endDate)
        }

        projectData.progress = Number(projectData.progress) || 0

        if (projectData.budget) {
          projectData.budget = Number(projectData.budget)
        }

        emit('save', projectData)
      }
    }
  }
</script>

<style scoped>
/* Dialog styling */
.v-dialog .v-card {
  border-radius: 12px;
}

.v-dialog .v-card-title {
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px 12px 0 0;
  padding: 20px 24px;
  font-weight: 600;
}

.v-dialog .v-card-text {
  padding: 24px;
}

.v-dialog .v-card-actions {
  padding: 16px 24px 24px;
}

/* Form styling */
.v-form .v-text-field,
.v-form .v-textarea,
.v-form .v-select {
  margin-bottom: 8px;
}

/* Dark mode enhancements */
.v-theme--dark .v-dialog .v-card {
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
}

.v-theme--dark .v-dialog .v-card-title {
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-on-surface));
}

/* Responsive design */
@media (max-width: 600px) {
  .v-dialog {
    margin: 16px;
  }

  .v-dialog .v-card {
    margin: 0;
  }

  .v-dialog .v-card-title {
    padding: 16px;
    font-size: 1.1rem;
  }

  .v-dialog .v-card-text {
    padding: 16px;
  }

  .v-dialog .v-card-actions {
    padding: 12px 16px 16px;
  }
}
</style>
