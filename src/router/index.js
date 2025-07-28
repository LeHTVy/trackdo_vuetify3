import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const protectedRoutes = ['/projects', '/tasks', '/calendar']
  const requiresAuth = protectedRoutes.includes(to.path)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/auth')

  } else if (to.path === '/auth' && authStore.isAuthenticated) {
    next('/')

  } else {
    next()
  }
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
