<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

const usageData = ref({
  currentPeriod: {
    start: 'Dec 1, 2024',
    end: 'Dec 31, 2024',
  },
  compute: { used: 847, limit: 1000, unit: 'GPU hours' },
  storage: { used: 68, limit: 100, unit: 'GB' },
  apiCalls: { used: 45280, limit: 100000, unit: 'calls' },
  seats: { used: 18, limit: 25, unit: 'users' },
})

const usageHistory = ref([
  { month: 'Nov 2024', compute: 920, storage: 62, apiCalls: 52000 },
  { month: 'Oct 2024', compute: 780, storage: 58, apiCalls: 48000 },
  { month: 'Sep 2024', compute: 650, storage: 55, apiCalls: 42000 },
  { month: 'Aug 2024', compute: 540, storage: 50, apiCalls: 38000 },
])

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
  <div class="space-y-6">
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
      <div class="flex items-center gap-4 border-b border-border px-1 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <div class="w-32">Month</div>
        <div class="w-28">Compute (hrs)</div>
        <div class="w-28">Storage (GB)</div>
        <div class="flex-1">API Calls</div>
      </div>
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
</template>
