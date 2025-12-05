<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { ref, computed, watch } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
const isOwner = computed(() => workspaceStore.isOwner)

const breadcrumbItems = computed(() => [
  { label: '', icon: 'home', to: '/workspace' },
  { label: currentWorkspace.value?.name || 'Workspace', icon: 'users', to: '/workspace/manage' },
  { label: 'Settings' }
])

// Tabs
type Tab = 'general' | 'members' | 'security' | 'danger'
const activeTab = ref<Tab>('general')

const tabs = [
  { id: 'general' as Tab, label: 'General', icon: 'cog' },
  { id: 'members' as Tab, label: 'Members', icon: 'users' },
  { id: 'security' as Tab, label: 'Security', icon: 'shield' },
  { id: 'danger' as Tab, label: 'Danger Zone', icon: 'alert-triangle' },
]

// Settings state
const workspaceName = ref(currentWorkspace.value?.name || '')
const workspaceDescription = ref(currentWorkspace.value?.description || '')

// Watch for workspace changes
watch(currentWorkspace, (workspace) => {
  if (workspace) {
    workspaceName.value = workspace.name
    workspaceDescription.value = workspace.description || ''
  }
}, { immediate: true })

// Unsaved changes tracking
const hasUnsavedChanges = computed(() => {
  if (!currentWorkspace.value) return false
  return workspaceName.value !== currentWorkspace.value.name ||
    workspaceDescription.value !== (currentWorkspace.value.description || '')
})

// Workspace settings
const workspaceSettings = ref({
  allowMemberInvites: true,
  requireApproval: false,
  defaultRole: 'member' as 'member' | 'viewer',
  publicDiscovery: false,
  twoFactorRequired: false,
  sessionTimeout: '30',
})

// Transfer ownership
const showTransferModal = ref(false)
const transferEmail = ref('')

// Members for transfer
const members = ref([
  { id: '2', name: 'Alice Chen', email: 'alice@example.com', role: 'admin' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'member' },
  { id: '4', name: 'Carol Smith', email: 'carol@example.com', role: 'member' },
])

function saveWorkspaceSettings(): void {
  if (currentWorkspace.value && hasUnsavedChanges.value) {
    workspaceStore.updateWorkspace(currentWorkspace.value.id, {
      name: workspaceName.value,
      description: workspaceDescription.value,
    })
  }
}

function deleteWorkspace(): void {
  if (currentWorkspace.value && confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
    workspaceStore.deleteWorkspace(currentWorkspace.value.id)
  }
}

function openTransferModal(): void {
  showTransferModal.value = true
  transferEmail.value = ''
}

function confirmTransfer(): void {
  if (transferEmail.value) {
    console.log('Transfer ownership to:', transferEmail.value)
    showTransferModal.value = false
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <!-- Breadcrumb -->
    <PageBreadcrumb :items="breadcrumbItems" class="mb-4" />

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground">Settings</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex items-center gap-1 border-b border-border">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="[
          activeTab === tab.id
            ? 'border-foreground text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
          tab.id === 'danger' ? 'text-destructive hover:text-destructive' : ''
        ]"
        @click="activeTab = tab.id"
      >
        <Icon :name="tab.icon" size="sm" :class="tab.id === 'danger' && activeTab !== tab.id ? 'text-destructive/70' : ''" />
        {{ tab.label }}
      </button>
    </div>

    <!-- General Tab -->
    <div v-if="activeTab === 'general'" class="max-w-2xl">
      <!-- Workspace Logo Section -->
      <div class="pb-8">
        <h2 class="text-sm font-medium text-foreground">Workspace Logo</h2>
        <p class="mt-1 text-sm text-muted-foreground">Recommended: 256x256px, PNG or JPG</p>

        <div class="mt-4 flex items-center gap-4">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            <img
              v-if="currentWorkspace?.avatar"
              :src="currentWorkspace.avatar"
              :alt="currentWorkspace.name"
              class="h-full w-full object-cover"
            />
            <Icon v-else name="users" size="lg" class="text-muted-foreground" />
          </div>
          <div class="flex gap-2">
            <button
              class="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              :disabled="!isOwner"
            >
              Upload
            </button>
            <button
              v-if="currentWorkspace?.avatar"
              class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
              :disabled="!isOwner"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="h-px bg-border" />

      <!-- Workspace Name Section -->
      <div class="py-8">
        <div class="flex items-start justify-between gap-8">
          <div class="flex-1">
            <label class="text-sm font-medium text-foreground">Workspace Name</label>
            <p class="mt-1 text-sm text-muted-foreground">The display name for your workspace</p>
          </div>
          <input
            v-model="workspaceName"
            type="text"
            :disabled="!isOwner"
            class="w-72 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter workspace name"
          />
        </div>
      </div>

      <div class="h-px bg-border" />

      <!-- Description Section -->
      <div class="py-8">
        <div class="flex items-start justify-between gap-8">
          <div class="flex-1">
            <label class="text-sm font-medium text-foreground">Description</label>
            <p class="mt-1 text-sm text-muted-foreground">A brief description of your workspace</p>
          </div>
          <textarea
            v-model="workspaceDescription"
            rows="3"
            :disabled="!isOwner"
            class="w-72 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe what this workspace is for..."
          />
        </div>
      </div>

      <div class="h-px bg-border" />

      <!-- Workspace URL Section -->
      <div class="py-8">
        <div class="flex items-start justify-between gap-8">
          <div class="flex-1">
            <label class="text-sm font-medium text-foreground">Workspace URL</label>
            <p class="mt-1 text-sm text-muted-foreground">The URL where your workspace is accessible</p>
          </div>
          <div class="flex w-72 items-center gap-2">
            <span class="text-sm text-muted-foreground">comfy.org/</span>
            <input
              type="text"
              :value="currentWorkspace?.name?.toLowerCase().replace(/\s+/g, '-')"
              :disabled="!isOwner"
              class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div v-if="isOwner && hasUnsavedChanges" class="flex items-center gap-3 border-t border-border pt-6">
        <button
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          @click="saveWorkspaceSettings"
        >
          Save Changes
        </button>
        <span class="text-sm text-muted-foreground">You have unsaved changes</span>
      </div>
    </div>

    <!-- Members Tab -->
    <div v-else-if="activeTab === 'members'" class="max-w-2xl">
      <!-- Allow Member Invites -->
      <div class="flex items-center justify-between py-6">
        <div>
          <p class="text-sm font-medium text-foreground">Allow member invites</p>
          <p class="mt-1 text-sm text-muted-foreground">Members can invite others to this workspace</p>
        </div>
        <button
          :class="[
            'relative h-6 w-11 rounded-full transition-colors',
            workspaceSettings.allowMemberInvites ? 'bg-primary' : 'bg-muted'
          ]"
          :disabled="!isOwner"
          @click="workspaceSettings.allowMemberInvites = !workspaceSettings.allowMemberInvites"
        >
          <span
            :class="[
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              workspaceSettings.allowMemberInvites ? 'left-[22px]' : 'left-0.5'
            ]"
          />
        </button>
      </div>

      <div class="h-px bg-border" />

      <!-- Require Approval -->
      <div class="flex items-center justify-between py-6">
        <div>
          <p class="text-sm font-medium text-foreground">Require approval for new members</p>
          <p class="mt-1 text-sm text-muted-foreground">Admins must approve new member requests</p>
        </div>
        <button
          :class="[
            'relative h-6 w-11 rounded-full transition-colors',
            workspaceSettings.requireApproval ? 'bg-primary' : 'bg-muted'
          ]"
          :disabled="!isOwner"
          @click="workspaceSettings.requireApproval = !workspaceSettings.requireApproval"
        >
          <span
            :class="[
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              workspaceSettings.requireApproval ? 'left-[22px]' : 'left-0.5'
            ]"
          />
        </button>
      </div>

      <div class="h-px bg-border" />

      <!-- Default Role -->
      <div class="flex items-start justify-between gap-8 py-6">
        <div class="flex-1">
          <label class="text-sm font-medium text-foreground">Default role for new members</label>
          <p class="mt-1 text-sm text-muted-foreground">Role assigned to members when they join</p>
        </div>
        <select
          v-model="workspaceSettings.defaultRole"
          :disabled="!isOwner"
          class="w-72 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="member">Member - Can create and edit</option>
          <option value="viewer">Viewer - Can only view</option>
        </select>
      </div>
    </div>

    <!-- Security Tab -->
    <div v-else-if="activeTab === 'security'" class="max-w-2xl">
      <!-- Public Discovery -->
      <div class="flex items-center justify-between py-6">
        <div>
          <p class="text-sm font-medium text-foreground">Public discovery</p>
          <p class="mt-1 text-sm text-muted-foreground">Allow this workspace to be found in search</p>
        </div>
        <button
          :class="[
            'relative h-6 w-11 rounded-full transition-colors',
            workspaceSettings.publicDiscovery ? 'bg-primary' : 'bg-muted'
          ]"
          :disabled="!isOwner"
          @click="workspaceSettings.publicDiscovery = !workspaceSettings.publicDiscovery"
        >
          <span
            :class="[
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              workspaceSettings.publicDiscovery ? 'left-[22px]' : 'left-0.5'
            ]"
          />
        </button>
      </div>

      <div class="h-px bg-border" />

      <!-- Two-Factor Authentication -->
      <div class="flex items-center justify-between py-6">
        <div>
          <p class="text-sm font-medium text-foreground">Require two-factor authentication</p>
          <p class="mt-1 text-sm text-muted-foreground">All members must enable 2FA to access this workspace</p>
        </div>
        <button
          :class="[
            'relative h-6 w-11 rounded-full transition-colors',
            workspaceSettings.twoFactorRequired ? 'bg-primary' : 'bg-muted'
          ]"
          :disabled="!isOwner"
          @click="workspaceSettings.twoFactorRequired = !workspaceSettings.twoFactorRequired"
        >
          <span
            :class="[
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              workspaceSettings.twoFactorRequired ? 'left-[22px]' : 'left-0.5'
            ]"
          />
        </button>
      </div>

      <div class="h-px bg-border" />

      <!-- Session Timeout -->
      <div class="flex items-start justify-between gap-8 py-6">
        <div class="flex-1">
          <label class="text-sm font-medium text-foreground">Session timeout</label>
          <p class="mt-1 text-sm text-muted-foreground">Automatically log out inactive users</p>
        </div>
        <select
          v-model="workspaceSettings.sessionTimeout"
          :disabled="!isOwner"
          class="w-72 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="480">8 hours</option>
          <option value="1440">24 hours</option>
        </select>
      </div>

      <div class="h-px bg-border" />

      <!-- Enterprise Security -->
      <div class="py-6">
        <p class="text-sm font-medium text-foreground">Enterprise Security</p>
        <p class="mt-1 text-sm text-muted-foreground">
          SSO, SAML, SCIM provisioning, and advanced security features are available on Enterprise plans.
        </p>
        <button class="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Upgrade to Enterprise
        </button>
      </div>
    </div>

    <!-- Danger Zone Tab -->
    <div v-else-if="activeTab === 'danger'" class="max-w-2xl">
      <!-- Warning Banner -->
      <div class="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
        <Icon name="alert-triangle" size="md" class="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p class="text-sm text-amber-700 dark:text-amber-300">
          Actions in this section can have irreversible consequences. Please proceed with caution.
        </p>
      </div>

      <!-- Transfer Ownership -->
      <div class="flex items-start justify-between gap-8 py-6">
        <div class="flex-1">
          <p class="text-sm font-medium text-foreground">Transfer Ownership</p>
          <p class="mt-1 text-sm text-muted-foreground">
            Transfer this workspace to another member. You will become an admin.
          </p>
        </div>
        <button
          v-if="isOwner"
          class="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          @click="openTransferModal"
        >
          Transfer
        </button>
      </div>

      <div class="h-px bg-border" />

      <!-- Leave Workspace -->
      <div class="flex items-start justify-between gap-8 py-6">
        <div class="flex-1">
          <p class="text-sm font-medium text-foreground">Leave Workspace</p>
          <p class="mt-1 text-sm text-muted-foreground">
            <template v-if="isOwner">
              As the owner, you must transfer ownership before leaving.
            </template>
            <template v-else>
              Remove yourself from this workspace. This cannot be undone.
            </template>
          </p>
        </div>
        <button
          v-if="!isOwner"
          class="shrink-0 rounded-lg border border-amber-500/50 px-4 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-500/10 dark:text-amber-400"
        >
          Leave
        </button>
      </div>

      <div class="h-px bg-border" />

      <!-- Delete Workspace -->
      <div v-if="isOwner" class="flex items-start justify-between gap-8 py-6">
        <div class="flex-1">
          <p class="text-sm font-medium text-destructive">Delete Workspace</p>
          <p class="mt-1 text-sm text-muted-foreground">
            Permanently delete this workspace and all its data. This cannot be undone.
          </p>
        </div>
        <button
          class="shrink-0 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
          @click="deleteWorkspace"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Transfer Ownership Modal -->
    <div v-if="showTransferModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-foreground">Transfer Ownership</h2>
          <button
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="showTransferModal = false"
          >
            <Icon name="times" size="sm" />
          </button>
        </div>

        <p class="mt-4 text-sm text-muted-foreground">
          Select a member to transfer ownership to. You will become an admin after the transfer.
        </p>

        <div class="mt-4 space-y-2">
          <label class="text-sm font-medium text-foreground">Select new owner</label>
          <select
            v-model="transferEmail"
            class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
          >
            <option value="">Choose a member...</option>
            <option v-for="member in members" :key="member.id" :value="member.email">
              {{ member.name }} ({{ member.email }})
            </option>
          </select>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="showTransferModal = false"
          >
            Cancel
          </button>
          <button
            :disabled="!transferEmail"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            @click="confirmTransfer"
          >
            Transfer Ownership
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
