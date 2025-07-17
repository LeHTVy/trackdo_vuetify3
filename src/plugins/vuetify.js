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
          'primary': '#1976D2', // Blue
          'secondary': '#FFC107', // Amber/Yellow
          'accent': '#FF9800', // Orange
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
          'primary': '#2196F3',
          'secondary': '#FFC107',
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
