<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import type { WorkspaceRole } from '@/types/workspace'

const route = useRoute()
const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
const isAdmin = computed(() => workspaceStore.isAdmin)

const breadcrumbItems = computed(() => [
  { label: '', icon: 'home', to: '/workspace' },
  { label: currentWorkspace.value?.name || 'Workspace', icon: 'users', to: '/workspace/manage' },
  { label: 'People' }
])

// Tab definitions
const tabs = [
  { name: 'Members', icon: 'users', route: '/workspace/manage/people/members' },
  { name: 'Pending Invites', icon: 'envelope', route: '/workspace/manage/people/invites' },
]

function isActiveTab(tabRoute: string): boolean {
  return route.path === tabRoute
}

// Invite modal (shared across tabs)
const showInviteModal = ref(false)
const inviteEmail = ref('')
const inviteRole = ref<Exclude<WorkspaceRole, 'owner'>>('member')

function sendInvite() {
  if (inviteEmail.value) {
    // In real app, this would call an API and update the store
    console.log('Sending invite to:', inviteEmail.value, 'with role:', inviteRole.value)
    inviteEmail.value = ''
    showInviteModal.value = false
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <!-- Breadcrumb -->
    <PageBreadcrumb :items="breadcrumbItems" class="mb-4" />

    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-foreground">People</h1>
      </div>
      <button
        v-if="isAdmin"
        class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        @click="showInviteModal = true"
      >
        <Icon name="user-plus" size="sm" />
        Invite People
      </button>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex items-center gap-1 border-b border-border">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.route"
        :to="tab.route"
        class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="isActiveTab(tab.route) ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
      >
        <Icon :name="tab.icon" size="sm" />
        {{ tab.name }}
      </RouterLink>
    </div>

    <!-- Tab Content -->
    <RouterView />

    <!-- Invite Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-foreground">Invite People</h2>
          <button
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="showInviteModal = false"
          >
            <Icon name="times" size="sm" />
          </button>
        </div>

        <div class="mt-4 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Email address</label>
            <input
              v-model="inviteEmail"
              type="email"
              placeholder="Enter email address"
              class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Role</label>
            <select
              v-model="inviteRole"
              class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              <option value="admin">Admin - Can manage members and content</option>
              <option value="member">Member - Can create and edit content</option>
              <option value="viewer">Viewer - Can only view content</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="showInviteModal = false"
          >
            Cancel
          </button>
          <button
            :disabled="!inviteEmail"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            @click="sendInvite"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
