import { createPinia } from 'pinia'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import cs from './locales/cs.json'
import en from './locales/en.json'
import router from './router'
import './style.css'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'cs',
  messages: {
    cs,
    en,
  },
  datetimeFormats: {
    en: {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short', // e.g. Mon, Tue
        hour: '2-digit',
        minute: '2-digit',
      },
    },
    cs: {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      },
    },
  },
})

const app = createApp(App)
app.use(i18n)
app.use(router)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')

// Set window title with TEST suffix in dev mode
if (import.meta.env.DEV) document.title = 'Task Manager - TEST'
