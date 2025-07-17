<template>
  <v-card class="tasks-card" elevation="4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Tasks</span>
      <div class="d-flex gap-2">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="elevated"
          @click="$emit('add-task')"
        >
          Add Task
        </v-btn>
        <v-menu>
          <!-- eslint-disable-next-line vue/no-template-shadow -->
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              append-icon="mdi-chevron-down"
              variant="outlined"
            >
              {{ filterText }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="option in filterOptions"
              :key="option.value"
              @click="$emit('filter-change', option.value)"
            >
              <v-list-item-title>{{ option.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-title>

    <v-card-text>
      <v-list v-if="filteredTasks.length > 0">
        <v-list-item
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-item"
          :class="{ 'completed': task.completed, 'overdue': isOverdue(task) }"
        >
          <template #prepend>
            <v-checkbox
              color="success"
              hide-details
              :model-value="task.completed"
              @update:model-value="$emit('toggle-task', task.id)"
            />
          </template>

          <v-list-item-title
            :class="{ 'text-decoration-line-through': task.completed }"
          >
            {{ task.title }}
          </v-list-item-title>

          <v-list-item-subtitle v-if="task.description">
            {{ task.description }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center gap-2">
              <v-chip
                v-if="task.priority"
                :color="getPriorityColor(task.priority)"
                size="small"
                variant="flat"
              >
                {{ task.priority }}
              </v-chip>

              <v-chip
                v-if="task.dueDate"
                :color="isOverdue(task) ? 'error' : 'primary'"
                size="small"
                variant="outlined"
              >
                {{ formatDate(task.dueDate) }}
              </v-chip>

              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="$emit('edit-task', task)"
              />

              <v-btn
                color="error"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="$emit('delete-task', task.id)"
              />
            </div>
          </template>
        </v-list-item>
      </v-list>

      <div v-else class="text-center py-8">
        <v-icon color="grey-lighten-1" size="64">mdi-format-list-checks</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">No tasks found</p>
        <p class="text-body-2 text-medium-emphasis">
          {{ filter === 'all' ? 'Create your first task to get started!' : 'No tasks match the current filter.' }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  const props = defineProps({
    tasks: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: String,
      default: 'all',
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const emit = defineEmits([
    'add-task',
    'edit-task',
    'delete-task',
    'toggle-task',
    'filter-change',
  ])

  const filterOptions = [
    { text: 'All Tasks', value: 'all' },
    { text: 'Pending', value: 'pending' },
    { text: 'Completed', value: 'completed' },
    { text: 'Overdue', value: 'overdue' },
  ]

  const filterText = computed(() => {
    const option = filterOptions.find(opt => opt.value === props.filter)
    return option ? option.text : 'All Tasks'
  })

  const filteredTasks = computed(() => {
    switch (props.filter) {
      case 'completed': {
        return props.tasks.filter(task => task.completed)
      }
      case 'pending': {
        return props.tasks.filter(task => !task.completed && !isOverdue(task))
      }
      case 'overdue': {
        return props.tasks.filter(task => !task.completed && isOverdue(task))
      }
      default: {
        return props.tasks
      }
    }
  })

  const isOverdue = task => {
    if (!task.dueDate || task.completed) return false
    return new Date(task.dueDate) < new Date()
  }

  const getPriorityColor = priority => {
    switch (priority?.toLowerCase()) {
      case 'high': { return 'error'
      }
      case 'medium': { return 'warning'
      }
      case 'low': { return 'success'
      }
      default: { return 'grey'
      }
    }
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
</script>

<style scoped>
.tasks-card {
  border-radius: 16px;
  background: rgb(255 255 255 / 95%);
  backdrop-filter: blur(10px);
}

.task-item {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: rgb(25 118 210 / 5%);
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.overdue {
  border-left: 4px solid rgb(244, 67, 54);
}

/* Dark theme adjustments */
.v-theme--dark .tasks-card {
  background: rgb(45 55 72 / 95%);
}
</style>
