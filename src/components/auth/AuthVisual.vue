<template>
  <div class="auth-visual-container">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="visual-content">
      <!-- Logo Animation -->
      <div class="logo-section">
        <div class="logo-container">
          <v-icon class="main-logo" color="white" size="120">
            mdi-check-circle
          </v-icon>
          <div class="logo-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
        </div>
      </div>

      <!-- Text Content -->
      <div class="text-section">
        <h1 class="welcome-title">
          Welcome to <span class="brand-name">TrackDo</span>
        </h1>
        <p class="welcome-subtitle">
          Your ultimate productivity companion for managing tasks, projects, and events seamlessly.
        </p>

        <!-- Feature Icons -->
        <div class="features-grid">
          <div class="feature-item" v-for="(feature, index) in features" :key="index">
            <v-icon :color="feature.color" size="32" class="feature-icon">
              {{ feature.icon }}
            </v-icon>
            <span class="feature-text">{{ feature.text }}</span>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="decorative-elements">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  { icon: 'mdi-calendar-check', text: 'Smart Calendar', color: '#4CAF50' },
  { icon: 'mdi-clipboard-list', text: 'Task Management', color: '#2196F3' },
  { icon: 'mdi-folder-multiple', text: 'Project Tracking', color: '#FF9800' },
  { icon: 'mdi-chart-line', text: 'Progress Analytics', color: '#9C27B0' }
])
</script>

<style scoped>
.auth-visual-container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgb(var(--v-theme-app-background)) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100vw;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb), 0.1) 0%,
    rgba(var(--v-theme-secondary-rgb), 0.05) 50%,
    rgba(var(--v-theme-accent-rgb), 0.1) 100%
  );
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(var(--v-theme-secondary-rgb), 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 40%;
  left: 5%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

.visual-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: rgb(var(--v-theme-on-surface));
  max-width: 500px;
  padding: 2rem;
}

.logo-section {
  margin-bottom: 3rem;
}

.logo-container {
  position: relative;
  display: inline-block;
}

.main-logo {
  position: relative;
  z-index: 3;
  animation: logoGlow 3s ease-in-out infinite;
  color: rgb(var(--v-theme-primary)) !important;
}

@keyframes logoGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(var(--v-theme-primary-rgb), 0.5));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(var(--v-theme-primary-rgb), 0.8));
  }
}

.logo-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring {
  position: absolute;
  border: 2px solid rgba(var(--v-theme-primary-rgb), 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ringPulse 4s linear infinite;
}

.ring-1 {
  width: 140px;
  height: 140px;
  animation-delay: 0s;
}

.ring-2 {
  width: 180px;
  height: 180px;
  animation-delay: 1.3s;
}

.ring-3 {
  width: 220px;
  height: 220px;
  animation-delay: 2.6s;
}

@keyframes ringPulse {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
  }
}

.text-section {
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  color: rgb(var(--v-theme-primary));
}

.brand-name {
  background: linear-gradient(45deg, rgb(var(--v-theme-secondary)), rgb(var(--v-theme-accent)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  color: rgb(var(--v-theme-on-surface));
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(var(--v-theme-surface-rgb), 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary-rgb), 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  background: rgba(var(--v-theme-surface-rgb), 0.9);
  box-shadow: 0 10px 25px rgba(var(--v-theme-primary-rgb), 0.15);
  border-color: rgba(var(--v-theme-primary-rgb), 0.3);
}

.feature-icon {
  margin-bottom: 0.5rem;
  animation: iconBounce 2s ease-in-out infinite;
}

.feature-icon:nth-child(1) { animation-delay: 0s; }
.feature-icon:nth-child(2) { animation-delay: 0.5s; }
.feature-icon:nth-child(3) { animation-delay: 1s; }
.feature-icon:nth-child(4) { animation-delay: 1.5s; }

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.feature-text {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  color: rgb(var(--v-theme-on-surface));
}

.decorative-elements {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100px;
  background: rgba(var(--v-theme-primary-rgb), 0.1);
  border-radius: 50%;
  animation: wave 8s linear infinite;
}

.wave-1 {
  animation-delay: 0s;
  opacity: 0.7;
}

.wave-2 {
  animation-delay: 2s;
  opacity: 0.5;
  height: 80px;
}

.wave-3 {
  animation-delay: 4s;
  opacity: 0.3;
  height: 60px;
}

@keyframes wave {
  0% {
    transform: translateX(-50%) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .main-logo {
    font-size: 80px !important;
  }
}

/* Light theme specific */
.v-theme--light .auth-visual-container {
  background-color: #F8F9FA !important;
}

.v-theme--light .animated-bg {
  background: linear-gradient(
    135deg,
    rgba(35, 46, 62, 0.1) 0%,
    rgba(255, 193, 7, 0.05) 50%,
    rgba(33, 150, 243, 0.1) 100%
  );
}

.v-theme--light .welcome-title {
  color: #232e3e;
}

.v-theme--light .welcome-subtitle {
  color: #5a6c7d;
}

.v-theme--light .feature-item {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(35, 46, 62, 0.1);
}

.v-theme--light .feature-item:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 25px rgba(35, 46, 62, 0.15);
  border-color: rgba(35, 46, 62, 0.3);
}

.v-theme--light .feature-text {
  color: #232e3e;
}

/* Dark theme specific */
.v-theme--dark .auth-visual-container {
  background-color: #1a1a1a !important;
}

.v-theme--dark .animated-bg {
  background: linear-gradient(
    135deg,
    rgba(254, 212, 79, 0.1) 0%,
    rgba(100, 124, 132, 0.05) 50%,
    rgba(255, 152, 0, 0.1) 100%
  );
}

.v-theme--dark .welcome-title {
  color: #fed44f;
}

.v-theme--dark .welcome-subtitle {
  color: #cbd5e1;
}

.v-theme--dark .feature-item {
  background: rgba(var(--v-theme-surface-rgb), 0.8);
  border: 1px solid rgba(254, 212, 79, 0.1);
}

.v-theme--dark .feature-item:hover {
  background: rgba(var(--v-theme-surface-rgb), 0.9);
  box-shadow: 0 10px 25px rgba(254, 212, 79, 0.15);
  border-color: rgba(254, 212, 79, 0.3);
}

.v-theme--dark .feature-text {
  color: #fed44f;
}
</style>
