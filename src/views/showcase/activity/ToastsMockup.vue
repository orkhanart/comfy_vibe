<script setup lang="ts">
/**
 * Toast Notifications Mockup
 *
 * Simulates real app scenarios that trigger toasts:
 * - Workflow completion
 * - Errors and warnings
 * - System notifications
 * - User actions
 */

import { ref, onUnmounted } from 'vue'
import { Icon } from '@/components/ui/icon'

type ToastSeverity = 'success' | 'info' | 'warn' | 'error'

interface Toast {
  id: string
  severity: ToastSeverity
  summary: string
  detail: string
  life: number
  createdAt: number
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

// Auto-dismiss toasts
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>()

function addToast(severity: ToastSeverity, summary: string, detail: string, life = 5000) {
  const id = `toast-${toastIdCounter++}`
  const toast: Toast = {
    id,
    severity,
    summary,
    detail,
    life,
    createdAt: Date.now(),
  }
  toasts.value.push(toast)

  // Set auto-dismiss timer
  if (life > 0) {
    const timer = setTimeout(() => {
      removeToast(id)
    }, life)
    dismissTimers.set(id, timer)
  }
}

function removeToast(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id)
  const timer = dismissTimers.get(id)
  if (timer) {
    clearTimeout(timer)
    dismissTimers.delete(id)
  }
}

function clearAllToasts() {
  toasts.value = []
  dismissTimers.forEach(timer => clearTimeout(timer))
  dismissTimers.clear()
}

onUnmounted(() => {
  dismissTimers.forEach(timer => clearTimeout(timer))
})

// Scenario triggers
function triggerWorkflowComplete() {
  addToast('success', 'Workflow Complete', 'Portrait Enhancement finished in 2m 34s')
}

function triggerBatchComplete() {
  addToast('success', 'Batch Complete', '5 images processed successfully')
}

function triggerSaveSuccess() {
  addToast('success', 'Saved', 'Workflow saved to "My Workflows"')
}

function triggerUpdateAvailable() {
  addToast('info', 'Update Available', 'ComfyUI v1.3.0 is ready to install', 0) // Sticky
}

function triggerNodeInstalled() {
  addToast('info', 'Node Installed', 'ComfyUI-Impact-Pack has been installed')
}

function triggerMemoryWarning() {
  addToast('warn', 'High Memory Usage', 'GPU memory at 85%. Consider reducing batch size.')
}

function triggerModelMissing() {
  addToast('warn', 'Missing Model', 'sd_xl_base_1.0.safetensors not found in checkpoints folder')
}

function triggerConnectionError() {
  addToast('error', 'Connection Lost', 'Lost connection to ComfyUI server. Retrying...')
}

function triggerExecutionError() {
  addToast('error', 'Execution Failed', 'KSampler: CUDA out of memory')
}

function triggerValidationError() {
  addToast('error', 'Invalid Workflow', 'Missing required input on node "Load Image"')
}

// Simulation scenarios
function runWorkflowScenario() {
  addToast('info', 'Starting', 'Queuing workflow for execution...')
  setTimeout(() => addToast('info', 'Processing', 'Running KSampler node...'), 1500)
  setTimeout(() => triggerWorkflowComplete(), 4000)
}

function runErrorScenario() {
  addToast('info', 'Starting', 'Queuing workflow for execution...')
  setTimeout(() => addToast('warn', 'High Load', 'GPU utilization at 95%'), 1000)
  setTimeout(() => triggerExecutionError(), 2500)
}

function runUpdateScenario() {
  triggerUpdateAvailable()
  setTimeout(() => addToast('info', 'Downloading', 'Downloading update... 45%'), 2000)
  setTimeout(() => addToast('success', 'Update Ready', 'Restart ComfyUI to apply update'), 4000)
}

function toastIcon(severity: ToastSeverity): string {
  switch (severity) {
    case 'success': return 'check-circle'
    case 'info': return 'info'
    case 'warn': return 'alert-triangle'
    case 'error': return 'x-circle'
  }
}

function toastColors(severity: ToastSeverity): { bg: string; border: string; icon: string } {
  switch (severity) {
    case 'success':
      return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-400' }
    case 'info':
      return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' }
    case 'warn':
      return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'text-yellow-400' }
    case 'error':
      return { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: 'text-red-400' }
  }
}
</script>

<template>
  <div class="min-h-screen bg-charcoal-950">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-charcoal-600 bg-charcoal-900 px-4 py-2">
      <div class="flex items-center gap-4">
        <a href="/showcase/activity" class="text-smoke-800 hover:text-white">
          <Icon name="arrow-left" size="sm" />
        </a>
        <h1 class="text-sm font-medium text-white">Toast Notifications Demo</h1>
      </div>
      <button
        class="text-xs text-smoke-800 hover:text-white"
        @click="clearAllToasts"
      >
        Clear All
      </button>
    </div>

    <!-- Main content -->
    <div class="p-8">
      <!-- Trigger buttons -->
      <div class="mb-8 grid gap-6 lg:grid-cols-2">
        <!-- Success toasts -->
        <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Icon name="check-circle" size="sm" />
            Success Notifications
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-500"
              @click="triggerWorkflowComplete"
            >
              Workflow Complete
            </button>
            <button
              class="rounded bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-500"
              @click="triggerBatchComplete"
            >
              Batch Complete
            </button>
            <button
              class="rounded bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-500"
              @click="triggerSaveSuccess"
            >
              Save Success
            </button>
          </div>
        </div>

        <!-- Info toasts -->
        <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-400">
            <Icon name="info" size="sm" />
            Info Notifications
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
              @click="triggerUpdateAvailable"
            >
              Update Available (Sticky)
            </button>
            <button
              class="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
              @click="triggerNodeInstalled"
            >
              Node Installed
            </button>
          </div>
        </div>

        <!-- Warning toasts -->
        <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-yellow-400">
            <Icon name="alert-triangle" size="sm" />
            Warning Notifications
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded bg-yellow-600 px-3 py-1.5 text-xs text-white hover:bg-yellow-500"
              @click="triggerMemoryWarning"
            >
              Memory Warning
            </button>
            <button
              class="rounded bg-yellow-600 px-3 py-1.5 text-xs text-white hover:bg-yellow-500"
              @click="triggerModelMissing"
            >
              Model Missing
            </button>
          </div>
        </div>

        <!-- Error toasts -->
        <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400">
            <Icon name="x-circle" size="sm" />
            Error Notifications
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500"
              @click="triggerConnectionError"
            >
              Connection Error
            </button>
            <button
              class="rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500"
              @click="triggerExecutionError"
            >
              Execution Error
            </button>
            <button
              class="rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500"
              @click="triggerValidationError"
            >
              Validation Error
            </button>
          </div>
        </div>
      </div>

      <!-- Scenarios -->
      <div class="mb-8 rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
        <h3 class="mb-3 text-sm font-semibold text-white">Simulation Scenarios</h3>
        <p class="mb-4 text-xs text-smoke-800">
          Click these to see a sequence of toasts that simulate real workflows.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            class="rounded bg-purple-600 px-4 py-2 text-xs text-white hover:bg-purple-500"
            @click="runWorkflowScenario"
          >
            <Icon name="play" size="sm" class="mr-1 inline" />
            Successful Workflow
          </button>
          <button
            class="rounded bg-purple-600 px-4 py-2 text-xs text-white hover:bg-purple-500"
            @click="runErrorScenario"
          >
            <Icon name="alert-circle" size="sm" class="mr-1 inline" />
            Failed Workflow
          </button>
          <button
            class="rounded bg-purple-600 px-4 py-2 text-xs text-white hover:bg-purple-500"
            @click="runUpdateScenario"
          >
            <Icon name="download" size="sm" class="mr-1 inline" />
            Update Flow
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
        <h3 class="mb-2 text-sm font-semibold text-white">About Toast Notifications</h3>
        <ul class="space-y-1 text-xs text-smoke-800">
          <li>• Toasts appear in the top-right corner and auto-dismiss after 5 seconds</li>
          <li>• Sticky toasts (like "Update Available") don't auto-dismiss</li>
          <li>• Click the X button to manually dismiss any toast</li>
          <li>• Multiple toasts stack vertically with newest at top</li>
          <li>• Different severities have distinct colors and icons</li>
        </ul>
      </div>
    </div>

    <!-- Toast container (fixed position like in real app) -->
    <div class="fixed right-4 top-16 z-50 flex w-80 flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 rounded-lg border p-3 shadow-lg"
          :class="[toastColors(toast.severity).bg, toastColors(toast.severity).border]"
        >
          <Icon
            :name="toastIcon(toast.severity)"
            size="md"
            :class="toastColors(toast.severity).icon"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white">{{ toast.summary }}</p>
            <p class="text-xs text-smoke-800">{{ toast.detail }}</p>
          </div>
          <button
            class="text-smoke-800 opacity-60 hover:opacity-100"
            @click="removeToast(toast.id)"
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
