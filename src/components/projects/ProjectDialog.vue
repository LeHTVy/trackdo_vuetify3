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
    status: 'active',
    progress: 0,
    startDate: '',
    endDate: '',
    budget: null,
  })

  const statusOptions = [
    { title: 'Active', value: 'active' },
    { title: 'Completed', value: 'completed' },
    { title: 'On Hold', value: 'on-hold' },
    { title: 'Cancelled', value: 'cancelled' },
  ]

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
        status: 'active',
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
/* No additional styles needed */
</style>
