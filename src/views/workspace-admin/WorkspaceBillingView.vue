<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)

const breadcrumbItems = computed(() => [
  { label: '', icon: 'home', to: '/workspace' },
  { label: currentWorkspace.value?.name || 'Workspace', icon: 'users', to: '/workspace/manage' },
  { label: 'Billing' }
])

// =====================
// TABS
// =====================
type Tab = 'usage' | 'billing-history' | 'payment-methods' | 'plan-management'
const activeTab = ref<Tab>('usage')

const tabs = [
  { id: 'usage' as Tab, label: 'Usage', icon: 'chart-bar' },
  { id: 'billing-history' as Tab, label: 'Billing History', icon: 'receipt' },
  { id: 'payment-methods' as Tab, label: 'Payment Methods', icon: 'credit-card' },
  { id: 'plan-management' as Tab, label: 'Plan Management', icon: 'layers' },
]

// =====================
// USAGE DATA
// =====================
const usageData = ref({
  currentPeriod: {
    start: 'Dec 1, 2024',
    end: 'Dec 31, 2024',
  },
  compute: {
    used: 847,
    limit: 1000,
    unit: 'GPU hours',
  },
  storage: {
    used: 68,
    limit: 100,
    unit: 'GB',
  },
  apiCalls: {
    used: 45280,
    limit: 100000,
    unit: 'calls',
  },
  seats: {
    used: 18,
    limit: 25,
    unit: 'users',
  },
})

const usageHistory = ref([
  { month: 'Nov 2024', compute: 920, storage: 62, apiCalls: 52000 },
  { month: 'Oct 2024', compute: 780, storage: 58, apiCalls: 48000 },
  { month: 'Sep 2024', compute: 650, storage: 55, apiCalls: 42000 },
  { month: 'Aug 2024', compute: 540, storage: 50, apiCalls: 38000 },
])

// =====================
// BILLING HISTORY DATA
// =====================
const invoices = ref([
  { id: 'INV-001', date: 'Dec 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-002', date: 'Nov 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-003', date: 'Oct 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-004', date: 'Sep 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-005', date: 'Aug 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-006', date: 'Jul 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
])

const billingEmail = ref('billing@company.com')

// =====================
// PAYMENT METHODS DATA
// =====================
const paymentMethods = ref([
  {
    id: 'pm-1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'card',
    brand: 'Mastercard',
    last4: '8888',
    expiry: '09/25',
    isDefault: false,
  },
])

const billingAddress = ref({
  name: 'Acme Inc.',
  line1: '123 Main Street',
  line2: 'Suite 400',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94105',
  country: 'United States',
})

// =====================
// PLAN MANAGEMENT DATA
// =====================
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

// =====================
// ACTIONS
// =====================
function downloadInvoice(invoiceId: string) {
  console.log('Download invoice:', invoiceId)
}

function setDefaultPaymentMethod(methodId: string) {
  paymentMethods.value.forEach(pm => {
    pm.isDefault = pm.id === methodId
  })
}

function removePaymentMethod(methodId: string) {
  console.log('Remove payment method:', methodId)
}

function addPaymentMethod() {
  console.log('Add payment method')
}

function editBillingAddress() {
  console.log('Edit billing address')
}

function changePlan(planId: string) {
  console.log('Change to plan:', planId)
}

function cancelSubscription() {
  console.log('Cancel subscription')
}

function getUsagePercentage(used: number, limit: number): number {
  return Math.round((used / limit) * 100)
}

function getUsageColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-amber-500'
  return 'bg-primary'
}

function formatNumber(num: number): string {
  return num.toLocaleString()
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <!-- Breadcrumb -->
    <PageBreadcrumb :items="breadcrumbItems" class="mb-4" />

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground">Billing</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex items-center gap-1 border-b border-border">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="activeTab === tab.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = tab.id"
      >
        <Icon :name="tab.icon" size="sm" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Usage Tab -->
    <div v-if="activeTab === 'usage'" class="space-y-6">
      <!-- Billing Period -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-medium text-muted-foreground">Current Billing Period</h2>
          <p class="text-lg font-semibold text-foreground">{{ usageData.currentPeriod.start }} - {{ usageData.currentPeriod.end }}</p>
        </div>
        <button class="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          View Details
        </button>
      </div>

      <!-- Usage Cards -->
      <div class="grid grid-cols-4 gap-4">
        <!-- Compute Usage -->
        <div class="rounded-lg border border-border bg-card p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Icon name="cpu" size="sm" class="text-blue-600 dark:text-blue-400" />
              </div>
              <span class="text-sm font-medium text-foreground">Compute</span>
            </div>
            <span class="text-xs text-muted-foreground">{{ usageData.compute.unit }}</span>
          </div>
          <div class="mt-4">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-foreground">{{ formatNumber(usageData.compute.used) }}</span>
              <span class="text-sm text-muted-foreground">/ {{ formatNumber(usageData.compute.limit) }}</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                :class="['h-full rounded-full transition-all', getUsageColor(getUsagePercentage(usageData.compute.used, usageData.compute.limit))]"
                :style="{ width: `${getUsagePercentage(usageData.compute.used, usageData.compute.limit)}%` }"
              />
            </div>
            <p class="mt-1.5 text-xs text-muted-foreground">{{ getUsagePercentage(usageData.compute.used, usageData.compute.limit) }}% used</p>
          </div>
        </div>

        <!-- Storage Usage -->
        <div class="rounded-lg border border-border bg-card p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Icon name="hard-drive" size="sm" class="text-purple-600 dark:text-purple-400" />
              </div>
              <span class="text-sm font-medium text-foreground">Storage</span>
            </div>
            <span class="text-xs text-muted-foreground">{{ usageData.storage.unit }}</span>
          </div>
          <div class="mt-4">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-foreground">{{ usageData.storage.used }}</span>
              <span class="text-sm text-muted-foreground">/ {{ usageData.storage.limit }}</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                :class="['h-full rounded-full transition-all', getUsageColor(getUsagePercentage(usageData.storage.used, usageData.storage.limit))]"
                :style="{ width: `${getUsagePercentage(usageData.storage.used, usageData.storage.limit)}%` }"
              />
            </div>
            <p class="mt-1.5 text-xs text-muted-foreground">{{ getUsagePercentage(usageData.storage.used, usageData.storage.limit) }}% used</p>
          </div>
        </div>

        <!-- API Calls -->
        <div class="rounded-lg border border-border bg-card p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Icon name="code" size="sm" class="text-green-600 dark:text-green-400" />
              </div>
              <span class="text-sm font-medium text-foreground">API Calls</span>
            </div>
            <span class="text-xs text-muted-foreground">{{ usageData.apiCalls.unit }}</span>
          </div>
          <div class="mt-4">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-foreground">{{ formatNumber(usageData.apiCalls.used) }}</span>
              <span class="text-sm text-muted-foreground">/ {{ formatNumber(usageData.apiCalls.limit) }}</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                :class="['h-full rounded-full transition-all', getUsageColor(getUsagePercentage(usageData.apiCalls.used, usageData.apiCalls.limit))]"
                :style="{ width: `${getUsagePercentage(usageData.apiCalls.used, usageData.apiCalls.limit)}%` }"
              />
            </div>
            <p class="mt-1.5 text-xs text-muted-foreground">{{ getUsagePercentage(usageData.apiCalls.used, usageData.apiCalls.limit) }}% used</p>
          </div>
        </div>

        <!-- Team Seats -->
        <div class="rounded-lg border border-border bg-card p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Icon name="users" size="sm" class="text-amber-600 dark:text-amber-400" />
              </div>
              <span class="text-sm font-medium text-foreground">Team Seats</span>
            </div>
            <span class="text-xs text-muted-foreground">{{ usageData.seats.unit }}</span>
          </div>
          <div class="mt-4">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-foreground">{{ usageData.seats.used }}</span>
              <span class="text-sm text-muted-foreground">/ {{ usageData.seats.limit }}</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                :class="['h-full rounded-full transition-all', getUsageColor(getUsagePercentage(usageData.seats.used, usageData.seats.limit))]"
                :style="{ width: `${getUsagePercentage(usageData.seats.used, usageData.seats.limit)}%` }"
              />
            </div>
            <p class="mt-1.5 text-xs text-muted-foreground">{{ getUsagePercentage(usageData.seats.used, usageData.seats.limit) }}% used</p>
          </div>
        </div>
      </div>

      <!-- Usage History -->
      <div>
        <h2 class="mb-4 text-sm font-medium text-foreground">Usage History</h2>
        <!-- Table Header -->
        <div class="flex items-center gap-4 border-b border-border px-1 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div class="w-32">Month</div>
          <div class="w-28">Compute (hrs)</div>
          <div class="w-28">Storage (GB)</div>
          <div class="flex-1">API Calls</div>
        </div>

        <!-- History Items -->
        <div class="divide-y divide-border">
          <div
            v-for="row in usageHistory"
            :key="row.month"
            class="flex items-center gap-4 px-1 py-4 transition-colors hover:bg-muted/30"
          >
            <div class="w-32 font-medium text-foreground">{{ row.month }}</div>
            <div class="w-28 text-sm text-muted-foreground">{{ formatNumber(row.compute) }}</div>
            <div class="w-28 text-sm text-muted-foreground">{{ row.storage }}</div>
            <div class="flex-1 text-sm text-muted-foreground">{{ formatNumber(row.apiCalls) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing History Tab -->
    <div v-else-if="activeTab === 'billing-history'" class="space-y-6">
      <!-- Billing Email -->
      <div class="flex items-start justify-between gap-8 py-6">
        <div class="flex-1">
          <label class="text-sm font-medium text-foreground">Billing Email</label>
          <p class="mt-1 text-sm text-muted-foreground">Invoices will be sent to this email address</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-foreground">{{ billingEmail }}</span>
          <button class="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Change
          </button>
        </div>
      </div>
      <div class="h-px bg-border" />

      <!-- Invoices Table -->
      <div>
        <h2 class="mb-4 text-sm font-medium text-foreground">Invoices</h2>
        <!-- Table Header -->
        <div class="flex items-center gap-4 border-b border-border px-1 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div class="w-28">Invoice</div>
          <div class="w-32">Date</div>
          <div class="w-24">Amount</div>
          <div class="flex-1">Status</div>
          <div class="w-20 text-right">Download</div>
        </div>

        <!-- Invoice Items -->
        <div class="divide-y divide-border">
          <div
            v-for="invoice in invoices"
            :key="invoice.id"
            class="flex items-center gap-4 px-1 py-4 transition-colors hover:bg-muted/30"
          >
            <div class="w-28 font-medium text-foreground">{{ invoice.id }}</div>
            <div class="w-32 text-sm text-muted-foreground">{{ invoice.date }}</div>
            <div class="w-24 text-sm text-foreground">${{ invoice.amount.toFixed(2) }}</div>
            <div class="flex-1">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500" />
                Paid
              </span>
            </div>
            <div class="flex w-20 justify-end">
              <button
                class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                @click="downloadInvoice(invoice.id)"
              >
                <Icon name="download" size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Methods Tab -->
    <div v-else-if="activeTab === 'payment-methods'" class="space-y-6">
      <!-- Payment Methods List -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-foreground">Payment Methods</h2>
          <button
            class="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            @click="addPaymentMethod"
          >
            <Icon name="plus" size="xs" />
            Add Payment Method
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            :class="[
              'flex items-center justify-between rounded-lg border p-4',
              method.isDefault ? 'border-primary bg-primary/5' : 'border-border bg-card'
            ]"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-16 items-center justify-center rounded-md bg-muted">
                <Icon name="credit-card" size="lg" class="text-muted-foreground" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-medium text-foreground">{{ method.brand }} ending in {{ method.last4 }}</p>
                  <span v-if="method.isDefault" class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Default
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">Expires {{ method.expiry }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="!method.isDefault"
                class="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                @click="setDefaultPaymentMethod(method.id)"
              >
                Set as Default
              </button>
              <button
                class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                @click="removePaymentMethod(method.id)"
              >
                <Icon name="trash" size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Billing Address -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-foreground">Billing Address</h2>
          <button
            class="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            @click="editBillingAddress"
          >
            Edit
          </button>
        </div>

        <div class="rounded-lg border border-border bg-card p-5">
          <p class="font-medium text-foreground">{{ billingAddress.name }}</p>
          <p class="mt-1 text-sm text-muted-foreground">{{ billingAddress.line1 }}</p>
          <p v-if="billingAddress.line2" class="text-sm text-muted-foreground">{{ billingAddress.line2 }}</p>
          <p class="text-sm text-muted-foreground">{{ billingAddress.city }}, {{ billingAddress.state }} {{ billingAddress.postalCode }}</p>
          <p class="text-sm text-muted-foreground">{{ billingAddress.country }}</p>
        </div>
      </div>
    </div>

    <!-- Plan Management Tab -->
    <div v-else-if="activeTab === 'plan-management'" class="space-y-6">
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
              plan.current
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
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
  </div>
</template>
