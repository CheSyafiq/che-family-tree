import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initAuth } from './composables/useAuth'
import { initDarkMode } from './composables/useDarkMode'
import { initLanguage } from './composables/useLanguage'

// Initialize dark mode
initDarkMode()

// Initialize language
initLanguage()

// Initialize authentication and wait for it to complete before mounting
initAuth().then(() => {
  createApp(App)
    .use(router)
    .mount('#app')
})
