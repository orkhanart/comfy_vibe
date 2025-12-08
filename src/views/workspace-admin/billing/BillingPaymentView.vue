<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

const paymentMethods = ref([
  { id: 'pm-1', type: 'card', brand: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: 'pm-2', type: 'card', brand: 'Mastercard', last4: '8888', expiry: '09/25', isDefault: false },
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
</script>

<template>
  <div class="space-y-6">
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
</template>
