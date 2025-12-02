<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  create: [data: { name: string; description: string }]
}>()

const newProject = ref({ name: '', description: '' })

watch(() => newProject.value.name, () => {
  // Reset on close
})

function handleCreate(): void {
  if (!newProject.value.name.trim()) return
  emit('create', { ...newProject.value })
  emit('update:visible', false)
  newProject.value = { name: '', description: '' }
}

function handleClose(): void {
  emit('update:visible', false)
  newProject.value = { name: '', description: '' }
}
</script>

<template>
  <Dialog
    :open="visible"
    @update:open="$emit('update:visible', $event)"
  >
    <DialogContent class="max-w-[420px]">
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
          <Input
            v-model="newProject.name"
            placeholder="Project name"
            @keyup.enter="handleCreate"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
          <Textarea
            v-model="newProject.description"
            placeholder="Optional description"
            :rows="3"
          />
        </div>
      </div>

      <DialogFooter>
        <button
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          :disabled="!newProject.name.trim()"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            newProject.name.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'
          ]"
          @click="handleCreate"
        >
          Create
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
