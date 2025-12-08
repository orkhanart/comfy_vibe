<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'
import { getRoleLabel, getRoleBadgeColor, type WorkspaceRole } from '@/types/workspace'

// Invite state
const showInviteModal = ref(false)
const inviteEmail = ref('')
const inviteRole = ref<Exclude<WorkspaceRole, 'owner'>>('member')

interface PendingInvite {
  id: string
  email: string
  role: Exclude<WorkspaceRole, 'owner'>
  invitedBy: string
  invitedAt: string
  expiresAt: string
}

const pendingInvites = ref<PendingInvite[]>([
  { id: 'p1', email: 'newuser@example.com', role: 'member', invitedBy: 'John Doe', invitedAt: '2 days ago', expiresAt: '5 days' },
  { id: 'p2', email: 'designer@example.com', role: 'viewer', invitedBy: 'Alice Chen', invitedAt: '1 day ago', expiresAt: '6 days' },
])

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
</script>

<template>
  <div>
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
