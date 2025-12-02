<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

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
  menu: [event: MouseEvent]
}>()
</script>

<template>
  <div
    class="group cursor-pointer"
    @click="emit('open')"
  >
    <!-- Thumbnail with hover overlay -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
      <img
        :src="thumbnail"
        :alt="title"
        class="h-full w-full object-cover"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-all group-hover:bg-black/40">
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
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              title="More options"
              @click.stop="emit('menu', $event)"
            >
              <Icon name="ellipsis-h" size="sm" />
            </button>
            <button
              class="flex h-8 items-center gap-1.5 rounded-lg bg-white/90 px-3 font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
              @click.stop="emit('open')"
            >
              <Icon name="external-link" size="xs" />
              <span class="text-xs">Open</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Name -->
    <div class="mt-2 px-1">
      <h3
        :title="title"
        class="line-clamp-2 text-sm font-medium leading-tight text-zinc-900 dark:text-foreground"
      >
        {{ title }}
      </h3>
      <p v-if="updatedAt" class="mt-0.5 text-xs text-muted-foreground">{{ updatedAt }}</p>
    </div>
  </div>
</template>
