<template>
  <div class="hero-container">
    <div class="hero-background" />
    <div class="hero-bottom-overlay">
      <div class="action-buttons">
        <v-fab
          class="fab-btn"
          color="primary"
          icon="mdi-calendar"
          size="large"
          to="/calendar"
          variant="tonal"
        >
          <v-icon>mdi-calendar</v-icon>
          <v-tooltip activator="parent" location="top">
            View Calendar
          </v-tooltip>
        </v-fab>
        <v-fab
          class="fab-btn"
          color="secondary"
          icon="mdi-format-list-checks"
          size="large"
          to="/tasks"
          variant="tonal"
        >
          <v-icon>mdi-format-list-checks</v-icon>
          <v-tooltip activator="parent" location="top">
            Manage Tasks
          </v-tooltip>
        </v-fab>
        <v-fab
          class="fab-btn"
          color="success"
          icon="mdi-folder-multiple"
          size="large"
          to="/projects"
          variant="tonal"
        >
          <v-icon>mdi-folder-multiple</v-icon>
          <v-tooltip activator="parent" location="top">
            View Projects
          </v-tooltip>
        </v-fab>
        <v-fab
          class="fab-btn"
          color="warning"
          icon="mdi-plus-circle"
          size="large"
          to="/projects/new"
          variant="tonal"
        >
          <v-icon>mdi-plus-circle</v-icon>
          <v-tooltip activator="parent" location="top">
            New Project
          </v-tooltip>
        </v-fab>
      </div>
    </div>
    <div class="hero-content">
      <h1 class="text-h3 font-weight-bold text-white mb-4 hero-title">
        Welcome to <span class="text-accent">TrackDo</span>
      </h1>
      <p class="text-h6 text-white-80 mb-8 hero-subtitle">
        Your ultimate productivity companion for managing tasks, events, and projects
      </p>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this component
</script>

<style scoped>
.hero-container {
  position: relative;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #F8F9FA 0%, #E3F2FD 50%, #FFF8E1 100%);
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    #e7f3fc 0%,
    #f0f8ff 30%,
    #fff8e1 70%,
    #e3f2fd 100%);
  z-index: 1;
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  transition: all 0.3s ease;
}

.hero-bottom-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6rem;
  background: linear-gradient(to top,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  z-index: 3;
  pointer-events: none;
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 3rem 2rem;
  background: transparent;
  border-radius: 20px;
  max-width: 900px;
}

.hero-title {
  background: linear-gradient(135deg, #232e3e 0%, #fed44f 50%, #232e3e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(254, 212, 79, 0.3);
  animation: fadeInScale 1.2s ease-out;
  font-weight: 800 !important;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 1rem;
  position: relative;
}

.hero-title .v-icon {
  color: #fed44f !important;
  filter: drop-shadow(0 3px 10px rgba(254, 212, 79, 0.6));
  z-index: 100;
  position: relative;
  opacity: 1 !important;
}

.hero-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #232e3e, #fed44f);
  border-radius: 2px;
  opacity: 0.8;
}

.hero-subtitle {
  background: linear-gradient(135deg, #232e3e 0%, #fed44f 30%, #232e3e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(35, 46, 62, 0.2);
  animation: fadeInSlide 1.2s ease-out 0.3s both;
  font-weight: 600 !important;
  line-height: 1.7;
  margin-top: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.action-buttons {
  display: flex;
  gap: 1.5rem;
  pointer-events: auto;
  animation: fadeInBounce 1.2s ease-out 0.6s both;
}

.fab-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none !important;
  box-shadow: none !important;
}

.fab-btn:hover {
  transform: scale(1.1) translateY(-2px);
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.05);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInBounce {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  60% {
    transform: translateY(-5px) scale(1.02);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

.v-theme--dark .hero-container {
  background: linear-gradient(135deg, #0f1419 0%, #1a202c 50%, #2d3748 100%);
}

.v-theme--dark .hero-background {
  background: linear-gradient(135deg,
    #0f1419 0%,
    #1a202c 30%,
    #2d3748 70%,
    #1a1a1a 100%);
  opacity: 0.95;
}

.v-theme--dark .hero-content {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.v-theme--dark .hero-title {
  background: linear-gradient(135deg, #fed44f 0%, #fbbf24 50%, #fed44f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 16px rgba(254, 212, 79, 0.5);
}

.v-theme--dark .hero-title .v-icon {
  color: #fed44f !important;
  filter: drop-shadow(0 4px 16px rgba(254, 212, 79, 0.9));
  opacity: 1 !important;
}

.v-theme--dark .hero-title::after {
  background: linear-gradient(90deg, #fed44f, #fbbf24);
  box-shadow: 0 2px 8px rgba(254, 212, 79, 0.4);
}

.v-theme--dark .hero-subtitle {
  background: linear-gradient(135deg, #e5e7eb 0%, #fed44f 30%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 12px rgba(254, 212, 79, 0.3);
}

.v-theme--dark .hero-bottom-overlay {
  background: linear-gradient(to top,
    rgba(15, 20, 25, 0.4) 0%,
    rgba(26, 32, 44, 0.2) 50%,
    transparent 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

@media (max-width: 768px) {
  .hero-container {
    height: 50vh;
  }
  .hero-title {
    font-size: 1.8rem !important;
  }
  .hero-subtitle {
    font-size: 1.1rem !important;
  }
  .hero-bottom-overlay {
    height: 5rem;
  }
  .action-buttons {
    gap: 0.8rem;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90%;
  }
  .fab-btn {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>
