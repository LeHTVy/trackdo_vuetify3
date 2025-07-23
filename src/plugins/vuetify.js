import { createVuetify } from 'vuetify'

import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

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
          'navbar-bg': '#FFC107',
          'card-bg': '#FFFFFF',
          'accent-yellow': '#FFD54F',
          'accent-light-blue': '#81D4FA',
          'app-background': '#F8F9FA',
          // Project tracking colors
          'project-active': '#10B981',
          'project-completed': '#3B82F6',
          'project-onhold': '#F59E0B',
          'project-cancelled': '#EF4444',
          'project-planning': '#8B5CF6',
          'progress-bg': '#F1F5F9',
          'card-hover': '#F8FAFC',
          // Project card hover colors
          'project-card-hover-border': '#232e3e',
          'project-card-hover-shadow': '#000000',
          'project-card-gradient-start': '#232e3e',
          'project-card-gradient-middle': '#fed44f',
          'project-card-gradient-end': '#232e3e',
          // Title and subtitle colors
          'title-text': '#232e3e',
          'subtitle-text': '#5a6c7d',
        },
      },
      dark: {
        colors: {
          'primary': '#fed44f',
          'secondary': '#90a8ba',
          'accent': '#FF9800',
          'error': '#F44336',
          'warning': '#FF9800',
          'info': '#2196F3',
          'success': '#4CAF50',
          'navbar-bg': '#232E3E',
          'accent-yellow': '#FFD54F',
          'accent-light-blue': '#81D4FA',
          'app-background': '#1a1a1a',
          // Project tracking colors for dark mode
          'project-active': '#059669',
          'project-completed': '#1D4ED8',
          'project-onhold': '#D97706',
          'project-cancelled': '#DC2626',
          'project-planning': '#7C3AED',
          'progress-bg': '#1E293B',
          'card-hover': '#334155',
          // Project card hover colors for dark mode
          'project-card-hover-border': '#fed44f',
          'project-card-hover-shadow': '#000000',
          'project-card-gradient-start': '#fed44f',
          'project-card-gradient-middle': '#90a8ba',
          'project-card-gradient-end': '#fed44f',
          // Title and subtitle colors for dark mode
          'title-text': '#fed44f',
          'subtitle-text': '#cbd5e1',
        },
      },
    },
  },
})
