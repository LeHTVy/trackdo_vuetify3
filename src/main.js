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

// Note: Clerk removed - using custom authentication

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

// Import logger for initialization
import logger from '@/services/logger'

initializeStores().catch(error => {
  logger.error('Store initialization failed', error)
})
