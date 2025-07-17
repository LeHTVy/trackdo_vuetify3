<!-- eslint-disable vue/no-template-shadow -->
<template>
  <v-card class="projects-card" elevation="4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Projects</span>
      <div class="d-flex gap-2">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="elevated"
          @click="$emit('add-project')"
        >
          Add Project
        </v-btn>
        <v-menu>
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
      <v-row v-if="filteredProjects.length > 0">
        <v-col
          v-for="project in filteredProjects"
          :key="project.id"
          cols="12"
          lg="4"
          md="6"
        >
          <v-card
            class="project-card h-100"
            :class="{ 'completed': project.status === 'completed' }"
            elevation="2"
          >
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-truncate">{{ project.name }}</span>
              <v-chip
                :color="getStatusColor(project.status)"
                size="small"
                variant="flat"
              >
                {{ project.status }}
              </v-chip>
            </v-card-title>

            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-3">
                {{ project.description || 'No description available' }}
              </p>

              <div class="mb-3">
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-caption">Progress</span>
                  <span class="text-caption">{{ project.progress || 0 }}%</span>
                </div>
                <v-progress-linear
                  :color="getStatusColor(project.status)"
                  height="6"
                  :model-value="project.progress || 0"
                  rounded
                />
              </div>

              <div class="d-flex justify-space-between align-center text-caption text-medium-emphasis">
                <span v-if="project.startDate">
                  Started: {{ formatDate(project.startDate) }}
                </span>
                <span v-if="project.endDate">
                  Due: {{ formatDate(project.endDate) }}
                </span>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                size="small"
                variant="text"
                @click="$emit('view-project', project)"
              >
                View Details
              </v-btn>
              <v-spacer />
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="$emit('edit-project', project)"
              />
              <v-btn
                color="error"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="$emit('delete-project', project.id)"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div v-else class="text-center py-8">
        <v-icon color="grey-lighten-1" size="64">mdi-folder-multiple</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">No projects found</p>
        <p class="text-body-2 text-medium-emphasis">
          {{ filter === 'all' ? 'Create your first project to get started!' : 'No projects match the current filter.' }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  const props = defineProps({
    projects: {
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
    'add-project',
    'edit-project',
    'delete-project',
    'view-project',
    'filter-change',
  ])

  const filterOptions = [
    { text: 'All Projects', value: 'all' },
    { text: 'Active', value: 'active' },
    { text: 'Completed', value: 'completed' },
    { text: 'On Hold', value: 'on-hold' },
  ]

  const filterText = computed(() => {
    const option = filterOptions.find(opt => opt.value === props.filter)
    return option ? option.text : 'All Projects'
  })

  const filteredProjects = computed(() => {
    if (props.filter === 'all') {
      return props.projects
    }
    return props.projects.filter(project => project.status === props.filter)
  })

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'active': { return 'success'
      }
      case 'completed': { return 'info'
      }
      case 'on-hold': { return 'warning'
      }
      case 'cancelled': { return 'error'
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.projects-card {
  border-radius: 20px;
  background: linear-gradient(135deg, rgb(255 255 255 / 95%) 0%, rgb(248 250 252 / 95%) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgb(255 255 255 / 20);
  box-shadow: 0 8px 32px rgb(0 0 0 / 8%);
  animation: fadeInUp 0.6s ease-out;
  width: 100%;
  max-width: 100%;
}

.project-card {
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgb(226 232 240 / 50%);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgb(0 0 0 / 15%);
  border-color: rgb(59 130 246 / 30%);
}

.project-card.completed {
  opacity: 0.85;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.project-card.completed::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

/* Enhanced button styles */
.v-btn {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

/* Progress bar enhancements */
.v-progress-linear {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgb(0 0 0 / 10%);
}

/* Chip enhancements */
.v-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

/* Filter menu enhancements */
.v-menu .v-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgb(59 130 246 / 30%);
}

.v-menu .v-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgb(59 130 246 / 40%);
}

/* Empty state enhancements */
.text-center {
  animation: fadeInUp 0.8s ease-out;
}

.text-center .v-icon {
  animation: pulse 2s infinite;
  filter: drop-shadow(0 4px 8px rgb(0 0 0 / 10%));
}

/* Card title enhancements */
.v-card-title {
  background: linear-gradient(135deg, rgb(255 255 255 / 80%) 0%, rgb(248 250 252 / 80%) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  padding: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.v-card-text {
  padding: 20px;
}

.v-card-actions {
  padding: 16px 20px;
  background: rgb(248 250 252 / 50%);
  border-radius: 0 0 16px 16px;
}

/* Dark theme adjustments */
.v-theme--dark .projects-card {
  background: linear-gradient(135deg, rgb(30 41 59 / 95%) 0%, rgb(15 23 42 / 95%) 100%);
  border-color: rgb(71 85 105 / 30%);
}

.v-theme--dark .project-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: rgb(71 85 105 / 30%);
}

.v-theme--dark .project-card:hover {
  border-color: rgb(59 130 246 / 50%);
  box-shadow: 0 20px 40px rgb(0 0 0 / 30%);
}

.v-theme--dark .project-card.completed {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
}

.v-theme--dark .v-card-title {
  background: linear-gradient(135deg, rgb(30 41 59 / 80%) 0%, rgb(15 23 42 / 80%) 100%);
}

.v-theme--dark .v-card-actions {
  background: rgb(15 23 42 / 50%);
}

.v-theme--dark .v-menu .v-btn {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
}

.v-theme--dark .v-menu .v-btn:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}
</style>
