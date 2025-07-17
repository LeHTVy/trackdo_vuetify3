<template>
  <v-dialog max-width="600px" :model-value="showDialog" @update:model-value="$emit('close')">
    <v-card>
      <v-card-title class="text-h5">
        {{ editingTask ? 'Edit Task' : 'Add New Task' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="formData.title"
            class="mb-4"
            label="Task Title"
            required
            :rules="[v => !!v || 'Title is required']"
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
                v-model="formData.priority"
                class="mb-4"
                :items="priorityOptions"
                label="Priority"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.dueDate"
                class="mb-4"
                label="Due Date"
                type="date"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-select
            v-model="formData.projectId"
            class="mb-4"
            clearable
            :items="projectOptions"
            label="Project (Optional)"
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
          @click="saveTask"
        >
          {{ editingTask ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
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

  const projectsStore = useProjectsStore()
  const form = ref(null)
  const valid = ref(false)

  const formData = ref({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: null,
    completed: false,
  })

  const priorityOptions = [
    { title: 'Low', value: 'low' },
    { title: 'Medium', value: 'medium' },
    { title: 'High', value: 'high' },
  ]

  const projectOptions = computed(() => {
    return projectsStore.projects.map(project => ({
      title: project.name,
      value: project.id,
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
      formData.value = { ...props.editingTask }
      // Format date for input
      if (formData.value.dueDate) {
        formData.value.dueDate = new Date(formData.value.dueDate).toISOString().split('T')[0]
      }
    } else {
      formData.value = {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        projectId: null,
        completed: false,
        ...props.initialData,
      }
    }
  }

  const saveTask = async () => {
    if (form.value) {
      const { valid: isValid } = await form.value.validate()
      if (isValid) {
        const taskData = { ...formData.value }

        if (taskData.dueDate) {
          taskData.dueDate = new Date(taskData.dueDate)
        }

        emit('save', taskData)
      }
    }
  }
</script>

<style scoped>
/* No additional styles needed */
</style>
