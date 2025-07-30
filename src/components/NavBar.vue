<template>
  <v-app-bar
    class="navbar-gradient"
    :color="$vuetify.theme.current.colors['navbar-bg']"
    elevation="4"
    position="fixed"
  >
    <v-container class="d-flex align-center">
      <!-- Logo and Brand -->
      <div class="d-flex align-center">
        <!-- Logo -->
        <div class="logo-container mr-3">
          <v-icon
            class="logo"
            color="accent-yellow"
            size="32"
          >
            mdi-check-circle
          </v-icon>
        </div>

        <div>
          <h2 class="text-h5 font-weight-bold text-white mb-0">
            Track<span class="text-accent-yellow">Do</span>
          </h2>
          <p class="text-caption text-grey-lighten-1 mb-0">Productivity Hub</p>
        </div>
      </div>

      <v-spacer />

      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center">
        <!-- Show navigation items only when authenticated -->
        <template v-if="authStore.isAuthenticated">
          <v-btn
            v-for="item in navItems"
            :key="item.title"
            class="nav-btn mx-1"
            :class="{ 'active-nav': $route.path === item.to }"
            :to="item.to"
            variant="text"
          >
            <v-icon class="mr-2" :color="$route.path === item.to ? 'accent-yellow' : 'white'">
              {{ item.icon }}
            </v-icon>
            <span :class="$route.path === item.to ? 'text-accent-yellow' : 'text-white'">
              {{ item.title }}
            </span>
          </v-btn>
        </template>

        <!-- Show Login/SignUp button when not authenticated -->
        <template v-else>
          <v-btn
            class="login-btn mx-2"
            color="accent-yellow"
            variant="outlined"
            to="/auth"
          >
            <v-icon class="mr-2">mdi-login</v-icon>
            Login/Signup
          </v-btn>
        </template>
      </div>

      <!-- Theme Toggle -->
      <v-btn
        class="mx-2"
        icon
        variant="text"
        @click="toggleTheme"
      >
        <v-icon color="accent-yellow">
          {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>

      <!-- User Menu - Only show when authenticated -->
      <v-menu v-if="authStore.isAuthenticated" offset-y>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="user-menu-btn"
            icon
            variant="text"
          >
            <v-avatar color="secondary" size="32">
              <v-img v-if="authStore.currentUser?.avatar" :src="authStore.currentUser.avatar" />
              <v-icon v-else color="white">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="user-menu">
          <v-list-item>
            <v-list-item-title class="font-weight-medium">
              {{ authStore.currentUser?.firstName }} {{ authStore.currentUser?.lastName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ authStore.currentUser?.email }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <v-list-item
            v-for="item in userMenuItems"
            :key="item.title"
            @click="item.action"
          >
            <template #prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Mobile Menu Button -->
      <v-btn
        class="d-md-none ml-2"
        icon
        variant="text"
        @click="drawer = !drawer"
      >
        <v-icon color="white">mdi-menu</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    class="mobile-drawer"
    location="right"
    temporary
  >
    <v-list>
      <!-- User info - only show when authenticated -->
      <v-list-item v-if="authStore.isAuthenticated" class="px-4 py-6">
        <div class="d-flex align-center">
          <v-avatar class="mr-3" color="secondary">
            <v-img v-if="authStore.currentUser?.avatar" :src="authStore.currentUser.avatar" />
            <v-icon v-else color="white">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-medium">
              {{ authStore.currentUser?.firstName }} {{ authStore.currentUser?.lastName }}
            </div>
            <div class="text-caption text-medium-emphasis">{{ authStore.currentUser?.email }}</div>
          </div>
        </div>
      </v-list-item>

      <!-- Login/SignUp button for mobile when not authenticated -->
      <v-list-item v-else class="px-4 py-6">
        <v-btn
          class="login-btn-mobile"
          color="primary"
          variant="outlined"
          block
          to="/auth"
          @click="drawer = false"
        >
          <v-icon class="mr-2">mdi-login</v-icon>
          Login/Signup
        </v-btn>
      </v-list-item>

      <v-divider />

      <!-- Navigation items - only show when authenticated -->
      <template v-if="authStore.isAuthenticated">
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          class="mobile-nav-item"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          @click="drawer = false"
        />
        <v-divider class="my-2" />
        <v-list-item class="text-error" prepend-icon="mdi-logout" title="Logout" @click="handleLogout" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
    import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTheme } from 'vuetify'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const theme = useTheme()
  const authStore = useAuthStore()
  const drawer = ref(false)

  const navItems = [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      to: '/',
    },
    {
      title: 'Calendar',
      icon: 'mdi-calendar',
      to: '/calendar',
    },
    {
      title: 'Tasks',
      icon: 'mdi-format-list-checks',
      to: '/tasks',
    },
    {
      title: 'Projects',
      icon: 'mdi-folder-multiple',
      to: '/projects',
    },
  ]

  const handleLogout = () => {
    authStore.logout()
    drawer.value = false
    router.push('/')
  }

  const userMenuItems = [
    {
      title: 'Logout',
      icon: 'mdi-logout',
      action: handleLogout,
    },
  ]

  const toggleTheme = () => {
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
    theme.change(newTheme)
  }

</script>

<style scoped>
.navbar-gradient {
  background: linear-gradient(135deg, #232E3E 0%, #2A3F54 100%) !important;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  left: 50% !important;
  transform: translateX(-50%) !important;
  margin-top: 16px;

}

.logo-container {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-gif {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
}

.logo {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.nav-btn {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 213, 79, 0.2), transparent);
  transition: left 0.5s ease;
}

.nav-btn:hover::before {
  left: 100%;
}

.nav-btn:hover {
  background-color: rgba(255, 213, 79, 0.1) !important;
  transform: translateY(-2px);
}

.active-nav {
  background-color: rgba(255, 213, 79, 0.15) !important;
  border: 1px solid rgba(255, 213, 79, 0.3);
}

.user-menu-btn {
  transition: transform 0.2s ease;
}

.user-menu-btn:hover {
  transform: scale(1.1);
}

.user-menu {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.mobile-drawer {
  border-radius: 16px 0 0 16px;
}

.mobile-nav-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  background-color: rgba(25, 118, 210, 0.1);
  transform: translateX(4px);
}

.login-btn {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  font-weight: 600;
}

.login-btn:hover {
  background-color: rgba(255, 213, 79, 0.1) !important;
  transform: translateY(-2px);
}

.login-btn-mobile {
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .logo-gif {
    width: 32px;
    height: 32px;
  }

  .logo-container {
    width: 36px;
    height: 36px;
  }
}
</style>
