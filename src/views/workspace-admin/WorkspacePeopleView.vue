<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { PageBreadcrumb } from '@/components/workspace'
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getRoleLabel, getRoleBadgeColor, type WorkspaceRole } from '@/types/workspace'

const workspaceStore = useWorkspaceStore()
const currentWorkspace = computed(() => workspaceStore.currentWorkspace)
const isAdmin = computed(() => workspaceStore.isAdmin)

const breadcrumbItems = computed(() => [
  { label: '', icon: 'home', to: '/workspace' },
  { label: currentWorkspace.value?.name || 'Workspace', icon: 'users', to: '/workspace/manage' },
  { label: 'People' }
])

// Tabs
type Tab = 'members' | 'pending'
const activeTab = ref<Tab>('members')

// Search and filter
const searchQuery = ref('')
const roleFilter = ref<WorkspaceRole | 'all'>('all')

// Invite state
const showInviteModal = ref(false)
const inviteEmail = ref('')
const inviteRole = ref<Exclude<WorkspaceRole, 'owner'>>('member')

// Mock members data
interface Member {
  id: string
  name: string
  email: string
  role: WorkspaceRole
  avatar?: string
  status: 'active' | 'inactive'
  lastActive: string
  joinedAt: string
}

interface PendingInvite {
  id: string
  email: string
  role: Exclude<WorkspaceRole, 'owner'>
  invitedBy: string
  invitedAt: string
  expiresAt: string
}

const members = ref<Member[]>([
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner', status: 'active', lastActive: 'Now', joinedAt: '3 months ago' },
  { id: '2', name: 'Alice Chen', email: 'alice@example.com', role: 'admin', status: 'active', lastActive: '2 hours ago', joinedAt: '2 months ago' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'member', status: 'active', lastActive: '1 day ago', joinedAt: '1 month ago' },
  { id: '4', name: 'Carol Smith', email: 'carol@example.com', role: 'member', status: 'inactive', lastActive: '1 week ago', joinedAt: '3 weeks ago' },
  { id: '5', name: 'David Lee', email: 'david@example.com', role: 'viewer', status: 'active', lastActive: '3 hours ago', joinedAt: '2 weeks ago' },
])

const pendingInvites = ref<PendingInvite[]>([
  { id: 'p1', email: 'newuser@example.com', role: 'member', invitedBy: 'John Doe', invitedAt: '2 days ago', expiresAt: '5 days' },
  { id: 'p2', email: 'designer@example.com', role: 'viewer', invitedBy: 'Alice Chen', invitedAt: '1 day ago', expiresAt: '6 days' },
])

const filteredMembers = computed(() => {
  let result = members.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value !== 'all') {
    result = result.filter(m => m.role === roleFilter.value)
  }

  return result
})

function sendInvite() {
  if (inviteEmail.value) {
    pendingInvites.value.push({
      id: `p${Date.now()}`,
      email: inviteEmail.value,
      role: inviteRole.value,
      invitedBy: 'You',
      invitedAt: 'Just now',
      expiresAt: '7 days',
    })
    inviteEmail.value = ''
    showInviteModal.value = false
  }
}

function cancelInvite(id: string) {
  pendingInvites.value = pendingInvites.value.filter(i => i.id !== id)
}

function resendInvite(id: string) {
  const invite = pendingInvites.value.find(i => i.id === id)
  if (invite) {
    invite.invitedAt = 'Just now'
    invite.expiresAt = '7 days'
  }
}

function updateMemberRole(memberId: string, role: WorkspaceRole) {
  const member = members.value.find(m => m.id === memberId)
  if (member && role !== 'owner') {
    member.role = role
  }
}

function removeMember(memberId: string) {
  if (confirm('Are you sure you want to remove this member?')) {
    members.value = members.value.filter(m => m.id !== memberId)
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
      <button
        class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'members' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'members'"
      >
        <Icon name="users" size="sm" />
        Members
        <span class="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">{{ members.length }}</span>
      </button>
      <button
        class="flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'pending' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'pending'"
      >
        <Icon name="envelope" size="sm" />
        Pending Invites
        <span v-if="pendingInvites.length > 0" class="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {{ pendingInvites.length }}
        </span>
      </button>
    </div>

    <!-- Members Tab -->
    <div v-if="activeTab === 'members'">
      <!-- Filters -->
      <div class="mb-4 flex items-center gap-3">
        <div class="relative flex-1">
          <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search members..."
            class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          v-model="roleFilter"
          class="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
        >
          <option value="all">All roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <!-- Members List -->
      <div>
        <!-- Table Header -->
        <div class="flex items-center gap-4 border-b border-border px-1 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div class="flex-1">User</div>
          <div class="w-24">Role</div>
          <div class="w-24">Status</div>
          <div class="w-28">Last Active</div>
          <div class="w-32 text-right">Actions</div>
        </div>

        <!-- Members Items -->
        <div class="divide-y divide-border">
          <div
            v-for="member in filteredMembers"
            :key="member.id"
            class="flex items-center gap-4 px-1 py-4 transition-colors hover:bg-muted/30"
          >
            <!-- User -->
            <div class="flex flex-1 items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="h-full w-full rounded-full object-cover" />
                <Icon v-else name="user" size="sm" />
              </div>
              <div>
                <p class="font-medium text-foreground">{{ member.name }}</p>
                <p class="text-xs text-muted-foreground">{{ member.email }}</p>
              </div>
            </div>

            <!-- Role -->
            <div class="w-24">
              <span :class="['rounded-md px-2 py-1 text-xs font-medium', getRoleBadgeColor(member.role)]">
                {{ getRoleLabel(member.role) }}
              </span>
            </div>

            <!-- Status -->
            <div class="w-24">
              <span :class="[
                'inline-flex items-center gap-1.5 text-xs',
                member.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
              ]">
                <span :class="[
                  'h-1.5 w-1.5 rounded-full',
                  member.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'
                ]" />
                {{ member.status === 'active' ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <!-- Last Active -->
            <div class="w-28 text-sm text-muted-foreground">
              {{ member.lastActive }}
            </div>

            <!-- Actions -->
            <div class="w-32">
              <div v-if="isAdmin && member.role !== 'owner'" class="flex items-center justify-end gap-2">
                <select
                  :value="member.role"
                  class="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  @change="(e) => updateMemberRole(member.id, (e.target as HTMLSelectElement).value as WorkspaceRole)"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Remove member"
                  @click="removeMember(member.id)"
                >
                  <Icon name="trash" size="sm" />
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredMembers.length === 0" class="py-12 text-center">
            <Icon name="users" size="xl" class="mx-auto text-muted-foreground/50" />
            <p class="mt-4 text-sm text-muted-foreground">No members found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Invites Tab -->
    <div v-if="activeTab === 'pending'">
      <div v-if="pendingInvites.length > 0">
        <!-- Table Header -->
        <div class="flex items-center gap-4 border-b border-border px-1 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div class="flex-1">Email</div>
          <div class="w-24">Role</div>
          <div class="w-28">Invited By</div>
          <div class="w-24">Expires In</div>
          <div class="w-32 text-right">Actions</div>
        </div>

        <!-- Invites List -->
        <div class="divide-y divide-border">
          <div
            v-for="invite in pendingInvites"
            :key="invite.id"
            class="flex items-center gap-4 px-1 py-4 transition-colors hover:bg-muted/30"
          >
            <!-- Email -->
            <div class="flex flex-1 items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Icon name="envelope" size="sm" class="text-muted-foreground" />
              </div>
              <span class="font-medium text-foreground">{{ invite.email }}</span>
            </div>

            <!-- Role -->
            <div class="w-24">
              <span :class="['rounded-md px-2 py-1 text-xs font-medium', getRoleBadgeColor(invite.role)]">
                {{ getRoleLabel(invite.role) }}
              </span>
            </div>

            <!-- Invited By -->
            <div class="w-28 text-sm text-muted-foreground">
              {{ invite.invitedBy }}
            </div>

            <!-- Expires In -->
            <div class="w-24 text-sm text-muted-foreground">
              {{ invite.expiresAt }}
            </div>

            <!-- Actions -->
            <div class="flex w-32 items-center justify-end gap-2">
              <button
                class="rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                @click="resendInvite(invite.id)"
              >
                Resend
              </button>
              <button
                class="rounded-lg px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                @click="cancelInvite(invite.id)"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center">
        <Icon name="envelope" size="xl" class="mx-auto text-muted-foreground/50" />
        <p class="mt-4 text-sm text-muted-foreground">No pending invites</p>
        <button
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          @click="showInviteModal = true"
        >
          <Icon name="user-plus" size="sm" />
          Invite People
        </button>
      </div>
    </div>

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
