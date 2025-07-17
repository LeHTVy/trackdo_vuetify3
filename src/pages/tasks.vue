<template>
  <div class="tasks-container">
    <!-- Header Section -->
    <TasksHeader />

    <!-- Quick Stats -->
    <v-container class="py-4">
      <TasksStats
        :completed-tasks="completedTasks"
        :overdue-tasks="overdueTasks"
        :pending-tasks="pendingTasks"
        :total-tasks="totalTasks"
      />
    </v-container>

    <!-- Task Management Section -->
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" md="8">
          <TasksList
            :filter="selectedFilter"
            :tasks="tasks"
            @add-task="showAddDialog = true"
            @delete-task="deleteTask"
            @edit-task="editTask"
            @filter-change="selectedFilter = $event"
            @toggle-task="toggleTask"
          />
        </v-col>

        <v-col cols="12" md="4">
          <!-- Task Filters -->
          <v-card class="filter-card mb-4" elevation="3">
            <v-card-title class="text-h6 font-weight-bold text-primary">
              Filters
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedFilter"
                density="compact"
                :items="filterOptions"
                label="Filter by status"
                variant="outlined"
              />
              <v-select
                v-model="selectedPriority"
                class="mt-3"
                density="compact"
                :items="priorityOptions"
                label="Filter by priority"
                variant="outlined"
              />
            </v-card-text>
          </v-card>

          <!-- Progress Chart -->
          <v-card class="progress-card" elevation="3">
            <v-card-title class="text-h6 font-weight-bold text-primary">
              Progress Overview
            </v-card-title>
            <v-card-text>
              <div class="progress-item mb-4">
                <div class="d-flex justify-space-between mb-2">
                  <span>Completed</span>
                  <span>{{ totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0 }}%</span>
                </div>
                <v-progress-linear
                  color="success"
                  height="8"
                  :model-value="totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0"
                  rounded
                />
              </div>

              <div class="progress-item mb-4">
                <div class="d-flex justify-space-between mb-2">
                  <span>In Progress</span>
                  <span>{{ totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0 }}%</span>
                </div>
                <v-progress-linear
                  color="warning"
                  height="8"
                  :model-value="totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0"
                  rounded
                />
              </div>

              <div class="progress-item">
                <div class="d-flex justify-space-between mb-2">
                  <span>Overdue</span>
                  <span>{{ totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0 }}%</span>
                </div>
                <v-progress-linear
                  color="error"
                  height="8"
                  :model-value="totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0"
                  rounded
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Task Dialog -->
    <TaskDialog
      :editing-task="editingTask"
      :show-dialog="showAddDialog"
      @close="closeDialog"
      @save="saveTask"
    />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import TaskDialog from '@/components/tasks/TaskDialog.vue'
  import TasksHeader from '@/components/tasks/TasksHeader.vue'
  import TasksList from '@/components/tasks/TasksList.vue'
  import TasksStats from '@/components/tasks/TasksStats.vue'
  import { useTasksStore } from '@/stores/tasks'

  const showAddDialog = ref(false)
  const editingTask = ref(null)
  const selectedFilter = ref('all')
  const selectedPriority = ref('All')
  const tasksStore = useTasksStore()
  const tasks = computed(() => tasksStore.tasks)
  const filterOptions = ['All', 'Completed', 'Pending', 'Overdue']
  const priorityOptions = ['All', 'high', 'medium', 'low']
  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed').length)
  const pendingTasks = computed(() => tasks.value.filter(task => task.status === 'todo' || task.status === 'in-progress').length)
  const overdueTasks = computed(() => tasks.value.filter(task => task.status !== 'completed' && isOverdue(task)).length)

  // Methods
  const toggleTask = async taskId => {
    const task = tasks.value.find(t => t._id === taskId)
    if (task) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed'
      await tasksStore.updateTask(task._id, { ...task, status: newStatus })
    }
  }

  const editTask = task => {
    editingTask.value = task
    showAddDialog.value = true
  }

  const deleteTask = async taskId => {
    if (confirm('Are you sure you want to delete this task?')) {
      await tasksStore.deleteTask(taskId)
    }
  }

  const closeDialog = () => {
    showAddDialog.value = false
    editingTask.value = null
  }

  const saveTask = async taskData => {
    try {
      await (editingTask.value
        ? tasksStore.updateTask(editingTask.value._id, taskData)
        : tasksStore.addTask({
          ...taskData,
          status: 'todo',
          dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        }))
      closeDialog()
    } catch (error) {
      console.error('Error saving task:', error)
      alert(`Error saving task: ${error.message}`)
    }
  }

  const isOverdue = task => {
    const today = new Date().toISOString().split('T')[0]
    return task.dueDate < today
  }

  onMounted(async () => {
    await tasksStore.fetchTasks()
  })
</script>

<style scoped>
.tasks-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #fff8e1 100%);
}

.filter-card,
.progress-card {
  border-radius: 16px;
  background: rgb(255 255 255 / 95%);
  backdrop-filter: blur(10px);
}

/* Dark theme adjustments */
.v-theme--dark .tasks-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #2a2a2a 100%);
}

.v-theme--dark .filter-card,
.v-theme--dark .progress-card {
  background: rgb(45 55 72 / 95%);
}
</style>
