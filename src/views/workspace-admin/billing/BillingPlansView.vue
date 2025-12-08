<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

const currentPlan = ref({
  name: 'Team Pro',
  price: 29,
  interval: 'month',
  description: 'For growing teams',
  renewalDate: 'January 15, 2025',
  status: 'active',
})

const plans = ref([
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'For individuals just getting started',
    features: ['3 workflows', '1 GB storage', 'Community support', '100 GPU hours/month'],
    current: false,
  },
  {
    id: 'pro',
    name: 'Team Pro',
    price: 29,
    interval: 'month',
    description: 'For growing teams',
    features: ['Unlimited workflows', '100 GB storage', 'Priority support', '1000 GPU hours/month', 'API access'],
    current: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    interval: 'month',
    description: 'For large organizations',
    features: ['Everything in Pro', 'SSO/SAML', 'Dedicated support', 'Custom GPU allocation', 'Custom contracts'],
    current: false,
  },
])

function changePlan(planId: string) {
  console.log('Change to plan:', planId)
}

function cancelSubscription() {
  console.log('Cancel subscription')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Current Plan -->
    <div class="rounded-lg border border-border bg-card p-6">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-medium text-muted-foreground">Current Plan</h2>
          <p class="mt-1 text-2xl font-semibold text-foreground">{{ currentPlan.name }}</p>
          <p class="mt-1 text-sm text-muted-foreground">{{ currentPlan.description }}</p>
        </div>
        <span class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Active
        </span>
      </div>

      <div class="mt-4 flex items-baseline gap-1">
        <span class="text-3xl font-bold text-foreground">${{ currentPlan.price }}</span>
        <span class="text-muted-foreground">/{{ currentPlan.interval }}</span>
      </div>

      <div class="mt-4 border-t border-border pt-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Next billing date</span>
          <span class="font-medium text-foreground">{{ currentPlan.renewalDate }}</span>
        </div>
      </div>

      <div class="mt-6">
        <button
          class="text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          @click="cancelSubscription"
        >
          Cancel Subscription
        </button>
      </div>
    </div>

    <!-- Available Plans -->
    <div>
      <h2 class="mb-4 text-lg font-medium text-foreground">Available Plans</h2>
      <p class="mb-4 text-sm text-muted-foreground">Choose the plan that best fits your needs</p>

      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="plan in plans"
          :key="plan.id"
          :class="[
            'rounded-lg border p-6',
            plan.current ? 'border-primary bg-primary/5' : 'border-border bg-card'
          ]"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">{{ plan.name }}</h3>
            <span v-if="plan.current" class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Current
            </span>
          </div>

          <p class="mt-1 text-sm text-muted-foreground">{{ plan.description }}</p>

          <div class="mt-4">
            <span v-if="plan.price !== null" class="text-3xl font-bold text-foreground">${{ plan.price }}</span>
            <span v-else class="text-xl font-bold text-foreground">Custom</span>
            <span v-if="plan.price !== null" class="text-muted-foreground">/{{ plan.interval }}</span>
          </div>

          <ul class="mt-4 space-y-2">
            <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="check" size="sm" class="text-green-500" />
              {{ feature }}
            </li>
          </ul>

          <button
            v-if="!plan.current"
            class="mt-6 w-full rounded-lg border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            @click="changePlan(plan.id)"
          >
            {{ plan.price === null ? 'Contact Sales' : plan.price === 0 ? 'Downgrade' : 'Upgrade' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
