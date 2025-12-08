<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { ref, computed, watch } from 'vue'
import { useShareStore } from '@/stores/shareStore'
import type { ShareAccessMode, ShareableUser } from '@/types/workflowShare'
import { ACCESS_MODE_LABELS, getAccessModeBadgeColor } from '@/types/workflowShare'

interface Props {
  visible: boolean
  workflowName?: string
  workflowId?: string
}

const props = withDefaults(defineProps<Props>(), {
  workflowName: 'Workflow',
  workflowId: 'workflow-editor-current',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const shareStore = useShareStore()

// State
const searchQuery = ref('')
const linkCopied = ref(false)
const accessMode = ref<ShareAccessMode>('linear')
const searchResults = ref<ShareableUser[]>([])

// Get existing shares for this workflow
const existingShares = computed(() => shareStore.getWorkflowShares(props.workflowId))

// Get existing share link for this workflow
const shareLink = computed(() => shareStore.getShareLink(props.workflowId))

// Access mode options
const accessModes: ShareAccessMode[] = ['linear', 'workflow', 'both']

// Initialize state when dialog opens
watch(() => props.visible, (isOpen) => {
  if (isOpen) {
    const settings = shareStore.getShareSettings(props.workflowId)
    accessMode.value = settings.accessMode
    searchQuery.value = ''
    searchResults.value = []
    linkCopied.value = false
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

// Update access mode for all shares when changed
watch(accessMode, (newMode) => {
  shareStore.updateWorkflowAccessMode(props.workflowId, newMode)
})

function addUser(user: ShareableUser) {
  shareStore.shareWorkflow(props.workflowId, {
    userIds: [user.id],
    accessMode: accessMode.value,
  })
  searchQuery.value = ''
  searchResults.value = []
}

function removeShare(shareId: string) {
  shareStore.removeShare(props.workflowId, shareId)
}

function generateOrCopyLink() {
  if (!shareLink.value) {
    shareStore.createShareLink(props.workflowId, accessMode.value)
  }
  copyLink()
}

async function copyLink() {
  const success = await shareStore.copyShareLink(props.workflowId)
  if (success) {
    linkCopied.value = true
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
</script>

<template>
  <Dialog v-model:open="dialogVisible">
    <DialogContent class="max-w-[480px] gap-0 overflow-hidden p-0">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <h2 class="text-base font-semibold text-zinc-900 dark:text-foreground">
          Share "{{ workflowName }}"
        </h2>
        <button
          class="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          @click="dialogVisible = false"
        >
          <Icon name="x" size="sm" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Access Mode Tabs -->
        <div class="mb-4">
          <div class="inline-flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
            <button
              v-for="mode in accessModes"
              :key="mode"
              class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
              :class="accessMode === mode
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-foreground'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'"
              @click="accessMode = mode"
            >
              {{ ACCESS_MODE_LABELS[mode] }}
            </button>
          </div>
        </div>

        <!-- Invite Input -->
        <div class="relative mb-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Invite by name or email"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-foreground dark:placeholder-zinc-500 dark:focus:border-blue-400"
          />
          <!-- Search Dropdown -->
          <div
            v-if="searchResults.length > 0"
            class="absolute left-0 right-0 top-full z-10 mt-1 max-h-52 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
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

        <!-- People with Access -->
        <div v-if="existingShares.length > 0" class="mb-4">
          <p class="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            People with access
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
              <span
                class="rounded px-1.5 py-0.5 text-[10px] font-medium"
                :class="getAccessModeBadgeColor(share.accessMode)"
              >
                {{ ACCESS_MODE_LABELS[share.accessMode] }}
              </span>
              <button
                class="flex h-6 w-6 items-center justify-center rounded text-zinc-400 opacity-0 transition-all hover:bg-zinc-200 hover:text-zinc-600 group-hover:opacity-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                title="Remove"
                @click="removeShare(share.id)"
              >
                <Icon name="x" size="xs" />
              </button>
            </div>
          </div>
        </div>

        <!-- Copy Link Section -->
        <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-700">
            <Icon name="link" size="sm" class="text-zinc-500 dark:text-zinc-400" />
          </div>
          <div class="min-w-0 flex-1">
            <p v-if="shareLink" class="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {{ formatShareLink(shareLink.code) }}
            </p>
            <p v-else class="text-xs text-zinc-500 dark:text-zinc-400">
              Anyone with the link can view
            </p>
          </div>
          <button
            class="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
            :class="linkCopied
              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'"
            @click="generateOrCopyLink"
          >
            {{ linkCopied ? 'Copied!' : 'Copy link' }}
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
