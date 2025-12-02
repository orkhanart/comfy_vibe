<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ref } from 'vue'

interface Props {
  thumbnail: string
  title: string
  icon?: string
  iconClass?: string
  badge?: string
  badgeClass?: string
  updatedAt?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'file',
  iconClass: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
  badge: undefined,
  badgeClass: 'bg-zinc-900/70 text-white',
  updatedAt: undefined
})

const emit = defineEmits<{
  open: []
  share: []
  delete: []
}>()

const menuOpen = ref(false)

function handleAction(action: string) {
  menuOpen.value = false
  switch (action) {
    case 'open': emit('open'); break
    case 'share': emit('share'); break
    case 'delete': emit('delete'); break
  }
}
</script>

<template>
  <div
    class="group cursor-pointer"
    @click="emit('open')"
  >
    <!-- Thumbnail with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 transition-all duration-200 group-hover:scale-[1.01] group-hover:shadow-xl dark:bg-zinc-800">
      <img
        :src="thumbnail"
        :alt="title"
        class="h-full w-full object-cover"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between p-2">
        <!-- Top row -->
        <div class="flex items-start justify-between">
          <!-- Badge -->
          <span v-if="badge" :class="['rounded px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm', badgeClass]">
            {{ badge }}
          </span>
          <div v-else />
          <div />
        </div>
        <!-- Bottom row -->
        <div class="flex items-end justify-between">
          <!-- Updated time -->
          <span v-if="updatedAt" class="rounded bg-zinc-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {{ updatedAt }}
          </span>
          <div v-else />
          <!-- Hover actions -->
          <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900/70 text-white backdrop-blur-sm transition-colors hover:bg-zinc-900/90"
              title="Open"
              @click.stop="emit('open')"
            >
              <Icon name="external-link" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name & Menu -->
    <div class="mt-2 flex items-center justify-between gap-1 px-1">
      <h3
        :title="title"
        class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-foreground"
      >
        {{ title }}
      </h3>
      <Popover v-model:open="menuOpen">
        <PopoverTrigger as-child>
          <button
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-foreground"
            title="More options"
            @click.stop
          >
            <Icon name="ellipsis-h" size="sm" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" :side-offset="4" class="w-48 p-1">
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('open')"
          >
            <Icon name="external-link" size="sm" class="text-zinc-400" />
            Open
          </button>
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="handleAction('share')"
          >
            <Icon name="share" size="sm" class="text-zinc-400" />
            Share
          </button>
          <div class="my-1 border-t border-zinc-200 dark:border-zinc-700" />
          <button
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            @click="handleAction('delete')"
          >
            <Icon name="trash" size="sm" />
            Delete
          </button>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
