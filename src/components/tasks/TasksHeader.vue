<template>
  <div class="page-header">
    <v-container fluid>
      <div class="header-content">
        <!-- Hero Section with Gradient Background -->
        <div class="hero-section">
          <div class="hero-background">
            <div class="gradient-overlay" />
            <div class="pattern-overlay" />
          </div>

          <div class="hero-content">
            <div class="header-icon">
              <v-avatar
                class="header-avatar"
                color="avatar-bg"
                elevation="8"
                size="64"
              >
                <v-icon color="primary" icon="mdi-check-circle-outline" size="32" />
              </v-avatar>
            </div>

            <div class="header-text">
              <h1 class="task-title">Task Management</h1>

              <v-divider
                class="header-divider"
                color="rgb(var(--v-theme-task-font))"
                :thickness="5"
              />

              <p class="task-subtitle">Organize and track your daily tasks efficiently</p>

              <!-- Stats Cards -->
              <div class="stats-row">
                <div class="stat-item">
                  <v-icon class="stat-icon" icon="mdi-clipboard-list" size="16" />
                  <span class="stat-text">Task Organization</span>
                </div>
                <div class="stat-item">
                  <v-icon class="stat-icon" icon="mdi-progress-check" size="16" />
                  <span class="stat-text">Progress Tracking</span>
                </div>
                <div class="stat-item">
                  <v-icon class="stat-icon" icon="mdi-clock-outline" size="16" />
                  <span class="stat-text">Time Management</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
  import { onMounted, watch } from 'vue'
  import { useTaskColors } from '@/composables'

  const { colors, applyCssVars } = useTaskColors()

  onMounted(() => {
    applyCssVars()
  })

  watch(colors, () => {
    applyCssVars()
  }, { deep: true })
</script>

<style scoped>
/* Header Section */
.page-header {
  position: relative;
  margin-bottom: 2rem;
  overflow: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 4rem 0 3rem;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 1rem;
  margin-top: 5rem;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--task-header-bg, linear-gradient(135deg,
    rgb(var(--v-theme-primary)) 50%,
    rgb(var(--v-theme-secondary)) 100%));
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 100%);
}

.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 2rem;
}

.header-icon {
  flex-shrink: 0;
}

.header-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.header-avatar:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.task-title {
  font-size: 3rem;
  font-weight: 700;
  color: rgb(var(--v-theme-task-font));
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
}

.header-divider {
  margin: 1rem 0;
  max-width: 200px;
  opacity: 0.6;
  border-radius: 2px;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.header-divider:hover {
  opacity: 0.8;
  transform: scaleX(1.1);
}

.task-subtitle {
  font-size: 1.2rem;
  color: rgb(var(--v-theme-task-font));
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

/* Stats Row */
.stats-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--task-stats-bg, rgba(255, 255, 255, 0.15));
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--task-stats-border, rgba(255, 255, 255, 0.2));
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: var(--task-stats-bg-hover, rgba(255, 255, 255, 0.25));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  color: rgb(var(--v-theme-task-font));
  opacity: 0.9;
}

.stat-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-task-font));
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    gap: 1.5rem;
    padding: 0 1.5rem;
  }

  .task-title {
    font-size: 2.5rem;
  }

  .task-subtitle {
    font-size: 1.1rem;
  }

  .stats-row {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0 2.5rem;
    margin-top: 3rem;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .task-title {
    font-size: 2rem;
  }

  .task-subtitle {
    font-size: 1rem;
  }

  .stats-row {
    justify-content: center;
    gap: 1rem;
  }

  .stat-item {
    padding: 0.4rem 0.8rem;
  }

  .stat-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 0;
    border-radius: 16px;
    margin-top: 2rem;
  }

  .hero-content {
    gap: 1rem;
    padding: 0 0.75rem;
  }

  .header-avatar {
    width: 56px !important;
    height: 56px !important;
  }

  .task-title {
    font-size: 1.75rem;
  }

  .task-subtitle {
    font-size: 0.9rem;
  }

  .stats-row {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .stat-item {
    justify-content: center;
    padding: 0.5rem 1rem;
    width: 100%;
  }
}
</style>
