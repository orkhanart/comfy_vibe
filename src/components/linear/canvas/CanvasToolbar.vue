<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref } from 'vue'

type ToolId = 'select' | 'group' | 'ungroup' | 'section' | 'note' | 'annotation' | 'text' | 'pen' | 'highlighter'

const activeTool = ref<ToolId>('select')

const tools: Array<{ id: ToolId; icon: string; label: string; dividerAfter?: boolean }> = [
  { id: 'select', icon: 'arrow-up', label: 'Select' },
  { id: 'group', icon: 'objects-column', label: 'Group', dividerAfter: false },
  { id: 'ungroup', icon: 'grid', label: 'Ungroup', dividerAfter: true },
  { id: 'section', icon: 'square', label: 'Section' },
  { id: 'note', icon: 'bookmark', label: 'Sticky Note' },
  { id: 'annotation', icon: 'comment', label: 'Annotation', dividerAfter: true },
  { id: 'text', icon: 'type', label: 'Text' },
  { id: 'pen', icon: 'pencil', label: 'Pen' },
  { id: 'highlighter', icon: 'edit', label: 'Highlighter' },
]

const emit = defineEmits<{
  selectTool: [tool: ToolId]
}>()

function selectTool(tool: ToolId): void {
  activeTool.value = tool
  emit('selectTool', tool)
}
</script>

<template>
  <div class="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
    <div class="flex items-center gap-0.5 rounded-xl border border-zinc-800 bg-zinc-900/95 p-1.5 shadow-lg backdrop-blur">
      <template v-for="tool in tools" :key="tool.id">
        <button
          v-tooltip.top="tool.label"
          :class="[
            'flex h-8 w-8 items-center justify-center rounded-lg transition-all',
            activeTool === tool.id
              ? 'bg-zinc-700 text-zinc-100'
              : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
          ]"
          @click="selectTool(tool.id)"
        >
          <Icon :name="tool.icon" size="sm" />
        </button>
        <div v-if="tool.dividerAfter" class="mx-1 h-5 w-px bg-zinc-700" />
      </template>
    </div>
  </div>
</template>
