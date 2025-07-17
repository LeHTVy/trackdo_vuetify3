<template>
  <div class="sticky-note-container">
    <div class="sticky-note">
      <div class="sticky-tape" />
      <div class="note-content">
        <h3 class="note-title">
          <v-icon class="note-icon" color="#fed44f">mdi-lightbulb</v-icon>
          Quick Notes
        </h3>
        <div class="note-items">
          <div class="note-item">
            <v-icon color="#232e3e" size="small">mdi-check-circle</v-icon>
            <span>Stay organized with TrackDo</span>
          </div>
          <div class="note-item">
            <v-icon color="#232e3e" size="small">mdi-calendar-heart</v-icon>
            <span>Never miss important events</span>
          </div>
          <div class="note-item">
            <v-icon color="#232e3e" size="small">mdi-rocket-launch</v-icon>
            <span>Boost your productivity</span>
          </div>
          <div class="note-item">
            <v-icon color="#232e3e" size="small">mdi-team</v-icon>
            <span>Collaborate with your team</span>
          </div>
        </div>
        <div class="note-footer">
          <small class="note-date">{{ currentDate }}</small>
          <v-icon color="#fed44f" size="small">mdi-heart</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const currentDate = computed(() => {
    return new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  })
</script>

<style scoped>
.sticky-note-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 2rem 2rem;
  min-height: 500px;
  margin-top: -3rem;
}

.sticky-note {
  position: relative;
  width: 350px;
  height: 420px;
  background: linear-gradient(135deg, #fef3c7 0%, #fed44f 100%);
  border-radius: 0 0 12px 12px;
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.1),
    0 12px 24px rgba(0, 0, 0, 0.1);
  transform: rotate(-2deg);
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
  z-index: 10;
}

.sticky-note:hover {
  transform: rotate(0deg) scale(1.02);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1);
}

.sticky-tape {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 24px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.note-content {
  padding: 2.5rem 2rem 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.note-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #232e3e;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.note-icon {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.note-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #232e3e;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(35, 46, 62, 0.2);
}

.note-date {
  color: #232e3e;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.8;
}

@keyframes float {
  0%, 100% {
    transform: rotate(-2deg) translateY(0px);
  }
  50% {
    transform: rotate(-2deg) translateY(-5px);
  }
}

/* Dark theme */
.v-theme--dark .sticky-note {
  background: linear-gradient(135deg, #fed44f 0%, #f59e0b 100%);
}

.v-theme--dark .note-title,
.v-theme--dark .note-item,
.v-theme--dark .note-date {
  color: #1f2937;
}

.v-theme--dark .note-footer {
  border-top-color: rgba(31, 41, 55, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .sticky-note-container {
    padding: 0 1rem 1rem;
    min-height: 300px;
    margin-top: -2rem;
  }

  .sticky-note {
    width: 300px;
    height: 360px;
    transform: rotate(-1deg);
  }

  .note-content {
    padding: 2rem 1.5rem 1.5rem;
  }

  .note-title {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .note-item {
    font-size: 0.9rem;
    gap: 0.5rem;
  }
}
</style>
