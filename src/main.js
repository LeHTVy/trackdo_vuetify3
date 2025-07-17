/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Stores initialization
import { initializeStores } from '@/stores/init.js'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
import '@/styles/global.css'

const app = createApp(App)

registerPlugins(app)

// Initialize stores with MongoDB data after app is mounted
app.mount('#app')

// Initialize stores asynchronously
initializeStores().catch(error => {
  console.error('Store initialization failed:', error)
})
