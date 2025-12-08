<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

const invoices = ref([
  { id: 'INV-001', date: 'Dec 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-002', date: 'Nov 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-003', date: 'Oct 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-004', date: 'Sep 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-005', date: 'Aug 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
  { id: 'INV-006', date: 'Jul 15, 2024', amount: 29.00, status: 'paid', downloadUrl: '#' },
])

const billingEmail = ref('billing@company.com')

function downloadInvoice(invoiceId: string) {
  console.log('Download invoice:', invoiceId)
}
</script>

<template>
  <div class="space-y-6">
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
      <div class="flex items-center gap-4 border-b border-border px-1 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <div class="w-28">Invoice</div>
        <div class="w-32">Date</div>
        <div class="w-24">Amount</div>
        <div class="flex-1">Status</div>
        <div class="w-20 text-right">Download</div>
      </div>
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
</template>
