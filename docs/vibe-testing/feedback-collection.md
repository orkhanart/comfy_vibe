# Feedback Collection

Methods and tools for gathering user feedback on prototypes.

## Feedback Types

| Type | What It Tells You | When to Use |
|------|-------------------|-------------|
| **Behavioral** | What users actually do | Always (passive) |
| **Attitudinal** | What users say/think | Key moments |
| **Feature Requests** | What users want | Ongoing |
| **Bug Reports** | What's broken | Ongoing |

---

## In-App Feedback Widget

### Option 1: Canny Integration

```typescript
// src/plugins/canny.ts
declare global {
  interface Window {
    Canny: any
  }
}

export function initCanny(appId: string) {
  // Load Canny SDK
  ;(function (w: any, d, i, s) {
    function l() {
      if (!d.getElementById(i)) {
        const f = d.getElementsByTagName(s)[0]
        const e = d.createElement(s) as HTMLScriptElement
        e.type = 'text/javascript'
        e.async = true
        e.src = 'https://canny.io/sdk.js'
        f.parentNode?.insertBefore(e, f)
      }
    }
    if (typeof w.Canny !== 'function') {
      const c = function (...args: any[]) {
        c.q.push(args)
      } as any
      c.q = []
      w.Canny = c
      if (d.readyState === 'complete') {
        l()
      } else {
        w.attachEvent
          ? w.attachEvent('onload', l)
          : w.addEventListener('load', l, false)
      }
    }
  })(window, document, 'canny-jssdk', 'script')

  // Identify user
  window.Canny('identify', {
    appID: appId,
    user: {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      created: new Date(currentUser.createdAt).toISOString(),
    },
  })
}

// Show feedback widget
export function showFeedbackWidget() {
  window.Canny('showWidget')
}
```

### Option 2: Custom Widget

```vue
<!-- src/components/FeedbackWidget.vue -->
<template>
  <Teleport to="body">
    <!-- Trigger Button -->
    <button
      @click="isOpen = true"
      class="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90"
    >
      <MessageSquare class="w-4 h-4 mr-2" />
      Feedback
    </button>

    <!-- Modal -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isOpen = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">Send Feedback</h2>

        <form @submit.prevent="submit">
          <!-- Type -->
          <div class="mb-4">
            <label class="block text-sm mb-2">Type</label>
            <select v-model="form.type" class="w-full border rounded p-2">
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <!-- Message -->
          <div class="mb-4">
            <label class="block text-sm mb-2">Message</label>
            <textarea
              v-model="form.message"
              rows="4"
              class="w-full border rounded p-2"
              placeholder="What's on your mind?"
              required
            />
          </div>

          <!-- Screenshot -->
          <div class="mb-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.includeScreenshot"
              />
              <span class="text-sm">Include screenshot</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="isOpen = false"
              class="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-primary text-white rounded"
            >
              {{ submitting ? 'Sending...' : 'Send' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import { captureScreenshot, sendFeedback } from '@/services/feedback'

const isOpen = ref(false)
const submitting = ref(false)

const form = reactive({
  type: 'general',
  message: '',
  includeScreenshot: false,
})

async function submit() {
  submitting.value = true

  try {
    let screenshot: string | undefined

    if (form.includeScreenshot) {
      screenshot = await captureScreenshot()
    }

    await sendFeedback({
      ...form,
      screenshot,
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    isOpen.value = false
    form.message = ''
    // Show success toast
  } catch (error) {
    // Show error toast
  } finally {
    submitting.value = false
  }
}
</script>
```

---

## Micro-Surveys

### PostHog Surveys

```typescript
// Trigger survey after specific action
posthog.capture('workflow_completed', {
  $survey_id: 'post-workflow-nps',
})

// Or trigger manually
posthog.capture('$survey_shown', {
  $survey_id: 'prototype-feedback',
})
```

### Custom Micro-Survey

```vue
<!-- src/components/MicroSurvey.vue -->
<template>
  <Transition name="slide-up">
    <div
      v-if="visible"
      class="fixed bottom-4 right-4 bg-white shadow-xl rounded-lg p-4 w-80"
    >
      <button @click="dismiss" class="absolute top-2 right-2">
        <X class="w-4 h-4" />
      </button>

      <p class="text-sm font-medium mb-3">{{ question }}</p>

      <!-- Rating Scale -->
      <div v-if="type === 'rating'" class="flex gap-1 mb-3">
        <button
          v-for="n in 5"
          :key="n"
          @click="answer = n"
          :class="[
            'w-8 h-8 rounded',
            answer === n ? 'bg-primary text-white' : 'bg-gray-100'
          ]"
        >
          {{ n }}
        </button>
      </div>

      <!-- Yes/No -->
      <div v-else-if="type === 'boolean'" class="flex gap-2 mb-3">
        <button
          @click="answer = true"
          :class="['px-4 py-2 rounded', answer === true ? 'bg-green-500 text-white' : 'bg-gray-100']"
        >
          Yes
        </button>
        <button
          @click="answer = false"
          :class="['px-4 py-2 rounded', answer === false ? 'bg-red-500 text-white' : 'bg-gray-100']"
        >
          No
        </button>
      </div>

      <!-- Text -->
      <textarea
        v-if="showFollowUp"
        v-model="followUp"
        class="w-full border rounded p-2 text-sm mb-3"
        placeholder="Tell us more (optional)"
        rows="2"
      />

      <button
        @click="submit"
        :disabled="answer === null"
        class="w-full bg-primary text-white py-2 rounded text-sm"
      >
        Submit
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  surveyId: string
  question: string
  type: 'rating' | 'boolean' | 'text'
  showFollowUp?: boolean
}>()

const visible = ref(true)
const answer = ref<number | boolean | null>(null)
const followUp = ref('')

function dismiss() {
  visible.value = false
  posthog.capture('survey_dismissed', { survey_id: props.surveyId })
}

function submit() {
  posthog.capture('survey_response', {
    survey_id: props.surveyId,
    answer: answer.value,
    follow_up: followUp.value,
  })
  visible.value = false
}
</script>
```

### Survey Triggers

| Trigger | Use Case | Example |
|---------|----------|---------|
| Page visit | First impression | "First time here? Quick question..." |
| Action complete | Task satisfaction | "How was that?" after saving |
| Time on page | Engagement | After 2 min on canvas |
| Exit intent | Abandonment reason | Mouse moves to close tab |
| Feature use | Feature feedback | After using new tool |

```typescript
// Trigger examples
function setupSurveyTriggers() {
  // After completing workflow
  watch(workflowCompleted, (completed) => {
    if (completed) {
      showSurvey('post-workflow')
    }
  })

  // Time on page
  setTimeout(() => {
    if (route.path.includes('/canvas')) {
      showSurvey('canvas-experience')
    }
  }, 120000) // 2 minutes

  // Exit intent
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10) {
      showSurvey('exit-intent')
    }
  })
}
```

---

## Feature Request Voting

### Canny Board Setup

1. Create boards:
   - **Feature Requests** - User suggestions
   - **Bug Reports** - Issues
   - **Roadmap** - Planned features (public)

2. Configure voting:
   - Users can upvote
   - Optionally allow comments
   - Set up status labels: Under Review, Planned, In Progress, Complete

### Embedding Roadmap

```vue
<template>
  <div
    data-canny
    data-board-token="YOUR_BOARD_TOKEN"
  />
</template>

<script setup>
onMounted(() => {
  window.Canny('render', {
    boardToken: 'YOUR_BOARD_TOKEN',
    basePath: '/roadmap',
  })
})
</script>
```

---

## NPS (Net Promoter Score)

### When to Ask

- After 30 days of usage
- After completing onboarding
- After major feature adoption
- Quarterly for regular users

### Implementation

```vue
<!-- NPSSurvey.vue -->
<template>
  <div class="fixed bottom-4 right-4 bg-white shadow-xl rounded-lg p-6 w-96">
    <h3 class="font-medium mb-4">
      How likely are you to recommend Vibe to a friend?
    </h3>

    <div class="flex justify-between mb-2">
      <span class="text-xs text-gray-500">Not likely</span>
      <span class="text-xs text-gray-500">Very likely</span>
    </div>

    <div class="flex gap-1 mb-4">
      <button
        v-for="n in 11"
        :key="n - 1"
        @click="score = n - 1"
        :class="[
          'flex-1 py-2 text-sm rounded',
          getScoreClass(n - 1)
        ]"
      >
        {{ n - 1 }}
      </button>
    </div>

    <textarea
      v-model="reason"
      class="w-full border rounded p-2 mb-4"
      :placeholder="reasonPlaceholder"
      rows="3"
    />

    <button
      @click="submit"
      class="w-full bg-primary text-white py-2 rounded"
    >
      Submit
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const score = ref<number | null>(null)
const reason = ref('')

const reasonPlaceholder = computed(() => {
  if (score.value === null) return 'Why did you choose this score?'
  if (score.value <= 6) return 'What could we do better?'
  if (score.value <= 8) return 'What would make it a 10?'
  return 'What do you love about Vibe?'
})

function getScoreClass(n: number) {
  if (score.value !== n) return 'bg-gray-100 hover:bg-gray-200'
  if (n <= 6) return 'bg-red-500 text-white'
  if (n <= 8) return 'bg-yellow-500 text-white'
  return 'bg-green-500 text-white'
}

function submit() {
  posthog.capture('nps_response', {
    score: score.value,
    reason: reason.value,
    category: score.value! <= 6 ? 'detractor' : score.value! <= 8 ? 'passive' : 'promoter',
  })
}
</script>
```

---

## Feedback Analysis

### Tagging System

```typescript
interface FeedbackItem {
  id: string
  type: 'bug' | 'feature' | 'general'
  message: string
  tags: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'reviewed' | 'planned' | 'completed'
}

// Common tags
const feedbackTags = [
  'ux', 'performance', 'ui', 'navigation',
  'onboarding', 'pricing', 'mobile', 'integration',
  'canvas', 'nodes', 'workflow', 'export',
]
```

### Weekly Review Process

```markdown
## Weekly Feedback Review

### New Feedback
- [ ] Review all new submissions
- [ ] Tag and categorize
- [ ] Identify urgent issues
- [ ] Respond to users if needed

### Patterns
- Top requested features:
  1. _______________
  2. _______________
  3. _______________

- Common pain points:
  1. _______________
  2. _______________

### Actions
- [ ] Add to roadmap: _______________
- [ ] Quick fix: _______________
- [ ] Needs investigation: _______________
```

---

## Closing the Loop

### Notify Users

When you ship a requested feature:

1. **Canny changelog** - Automatic notification to voters
2. **Email** - Personal follow-up to key contributors
3. **In-app** - Highlight new feature

```typescript
// Track feature request fulfillment
async function notifyFeatureShipped(featureId: string) {
  const voters = await getFeatureVoters(featureId)

  for (const user of voters) {
    await sendEmail({
      to: user.email,
      template: 'feature-shipped',
      data: {
        featureName: feature.name,
        userName: user.name,
      },
    })
  }

  // Update Canny status
  await canny.updatePost(featureId, { status: 'complete' })
}
```

### Response Templates

**Bug Report Response:**
```
Thanks for reporting this! We've identified the issue and are working on a fix.
You'll be notified when it's resolved.
```

**Feature Request Response:**
```
Great suggestion! We've added this to our consideration list.
Other users can vote on it to help us prioritize.
```

**After Shipping:**
```
Hi [Name]! You asked for [feature] - it's now live!
Check it out here: [link]
Thanks for helping us improve Vibe!
```
