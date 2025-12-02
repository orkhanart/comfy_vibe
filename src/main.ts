import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { vTooltip } from './directives/tooltip'
import { initPostHog } from './plugins/posthog'

import './assets/css/main.css'

const app = createApp(App)

// Pinia state management
const pinia = createPinia()
app.use(pinia)

// Vue Router
app.use(router)

// PostHog Analytics
initPostHog(router)

// Custom tooltip directive
app.directive('tooltip', vTooltip)

app.mount('#app')
