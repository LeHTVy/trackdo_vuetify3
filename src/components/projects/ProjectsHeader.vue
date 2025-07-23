<template>
  <div class="page-header">
    <v-container fluid>
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Project Tracking</h1>
          <p class="page-subtitle">Monitor and manage your project progress</p>
        </div>
        <v-btn
          class="add-project-btn"
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          variant="elevated"
          @click="$emit('add-project')"
        >
          New Project
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
defineEmits(['add-project'])
</script>

<style scoped>
/* Header Section */
.page-header {
  padding: 2rem 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-top: 5rem;
  margin-bottom: 1rem;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  margin: 0;
}

.add-project-btn {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.add-project-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--v-theme-primary), 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1rem 0;
  }

  .page-title {
    font-size: 1.75rem;
  }
}
</style>
