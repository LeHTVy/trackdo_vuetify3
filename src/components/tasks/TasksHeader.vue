<template>
  <div class="page-header">
    <v-container fluid>
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Task Management</h1>
          <p class="page-subtitle">Organize and track your daily tasks efficiently</p>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
// No props or logic needed for this header component
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

/* Responsive Design */
@media (max-width: 768px) {
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
