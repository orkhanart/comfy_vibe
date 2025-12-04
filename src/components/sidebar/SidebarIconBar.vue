<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useUiStore, SIDEBAR_TABS, type SidebarTabId, type SidebarShortcut } from '@/stores/uiStore'

const uiStore = useUiStore()
const activeSidebarTab = computed(() => uiStore.activeSidebarTab)
const sidebarShortcuts = computed(() => uiStore.sidebarShortcuts)

const isDragOver = ref(false)
const isGlobalDragging = ref(false)

// Global drag tracking to show drop zone hint
function handleGlobalDragStart(): void {
  console.log('[Shortcut] Global drag started')
  isGlobalDragging.value = true
}

function handleGlobalDragEnd(): void {
  console.log('[Shortcut] Global drag ended')
  isGlobalDragging.value = false
  isDragOver.value = false
}

onMounted(() => {
  document.addEventListener('dragstart', handleGlobalDragStart)
  document.addEventListener('dragend', handleGlobalDragEnd)
})

onUnmounted(() => {
  document.removeEventListener('dragstart', handleGlobalDragStart)
  document.removeEventListener('dragend', handleGlobalDragEnd)
})


function handleTabClick(tabId: Exclude<SidebarTabId, null>): void {
  uiStore.toggleSidebarTab(tabId)
}

function handleShortcutClick(shortcut: SidebarShortcut): void {
  uiStore.openShortcut(shortcut)
}

function handleShortcutRemove(e: MouseEvent, shortcutId: string): void {
  e.stopPropagation()
  uiStore.removeSidebarShortcut(shortcutId)
}

// Reordering state
const draggedShortcutIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)

function handleShortcutDragStart(e: DragEvent, index: number): void {
  e.stopPropagation()
  draggedShortcutIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', 'reorder')
  }
}

function handleShortcutDragOver(e: DragEvent, index: number): void {
  e.preventDefault()
  e.stopPropagation()
  if (draggedShortcutIndex.value !== null && draggedShortcutIndex.value !== index) {
    dropTargetIndex.value = index
  }
}

function handleShortcutDragLeave(): void {
  dropTargetIndex.value = null
}

function handleShortcutDrop(e: DragEvent, index: number): void {
  e.preventDefault()
  e.stopPropagation()
  if (draggedShortcutIndex.value !== null && draggedShortcutIndex.value !== index) {
    uiStore.reorderSidebarShortcuts(draggedShortcutIndex.value, index)
  }
  draggedShortcutIndex.value = null
  dropTargetIndex.value = null
}

function handleShortcutDragEnd(): void {
  draggedShortcutIndex.value = null
  dropTargetIndex.value = null
}

// Drag and drop handlers for shortcuts area
const dropZoneRef = ref<HTMLElement | null>(null)

function handleDragEnter(e: DragEvent): void {
  e.preventDefault()
  e.stopPropagation()
  console.log('[Shortcut] Drag enter, types:', e.dataTransfer?.types)
  isDragOver.value = true
}

function handleDragOver(e: DragEvent): void {
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
  isDragOver.value = true
}

function handleDragLeave(e: DragEvent): void {
  e.preventDefault()
  e.stopPropagation()
  // Only set to false if we're leaving the drop zone entirely
  const relatedTarget = e.relatedTarget as HTMLElement | null
  if (!dropZoneRef.value?.contains(relatedTarget)) {
    isDragOver.value = false
  }
}

function handleDrop(e: DragEvent): void {
  e.preventDefault()
  e.stopPropagation()
  isDragOver.value = false

  console.log('[Shortcut] Drop event fired!')
  console.log('[Shortcut] DataTransfer types:', e.dataTransfer?.types)

  // Try custom MIME type first, then fall back to text/plain
  let data = e.dataTransfer?.getData('application/x-library-shortcut')
  console.log('[Shortcut] Custom MIME data:', data)

  if (!data) {
    data = e.dataTransfer?.getData('text/plain')
    console.log('[Shortcut] Fallback text/plain data:', data)
  }

  if (data) {
    try {
      const shortcut: SidebarShortcut = JSON.parse(data)
      console.log('[Shortcut] Parsed shortcut:', shortcut)
      // Validate it has the required fields
      if (shortcut.id && shortcut.label && shortcut.icon && shortcut.type) {
        console.log('[Shortcut] Adding to store:', shortcut)
        uiStore.addSidebarShortcut(shortcut)
        console.log('[Shortcut] Added successfully! Total shortcuts:', uiStore.sidebarShortcuts.length)
      } else {
        console.error('[Shortcut] Invalid shortcut data - missing required fields:', shortcut)
      }
    } catch (err) {
      console.error('[Shortcut] Failed to parse shortcut data:', err)
    }
  } else {
    console.log('[Shortcut] No data received in drop event')
  }
}
</script>

<template>
  <nav class="flex w-12 flex-col items-center border-r border-border bg-zinc-950 py-2">
    <!-- Tab buttons -->
    <div class="flex flex-col gap-1">
      <button
        v-for="tab in SIDEBAR_TABS"
        :key="tab.id"
        v-tooltip.right="{ value: tab.tooltip, showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        :class="[
          activeSidebarTab === tab.id
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
        ]"
        @click="handleTabClick(tab.id)"
      >
        <Icon :name="tab.icon" size="sm" />
      </button>
    </div>

    <!-- Divider -->
    <div class="my-2 h-px w-6 bg-border" />

    <!-- Shortcuts drop zone -->
    <div
      ref="dropZoneRef"
      class="flex min-h-[48px] flex-1 flex-col items-center gap-1 overflow-y-auto px-2 py-1 transition-all"
      :class="[
        isDragOver ? 'rounded-md bg-primary/20 ring-2 ring-primary' : '',
        isGlobalDragging && !isDragOver ? 'rounded-md bg-muted/50 ring-1 ring-muted-foreground/20' : ''
      ]"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- Drop hint when dragging -->
      <div
        v-if="isGlobalDragging && sidebarShortcuts.length === 0"
        class="flex h-8 w-8 items-center justify-center rounded-md border-2 border-dashed"
        :class="isDragOver ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground/50'"
      >
        <Icon name="plus" size="sm" />
      </div>

      <!-- Shortcuts -->
      <div
        v-for="(shortcut, index) in sidebarShortcuts"
        :key="shortcut.id"
        v-tooltip.right="{ value: shortcut.label, showDelay: 50 }"
        draggable="true"
        class="group relative flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground active:cursor-grabbing"
        :class="[
          draggedShortcutIndex === index ? 'opacity-50' : '',
          dropTargetIndex === index ? 'ring-2 ring-primary ring-offset-1' : ''
        ]"
        @click="handleShortcutClick(shortcut)"
        @dragstart="handleShortcutDragStart($event, index)"
        @dragover="handleShortcutDragOver($event, index)"
        @dragleave="handleShortcutDragLeave"
        @drop="handleShortcutDrop($event, index)"
        @dragend="handleShortcutDragEnd"
      >
        <Icon :name="shortcut.icon" size="sm" />
        <!-- Remove button on hover -->
        <button
          v-tooltip.right="{ value: 'Remove shortcut', showDelay: 300 }"
          class="absolute -right-0.5 -top-0.5 hidden h-3.5 w-3.5 items-center justify-center rounded-full bg-muted-foreground/80 text-background transition-colors hover:bg-destructive group-hover:flex"
          @click="handleShortcutRemove($event, shortcut.id)"
        >
          <Icon name="times" size="xs" class="scale-75" />
        </button>
      </div>

      <!-- Empty state hint (only when not dragging) -->
      <div
        v-if="sidebarShortcuts.length === 0 && !isGlobalDragging"
        v-tooltip.right="{ value: 'Drag and drop items here to create shortcuts', showDelay: 50 }"
        class="flex h-8 w-8 cursor-help items-center justify-center"
      >
        <Icon name="plus" size="xs" class="text-muted-foreground/30" />
      </div>
    </div>

    <!-- Bottom section -->
    <div class="mt-auto flex flex-col gap-1">
      <button
        v-tooltip.right="{ value: 'Console', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <Icon name="code" size="sm" />
      </button>
      <button
        v-tooltip.right="{ value: 'Settings', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <Icon name="cog" size="sm" />
      </button>
      <button
        v-tooltip.right="{ value: 'Help', showDelay: 50 }"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <Icon name="question-circle" size="sm" />
      </button>
    </div>
  </nav>
</template>
