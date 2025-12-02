<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ref, computed } from 'vue'

export type ShareItemType = 'workflow' | 'folder' | 'asset' | 'model' | 'project'
export type Permission = 'view' | 'edit' | 'duplicate' | 'join'

interface SharedUser {
  id: string
  name: string
  email: string
  avatar?: string
  permission: Permission
}

interface Props {
  open: boolean
  itemType: ShareItemType
  itemName: string
  itemId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  share: [users: SharedUser[], linkAccess: Permission | null]
}>()

const searchQuery = ref('')
const linkCopied = ref(false)
const linkAccessOpen = ref(false)
const linkAccess = ref<Permission | null>(null)

// Mock users for search
const availableUsers = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '/assets/avatars/avatar-1.jpg' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com', avatar: '/assets/avatars/avatar-2.jpg' },
  { id: 'user-3', name: 'Carol Williams', email: 'carol@example.com' },
  { id: 'user-4', name: 'David Brown', email: 'david@example.com' },
  { id: 'user-5', name: 'Eve Davis', email: 'eve@example.com', avatar: '/assets/avatars/avatar-3.jpg' },
]

const sharedUsers = ref<SharedUser[]>([
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '/assets/avatars/avatar-1.jpg', permission: 'edit' },
])

const permissions: { value: Permission; label: string; description: string; icon: string }[] = [
  { value: 'view', label: 'Can view', description: 'View only, no changes allowed', icon: 'eye' },
  { value: 'edit', label: 'Can edit', description: 'Make changes to this item', icon: 'pencil' },
  { value: 'duplicate', label: 'Can duplicate', description: 'Create a copy of this item', icon: 'copy' },
  { value: 'join', label: 'Can join', description: 'Join and collaborate on project', icon: 'user-plus' },
]

const availablePermissions = computed(() => {
  if (props.itemType === 'project') {
    return permissions
  }
  // For non-project items, exclude 'join' permission
  return permissions.filter(p => p.value !== 'join')
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return availableUsers.filter(
    user =>
      !sharedUsers.value.some(s => s.id === user.id) &&
      (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
  )
})

function addUser(user: typeof availableUsers[0]) {
  sharedUsers.value.push({
    ...user,
    permission: 'view'
  })
  searchQuery.value = ''
}

function removeUser(userId: string) {
  sharedUsers.value = sharedUsers.value.filter(u => u.id !== userId)
}

function updatePermission(userId: string, permission: Permission) {
  const user = sharedUsers.value.find(u => u.id === userId)
  if (user) {
    user.permission = permission
  }
}

function copyLink() {
  const url = `${window.location.origin}/share/${props.itemType}/${props.itemId}`
  navigator.clipboard.writeText(url)
  linkCopied.value = true
  setTimeout(() => {
    linkCopied.value = false
  }, 2000)
}

function handleShare() {
  emit('share', sharedUsers.value, linkAccess.value)
  emit('update:open', false)
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getPermissionLabel(permission: Permission): string {
  return permissions.find(p => p.value === permission)?.label || permission
}

function getItemTypeLabel(type: ShareItemType): string {
  const labels: Record<ShareItemType, string> = {
    workflow: 'workflow',
    folder: 'folder',
    asset: 'asset',
    model: 'model',
    project: 'project',
  }
  return labels[type]
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Icon name="share" size="md" class="text-zinc-500" />
          Share {{ itemName }}
        </DialogTitle>
        <DialogDescription>
          Share this {{ getItemTypeLabel(itemType) }} with others
        </DialogDescription>
      </DialogHeader>

      <div class="mt-4 space-y-4">
        <!-- Search Users -->
        <div class="relative">
          <Icon name="search" size="sm" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Add people by name or email..."
            class="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-foreground dark:placeholder-zinc-500"
          />
          <!-- Search Results Dropdown -->
          <div
            v-if="filteredUsers.length > 0"
            class="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          >
            <button
              v-for="user in filteredUsers"
              :key="user.id"
              class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700"
              @click="addUser(user)"
            >
              <div
                v-if="user.avatar"
                class="h-8 w-8 shrink-0 overflow-hidden rounded-full"
              >
                <img :src="user.avatar" :alt="user.name" class="h-full w-full object-cover" />
              </div>
              <div
                v-else
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
              >
                {{ getInitials(user.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ user.name }}</p>
                <p class="truncate text-xs text-zinc-500 dark:text-zinc-400">{{ user.email }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Shared Users List -->
        <div v-if="sharedUsers.length > 0" class="space-y-2">
          <p class="text-xs font-medium text-zinc-500 dark:text-zinc-400">People with access</p>
          <div class="max-h-48 space-y-1 overflow-auto">
            <div
              v-for="user in sharedUsers"
              :key="user.id"
              class="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div
                v-if="user.avatar"
                class="h-8 w-8 shrink-0 overflow-hidden rounded-full"
              >
                <img :src="user.avatar" :alt="user.name" class="h-full w-full object-cover" />
              </div>
              <div
                v-else
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
              >
                {{ getInitials(user.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ user.name }}</p>
                <p class="truncate text-xs text-zinc-500 dark:text-zinc-400">{{ user.email }}</p>
              </div>
              <!-- Permission Dropdown -->
              <Popover>
                <PopoverTrigger as-child>
                  <button class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700">
                    {{ getPermissionLabel(user.permission) }}
                    <Icon name="chevron-down" size="xs" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" :side-offset="4" class="w-48 p-1">
                  <button
                    v-for="perm in availablePermissions"
                    :key="perm.value"
                    class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    :class="user.permission === perm.value ? 'bg-zinc-100 dark:bg-zinc-800' : ''"
                    @click="updatePermission(user.id, perm.value)"
                  >
                    <Icon :name="perm.icon" size="sm" class="text-zinc-400" />
                    <div>
                      <p class="font-medium text-zinc-700 dark:text-zinc-300">{{ perm.label }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-500">{{ perm.description }}</p>
                    </div>
                  </button>
                  <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
                  <button
                    class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    @click="removeUser(user.id)"
                  >
                    <Icon name="trash" size="sm" />
                    Remove access
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <!-- Link Sharing -->
        <div class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                <Icon name="link" size="sm" class="text-zinc-500 dark:text-zinc-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-zinc-900 dark:text-foreground">Share link</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">
                  {{ linkAccess ? `Anyone with link can ${linkAccess}` : 'Link sharing off' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <!-- Link Access Dropdown -->
              <Popover v-model:open="linkAccessOpen">
                <PopoverTrigger as-child>
                  <button class="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600">
                    {{ linkAccess ? getPermissionLabel(linkAccess) : 'Off' }}
                    <Icon name="chevron-down" size="xs" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" :side-offset="4" class="w-48 p-1">
                  <button
                    class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    :class="linkAccess === null ? 'bg-zinc-100 dark:bg-zinc-800' : ''"
                    @click="linkAccess = null; linkAccessOpen = false"
                  >
                    <Icon name="lock" size="sm" class="text-zinc-400" />
                    <div>
                      <p class="font-medium text-zinc-700 dark:text-zinc-300">Off</p>
                      <p class="text-xs text-zinc-500">Only invited people</p>
                    </div>
                  </button>
                  <button
                    v-for="perm in availablePermissions"
                    :key="perm.value"
                    class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    :class="linkAccess === perm.value ? 'bg-zinc-100 dark:bg-zinc-800' : ''"
                    @click="linkAccess = perm.value; linkAccessOpen = false"
                  >
                    <Icon :name="perm.icon" size="sm" class="text-zinc-400" />
                    <div>
                      <p class="font-medium text-zinc-700 dark:text-zinc-300">{{ perm.label }}</p>
                      <p class="text-xs text-zinc-500">{{ perm.description }}</p>
                    </div>
                  </button>
                </PopoverContent>
              </Popover>
              <!-- Copy Link Button -->
              <button
                class="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200"
                :class="linkCopied ? 'border-green-500 bg-green-50 text-green-600 dark:border-green-500 dark:bg-green-500/10 dark:text-green-400' : ''"
                title="Copy link"
                @click="copyLink"
              >
                <Icon :name="linkCopied ? 'check' : 'copy'" size="sm" />
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            @click="emit('update:open', false)"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            @click="handleShare"
          >
            Done
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
