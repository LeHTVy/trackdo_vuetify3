<template>
  <v-container class="py-12 pt-16">
    <v-row>
      <v-col cols="12">
        <div class="page-header mb-8">
          <div class="header-content">
            <div class="icon-wrapper mb-4">
              <v-icon class="header-icon" color="primary" size="48">mdi-folder-multiple</v-icon>
            </div>
            <h1 class="text-h2 font-weight-bold text-primary mb-3">
              Project <span class="text-gradient">Management</span>
            </h1>
            <p class="text-h6 text-medium-emphasis mb-4">
              Organize, track, and manage your projects with ease
            </p>
            <div class="header-decoration" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No props or logic needed for this simple header component
</script>

<style scoped>
.page-header {
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
  position: relative;
  padding-top: 2rem;
}

.header-content {
  position: relative;
  z-index: 2;
}

.icon-wrapper {
  display: inline-block;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05));
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.header-icon {
  animation: float 3s ease-in-out infinite;
}

.text-gradient {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-decoration {
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  margin: 0 auto;
  border-radius: 2px;
  animation: slideIn 1s ease-out 0.5s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 80px;
    opacity: 1;
  }
}

/* Dark theme adjustments */
.v-theme--dark .icon-wrapper {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(25, 118, 210, 0.1));
}

.v-theme--dark .text-gradient {
  background: linear-gradient(135deg, #42a5f5, #90caf9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.v-theme--dark .header-decoration {
  background: linear-gradient(135deg, #42a5f5, #90caf9);
}
</style>
