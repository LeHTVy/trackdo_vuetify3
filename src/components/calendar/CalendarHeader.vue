<template>
  <v-card class="calendar-header mb-4" elevation="2">
    <v-card-text class="pa-4">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <div class="d-flex align-center justify-center">
            <v-icon
              icon="mdi-calendar-month"
              size="32"
              :color="$vuetify.theme.current.colors.primary"
              class="mr-3"
            ></v-icon>
            <div class="text-center">
              <h2 class="text-h4 font-weight-bold title-text">
                {{ currentMonthYear }}
              </h2>
              <p class="text-subtitle-1 subtitle-text mb-0">
                {{ todayFormatted }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentDate: {
    type: Date,
    default: () => new Date()
  }
})

const getCurrentDateInfo = () => {
  const date = props.currentDate
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    monthName: date.toLocaleDateString('en-US', { month: 'long' }),
    day: date.getDate(),
    fullDate: date.toLocaleDateString('en-US')
  }
}

const currentMonthYear = computed(() => {
  const dateInfo = getCurrentDateInfo()
  return `${dateInfo.monthName} ${dateInfo.year}`
})

const todayFormatted = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
})
</script>

<style scoped>
.calendar-header {
  background: linear-gradient(135deg,
    rgb(var(--v-theme-surface)) 0%,
    rgb(var(--v-theme-background)) 100%
  );
  border: 1px solid rgb(var(--v-theme-primary), 0.1);
  border-radius: 16px;
  margin-top: 80px;
  overflow: hidden;
}

.title-text {
  color: rgb(var(--v-theme-title-text));
  background: linear-gradient(135deg, #232e3e 0%, #fed44f 50%, #232e3e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle-text {
  color: rgb(var(--v-theme-subtitle-text));
}

.v-btn-group {
  box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.1);
}
</style>
