<template>
  <div class="tasks-list" :style="cssVars">
    <!-- Filter and Actions Bar -->
    <div class="list-header">
      <div class="list-title">
        <h3>Tasks</h3>
        <span class="task-count">{{ filteredTasks.length }} tasks</span>
      </div>
    </div>

    <!-- Tasks Grid -->
    <div v-if="filteredTasks.length > 0" class="tasks-grid">
      <div
        v-for="task in filteredTasks"
        :key="task.id || task._id"
        class="task-card"
        :class="[getTaskCardClass(task), ...getTaskCompletionClasses(task)]"
        :style="getTaskCompletionStyles(task)"
        @click="$emit('edit', task)"
      >
        <!-- Completion Overlay -->
        <div v-if="isTaskCompleted(task)" class="completion-overlay" />

        <!-- Task Header -->
        <div class="task-header">
          <div class="task-checkbox" @click.stop>
            <v-checkbox
              color="success"
              density="compact"
              hide-details
              :loading="isTaskToggling(task)"
              :model-value="task.status === 'completed'"
              @update:model-value="handleToggleCompletion(task)"
            />
          </div>
          <div class="task-priority">
            <v-chip
              v-if="task.priority"
              :color="getPriorityColor(task.priority)"
              size="small"
              variant="flat"
            >
              {{ formatPriority(task.priority) }}
            </v-chip>
          </div>
          <div class="task-actions" @click.stop>
            <v-btn
              color="primary"
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
              @click="handleDeleteTask(task)"
            />
          </div>
        </div>

        <!-- Task Content -->
        <div class="task-content">
          <h4 class="task-title" :class="{ 'completed': task.status === 'completed' }">
            {{ task.title }}
          </h4>
          <p v-if="task.description" class="task-description">
            {{ task.description }}
          </p>
        </div>

        <!-- Task Footer -->
        <div class="task-footer">
          <div class="task-meta">
            <div v-if="task.dueDate" class="task-due-date">
              <v-icon :color="getDateColor(task)" size="16">mdi-calendar</v-icon>
              <span :class="getDateClass(task)">{{ formatDate(task.dueDate) }}</span>
            </div>
            <div v-if="task.project" class="task-project">
              <v-icon color="primary" size="16">mdi-folder</v-icon>
              <span>{{ task.project }}</span>
            </div>
          </div>
          <div class="task-status">
            <v-chip
              :color="getStatusColor(task.status)"
              size="small"
              variant="outlined"
            >
              {{ formatStatus(task.status) }}
            </v-chip>
          </div>
        </div>

        <!-- Overdue Indicator -->
        <div v-if="isTaskOverdue(task)" class="overdue-indicator" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <v-icon color="grey-lighten-2" size="64">mdi-format-list-checks</v-icon>
      </div>
      <h3 class="empty-title">No tasks found</h3>
      <p class="empty-subtitle">
        {{ hasActiveFilters ? 'No tasks match the current filters.' : 'Use the floating button to create your first task!' }}
      </p>
      <v-btn
        v-if="hasActiveFilters"
        variant="outlined"
        @click="clearFilters"
      >
        Clear Filters
      </v-btn>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      :details="taskToDelete?.title ? `Task: ${taskToDelete.title}` : ''"
      :loading="deletingTask"
      :title="`Delete Task`"
      type="delete"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useTaskColors, useTaskCompletion, useTaskFilters, useTaskFormatting } from '@/composables'
  import ConfirmModal from '@/components/common/ConfirmModal.vue'

  const props = defineProps({
    tasks: {
      type: Array,
      default: () => [],
    },
    tasksStore: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits([
    'edit',
    'edit-task',
    'delete',
    'delete-task',
    'toggle-complete',
    'filter-change',
  ])

  // Refs for delete modal
  const showDeleteModal = ref(false)
  const taskToDelete = ref(null)
  const deletingTask = ref(false)

  // Use composables
  const { cssVars, applyCssVars, getStatusColor, getPriorityColor } = useTaskColors('list')
  const { formatDate, formatPriority, formatStatus, isTaskOverdue } = useTaskFormatting(computed(() => props.tasks))
  const { getTaskCardClass, getDateColor, getDateClass } = useTaskColors()
  const {
    filteredTasks,
    hasActiveFilters,
    clearFilters,
  } = useTaskFilters(computed(() => props.tasks))

  // Task completion composable
  const {
    toggleTaskCompletion,
    isTaskToggling,
    getTaskCompletionClasses,
    getTaskCompletionStyles,
    isTaskCompleted,
  } = useTaskCompletion(props.tasksStore)

  // Apply CSS variables
  applyCssVars()

  // Handle task completion toggle
  const handleToggleCompletion = async task => {
    try {
      await toggleTaskCompletion(task)
      emit('toggle-complete', task)
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  // Handle delete click
  const handleDeleteTask = task => {
    taskToDelete.value = task
    showDeleteModal.value = true
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!taskToDelete.value) return

    try {
      deletingTask.value = true
      await emit('delete-task', taskToDelete.value.id || taskToDelete.value._id)
      showDeleteModal.value = false
      taskToDelete.value = null
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      deletingTask.value = false
    }
  }

  // Cancel delete
  const cancelDelete = () => {
    showDeleteModal.value = false
    taskToDelete.value = null
  }
</script>

<style scoped>
.tasks-list {
  background: var(--task-bg-primary);
  border-radius: 16px;
  padding: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.list-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.list-title h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--task-text-primary);
}

.task-count {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}


.search-field {
  min-width: 250px;
}

.filter-select {
  min-width: 120px;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: var(--task-card-bg);
  border: 1px solid var(--task-card-border);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.task-card:hover {
  background: var(--task-card-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.task-card.completed {
  opacity: 0.7;
}

.task-card.overdue {
  border-left: 4px solid rgb(var(--v-theme-error));
}

.overdue-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-top: 20px solid rgb(var(--v-theme-error));
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.task-checkbox {
  flex-shrink: 0;
}

.task-priority {
  flex: 1;
  display: flex;
  justify-content: center;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.task-content {
  margin-bottom: 1rem;
}

.task-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--task-text-primary);
  line-height: 1.4;
}

.task-title.completed {
  text-decoration: line-through;
  opacity: 0.7;
}

.task-description {
  font-size: 0.875rem;
  color: var(--task-text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-due-date,
.task-project {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--task-text-secondary);
}

.overdue-text {
  color: rgb(var(--v-theme-error)) !important;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--task-text-primary);
}

.empty-subtitle {
  font-size: 1rem;
  color: var(--task-text-secondary);
  margin: 0 0 2rem 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .tasks-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .tasks-list {
    padding: 1rem;
  }

  .list-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .list-actions {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .search-field {
    min-width: 200px;
    flex: 1;
  }

  .filter-select {
    min-width: 100px;
    flex: 1;
  }

  .tasks-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .task-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .tasks-list {
    padding: 0.75rem;
  }

  .list-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-field,
  .filter-select {
    min-width: auto;
  }

  .task-header {
    margin-bottom: 0.75rem;
  }

  .task-content {
    margin-bottom: 0.75rem;
  }

  .task-title {
    font-size: 1rem;
  }

  .task-description {
    font-size: 0.8rem;
  }

  .task-meta {
    gap: 0.25rem;
  }

  .task-due-date,
  .task-project {
    font-size: 0.7rem;
  }
}
</style>
