<script setup lang="ts">
import { Icon } from '@/components/ui/icon'

interface Props {
  thumbnail: string
  title: string
  description?: string
  icon?: string
  badge?: string
  badgeClass?: string
  stats?: Array<{ icon: string; value: string | number }>
  updatedAt?: string
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  icon: undefined,
  badge: undefined,
  badgeClass: 'bg-muted-foreground/20 text-muted-foreground',
  stats: () => [],
  updatedAt: undefined
})

const emit = defineEmits<{
  open: []
  menu: [event: MouseEvent]
}>()
</script>

<template>
  <div
    class="group cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-white text-left transition-all hover:border-zinc-300 hover:shadow-sm dark:border-border dark:bg-card dark:hover:border-border"
  >
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="thumbnail"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <!-- Open button (bottom-right) -->
      <button
        class="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-lg opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
        @click.stop="emit('open')"
      >
        <Icon name="external-link" size="xs" />
        Open
      </button>

      <!-- Type icon badge (bottom-left) -->
      <div
        v-if="icon"
        class="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-md bg-popover/30 backdrop-blur-sm"
      >
        <Icon :name="icon" size="sm" />
      </div>

      <!-- Menu button (top-right) -->
      <button
        class="absolute right-2 top-2 rounded p-1 text-white/70 opacity-0 transition-opacity hover:bg-popover/20 hover:text-white group-hover:opacity-100"
        @click.stop="emit('menu', $event)"
      >
        <Icon name="ellipsis-h" size="sm" />
      </button>
    </div>

    <div class="p-3">
      <div>
        <h3 class="truncate font-medium text-zinc-900 dark:text-foreground">{{ title }}</h3>
        <p v-if="description" class="mt-0.5 line-clamp-1 text-sm text-muted-foreground dark:text-muted-foreground">
          {{ description }}
        </p>
      </div>

      <div v-if="badge || stats.length > 0 || updatedAt" class="mt-2 flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
        <!-- Badge -->
        <span v-if="badge" :class="['rounded px-1.5 py-0.5 text-[10px] font-medium', badgeClass]">
          {{ badge }}
        </span>

        <!-- Stats -->
        <template v-if="stats.length > 0">
          <span v-for="(stat, idx) in stats" :key="idx" class="flex items-center gap-1">
            <i v-if="stat.icon" :class="[stat.icon, 'text-[10px]']" />
            {{ stat.value }}
          </span>
        </template>

        <!-- Updated time -->
        <span v-if="updatedAt" class="ml-auto">{{ updatedAt }}</span>
      </div>
    </div>
  </div>
</template>
