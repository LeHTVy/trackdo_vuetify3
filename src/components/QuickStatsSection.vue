<template>
  <v-container class="py-16">
    <v-row>
      <v-col class="text-center mb-8" cols="12">
        <h2 class="text-h3 font-weight-bold text-primary mb-4">
          Your Productivity at a <span class="text-secondary">Glance</span>
        </h2>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col
        v-for="stat in stats"
        :key="stat.id"
        class="text-center"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="3"
      >
        <QuickStatCard
          :color="stat.color"
          :label="stat.label"
          :progress="stat.progress"
          :value="stat.value"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { useQuickStatsSection } from '@/composables/common/useQuickStatsSection'
  import QuickStatCard from './QuickStatCard.vue'

  const { stats } = useQuickStatsSection()
</script>

<style scoped>
/* Styles are moved to QuickStatCard component */
</style>
