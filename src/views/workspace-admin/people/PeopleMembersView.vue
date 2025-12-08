<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { getRoleLabel, getRoleBadgeColor, type WorkspaceRole } from '@/types/workspace'

const workspaceStore = useWorkspaceStore()
const isAdmin = computed(() => workspaceStore.isAdmin)

// Search and filter
const searchQuery = ref('')
const roleFilter = ref<WorkspaceRole | 'all'>('all')

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

const members = ref<Member[]>([
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner', status: 'active', lastActive: 'Now', joinedAt: '3 months ago' },
  { id: '2', name: 'Alice Chen', email: 'alice@example.com', role: 'admin', status: 'active', lastActive: '2 hours ago', joinedAt: '2 months ago' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'member', status: 'active', lastActive: '1 day ago', joinedAt: '1 month ago' },
  { id: '4', name: 'Carol Smith', email: 'carol@example.com', role: 'member', status: 'inactive', lastActive: '1 week ago', joinedAt: '3 weeks ago' },
  { id: '5', name: 'David Lee', email: 'david@example.com', role: 'viewer', status: 'active', lastActive: '3 hours ago', joinedAt: '2 weeks ago' },
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
  <div>
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
</template>
