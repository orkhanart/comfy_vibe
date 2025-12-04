# Tool Stack

Recommended tools for prototype testing and user feedback.

## Deployment & Infrastructure

### Vercel
**Purpose:** Deployment, preview URLs, A/B testing infrastructure

| Feature | Use Case |
|---------|----------|
| Preview Deployments | Unique URL per branch/PR for testing |
| Flags SDK | Feature flags and A/B testing at the edge |
| Web Analytics | Built-in page view and event tracking |
| Flags Explorer | Override flags in toolbar without affecting others |

**Setup:**
```bash
# Already configured - just push branches
git push origin feature/experiment
# Auto-generates: https://project-git-feature-experiment.vercel.app
```

**Integrations:**
- Statsig (A/B testing, launch partner)
- LaunchDarkly, Split, Optimizely (feature flags)

---

## Behavior Analytics

### Option A: Microsoft Clarity (Free)
**Best for:** Starting out, budget-conscious

| Feature | Description |
|---------|-------------|
| Heatmaps | Click, scroll, area heatmaps |
| Session Recordings | Watch user sessions |
| Rage Clicks | Detect frustration signals |
| Dead Clicks | Find broken interactions |
| Insights Dashboard | AI-powered insights |

**Pricing:** Free, unlimited traffic

**Install:**
```html
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    // ... clarity script
  })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
</script>
```

### Option B: PostHog (Recommended)
**Best for:** All-in-one solution, technical teams

| Feature | Description |
|---------|-------------|
| Product Analytics | Events, funnels, retention |
| Session Recording | Full session replay |
| Heatmaps | Click and scroll tracking |
| Feature Flags | Built-in experimentation |
| A/B Testing | Statistical significance |
| Surveys | In-app micro-surveys |

**Pricing:** Free up to 1M events/mo, then usage-based (~$0.00031/event)

**Install (Vue):**
```bash
pnpm add posthog-js
```

```typescript
// src/plugins/posthog.ts
import posthog from 'posthog-js'

export function initPostHog() {
  posthog.init('YOUR_API_KEY', {
    api_host: 'https://app.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  })
}
```

### Option C: Hotjar
**Best for:** SMBs, non-technical teams

| Feature | Description |
|---------|-------------|
| Heatmaps | Visual click/scroll maps |
| Recordings | Session replay |
| Feedback | Built-in feedback widget |
| Surveys | On-site surveys |

**Pricing:** Free (35 sessions/day), $32/mo (100 sessions), $80/mo (500 sessions)

---

## Feedback Collection

### Canny
**Purpose:** Feature requests, voting, roadmaps

| Feature | Description |
|---------|-------------|
| Feedback Widget | In-app submission |
| Voting Boards | Users upvote features |
| Public Roadmap | Transparent planning |
| Changelog | Announce shipped features |
| SSO | No extra login for users |

**Pricing:** Free (basic), $79/mo (growth)

**Integrations:** Jira, Slack, Intercom, GitHub, Zapier

### Featurebase (Alternative)
**Purpose:** All-in-one feedback platform

Best value in 2025 - includes widget, voting, roadmap, changelog in one tool.

### Sprig (Advanced)
**Purpose:** AI-powered in-product surveys

| Feature | Description |
|---------|-------------|
| Targeted Surveys | Trigger based on behavior |
| AI Analysis | Automatic insight extraction |
| Evergreen Widget | Continuous feedback |

**Pricing:** $175/mo+

---

## Usability Testing

### Maze
**Purpose:** Structured usability tests

| Feature | Description |
|---------|-------------|
| Prototype Testing | Import from Figma |
| Task Analysis | Completion rates, time-on-task |
| Heatmaps | Click paths visualization |
| Metrics | Misclick rate, direct success |
| Panel | Recruit participants |

**Pricing:** Free (limited), $99/mo (team)

### Useberry (Alternative)
**Purpose:** Design validation

- Figma, Adobe XD, Sketch integration
- 5-second tests
- First-click tests
- Preference tests

**Pricing:** Free (limited), $99/mo

### Lyssna (Alternative)
**Purpose:** Think-aloud testing

- Participant recruitment panel
- Video responses
- Think-aloud protocol support

---

## A/B Testing

### Statsig (Recommended with Vercel)
**Purpose:** Feature flags + experimentation

| Feature | Description |
|---------|-------------|
| Feature Gates | Boolean flags |
| Dynamic Configs | JSON configs |
| Experiments | A/B/n testing |
| Autotune | Multi-armed bandit |
| Metrics | Automatic analysis |

**Pricing:** Free tier generous, usage-based

**Vercel Integration:**
```typescript
// Built into Vercel Flags SDK
import { flag } from '@vercel/flags/next'

export const newFeature = flag({
  key: 'new-feature',
  decide: () => Math.random() > 0.5,
})
```

### ConfigCat (Simple Alternative)
**Purpose:** Simple feature flags

- Easy setup
- Percentage rollouts
- Targeting rules

---

## Comparison Matrix

| Need | Free Option | Paid Option |
|------|-------------|-------------|
| Heatmaps | Clarity | PostHog, Hotjar |
| Session Recording | Clarity | PostHog, FullStory |
| Feedback Widget | - | Canny, Featurebase |
| Usability Tests | - | Maze, Useberry |
| A/B Testing | Vercel + DIY | Statsig, Optimizely |
| All-in-One | Clarity + Vercel | PostHog |

## Recommended Combinations

### Lean Stack (Low Budget)
```
Vercel (free) + Clarity (free) + Canny (free tier)
```

### Growth Stack (Recommended)
```
Vercel + PostHog ($0-200/mo) + Canny ($79/mo) + Maze (as needed)
```

### Enterprise Stack
```
Vercel + FullStory + Productboard + Optimizely + UserTesting
```
