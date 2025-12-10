<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ref } from 'vue'

defineProps<{
  title?: string
  runningCount?: number
  pendingCount?: number
}>()

const emit = defineEmits<{
  clearHistory: []
  clearQueue: []
  interruptAll: []
}>()

const menuOpen = ref(false)
</script>

<template>
  <div class="flex h-9 items-center justify-between border-b border-border bg-background/80 px-3 backdrop-blur">
    <!-- Left: Title and counts -->
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-foreground">{{ title || 'Queue' }}</span>

      <!-- Running indicator -->
      <div
        v-if="runningCount && runningCount > 0"
        class="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5"
      >
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
        <span class="text-[10px] font-medium text-blue-500">{{ runningCount }}</span>
      </div>

      <!-- Pending count -->
      <div
        v-if="pendingCount && pendingCount > 0"
        class="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5"
      >
        <Icon name="clock" size="xs" class="text-amber-500" />
        <span class="text-[10px] font-medium text-amber-500">{{ pendingCount }}</span>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-1">
      <!-- Interrupt button (visible when running) -->
      <button
        v-if="runningCount && runningCount > 0"
        v-tooltip.bottom="'Interrupt'"
        class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        @click="emit('interruptAll')"
      >
        <Icon name="stop" size="xs" />
      </button>

      <!-- Clear queue button (visible when pending) -->
      <button
        v-if="pendingCount && pendingCount > 0"
        v-tooltip.bottom="'Clear queue'"
        class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-500"
        @click="emit('clearQueue')"
      >
        <Icon name="times" size="xs" />
      </button>

      <!-- More options menu -->
      <Popover v-model:open="menuOpen">
        <PopoverTrigger as-child>
          <button
            v-tooltip.bottom="'More options'"
            class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon name="ellipsis-h" size="xs" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" class="w-40 p-0">
          <div class="flex flex-col py-1">
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              @click="emit('clearHistory'); menuOpen = false"
            >
              <Icon name="trash" size="xs" class="text-muted-foreground" />
              <span>Clear History</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
