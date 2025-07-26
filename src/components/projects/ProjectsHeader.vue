<template>
  <div class="page-header">
    <v-container fluid>
      <div class="header-content">
        <!-- Hero Section with Gradient Background -->
        <div class="hero-section">
          <div class="hero-background">
            <div class="gradient-overlay"></div>
            <div class="pattern-overlay"></div>
          </div>

          <div class="hero-content">
            <div class="header-icon">
              <v-avatar
                size="64"
                class="header-avatar"
                color="secondary"
                elevation="8"
              >
                <v-icon icon="mdi-folder-multiple" size="32" color="primary"></v-icon>
              </v-avatar>
            </div>

            <div class="header-text">
              <h1 class="project-title ">Project Tracking</h1>

              <v-divider
                class="header-divider"
                :thickness="5"
                color="rgb(var(--v-theme-project-font))"
              ></v-divider>

              <p class="project-subtitle ">Monitor and manage your project progress with advanced analytics</p>

              <!-- Stats Cards -->
              <div class="stats-row">
                <div class="stat-item">
                  <v-icon icon="mdi-folder-open" size="16" class="stat-icon"></v-icon>
                  <span class="stat-text">Active Projects</span>
                </div>
                <div class="stat-item">
                  <v-icon icon="mdi-chart-line" size="16" class="stat-icon"></v-icon>
                  <span class="stat-text">Progress Tracking</span>
                </div>
                <div class="stat-item">
                  <v-icon icon="mdi-account-group" size="16" class="stat-icon"></v-icon>
                  <span class="stat-text">Team Collaboration</span>
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
import { useProjectColors } from '@/composables'

const { colors, applyCssVars } = useProjectColors()

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
  background: var(--project-header-bg, linear-gradient(135deg,
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


.project-title {
  font-size: 3rem;
  font-weight: 700;
  color: rgb(var(--v-theme-project-font));
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

.project-subtitle {
  font-size: 1.2rem;
  color: rgb(var(--v-theme-project-font));
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
  background: var(--project-stats-bg, rgba(255, 255, 255, 0.15));
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--project-stats-border, rgba(255, 255, 255, 0.2));
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: var(--project-stats-bg-hover, rgba(255, 255, 255, 0.25));
  transform: translateY(-2px);
}

.stat-icon {
  opacity: 0.9;
  color:  rgb(var(--v-theme-project-font));
}

.stat-text {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 1;
  color: rgb(var(--v-theme-project-font));
}

/* Dark Mode Adjustments */
.v-theme--dark .hero-background {
  background: linear-gradient(135deg,
    rgb(var(--v-theme-primary), 0.9) 0%,
    rgb(var(--v-theme-primary), 0.7) 50%,
    rgb(var(--v-theme-secondary), 0.8) 100%);
}

.v-theme--dark .header-avatar {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .stat-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .stat-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
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
    padding: 3rem 0 2rem;
    border-radius: 16px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .header-avatar {
    width: 48px !important;
    height: 48px !important;
  }

  .header-avatar .v-icon {
    font-size: 24px !important;
  }

  .stats-row {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}

/* Animation */
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

.hero-content {
  animation: fadeInUp 0.6s ease-out;
}

.stat-item {
  animation: fadeInUp 0.6s ease-out;
}

.stat-item:nth-child(1) { animation-delay: 0.1s; }
.stat-item:nth-child(2) { animation-delay: 0.2s; }
.stat-item:nth-child(3) { animation-delay: 0.3s; }
</style>
