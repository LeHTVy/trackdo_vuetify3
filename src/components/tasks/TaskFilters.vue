<template>
  <v-card class="filter-card" elevation="0">
    <v-card-text class="pa-4">
      <!-- Single Row Layout -->
      <div class="filters-row">
        <!-- Search Input -->
        <div class="search-section">
          <v-text-field
            v-model="searchQuery"
            class="search-input"
            clearable
            density="comfortable"
            hide-details
            placeholder="Search tasks..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
        </div>

        <!-- Status Filters -->
        <div class="filter-section">
          <v-chip-group
            v-model="selectedStatus"
            class="filter-chips"
            filter
            multiple
          >
            <v-chip
              v-for="status in statusOptions"
              :key="status.value"
              class="filter-chip"
              :color="status.color"
              size="small"
              :value="status.value"
              variant="outlined"
            >
              <v-icon :icon="status.icon" size="small" start />
              {{ status.title }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Priority Filters -->
        <div class="filter-section">
          <v-chip-group
            v-model="selectedPriority"
            class="filter-chips"
            filter
            multiple
          >
            <v-chip
              v-for="priority in priorityOptions"
              :key="priority.value"
              class="filter-chip"
              :color="priority.color"
              size="small"
              :value="priority.value"
              variant="outlined"
            >
              <v-icon :icon="priority.icon" size="small" start />
              {{ priority.title }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Sort Controls -->
        <div class="sort-section">
          <v-select
            v-model="sortBy"
            class="sort-select"
            density="compact"
            hide-details
            :items="sortOptions"
            label="Sort by"
            variant="outlined"
          />

          <v-btn
            class="sort-btn"
            :icon="sortOrder === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
            size="small"
            variant="outlined"
            @click="toggleSortOrder"
          >
            <v-tooltip activator="parent" location="top">
              {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
            </v-tooltip>
          </v-btn>
        </div>

        <!-- Clear Filters -->
        <div class="action-section">
          <v-btn
            v-if="hasActiveFilters"
            class="clear-btn"
            color="error"
            size="small"
            variant="outlined"
            @click="clearFilters"
          >
            <v-icon start>mdi-filter-remove</v-icon>
            Clear
          </v-btn>
        </div>
      </div>

      <!-- Filter Summary (Optional) -->
      <div v-if="hasActiveFilters" class="filter-summary mt-3">
        <v-chip
          v-if="searchQuery"
          closable
          color="primary"
          size="x-small"
          variant="tonal"
          @click:close="searchQuery = ''"
        >
          Search: "{{ searchQuery }}"
        </v-chip>

        <v-chip
          v-for="status in selectedStatus"
          :key="`status-${status}`"
          closable
          :color="getStatusColor(status)"
          size="x-small"
          variant="tonal"
          @click:close="removeStatusFilter(status)"
        >
          {{ getStatusTitle(status) }}
        </v-chip>

        <v-chip
          v-for="priority in selectedPriority"
          :key="`priority-${priority}`"
          closable
          :color="getPriorityColor(priority)"
          size="x-small"
          variant="tonal"
          @click:close="removePriorityFilter(priority)"
        >
          {{ getPriorityTitle(priority) }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'

  // Props
  const props = defineProps({
    searchQuery: {
      type: String,
      default: '',
    },
    selectedStatus: {
      type: Array,
      default: () => [],
    },
    selectedPriority: {
      type: Array,
      default: () => [],
    },
    sortBy: {
      type: String,
      default: 'dueDate',
    },
    sortOrder: {
      type: String,
      default: 'asc',
    },
    statusOptions: {
      type: Array,
      default: () => [],
    },
    priorityOptions: {
      type: Array,
      default: () => [],
    },
    sortOptions: {
      type: Array,
      default: () => [],
    },
    hasActiveFilters: {
      type: Boolean,
      default: false,
    },
  })

  // Emits
  const emit = defineEmits([
    'update:searchQuery',
    'update:selectedStatus',
    'update:selectedPriority',
    'update:sortBy',
    'update:sortOrder',
    'clear-filters',
    'toggle-sort-order',
  ])

  // Computed properties for v-model
  const searchQuery = computed({
    get: () => props.searchQuery,
    set: value => emit('update:searchQuery', value),
  })

  const selectedStatus = computed({
    get: () => props.selectedStatus,
    set: value => emit('update:selectedStatus', value),
  })

  const selectedPriority = computed({
    get: () => props.selectedPriority,
    set: value => emit('update:selectedPriority', value),
  })

  const sortBy = computed({
    get: () => props.sortBy,
    set: value => emit('update:sortBy', value),
  })

  const sortOrder = computed({
    get: () => props.sortOrder,
    set: value => emit('update:sortOrder', value),
  })

  // Helper methods
  const getStatusColor = status => {
    const option = props.statusOptions.find(opt => opt.value === status)
    return option?.color || 'primary'
  }

  const getStatusTitle = status => {
    const option = props.statusOptions.find(opt => opt.value === status)
    return option?.title || status
  }

  const getPriorityColor = priority => {
    const option = props.priorityOptions.find(opt => opt.value === priority)
    return option?.color || 'primary'
  }

  const getPriorityTitle = priority => {
    const option = props.priorityOptions.find(opt => opt.value === priority)
    return option?.title || priority
  }

  const removeStatusFilter = status => {
    const newStatus = props.selectedStatus.filter(s => s !== status)
    emit('update:selectedStatus', newStatus)
  }

  const removePriorityFilter = priority => {
    const newPriority = props.selectedPriority.filter(p => p !== priority)
    emit('update:selectedPriority', newPriority)
  }

  const clearFilters = () => {
    emit('clear-filters')
  }

  const toggleSortOrder = () => {
    emit('toggle-sort-order')
  }
</script>

<style scoped>
.filter-card {
  background: rgba(var(--v-theme-background), 0.3);
  border: 1px solid var(--task-border-color);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: var(--task-card-shadow);
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-section {
  flex: 1;
  min-width: 250px;
}

.search-input {
  border-radius: 12px;
}

.filter-section {
  flex-shrink: 0;
}

.filter-chips {
  margin: 0;
}

.filter-chip {
  margin: 2px;
  border-radius: 20px !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.sort-select {
  min-width: 140px;
}

.sort-btn {
  border-radius: 12px;
}

.action-section {
  flex-shrink: 0;
}

.clear-btn {
  border-radius: 12px;
  font-weight: 500;
}

.filter-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .search-section {
    min-width: auto;
  }

  .filter-section,
  .sort-section,
  .action-section {
    justify-content: center;
  }

  .sort-section {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .filter-card .v-card-text {
    padding: 1rem !important;
  }

  .filters-row {
    gap: 0.75rem;
  }

  .filter-chips {
    justify-content: center;
  }

  .sort-section {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .sort-select {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .filter-card .v-card-text {
    padding: 0.75rem !important;
  }

  .filter-chip {
    font-size: 0.75rem;
  }

  .search-input :deep(.v-field__input) {
    font-size: 0.875rem;
  }
}

/* Dark Mode Adjustments */
.v-theme--dark .filter-summary {
  border-top-color: rgba(255, 255, 255, 0.12);
}

/* Enhanced Chip Styling */
.filter-chip.v-chip--selected {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.filter-chip.v-chip--selected:hover {
  background: rgba(var(--v-theme-primary), 0.15) !important;
}

/* Animation for filter changes */
.filter-summary .v-chip {
  animation: slideInUp 0.3s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
