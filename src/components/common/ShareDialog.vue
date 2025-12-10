<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ref, computed, watch } from 'vue'
import { useShareStore } from '@/stores/shareStore'
import { posthog } from '@/plugins/posthog'
import type { ShareableUser } from '@/types/workflowShare'

export type ShareItemType = 'workflow' | 'folder' | 'asset' | 'model' | 'project'
export type SharePermission = 'view' | 'fork'

const PERMISSION_LABELS: Record<SharePermission, string> = {
  view: 'View only',
  fork: 'Can fork',
}

interface Props {
  open: boolean
  itemType: ShareItemType
  itemName: string
  itemId: string
  /** Development phase: 1=link only, 2=+email invites, 3=+share management */
  phase?: 1 | 2 | 3
}

const props = withDefaults(defineProps<Props>(), {
  phase: 3 // Default to full features
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const shareStore = useShareStore()

// State
const searchQuery = ref('')
const linkCopied = ref(false)
const searchResults = ref<ShareableUser[]>([])
const selectedPermission = ref<SharePermission>('view')
const linkPermission = ref<SharePermission>('view')
const sharedContentExpanded = ref(false)
const confirmShareAssets = ref(false)

// Mock data for shared content (in real app, this would come from workflow analysis)
const sharedContent = ref({
  models: [
    { name: 'SDXL Base 1.0', size: '6.94 GB', type: 'Checkpoint', included: true },
    { name: 'SDXL VAE', size: '335 MB', type: 'VAE', included: true },
    { name: 'ControlNet Canny', size: '1.45 GB', type: 'ControlNet', included: true },
  ],
  files: [
    { name: 'input_portrait.png', size: '2.4 MB', type: 'Image', included: true },
    { name: 'style_reference.jpg', size: '856 KB', type: 'Image', included: true },
  ],
})

// Count of included items
const includedItemsCount = computed(() => {
  return sharedContent.value.models.filter(m => m.included).length +
         sharedContent.value.files.filter(f => f.included).length
})

const totalItemsCount = computed(() => {
  return sharedContent.value.models.length + sharedContent.value.files.length
})

// Get existing shares for this workflow
const existingShares = computed(() => shareStore.getWorkflowShares(props.itemId))

// Get existing share link for this workflow
const shareLink = computed(() => shareStore.getShareLink(props.itemId))

// Initialize state when dialog opens
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
    searchResults.value = []
    linkCopied.value = false

    // Track for PostHog surveys
    posthog.capture('share_dialog_opened', {
      item_type: props.itemType,
      phase: props.phase,
    })
  }
})

// Search users when query changes
watch(searchQuery, (query) => {
  if (query.length < 2) {
    searchResults.value = []
    return
  }
  const excludeIds = existingShares.value.map(s => s.sharedWith)
  searchResults.value = shareStore.searchUsers(query, excludeIds)
})

function addUser(user: ShareableUser) {
  shareStore.shareWorkflow(props.itemId, {
    userIds: [user.id],
    accessMode: selectedPermission.value === 'fork' ? 'both' : 'linear',
  })
  searchQuery.value = ''
  searchResults.value = []
}

function inviteByEmail() {
  // If there's a matching user in search results, add them
  if (searchResults.value.length > 0) {
    addUser(searchResults.value[0])
    return
  }

  // Otherwise, treat as email invite (in real app, would send email)
  const email = searchQuery.value.trim()
  if (email && email.includes('@')) {
    // Create invite using the email address
    shareStore.shareWorkflow(props.itemId, {
      userIds: [email],
      accessMode: selectedPermission.value === 'fork' ? 'both' : 'linear',
    })
    searchQuery.value = ''
    searchResults.value = []
  }
}

function removeShare(shareId: string) {
  shareStore.removeShare(props.itemId, shareId)
}

function updateSharePermission(shareId: string, permission: SharePermission) {
  // TODO: Implement in shareStore
  console.log('Update permission:', shareId, permission)
}

function generateOrCopyLink() {
  if (!shareLink.value) {
    shareStore.createShareLink(props.itemId, linkPermission.value === 'fork' ? 'both' : 'linear')
  }
  copyLink()
}

async function copyLink() {
  const success = await shareStore.copyShareLink(props.itemId)
  if (success) {
    linkCopied.value = true

    // Track link copy for PostHog
    posthog.capture('share_link_copied', {
      item_type: props.itemType,
      permission: linkPermission.value,
      included_items: includedItemsCount.value,
    })

    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatShareLink(code: string): string {
  return `${window.location.origin}/shared/${code}`
}

// Convert accessMode to permission label
function getPermissionFromAccessMode(accessMode: string): SharePermission {
  return accessMode === 'both' ? 'fork' : 'view'
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-[480px] gap-0 p-0">
      <!-- Header -->
      <div class="flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <h2 class="text-base font-semibold text-zinc-900 dark:text-foreground">
          Share "{{ itemName }}"
        </h2>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Invite Input (Phase 2+) -->
        <div v-if="props.phase >= 2" class="relative mb-3 flex gap-2">
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Invite by name or email"
              class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-foreground dark:placeholder-zinc-500 dark:focus:border-blue-400"
            />
            <!-- Search Dropdown -->
            <div
              v-if="searchResults.length > 0"
              class="absolute left-0 right-0 top-full z-[60] mt-1 max-h-52 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
            >
              <button
                v-for="user in searchResults"
                :key="user.id"
                class="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                @click="addUser(user)"
              >
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="h-7 w-7 rounded-full object-cover"
                />
                <div
                  v-else
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-[10px] font-medium text-white"
                >
                  {{ getInitials(user.name) }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-zinc-900 dark:text-foreground">{{ user.name }}</p>
                  <p class="truncate text-xs text-zinc-500">{{ user.email }}</p>
                </div>
              </button>
            </div>
          </div>
          <!-- Invite Button -->
          <button
            class="shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            :class="searchQuery.length >= 2
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'"
            :disabled="searchQuery.length < 2"
            @click="inviteByEmail"
          >
            Invite
          </button>
        </div>

        <!-- People with Access (Phase 2+) -->
        <div v-if="props.phase >= 2 && existingShares.length > 0" class="mb-4">
          <p class="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {{ props.phase === 2 ? 'Invited' : 'People with access' }}
          </p>
          <div class="space-y-0.5">
            <div
              v-for="share in existingShares"
              :key="share.id"
              class="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <img
                v-if="share.user.avatar"
                :src="share.user.avatar"
                :alt="share.user.name"
                class="h-7 w-7 rounded-full object-cover"
              />
              <div
                v-else
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-[10px] font-medium text-white"
              >
                {{ getInitials(share.user.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm text-zinc-900 dark:text-foreground">{{ share.user.name }}</p>
              </div>
              <!-- Phase 2: Simple remove button -->
              <button
                v-if="props.phase === 2"
                class="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                @click="removeShare(share.id)"
              >
                <Icon name="x" size="xs" />
              </button>
              <!-- Phase 3: Permission dropdown for existing share -->
              <DropdownMenu v-else>
                <DropdownMenuTrigger as-child>
                  <button
                    class="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  >
                    {{ PERMISSION_LABELS[getPermissionFromAccessMode(share.accessMode)] }}
                    <Icon name="chevron-down" size="xs" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="z-[70]">
                  <DropdownMenuItem @click="updateSharePermission(share.id, 'view')">
                    <div class="flex flex-col">
                      <span class="font-medium">View only</span>
                      <span class="text-xs text-zinc-500">Can view but not copy</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="updateSharePermission(share.id, 'fork')">
                    <div class="flex flex-col">
                      <span class="font-medium">Can fork</span>
                      <span class="text-xs text-zinc-500">Can view and make a copy</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem class="text-red-600 dark:text-red-400" @click="removeShare(share.id)">
                    Remove access
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <!-- What's Being Shared (All phases) - Collapsible -->
        <div class="mb-3 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
          <!-- Header - Clickable -->
          <button
            class="flex w-full items-center justify-between px-3 py-2.5"
            @click="sharedContentExpanded = !sharedContentExpanded"
          >
            <div class="flex items-center gap-2">
              <Icon name="archive" size="sm" class="text-zinc-500" />
              <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">What's included in this share</span>
              <span class="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300">
                {{ props.phase === 1 ? totalItemsCount : `${includedItemsCount}/${totalItemsCount}` }} items
              </span>
            </div>
            <Icon
              name="chevron-down"
              size="sm"
              class="text-zinc-400 transition-transform"
              :class="{ 'rotate-180': sharedContentExpanded }"
            />
          </button>

          <!-- Expandable Content -->
          <div v-if="sharedContentExpanded" class="border-t border-zinc-200 px-3 py-2 dark:border-zinc-700">
            <!-- Models -->
            <div class="mb-2">
              <p class="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                Models ({{ props.phase === 1 ? sharedContent.models.length : `${sharedContent.models.filter(m => m.included).length}/${sharedContent.models.length}` }})
              </p>
              <div class="space-y-0.5">
                <!-- Phase 1: Read-only view -->
                <div
                  v-if="props.phase === 1"
                  v-for="model in sharedContent.models"
                  :key="model.name"
                  class="flex items-center justify-between px-2 py-1"
                >
                  <div class="flex items-center gap-2">
                    <Icon name="box" size="xs" class="text-purple-500" />
                    <span class="text-xs text-zinc-700 dark:text-zinc-300">{{ model.name }}</span>
                  </div>
                  <span class="text-[10px] text-zinc-400">{{ model.size }}</span>
                </div>
                <!-- Phase 2+: With checkboxes -->
                <label
                  v-else
                  v-for="model in sharedContent.models"
                  :key="model.name"
                  class="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                >
                  <div class="flex items-center gap-2">
                    <input
                      v-model="model.included"
                      type="checkbox"
                      class="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                    />
                    <Icon name="box" size="xs" class="text-purple-500" />
                    <span class="text-xs text-zinc-700 dark:text-zinc-300" :class="{ 'text-zinc-400 line-through': !model.included }">{{ model.name }}</span>
                  </div>
                  <span class="text-[10px] text-zinc-400">{{ model.size }}</span>
                </label>
              </div>
            </div>

            <!-- Files -->
            <div>
              <p class="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                Imported Files ({{ props.phase === 1 ? sharedContent.files.length : `${sharedContent.files.filter(f => f.included).length}/${sharedContent.files.length}` }})
              </p>
              <div class="space-y-0.5">
                <!-- Phase 1: Read-only view -->
                <div
                  v-if="props.phase === 1"
                  v-for="file in sharedContent.files"
                  :key="file.name"
                  class="flex items-center justify-between px-2 py-1"
                >
                  <div class="flex items-center gap-2">
                    <Icon name="image" size="xs" class="text-green-500" />
                    <span class="text-xs text-zinc-700 dark:text-zinc-300">{{ file.name }}</span>
                  </div>
                  <span class="text-[10px] text-zinc-400">{{ file.size }}</span>
                </div>
                <!-- Phase 2+: With checkboxes -->
                <label
                  v-else
                  v-for="file in sharedContent.files"
                  :key="file.name"
                  class="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                >
                  <div class="flex items-center gap-2">
                    <input
                      v-model="file.included"
                      type="checkbox"
                      class="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                    />
                    <Icon name="image" size="xs" class="text-green-500" />
                    <span class="text-xs text-zinc-700 dark:text-zinc-300" :class="{ 'text-zinc-400 line-through': !file.included }">{{ file.name }}</span>
                  </div>
                  <span class="text-[10px] text-zinc-400">{{ file.size }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Confirmation Checkbox -->
          <div class="border-t border-zinc-200 px-3 py-2.5 dark:border-zinc-700">
            <label class="flex cursor-pointer items-start gap-2">
              <input
                v-model="confirmShareAssets"
                type="checkbox"
                class="mt-0.5 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
              />
              <span class="text-xs text-zinc-600 dark:text-zinc-400">
                {{ props.phase === 1
                  ? 'I allow sharing these models and files via link'
                  : 'I allow these models and files to be forked by users with access to this link'
                }}
              </span>
            </label>
          </div>
        </div>

        <!-- Copy Link Section -->
        <div class="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-700">
              <Icon name="link" size="sm" class="text-zinc-500 dark:text-zinc-400" />
            </div>
            <div class="overflow-hidden">
              <p v-if="shareLink" class="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {{ formatShareLink(shareLink.code) }}
              </p>
              <p v-else class="text-xs text-zinc-500 dark:text-zinc-400">
                Anyone with the link
              </p>
            </div>
            <button
              class="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all"
              :class="linkCopied
                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                : confirmShareAssets
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                  : 'cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-500'"
              :disabled="!confirmShareAssets && !linkCopied"
              @click="generateOrCopyLink"
            >
              {{ linkCopied ? 'Copied!' : 'Copy link' }}
            </button>
          </div>
          <!-- Link permission selector -->
          <div class="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">Link access</span>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  class="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-600 transition-colors hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  {{ PERMISSION_LABELS[linkPermission] }}
                  <Icon name="chevron-down" size="xs" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="z-[70]">
                <DropdownMenuItem @click="linkPermission = 'view'">
                  <div class="flex flex-col">
                    <span class="font-medium">View only</span>
                    <span class="text-xs text-zinc-500">Can view but not copy</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem @click="linkPermission = 'fork'">
                  <div class="flex flex-col">
                    <span class="font-medium">Can fork</span>
                    <span class="text-xs text-zinc-500">Can view and make a copy</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
