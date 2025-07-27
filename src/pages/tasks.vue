<template>
  <div class="tasks-page app-background" :style="cssVars">
    <!-- Header Section -->
    <TasksHeader />

    <!-- Stats Section -->
    <TasksStats
      :total-tasks="tasksStore.totalTasks.length"
      :completed-tasks="tasksStore.completedTasks.length"
      :pending-tasks="tasksStore.pendingTasks.length"
      :in-progress-tasks="tasksStore.inProgressTasks.length"
      :overdue-tasks="tasksStore.overdueTasks.length"
    />

    <!-- Main Content -->
    <div class="tasks-content">
      <!-- Filters and Search -->
      <TaskFilters
        v-model:search-query="searchQuery"
        v-model:selected-status="selectedStatus"
        v-model:selected-priority="selectedPriority"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :status-options="statusOptions"
        :priority-options="priorityOptions"
        :sort-options="sortOptions"
        :has-active-filters="hasActiveFilters"
        @clear-filters="clearFilters"
        @toggle-sort-order="toggleSortOrder"
      />

      <!-- Main Layout Grid -->
      <div class="main-grid">
        <!-- Left Column - Tasks List -->
        <div class="left-column">
          <TasksList
            :tasks="filteredTasks"
            :tasks-store="tasksStore"
            @edit-task="editTask"
            @delete-task="deleteTask"
            @toggle-complete="toggleTaskComplete"
          />
        </div>

        <!-- Right Column - Progress & Insights -->
        <div class="right-column">
          <!-- Task Progress -->
          <TaskProgress :tasks-store="tasksStore" />

          <!-- Task Insights -->
          <TaskInsights />
        </div>
      </div>
    </div>

    <!-- Task Dialog -->
    <TaskDialog
      :show-dialog="showTaskDialog"
      :editing-task="editingTask"
      @close="closeTaskDialog"
      @save="saveTask"
    />

    <!-- Draggable Floating Action Button -->
    <v-btn
      fab
      color="primary"
      size="large"
      class="floating-add-btn"
      :class="{ 'dragging': isDragging }"
      :style="fabStyle"
      @click="openTaskDialog"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <v-icon>mdi-plus</v-icon>
      <v-tooltip activator="parent" location="top">
        Add New Task
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useTaskColors, useTaskFormatting, useTaskFilters, useDraggableFab } from '@/composables'
import TasksHeader from '@/components/tasks/TasksHeader.vue'
import TasksStats from '@/components/tasks/TasksStats.vue'
import TasksList from '@/components/tasks/TasksList.vue'
import TaskDialog from '@/components/tasks/TaskDialog.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskProgress from '@/components/tasks/TaskProgress.vue'
import TaskInsights from '@/components/tasks/TaskInsights.vue'

// Stores
const tasksStore = useTasksStore()

// Refs
const showTaskDialog = ref(false)
const editingTask = ref(null)

// Use composables
const { cssVars, applyCssVars, getPriorityColor } = useTaskColors('page')
const { formatRelativeTime } = useTaskFormatting()
const {
  searchQuery,
  selectedStatus,
  selectedPriority,
  sortBy,
  sortOrder,
  statusOptions,
  priorityOptions,
  sortOptions,
  filteredTasks,
  hasActiveFilters,
  clearFilters,
  toggleSortOrder
} = useTaskFilters(computed(() => tasksStore.tasks))

// Draggable FAB
const { isDragging, fabStyle, startDrag } = useDraggableFab({
  storageKey: 'tasksFabPosition'
})

// Apply CSS variables
applyCssVars()

// Methods
const openTaskDialog = (initialData = {}) => {
  editingTask.value = null
  showTaskDialog.value = true
}

const editTask = (task) => {
  editingTask.value = task
  showTaskDialog.value = true
}

const closeTaskDialog = () => {
  showTaskDialog.value = false
  editingTask.value = null
}

const saveTask = async (taskData) => {
  try {
    if (editingTask.value) {
      const taskId = editingTask.value.id || editingTask.value._id
      await tasksStore.updateTask(taskId, taskData)
    } else {
      await tasksStore.addTask(taskData)
    }
    closeTaskDialog()
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

const deleteTask = async (taskId) => {
  try {
    await tasksStore.deleteTask(taskId)
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const toggleTaskComplete = async (task) => {
  try {
    const taskId = task.id || task._id
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    await tasksStore.updateTask(taskId, {
      status: newStatus,
      completed: newStatus === 'completed'
    })
  } catch (error) {
    console.error('Error toggling task completion:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await tasksStore.fetchTasks()
})
</script>

<style scoped>
.tasks-page {
  min-height: 100vh;
  padding: 1rem;
  padding-bottom: 2rem;
}

.tasks-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Main Grid Layout */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  margin-top: 1rem;
}

.left-column {
  min-width: 0; /* Prevents grid overflow */
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Floating Action Button Styles */
.floating-add-btn {
  position: fixed;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.4) !important;
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
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.8) !important;
  transition: none !important;
}

.floating-add-btn:active {
  transform: scale(0.95);
}

/* Pulse animation for attention */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.4);
  }
  50% {
    box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.8);
  }
  100% {
    box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.4);
  }
}

.floating-add-btn:not(.dragging):not(:hover) {
  animation: pulse 2s infinite;
}

.v-theme--dark .floating-add-btn {
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.6) !important;
}

.v-theme--dark .floating-add-btn:hover {
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.8) !important;
}

.v-theme--dark .floating-add-btn.dragging {
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 1) !important;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr 350px;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .tasks-page {
    padding: 0.75rem;
  }

  .main-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .right-column {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .tasks-page {
    padding: 0.5rem;
  }

  .main-grid {
    gap: 0.75rem;
  }

  .right-column {
    gap: 0.75rem;
  }
}
</style>
