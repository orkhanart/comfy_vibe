<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'create': [name: string]
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const folderName = ref('')
const isCreating = ref(false)

const isValidName = computed(() => {
  return folderName.value.trim().length > 0
})

// Reset form when dialog opens
watch(() => props.visible, (visible) => {
  if (visible) {
    folderName.value = ''
    isCreating.value = false
  }
})

function handleCreate() {
  if (!isValidName.value || isCreating.value) return

  isCreating.value = true
  emit('create', folderName.value.trim())

  setTimeout(() => {
    isCreating.value = false
    folderName.value = ''
    dialogVisible.value = false
  }, 300)
}

function handleClose() {
  folderName.value = ''
  dialogVisible.value = false
}
</script>

<template>
  <Dialog v-model:open="dialogVisible">
    <DialogContent class="max-w-[400px] gap-0 p-0">
      <DialogHeader class="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <DialogTitle>Create Folder</DialogTitle>
        <DialogDescription>Create a new folder to organize your items</DialogDescription>
      </DialogHeader>

      <div class="p-5">
        <!-- Name Input -->
        <div>
          <label class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Folder Name
          </label>
          <div class="relative">
            <Icon
              name="folder"
              size="sm"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              v-model="folderName"
              placeholder="Enter folder name..."
              class="pl-9"
              autofocus
              @keyup.enter="handleCreate"
            />
          </div>
        </div>
      </div>

      <DialogFooter class="flex-row items-center justify-end gap-2 border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <button
          class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          :class="[
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            isValidName && !isCreating
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'
          ]"
          :disabled="!isValidName || isCreating"
          @click="handleCreate"
        >
          <Icon
            v-if="isCreating"
            name="spinner"
            size="xs"
            class="animate-spin"
          />
          <Icon v-else name="folder-plus" size="xs" />
          {{ isCreating ? 'Creating...' : 'Create Folder' }}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
