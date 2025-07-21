<template>
  <v-footer class="app-footer">
    <v-container class="py-8">
      <v-row align="center" justify="space-between">
        <!-- Logo and Brand -->
        <v-col class="text-center text-md-left" cols="12" md="4">
          <div class="footer-brand mb-4">
            <v-icon class="mr-2" color="secondary" size="32">
              mdi-check-circle
            </v-icon>
            <span class="text-h5 font-weight-bold">
              <span class="text-secondary">Track</span><span class="text-primary">Do</span>
            </span>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Your ultimate productivity companion for managing tasks, events, and projects.
          </p>
        </v-col>

        <!-- Quick Links -->
        <v-col class="text-center" cols="12" md="4">
          <h6 class="text-h6 font-weight-bold text-primary mb-4">
            Quick Links
          </h6>
          <div class="footer-links">
            <v-btn
              class="footer-link"
              color="primary"
              to="/"
              variant="text"
            >
              Home
            </v-btn>
            <v-btn
              class="footer-link"
              color="primary"
              to="/calendar"
              variant="text"
            >
              Calendar
            </v-btn>
            <v-btn
              class="footer-link"
              color="primary"
              to="/tasks"
              variant="text"
            >
              Tasks
            </v-btn>
            <v-btn
              class="footer-link"
              color="primary"
              to="/projects"
              variant="text"
            >
              Projects
            </v-btn>
          </div>
        </v-col>

        <!-- Social Links and Copyright -->
        <v-col class="text-center text-md-right" cols="12" md="4">
          <div class="social-links mb-4">
            <v-btn
              class="social-btn"
              color="primary"
              href="https://github.com"
              icon
              target="_blank"
              variant="text"
            >
              <v-icon>mdi-github</v-icon>
            </v-btn>
            <v-btn
              class="social-btn"
              color="info"
              href="https://twitter.com"
              icon
              target="_blank"
              variant="text"
            >
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn
              class="social-btn"
              color="secondary"
              href="https://linkedin.com"
              icon
              target="_blank"
              variant="text"
            >
              <v-icon>mdi-linkedin</v-icon>
            </v-btn>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            © {{ currentYear }} TrackDo. All rights reserved.
          </p>
        </v-col>
      </v-row>

      <!-- Divider -->
      <v-divider class="my-6 footer-divider" />

      <!-- Bottom Section -->
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <p class="text-caption text-medium-emphasis mb-0">
            Made with <v-icon class="mx-1" color="error" size="16">mdi-heart</v-icon>
            using Vue.js & Vuetify By VyLeHoang
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Decorative Elements -->
    <div class="footer-decoration">
      <div class="decoration-dot dot-1" />
      <div class="decoration-dot dot-2" />
      <div class="decoration-dot dot-3" />
      <div class="decoration-dot dot-4" />

      <!-- Shimmer Effect -->
      <div class="shimmer-overlay" />

      <!-- Sparkle Effects -->
      <div class="sparkle sparkle-1" />
      <div class="sparkle sparkle-2" />
      <div class="sparkle sparkle-3" />
      <div class="sparkle sparkle-4" />
      <div class="sparkle sparkle-5" />
    </div>
  </v-footer>
</template>

<script setup>
  import { computed } from 'vue'

  const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  position: relative;
  overflow: hidden;
  margin-top: auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #fff8e1 100%);
}

/* Dark theme adjustments */
.v-theme--dark .app-footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #2a2a2a 100%) !important;
}

.v-theme--dark .footer-divider {
  background: linear-gradient(90deg, transparent, #64b5f6, #ffb74d, #81c784, transparent);
}

.v-theme--dark .footer-link:hover {
  background: rgb(100 181 246 / 15%);
}

.v-theme--dark .social-btn {
  box-shadow: 0 2px 8px rgb(255 255 255 / 5%);
}

.v-theme--dark .social-btn:hover {
  box-shadow: 0 6px 20px rgb(255 255 255 / 10%);
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: brandGlow 3s ease-in-out infinite alternate;
}

@keyframes brandGlow {
  0% { filter: drop-shadow(0 0 5px rgb(25 118 210 / 30%)); }
  100% { filter: drop-shadow(0 0 15px rgb(255 193 7 / 40%)); }
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.footer-link {
  transition: all 0.3s ease;
  border-radius: 20px;
}

.footer-link:hover {
  background: rgb(25 118 210 / 10%);
  transform: translateY(-2px);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-btn {
  transition: all 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 6px 20px rgb(0 0 0 / 15%);
}

.footer-divider {
  background: linear-gradient(90deg, transparent, #1976d2, #ffc107, #4caf50, transparent);
  height: 2px;
  border: none;
}

.footer-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-dot {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.dot-1 {
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #1976d2, #ffc107);
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.dot-2 {
  width: 15px;
  height: 15px;
  background: linear-gradient(45deg, #ffc107, #4caf50);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.dot-3 {
  width: 25px;
  height: 25px;
  background: linear-gradient(45deg, #4caf50, #1976d2);
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

.dot-4 {
  width: 18px;
  height: 18px;
  background: linear-gradient(45deg, #ff5722, #ffc107);
  top: 40%;
  right: 25%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Shimmer Effect */
.shimmer-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 20%),
    transparent
  );
  animation: shimmer 3s ease-in-out infinite;
}

.v-theme--dark .shimmer-overlay {
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 10%),
    transparent
  );
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Sparkle Effects */
.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffc107;
  border-radius: 50%;
  opacity: 0;
  animation: sparkle 2s linear infinite;
}

.sparkle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 8px;
  background: inherit;
  transform: translate(-50%, -50%);
}

.sparkle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 2px;
  background: inherit;
  transform: translate(-50%, -50%);
}

.sparkle-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 70%;
  left: 80%;
  animation-delay: 0.5s;
}

.sparkle-3 {
  top: 40%;
  left: 30%;
  animation-delay: 1s;
}

.sparkle-4 {
  top: 60%;
  left: 60%;
  animation-delay: 1.5s;
}

.sparkle-5 {
  top: 30%;
  left: 90%;
  animation-delay: 0.8s;
}

@keyframes sparkle {
  0%, 20% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  80%, 100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-brand {
    justify-content: center;
    margin-bottom: 16px;
  }

  .footer-links {
    margin-bottom: 16px;
  }

  .social-links {
    margin-bottom: 16px;
  }
}
</style>
