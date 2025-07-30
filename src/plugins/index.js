import router from '@/router'
import pinia from '@/stores'
// Plugins
import vuetify from './vuetify'
import VCalendar from 'v-calendar'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VCalendar, {})
}
