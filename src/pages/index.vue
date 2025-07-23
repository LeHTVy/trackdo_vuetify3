<template>
  <div class="home-container app-background">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Features Section with StickyNote -->
    <div class="features-with-note-section">
      <v-container fluid>
        <v-row align="center" class="min-height-section">
          <v-col class="sticky-note-col" cols="12" md="5">
            <StickyNote />
          </v-col>
          <v-col class="features-col" cols="12" md="7">
            <FeaturesSection />
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Quick Stats Section -->
    <QuickStatsSection />
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import FeaturesSection from '@/components/FeaturesSection.vue'
  import HeroSection from '@/components/HeroSection.vue'
  import QuickStatsSection from '@/components/QuickStatsSection.vue'
  import StickyNote from '@/components/StickyNote.vue'
  //import { useEventsStore } from '@/stores/events'
  import { useProjectsStore } from '@/stores/projects'
  import { useTasksStore } from '@/stores/tasks'

  const tasksStore = useTasksStore()
  const projectsStore = useProjectsStore()
  //const eventsStore = useEventsStore()

  onMounted(async () => {
    await Promise.all([
      tasksStore.fetchTasks(),
      projectsStore.fetchProjects(),
      //eventsStore.fetchEvents(),
    ])
  })
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.features-with-note-section {
  margin-top: -2rem;
  padding-top: 0;
}

.min-height-section {
  min-height: 600px;
}

.sticky-note-col {
  display: flex;
  align-items: flex-start;
  padding-top: 0 !important;
}

.features-col {
  padding-left: 2rem;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .features-with-note-section {
    padding: 2rem 0;
  }

  .min-height-section {
    min-height: auto;
  }

  .sticky-note-col {
    margin-bottom: 2rem;
  }
}
</style>
