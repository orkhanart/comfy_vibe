# Analytics Setup

Heatmaps, session recording, and A/B testing configuration.

## Quick Start: Microsoft Clarity (Free)

### Installation

```html
<!-- Add to index.html -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
</script>
```

### Vue Plugin

```typescript
// src/plugins/clarity.ts
export function initClarity(projectId: string) {
  if (typeof window === 'undefined') return

  ;(function (c: any, l, a, r, i, t?: any, y?: any) {
    c[a] =
      c[a] ||
      function () {
        ;(c[a].q = c[a].q || []).push(arguments)
      }
    t = l.createElement(r)
    t.async = 1
    t.src = 'https://www.clarity.ms/tag/' + i
    y = l.getElementsByTagName(r)[0]
    y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', projectId)
}

// Identify users
export function identifyUser(userId: string, userProperties?: Record<string, string>) {
  if (window.clarity) {
    window.clarity('identify', userId)
    if (userProperties) {
      Object.entries(userProperties).forEach(([key, value]) => {
        window.clarity('set', key, value)
      })
    }
  }
}
```

---

## PostHog Setup (Recommended)

### Installation

```bash
pnpm add posthog-js
```

### Configuration

```typescript
// src/plugins/posthog.ts
import posthog from 'posthog-js'

export function initPostHog() {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',

    // Capture settings
    autocapture: true,
    capture_pageview: true,
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
    opt_out_capturing_by_default: false,

    // Performance
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        posthog.debug()
      }
    },
  })
}

export { posthog }
```

### Vue Integration

```typescript
// src/main.ts
import { initPostHog, posthog } from './plugins/posthog'

// Initialize
initPostHog()

// Provide globally
app.provide('posthog', posthog)

// Identify user on login
watch(currentUser, (user) => {
  if (user) {
    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      plan: user.plan,
      created_at: user.createdAt,
    })
  } else {
    posthog.reset()
  }
})
```

### Track Custom Events

```typescript
// Composable for tracking
// src/composables/useAnalytics.ts
import { posthog } from '@/plugins/posthog'

export function useAnalytics() {
  function track(event: string, properties?: Record<string, any>) {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  }

  function trackPageView(pageName: string) {
    posthog.capture('$pageview', {
      page_name: pageName,
      url: window.location.href,
    })
  }

  return { track, trackPageView }
}

// Usage in components
const { track } = useAnalytics()

// Canvas events
track('canvas_created', { template: 'blank', source: 'dashboard' })
track('node_added', { type: 'image', position: { x: 100, y: 200 } })
track('workflow_run', { node_count: 5, duration_ms: 1200 })

// Feature usage
track('feature_used', { feature: 'keyboard_shortcuts' })
track('export_completed', { format: 'png', size: '1024x768' })
```

---

## Session Recording

### What to Record

```typescript
// PostHog config for recording
session_recording: {
  // Record all sessions (or sample for high traffic)
  sampling: {
    sessionSampleRate: 1.0,  // 100% of sessions
    minimumDuration: 5000,   // At least 5 seconds
  },

  // Mask sensitive content
  maskAllInputs: false,
  maskInputOptions: {
    password: true,
    email: false,  // OK to see for debugging
  },

  // Block recording of specific elements
  blockSelector: '.no-record, [data-no-record]',

  // Record console logs (helpful for debugging)
  recordCrossOriginIframes: false,
}
```

### Recording Triggers

```typescript
// Start recording on specific events
posthog.startSessionRecording()

// Stop recording
posthog.stopSessionRecording()

// Tag recordings for easy filtering
posthog.capture('$session_recording_tag', {
  tags: ['beta-user', 'canvas-testing'],
})
```

### Filtering Recordings

In PostHog dashboard, filter by:
- Page URL contains `/preview/` for prototype sessions
- User property `is_beta_tester = true`
- Event `workflow_error` for debugging sessions

---

## Heatmaps

### PostHog Heatmaps

Automatically enabled with `enable_heatmaps: true`.

View in PostHog:
1. Go to toolbar (click PostHog logo on your site)
2. Toggle "Heatmap" mode
3. See click density visualization

### Heatmap Types

| Type | Shows | Use Case |
|------|-------|----------|
| Click Map | Where users click | CTA effectiveness |
| Scroll Map | How far users scroll | Content visibility |
| Move Map | Mouse movement | Attention patterns |
| Attention Map | Time spent looking | Engagement areas |

### Analyzing Heatmaps

Look for:
- **Hot spots** on non-interactive elements (users expect them to be clickable)
- **Cold spots** on important CTAs (visibility problem)
- **Scroll drop-off** before key content (content hierarchy issue)
- **Rage clicks** on specific areas (frustration signals)

---

## A/B Testing

### Vercel Feature Flags Setup

```typescript
// src/flags.ts
import { flag, dedupe } from '@vercel/flags/next'

// Simple boolean flag
export const newCanvasUI = flag({
  key: 'new-canvas-ui',
  decide: () => Math.random() > 0.5, // 50/50 split
})

// Percentage rollout
export const betaFeature = flag({
  key: 'beta-feature',
  decide: async ({ headers, cookies }) => {
    const userId = cookies.get('user-id')?.value
    // Hash user ID for consistent assignment
    const hash = hashString(userId || 'anonymous')
    return (hash % 100) < 20 // 20% of users
  },
})

// Targeted rollout
export const premiumFeature = flag({
  key: 'premium-feature',
  decide: async ({ headers }) => {
    const userPlan = headers.get('x-user-plan')
    return userPlan === 'pro' || userPlan === 'enterprise'
  },
})
```

### PostHog Experiments

```typescript
// Create experiment in PostHog dashboard, then:
function getExperimentVariant(experimentKey: string) {
  return posthog.getFeatureFlag(experimentKey)
}

// Usage
const variant = getExperimentVariant('new-onboarding-flow')
if (variant === 'control') {
  // Show original flow
} else if (variant === 'test') {
  // Show new flow
}

// Track conversion
posthog.capture('onboarding_completed', {
  $feature_flag: 'new-onboarding-flow',
  variant: variant,
})
```

### A/B Test Checklist

```markdown
## Experiment: [Name]

### Hypothesis
"If we [change], then [metric] will [improve/decrease] because [reason]"

### Variants
- Control: Current behavior
- Test A: [Description]
- Test B: [Description] (optional)

### Primary Metric
- [ ] Metric name: _____________
- [ ] Current baseline: _____________
- [ ] Target improvement: _____________%
- [ ] Minimum detectable effect: _____________%

### Secondary Metrics
- [ ] _____________
- [ ] _____________

### Traffic Allocation
- [ ] % per variant: _____________
- [ ] Estimated sample size: _____________
- [ ] Expected duration: _____________

### Guardrail Metrics
- [ ] Don't regress: _____________
- [ ] Don't regress: _____________

### Results
| Variant | Users | Conversions | Rate | CI |
|---------|-------|-------------|------|-----|
| Control | | | | |
| Test A | | | | |

### Decision
- [ ] Winner: _____________
- [ ] Ship: Yes / No / Iterate
```

---

## Event Tracking Plan

### Standard Events

```typescript
// User lifecycle
posthog.capture('user_signed_up', { method: 'email' })
posthog.capture('user_logged_in', { method: 'google' })
posthog.capture('user_logged_out')
posthog.capture('profile_updated', { fields: ['name', 'avatar'] })

// Onboarding
posthog.capture('onboarding_started')
posthog.capture('onboarding_step_completed', { step: 1, name: 'welcome' })
posthog.capture('onboarding_completed', { duration_seconds: 120 })
posthog.capture('onboarding_skipped', { at_step: 2 })

// Core features
posthog.capture('canvas_created', { template: 'blank' })
posthog.capture('canvas_opened', { canvas_id: '123' })
posthog.capture('canvas_saved', { auto_save: false })
posthog.capture('canvas_deleted')

// Nodes
posthog.capture('node_added', { type: 'image', method: 'drag' })
posthog.capture('node_connected', { from_type: 'image', to_type: 'upscale' })
posthog.capture('node_deleted', { type: 'image' })

// Workflow
posthog.capture('workflow_run_started', { node_count: 5 })
posthog.capture('workflow_run_completed', { duration_ms: 5000 })
posthog.capture('workflow_run_failed', { error: 'timeout' })

// Export
posthog.capture('export_started', { format: 'png' })
posthog.capture('export_completed', { format: 'png', size_kb: 500 })
```

### Event Naming Convention

```
[object]_[action]

Examples:
- canvas_created (not create_canvas or canvasCreated)
- node_added
- workflow_run_started
- export_completed
```

### Properties Convention

```typescript
{
  // IDs (snake_case)
  canvas_id: '123',
  user_id: 'abc',

  // Counts
  node_count: 5,
  duration_ms: 1000,

  // Booleans
  is_template: true,
  auto_save: false,

  // Enums
  source: 'dashboard' | 'hotkey' | 'menu',
  format: 'png' | 'jpg' | 'svg',
}
```

---

## Dashboard Setup

### Key Metrics to Track

```
┌─────────────────────────────────────────────────────────────┐
│                    ACQUISITION                               │
├─────────────────────────────────────────────────────────────┤
│ • New users (daily/weekly)                                  │
│ • Sign-up conversion rate                                   │
│ • Traffic sources                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ACTIVATION                                │
├─────────────────────────────────────────────────────────────┤
│ • Onboarding completion rate                                │
│ • Time to first canvas                                      │
│ • Time to first workflow run                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ENGAGEMENT                                │
├─────────────────────────────────────────────────────────────┤
│ • DAU/WAU/MAU                                               │
│ • Avg session duration                                      │
│ • Features used per session                                 │
│ • Workflows run per user                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    RETENTION                                 │
├─────────────────────────────────────────────────────────────┤
│ • D1, D7, D30 retention                                     │
│ • Cohort analysis                                           │
│ • Churn indicators                                          │
└─────────────────────────────────────────────────────────────┘
```

### PostHog Dashboard Config

Create dashboards for:

1. **Overview** - High-level health metrics
2. **Acquisition** - Sign-ups, sources
3. **Activation** - Onboarding funnel
4. **Feature Usage** - What's being used
5. **Experiments** - A/B test results

---

## Privacy & Compliance

### GDPR/CCPA Compliance

```typescript
// Opt-out mechanism
export function optOutTracking() {
  posthog.opt_out_capturing()
  if (window.clarity) {
    window.clarity('stop')
  }
}

// Opt-in mechanism
export function optInTracking() {
  posthog.opt_in_capturing()
  // Re-initialize Clarity
  initClarity(projectId)
}

// Check consent status
export function hasTrackingConsent() {
  return posthog.has_opted_out_capturing() === false
}
```

### Consent Banner

```vue
<template>
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
    <p class="text-sm mb-4">
      We use analytics to improve your experience.
      <a href="/privacy" class="underline">Learn more</a>
    </p>
    <div class="flex gap-2">
      <button @click="accept" class="bg-primary text-white px-4 py-2 rounded">
        Accept
      </button>
      <button @click="decline" class="border px-4 py-2 rounded">
        Decline
      </button>
    </div>
  </div>
</template>
```

### Data Retention

Configure in PostHog:
- Session recordings: 30 days
- Events: 1 year (or as needed)
- User data: Delete on request

```typescript
// Delete user data (for GDPR requests)
async function deleteUserData(userId: string) {
  await fetch('https://app.posthog.com/api/projects/:project_id/persons/:id/', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
    },
  })
}
```
