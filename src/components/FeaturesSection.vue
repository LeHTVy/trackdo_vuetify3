<template>
  <v-container class="py-14">
    <v-row class="justify-center">
      <v-col
        v-for="feature in features"
        :key="feature.id"
        class="mb-5"
        cols="12"
        lg="4"
        md="4"
        sm="6"
      >
        <FeatureCard
          :color="feature.color"
          :description="feature.description"
          :icon="feature.icon"
          :title="feature.title"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import FeatureCard from './FeatureCard.vue'

  const features = [
    {
      id: 1,
      icon: 'mdi-calendar-month',
      title: 'Event Calendar',
      description: 'Organize your schedule with our beautiful and intuitive calendar interface. Create, edit, and manage events with ease.',
      color: 'primary',
    },
    {
      id: 2,
      icon: 'mdi-format-list-checks',
      title: 'Task Management',
      description: 'Keep track of your to-dos with our comprehensive task management system. Set priorities, deadlines, and track progress.',
      color: 'success',
    },
    {
      id: 3,
      icon: 'mdi-folder-multiple',
      title: 'Project Organization',
      description: 'Organize your work into projects and collaborate with your team. Track milestones and deliverables efficiently.',
      color: 'secondary',
    },
  ]
</script>

<style scoped>
/* Styles are moved to FeatureCard component */
</style>
