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

app.mount('#app')

initializeStores().catch(error => {
  console.error('Store initialization failed:', error)
})
