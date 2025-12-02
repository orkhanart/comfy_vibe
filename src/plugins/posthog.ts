import posthog from 'posthog-js'
import type { Router } from 'vue-router'

export function initPostHog(router: Router) {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY
  const apiHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!apiKey) {
    console.warn('[PostHog] Missing VITE_POSTHOG_KEY - analytics disabled')
    return
  }

  posthog.init(apiKey, {
    api_host: apiHost,

    // Capture settings
    autocapture: true,
    capture_pageview: false, // We'll handle this manually with router
    capture_pageleave: true,

    // Session recording
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },

    // Heatmaps
    enable_heatmaps: true,

    // Privacy
    respect_dnt: true,
    persistence: 'localStorage',

    // Debug in development
    loaded: (ph) => {
      if (import.meta.env.DEV) {
        ph.debug()
      }
    },
  })

  // Track page views on route change
  router.afterEach((to) => {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path: to.path,
      name: to.name,
    })
  })
}

export { posthog }
