import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'primary': '#232e3e',
          'secondary': '#FFC107',
          'accent': '#2196F3',
          'error': '#F44336',
          'warning': '#FF9800',
          'info': '#2196F3',
          'success': '#4CAF50',
          'surface': '#FFFFFF',
          'background': '#F8F9FA',
          'primary-darken-1': '#1565C0',
          'secondary-darken-1': '#FFA000',
          'navbar-bg': '#232E3E',
          'card-bg': '#FFFFFF',
          'accent-yellow': '#FFD54F',
          'accent-light-blue': '#81D4FA',
        },
      },
      dark: {
        colors: {
          'primary': '#FFC107',
          'secondary': '#232e3e',
          'accent': '#FF9800',
          'error': '#F44336',
          'warning': '#FF9800',
          'info': '#2196F3',
          'success': '#4CAF50',
          'navbar-bg': '#232E3E',
          'accent-yellow': '#FFD54F',
          'accent-light-blue': '#81D4FA',
        },
      },
    },
  },
})
