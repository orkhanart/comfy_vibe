<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ShareDialog } from '@/components/common'

const isOpen = ref(true)
const selectedPhase = ref(1)

// Mock workflow data - uses 'wf-1' to match shareStore mock data
const mockWorkflow = {
  id: 'wf-1',
  name: 'Test Workflow - SDXL Portrait',
  type: 'workflow' as const
}

// Keyboard navigation for phases
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' && selectedPhase.value > 1) {
    selectedPhase.value--
    isOpen.value = true
  } else if (e.key === 'ArrowRight' && selectedPhase.value < 3) {
    selectedPhase.value++
    isOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Phase definitions
const phases = [
  {
    id: 1,
    title: 'Phase 1: Link Sharing',
    features: [
      'Generate shareable link',
      'Copy link to clipboard',
      'Link permission (view/fork)'
    ]
  },
  {
    id: 2,
    title: 'Phase 2: Email Invites',
    features: [
      'All Phase 1 features',
      'Search users by name/email',
      'Send email invitations',
      'Set permission per invite'
    ]
  },
  {
    id: 3,
    title: 'Phase 3: Share Management',
    features: [
      'All Phase 1 & 2 features',
      'View all shared links',
      'See people with access',
      'Revoke access',
      'Update permissions'
    ]
  }
]

function selectPhase(phase: number) {
  selectedPhase.value = phase
  isOpen.value = true
}
</script>

<template>
  <div class="relative flex h-screen w-screen flex-col overflow-hidden bg-neutral-900">
    <!-- Phase Selector -->
    <div class="border-b border-neutral-700 px-4 py-3">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-neutral-300">Development Phases:</span>
        <div class="flex gap-2">
          <button
            v-for="phase in phases"
            :key="phase.id"
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="selectedPhase === phase.id
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300'"
            @click="selectPhase(phase.id)"
          >
            Phase {{ phase.id }}
          </button>
        </div>

        <button
          v-if="!isOpen"
          class="ml-auto rounded-md bg-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-600"
          @click="isOpen = true"
        >
          Open Dialog
        </button>
      </div>

      <!-- Phase Details -->
      <div class="mt-3 rounded-lg bg-neutral-800 p-3">
        <h3 class="text-sm font-semibold text-neutral-200">
          {{ phases[selectedPhase - 1].title }}
        </h3>
        <ul class="mt-2 space-y-1">
          <li
            v-for="feature in phases[selectedPhase - 1].features"
            :key="feature"
            class="flex items-center gap-2 text-xs text-neutral-400"
          >
            <span class="h-1 w-1 rounded-full bg-blue-500" />
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Share Dialog -->
    <ShareDialog
      :open="isOpen"
      :item-type="mockWorkflow.type"
      :item-name="mockWorkflow.name"
      :item-id="mockWorkflow.id"
      :phase="selectedPhase"
      @update:open="isOpen = $event"
    />
  </div>
</template>
