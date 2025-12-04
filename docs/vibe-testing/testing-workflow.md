# Testing Workflow

Step-by-step process for prototype testing with existing users.

## Overview

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ PREPARE │ → │ DEPLOY  │ → │ COLLECT │ → │ ANALYZE │ → │ ITERATE │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
     │             │             │             │             │
  Define        Preview       Passive +     Synthesize    Ship or
  goals         URL           Active        findings      pivot
```

---

## Phase 1: Prepare

### Define Testing Goals

Before deploying, answer these questions:

```markdown
## Test Plan Template

### What are we testing?
- [ ] New feature: _______________
- [ ] UI change: _______________
- [ ] Flow improvement: _______________

### Success metrics
- [ ] Task completion rate > ___%
- [ ] Time on task < ___ seconds
- [ ] Error rate < ___%
- [ ] User satisfaction > ___/5

### Hypothesis
"We believe [change] will [outcome] because [reason]"

### Minimum sample size
- Qualitative: 5-8 users (saturation point)
- Quantitative: Use calculator at evanmiller.org/ab-testing
```

### Choose Testing Method

| Method | When to Use | Time Required |
|--------|-------------|---------------|
| Guerrilla | Early concepts, quick validation | 15 min/user |
| Unmoderated | Scaling feedback, async | 10-20 min/user |
| Moderated | Complex flows, deep insights | 30-60 min/user |
| A/B Test | Comparing variations | Days-weeks |

### Prepare Test Script

For moderated/unmoderated tests:

```markdown
## Test Script Template

### Introduction (2 min)
"Thanks for helping us test. We're evaluating a new [feature],
not you. There are no wrong answers. Please think aloud as you go."

### Warm-up (2 min)
- How often do you use [product]?
- What do you typically use it for?

### Tasks (10-15 min)
1. "Find [X] and [do Y]"
   - Observe: Did they succeed? Where did they struggle?

2. "Create a new [Z]"
   - Observe: What path did they take?

3. "Change the [setting]"
   - Observe: Was it discoverable?

### Follow-up (5 min)
- What was most confusing?
- What did you like?
- What would you change?
- Rate 1-5: How easy was this?
```

---

## Phase 2: Deploy

### Create Feature Branch

```bash
# Create branch for experiment
git checkout -b experiment/new-canvas-ui

# Make changes
# ...

# Push to trigger Vercel preview
git push origin experiment/new-canvas-ui
```

### Vercel Preview URL

Vercel automatically generates:
```
https://comfyui-vibe-git-experiment-new-canvas-ui-[team].vercel.app
```

### Feature Flag (Optional)

For gradual rollouts to production:

```typescript
// src/flags.ts
import { flag } from '@vercel/flags'

export const newCanvasUI = flag({
  key: 'new-canvas-ui',
  decide: async ({ headers }) => {
    // Enable for beta users
    const userId = headers.get('x-user-id')
    return betaUsers.includes(userId)
  },
})
```

```vue
<!-- Component usage -->
<template>
  <NewCanvas v-if="showNewCanvas" />
  <OldCanvas v-else />
</template>

<script setup>
const showNewCanvas = await newCanvasUI()
</script>
```

---

## Phase 3: Collect Feedback

### Passive Collection (Always On)

Set up before sharing preview URL:

1. **Analytics tracking**
   ```typescript
   // Track key events
   posthog.capture('canvas_created', { template: 'blank' })
   posthog.capture('node_added', { type: 'image' })
   posthog.capture('workflow_run', { nodes: 5 })
   ```

2. **Session recording**
   - Enabled by default with PostHog/Clarity
   - Filter by page URL to find preview sessions

3. **Error tracking**
   - Log errors with context
   - Track rage clicks, dead clicks

### Active Collection

#### Method A: In-App Feedback Widget

```vue
<!-- FeedbackWidget.vue -->
<template>
  <button @click="openFeedback" class="feedback-trigger">
    Feedback
  </button>
</template>

<script setup>
const openFeedback = () => {
  // Option 1: Canny widget
  Canny('showWidget')

  // Option 2: PostHog survey
  posthog.capture('$survey_shown', { survey_id: 'prototype-feedback' })
}
</script>
```

#### Method B: Exit Survey

Trigger when user leaves preview:

```typescript
// On page unload
window.addEventListener('beforeunload', () => {
  posthog.capture('$survey_shown', {
    survey_id: 'preview-exit',
    questions: [
      'How easy was this to use? (1-5)',
      'What would you improve?'
    ]
  })
})
```

#### Method C: Structured Test Link

Using Maze/Useberry:

1. Import Figma prototype or use live URL
2. Define tasks:
   - "Find the node library"
   - "Create a new workflow"
   - "Run your workflow"
3. Share test link with select users
4. Collect completion rates, recordings

### Recruit Test Participants

For existing users:

```markdown
## Recruitment Email Template

Subject: Help us test a new feature (10 min)

Hi [Name],

We're testing a new [feature] and would love your input.

Takes ~10 minutes:
1. Click this link: [preview URL or Maze link]
2. Complete 3 short tasks
3. Share your thoughts

As thanks, you'll get early access when we ship!

Book a time: [Calendly link] (optional for moderated)
```

---

## Phase 4: Analyze

### Quantitative Metrics

```markdown
## Metrics Dashboard

### Task Completion
| Task | Attempts | Completions | Rate |
|------|----------|-------------|------|
| Find library | 20 | 18 | 90% |
| Create workflow | 20 | 15 | 75% |
| Run workflow | 20 | 12 | 60% | ← Problem!

### Time on Task
| Task | Target | Median | P90 |
|------|--------|--------|-----|
| Find library | 10s | 8s | 15s | ✓
| Create workflow | 30s | 45s | 90s | ← Slow

### Engagement
- Sessions: 50
- Avg session duration: 4m 30s
- Bounce rate: 20%
- Rage clicks: 15 (on [element])
```

### Qualitative Analysis

**Affinity Mapping:**

1. Collect all feedback quotes
2. Group into themes:
   - Navigation issues
   - Missing features
   - Positive reactions
   - Confusion points

**"I Like, I Wish, What If" Framework:**

| I Like | I Wish | What If |
|--------|--------|---------|
| "Clean design" | "Easier to find nodes" | "Keyboard shortcuts?" |
| "Fast loading" | "More templates" | "AI suggestions?" |

### Session Recording Review

Watch 5-10 recordings focused on:
- Where do users hesitate?
- What do they click that doesn't work?
- Do they use the feature as intended?
- Any unexpected workarounds?

---

## Phase 5: Iterate

### Decision Framework

```
                    HIGH CONFIDENCE
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    SHIP IT          ITERATE           KILL IT
    (>80% success,   (Mixed results,   (<40% success,
    positive         clear fixes)      negative
    feedback)                          feedback)
         │                │                │
         └────────────────┼────────────────┘
                          │
                    LOW CONFIDENCE
                          ↓
                    TEST MORE
```

### Document Findings

```markdown
## Test Results: [Feature Name]

### Summary
- Tested: [date range]
- Participants: [N] existing users
- Method: [unmoderated/moderated/A/B]

### Key Findings
1. **Finding 1**: [Description]
   - Evidence: [quote, metric]
   - Severity: [critical/major/minor]
   - Action: [fix/investigate/ignore]

2. **Finding 2**: ...

### Recommendations
- [ ] Priority 1: Fix [critical issue]
- [ ] Priority 2: Improve [flow]
- [ ] Priority 3: Consider [enhancement]

### Next Steps
- [ ] Implement fixes
- [ ] Re-test with [N] users
- [ ] Ship to [%] of users via feature flag
```

### Communicate Results

1. **Update Canny roadmap** - Show users their feedback was heard
2. **Changelog entry** - Announce when shipped
3. **Team share-out** - Brief stakeholders on learnings

---

## Testing Cadence

### Weekly
- Review session recordings (30 min)
- Check analytics dashboard (15 min)
- Triage new feedback (30 min)

### Per Feature
- Pre-launch: 5-8 user tests
- Post-launch: Monitor for 1 week
- A/B test: Run until significance

### Monthly
- Synthesize learnings across tests
- Update product roadmap
- Plan next experiments

---

## Checklist

### Before Launch
- [ ] Test goals defined
- [ ] Success metrics set
- [ ] Preview URL working
- [ ] Analytics tracking events
- [ ] Feedback widget enabled
- [ ] Test participants identified

### After Launch
- [ ] Monitor daily for first week
- [ ] Document findings
- [ ] Share results with team
- [ ] Update roadmap
- [ ] Close feedback loop with users
