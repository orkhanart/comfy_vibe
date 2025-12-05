<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)

const breadcrumbItems = computed(() => [
  { label: '', icon: 'home', to: '/workspace' },
  { label: currentWorkspace.value?.name || 'Workspace', icon: 'users' },
  { label: 'Manage' }
])

// Mock data for seat requests
type SeatType = 'Manager' | 'Workflow Builder' | 'Linear Creator'

interface SeatRequest {
  id: string
  name: string
  email: string
  requestedAt: string
  seatType: SeatType
  initial: string
  color: string
}

const seatRequests = ref<SeatRequest[]>([
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', requestedAt: '2 hours ago', seatType: 'Manager', initial: 'S', color: 'bg-pink-500' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus.j@company.io', requestedAt: '5 hours ago', seatType: 'Workflow Builder', initial: 'M', color: 'bg-blue-500' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@design.co', requestedAt: '1 day ago', seatType: 'Linear Creator', initial: 'E', color: 'bg-emerald-500' },
  { id: '4', name: 'David Kim', email: 'david.kim@startup.dev', requestedAt: '2 days ago', seatType: 'Workflow Builder', initial: 'D', color: 'bg-violet-500' },
  { id: '5', name: 'Alex Turner', email: 'alex.t@agency.com', requestedAt: '3 days ago', seatType: 'Linear Creator', initial: 'A', color: 'bg-amber-500' },
])

// Seats data
const seats = ref({
  total: 3,
  assigned: 2,
  available: 0,
  viewSeats: 1,
})

function approveRequest(id: string) {
  seatRequests.value = seatRequests.value.filter(r => r.id !== id)
}

function approveAllRequests() {
  seatRequests.value = []
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <!-- Breadcrumb -->
    <PageBreadcrumb :items="breadcrumbItems" class="mb-4" />

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground">Manage Workspace</h1>
    </div>

    <div class="flex gap-6">
      <!-- Seat Requests -->
      <div class="flex-1 rounded-lg border border-border bg-card">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-border px-5 py-4">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-medium text-foreground">Seat requests</h2>
            <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {{ seatRequests.length }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <RouterLink
              to="/workspace/manage/people"
              class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              View all
            </RouterLink>
            <button
              v-if="seatRequests.length > 0"
              class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              @click="approveAllRequests"
            >
              Approve all
            </button>
          </div>
        </div>

        <!-- Request List -->
        <div class="divide-y divide-border">
          <div
            v-for="request in seatRequests"
            :key="request.id"
            class="flex items-center gap-4 px-5 py-4"
          >
            <!-- Avatar -->
            <div class="relative">
              <div :class="['flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white', request.color]">
                {{ request.initial }}
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-blue-500">
                <Icon name="globe" size="xs" class="text-white" />
              </div>
            </div>

            <!-- Info -->
            <div class="min-w-0 flex-1">
              <p class="text-sm text-foreground">
                <span class="font-medium">{{ request.name }}</span>
                <span class="text-muted-foreground"> requested </span>
                <span class="font-medium">{{ request.seatType }}</span>
                <span class="text-muted-foreground"> seat</span>
              </p>
              <p class="mt-0.5 text-xs text-muted-foreground">
                {{ request.email }} · {{ request.requestedAt }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button
                class="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                @click="approveRequest(request.id)"
              >
                Approve
              </button>
              <button class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Icon name="chevron-right" size="sm" />
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="seatRequests.length === 0" class="px-5 py-12 text-center">
            <Icon name="check-circle" size="xl" class="mx-auto text-green-500" />
            <p class="mt-2 text-sm text-muted-foreground">No pending requests</p>
          </div>
        </div>
      </div>

      <!-- Total Seats -->
      <div class="w-80 shrink-0 rounded-lg border border-border bg-card">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-border px-5 py-4">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-medium text-foreground">Total seats</h2>
            <span class="text-sm text-muted-foreground">{{ seats.total }}</span>
          </div>
          <button class="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Manage
          </button>
        </div>

        <!-- Seats List -->
        <div class="divide-y divide-border">
          <div class="flex items-center justify-between px-5 py-3">
            <div class="flex items-center gap-3">
              <Icon name="check-circle" size="md" class="text-muted-foreground" />
              <span class="text-sm text-foreground">Assigned seats</span>
            </div>
            <span class="text-sm text-muted-foreground">{{ seats.assigned }}</span>
          </div>
          <div class="flex items-center justify-between px-5 py-3">
            <div class="flex items-center gap-3">
              <Icon name="circle" size="md" class="text-muted-foreground" />
              <span class="text-sm text-foreground">Available seats</span>
            </div>
            <span class="text-sm text-muted-foreground">{{ seats.available }}</span>
          </div>
          <div class="flex items-center justify-between px-5 py-3">
            <div class="flex items-center gap-3">
              <Icon name="eye" size="md" class="text-muted-foreground" />
              <span class="text-sm text-foreground">View seats (free)</span>
            </div>
            <span class="text-sm text-muted-foreground">{{ seats.viewSeats }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
