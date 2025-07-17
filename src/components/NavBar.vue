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
        <!-- Logo GIF -->
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

      <!-- User Menu -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="user-menu-btn"
            icon
            variant="text"
          >
            <v-avatar color="secondary" size="32">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="user-menu">
          <v-list-item>
            <v-list-item-title class="font-weight-medium">Vy Le</v-list-item-title>
            <v-list-item-subtitle>vyle@trackdo.com</v-list-item-subtitle>
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
      <v-list-item class="px-4 py-6">
        <div class="d-flex align-center">
          <v-avatar class="mr-3" color="secondary">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-medium">John Doe</div>
            <div class="text-caption text-medium-emphasis">john@trackdo.com</div>
          </div>
        </div>
      </v-list-item>

      <v-divider />

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

      <v-list-item prepend-icon="mdi-account-circle" title="Profile" />
      <v-list-item prepend-icon="mdi-cog" title="Settings" />
      <v-list-item prepend-icon="mdi-help-circle" title="Help" />
      <v-list-item class="text-error" prepend-icon="mdi-logout" title="Logout" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTheme } from 'vuetify'

  const router = useRouter()
  const theme = useTheme()
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

  const userMenuItems = [
    {
      title: 'Profile',
      icon: 'mdi-account-circle',
      action: () => router.push('/profile'),
    },
    {
      title: 'Settings',
      icon: 'mdi-cog',
      action: () => router.push('/settings'),
    },
    {
      title: 'Logout',
      icon: 'mdi-logout',
      action: () => {
        // Handle logout logic here
        console.log('Logout clicked')
      },
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
