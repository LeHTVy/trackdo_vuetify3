<template>
  <v-app-bar
    app
    color="transparent"
    elevation="0"
    height="150"
    class="calendar-header"
  >
    <div class="header-content">
      <v-app-bar-nav-icon
        class="nav-icon"
        color="primary"
        @click="$emit('toggle-drawer')"
      />

      <v-toolbar-title class="text-h5 font-weight-bold text-primary mt-6">
        <v-icon class="mr-2" size="28">mdi-calendar-multiple</v-icon>
        Calendar
      </v-toolbar-title>

      <v-spacer />

      <!-- Add Event Button -->
      <v-btn
        class="add-event-btn mt-6"
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        variant="elevated"
        @click="$emit('add-event')"
      >
        Add Event
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
defineEmits(['toggle-drawer', 'add-event'])
</script>

<style scoped>
/* App Bar Styling */
.calendar-header {
  background: transparent !important;
  backdrop-filter: blur(5px);
}

.header-content {
  width: 100%;
  padding-top: 50px;
  display: flex;
  align-items: center;
}

.v-toolbar-title {
  display: flex;
  align-items: center;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Add Event Button */
.add-event-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-event-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.15);
}

.nav-icon {
  margin-top: 24px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .v-toolbar-title {
    font-size: 1.25rem;
  }

  .calendar-header {
    height: 80px !important;
  }

  .header-content {
    padding-top: 20px;
  }

  .nav-icon, .v-toolbar-title, .add-event-btn {
    margin-top: 0;
  }
}
</style>
