<template>
  <div class="app-preview-container">
    <div class="app-preview">
      <!-- App Header -->
      <div class="app-header">
        <div class="app-logo">
          <v-icon color="rgb(var(--v-theme-secondary))" size="24">mdi-check-circle</v-icon>
          <span class="app-name">TrackDo</span>
        </div>
        <div class="app-nav">
          <div class="nav-item active">
            <v-icon size="16">mdi-view-dashboard</v-icon>
            <span>DASHBOARD</span>
          </div>
          <div class="nav-item">
            <v-icon size="16">mdi-calendar</v-icon>
            <span>CALENDAR</span>
          </div>
          <div class="nav-item">
            <v-icon size="16">mdi-format-list-checks</v-icon>
            <span>TASKS</span>
          </div>
          <div class="nav-item">
            <v-icon size="16">mdi-folder-multiple</v-icon>
            <span>PROJECTS</span>
          </div>
        </div>
      </div>

      <!-- App Main Content -->
      <div class="app-main">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <h2 class="welcome-title">Welcome to TrackDo</h2>
          <p class="welcome-subtitle">Your ultimate productivity companion for managing tasks, events, and projects</p>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <div class="action-item">
            <v-icon color="primary" size="20">mdi-lock</v-icon>
          </div>
          <div class="action-item">
            <v-icon color="primary" size="20">mdi-format-list-bulleted</v-icon>
          </div>
          <div class="action-item">
            <v-icon color="success" size="20">mdi-folder</v-icon>
          </div>
          <div class="action-item">
            <v-icon color="warning" size="20">mdi-chart-line</v-icon>
          </div>
        </div>

        <!-- Feature Cards -->
        <div class="feature-cards">
          <!-- Event Calendar Card -->
          <div class="feature-card">
            <div class="card-icon">
              <v-icon color="warning" size="32">mdi-calendar</v-icon>
            </div>
            <div class="card-content">
              <h3 class="card-title">Event Calendar</h3>
              <p class="card-description">Organize your schedule with our beautiful and intuitive calendar interface. Create, edit, and manage events effortlessly.</p>
            </div>
          </div>

          <!-- Task Management Card -->
          <div class="feature-card">
            <div class="card-icon">
              <v-icon color="success" size="32">mdi-format-list-checks</v-icon>
            </div>
            <div class="card-content">
              <h3 class="card-title">Task Management</h3>
              <p class="card-description">Keep track of your to-dos with our comprehensive task management system. Track progress and collaborate with your team.</p>
            </div>
          </div>

          <!-- Project Organization Card -->
          <div class="feature-card">
            <div class="card-icon">
              <v-icon color="info" size="32">mdi-folder-multiple</v-icon>
            </div>
            <div class="card-content">
              <h3 class="card-title">Project Organization</h3>
              <p class="card-description">Organize your work into projects and collaborate with your team. Track progress and manage deadlines effectively.</p>
            </div>
          </div>
        </div>

        <!-- Quick Notes Section -->
        <div class="quick-notes">
          <div class="notes-header">
            <h3 class="notes-title">Quick Notes</h3>
          </div>
          <div class="notes-list">
            <div class="note-item">
              <v-icon color="success" size="16">mdi-check</v-icon>
              <span>Stay organized with TrackDo</span>
            </div>
            <div class="note-item">
              <v-icon color="warning" size="16">mdi-clock</v-icon>
              <span>Never miss important events</span>
            </div>
            <div class="note-item">
              <v-icon color="primary" size="16">mdi-rocket</v-icon>
              <span>Boost your productivity</span>
            </div>
            <div class="note-item">
              <v-icon color="info" size="16">mdi-account-group</v-icon>
              <span>Collaborate with your team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this preview component
</script>

<style scoped>
.app-preview-container {
  perspective: 1000px;
  width: 100%;
  max-width: 800px;
  margin-left: 10%;
  margin-right: 0;
  margin-top: 3rem;
}

.app-preview {
  background-color: rgb(var(--v-theme-primary));
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary-rgb), 0.1);
}

.app-preview:hover {
  transform: rotateY(-2deg) rotateX(2deg) scale(1.02);
}

/* Header Styles */
.app-header {
  background: rgb(var(--v-theme-primary));
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--v-theme-secondary));
}

.app-name {
  font-size: 1.2rem;
  font-weight: 700;
}


.app-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: white;
  font-size: 0.7rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  background-color: rgba(var(--v-theme-primary-rgb), 0.1);
  transition: all 0.2s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-item.active {
  background-color: rgba(var(--v-theme-primary-rgb), 0.7);
  color: rgb(var(--v-theme-secondary));
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
}

.nav-icon {
  color: white;
  opacity: 0.8;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.nav-icon:hover {
  opacity: 1;
}

/* Main Content Styles */
.app-main {
  padding: 2rem;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  min-height: 400px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f1c40f;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.feature-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-card:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f1c40f;
}

.card-description {
  font-size: 0.85rem;
  opacity: 0.8;
  line-height: 1.4;
}

.quick-notes {
  background-color: #f1c40f;
  border-radius: 12px;
  padding: 1.5rem;
  color: #2c3e50;
}

.notes-header {
  margin-bottom: 1rem;
}

.notes-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-preview {
    transform: none;
  }

  .app-preview:hover {
    transform: scale(1.02);
  }

  .app-nav {
    display: none;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .feature-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
