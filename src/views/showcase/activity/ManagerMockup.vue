<script setup lang="ts">
/**
 * Manager Progress Mockup
 *
 * Simulates the ComfyUI extension manager:
 * - Installing/updating custom nodes
 * - Task queue with logs
 * - Success/failure states
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@/components/ui/icon'

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

interface ManagerTask {
  id: string
  type: 'install' | 'update' | 'uninstall' | 'enable' | 'disable'
  packageName: string
  status: TaskStatus
  logs: string[]
  startedAt?: Date
  completedAt?: Date
  error?: string
}

const tasks = ref<ManagerTask[]>([
  {
    id: 't1',
    type: 'install',
    packageName: 'ComfyUI-Impact-Pack',
    status: 'running',
    logs: [
      '[INFO] Cloning repository from GitHub...',
      '[INFO] Repository cloned successfully',
      '[INFO] Installing Python dependencies...',
      '[INFO] Running: pip install -r requirements.txt',
    ],
    startedAt: new Date(Date.now() - 30000),
  },
  {
    id: 't2',
    type: 'update',
    packageName: 'ComfyUI-Manager',
    status: 'pending',
    logs: [],
  },
  {
    id: 't3',
    type: 'install',
    packageName: 'ComfyUI-ControlNet-Aux',
    status: 'pending',
    logs: [],
  },
])

const completedTasks = ref<ManagerTask[]>([
  {
    id: 'c1',
    type: 'install',
    packageName: 'ComfyUI-AnimateDiff',
    status: 'completed',
    logs: [
      '[INFO] Cloning repository from GitHub...',
      '[INFO] Repository cloned successfully',
      '[INFO] Installing dependencies...',
      '[SUCCESS] Installation completed',
    ],
    completedAt: new Date(Date.now() - 300000),
  },
])

const failedTasks = ref<ManagerTask[]>([
  {
    id: 'f1',
    type: 'install',
    packageName: 'ComfyUI-VideoHelperSuite',
    status: 'failed',
    logs: [
      '[INFO] Cloning repository from GitHub...',
      '[INFO] Repository cloned successfully',
      '[INFO] Installing dependencies...',
      '[ERROR] Failed to install: torch>=2.0 not satisfied',
      '[ERROR] Installation failed',
    ],
    error: 'Dependency conflict: torch>=2.0 required',
  },
])

// UI state
const isExpanded = ref(true)
const activeTab = ref<'queue' | 'failed'>('queue')
const expandedTaskId = ref<string | null>('t1')
const needsRestart = ref(false)

// Stats
const stats = computed(() => ({
  running: tasks.value.filter(t => t.status === 'running').length,
  pending: tasks.value.filter(t => t.status === 'pending').length,
  completed: completedTasks.value.length,
  failed: failedTasks.value.length,
}))

// Fake log messages
const logMessages = [
  '[INFO] Downloading package files...',
  '[INFO] Extracting files...',
  '[INFO] Checking dependencies...',
  '[INFO] Installing numpy>=1.24...',
  '[INFO] Installing opencv-python...',
  '[INFO] Installing torch>=2.0...',
  '[INFO] Compiling custom operators...',
  '[INFO] Setting up configuration...',
  '[INFO] Verifying installation...',
  '[SUCCESS] Package installed successfully',
]

// Animation
let animationInterval: ReturnType<typeof setInterval> | null = null
let logIndex = 0

onMounted(() => {
  animationInterval = setInterval(() => {
    const runningTask = tasks.value.find(t => t.status === 'running')
    if (runningTask) {
      // Add log message
      if (logIndex < logMessages.length) {
        runningTask.logs.push(logMessages[logIndex])
        logIndex++
      } else {
        // Complete the task
        runningTask.status = 'completed'
        runningTask.completedAt = new Date()
        completedTasks.value.unshift({ ...runningTask })
        tasks.value = tasks.value.filter(t => t.id !== runningTask.id)
        needsRestart.value = true

        // Start next pending task
        const nextPending = tasks.value.find(t => t.status === 'pending')
        if (nextPending) {
          nextPending.status = 'running'
          nextPending.startedAt = new Date()
          nextPending.logs = ['[INFO] Starting installation...']
          logIndex = 0
          expandedTaskId.value = nextPending.id
        }
      }
    }
  }, 800)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

// Actions
function cancelTask(id: string) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function retryTask(id: string) {
  const task = failedTasks.value.find(t => t.id === id)
  if (task) {
    failedTasks.value = failedTasks.value.filter(t => t.id !== id)
    tasks.value.push({
      ...task,
      status: 'pending',
      logs: [],
      error: undefined,
    })
  }
}

function addInstallTask() {
  const packages = [
    'ComfyUI-WD14-Tagger',
    'ComfyUI-Frame-Interpolation',
    'ComfyUI-KJNodes',
    'ComfyUI-Easy-Use',
    'ComfyUI-GGUF',
  ]
  const pkg = packages[Math.floor(Math.random() * packages.length)]
  const id = `t${Date.now()}`

  const newTask: ManagerTask = {
    id,
    type: 'install',
    packageName: pkg,
    status: tasks.value.some(t => t.status === 'running') ? 'pending' : 'running',
    logs: [],
  }

  if (newTask.status === 'running') {
    newTask.startedAt = new Date()
    newTask.logs = ['[INFO] Starting installation...']
    logIndex = 0
    expandedTaskId.value = id
  }

  tasks.value.push(newTask)
}

function toggleExpand(id: string) {
  expandedTaskId.value = expandedTaskId.value === id ? null : id
}

function typeIcon(type: ManagerTask['type']): string {
  switch (type) {
    case 'install': return 'download'
    case 'update': return 'refresh-cw'
    case 'uninstall': return 'trash-2'
    case 'enable': return 'toggle-right'
    case 'disable': return 'toggle-left'
  }
}

function typeLabel(type: ManagerTask['type']): string {
  switch (type) {
    case 'install': return 'Installing'
    case 'update': return 'Updating'
    case 'uninstall': return 'Uninstalling'
    case 'enable': return 'Enabling'
    case 'disable': return 'Disabling'
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
        <h1 class="text-sm font-medium text-white">Extension Manager Demo</h1>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="stats.running > 0" class="flex items-center gap-2 text-xs text-blue-400">
          <Icon name="loader-2" size="sm" class="animate-spin" />
          {{ stats.running }} running
        </span>
        <button
          class="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
          @click="addInstallTask"
        >
          <Icon name="plus" size="sm" class="mr-1 inline" />
          Install Package
        </button>
      </div>
    </div>

    <div class="p-8">
      <!-- Manager progress dialog (simulated) -->
      <div class="mx-auto max-w-2xl rounded-lg border border-charcoal-600 bg-charcoal-800 shadow-xl">
        <!-- Dialog header -->
        <div class="flex items-center justify-between border-b border-charcoal-600 p-4">
          <div class="flex items-center gap-3">
            <div v-if="stats.running > 0" class="flex items-center gap-2">
              <Icon name="loader-2" size="sm" class="animate-spin text-blue-400" />
              <span class="text-sm font-medium text-white">
                {{ stats.running + stats.pending }} task{{ stats.running + stats.pending !== 1 ? 's' : '' }} in queue
              </span>
            </div>
            <div v-else class="flex items-center gap-2">
              <Icon name="check-circle" size="sm" class="text-emerald-400" />
              <span class="text-sm font-medium text-white">All tasks completed</span>
            </div>
          </div>
          <button
            class="text-smoke-800 hover:text-white"
            @click="isExpanded = !isExpanded"
          >
            <Icon :name="isExpanded ? 'chevron-up' : 'chevron-down'" size="sm" />
          </button>
        </div>

        <!-- Tabs (when expanded) -->
        <div v-if="isExpanded" class="flex border-b border-charcoal-600">
          <button
            class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
            :class="activeTab === 'queue'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-smoke-800 hover:text-white'"
            @click="activeTab = 'queue'"
          >
            Installation Queue
          </button>
          <button
            class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
            :class="activeTab === 'failed'
              ? 'border-b-2 border-red-500 text-white'
              : 'text-smoke-800 hover:text-white'"
            @click="activeTab = 'failed'"
          >
            Failed ({{ stats.failed }})
          </button>
        </div>

        <!-- Content -->
        <div
          v-if="isExpanded"
          class="max-h-[450px] overflow-y-auto p-4"
        >
          <!-- Queue tab -->
          <template v-if="activeTab === 'queue'">
            <!-- Current/Recent tasks -->
            <div v-if="tasks.length === 0 && completedTasks.length === 0" class="py-8 text-center text-smoke-800">
              <Icon name="inbox" size="xl" class="mx-auto mb-2 opacity-30" />
              <p class="text-sm">No tasks in queue</p>
            </div>

            <!-- Active/Pending tasks -->
            <div v-for="task in tasks" :key="task.id" class="mb-3">
              <div class="rounded-lg border border-charcoal-500 bg-charcoal-700 shadow">
                <!-- Task header -->
                <div
                  class="flex cursor-pointer items-center justify-between p-3"
                  @click="toggleExpand(task.id)"
                >
                  <div class="flex items-center gap-3">
                    <Icon
                      :name="task.status === 'running' ? 'loader-2' : 'clock'"
                      size="sm"
                      :class="task.status === 'running' ? 'animate-spin text-blue-400' : 'text-yellow-400'"
                    />
                    <div>
                      <span class="text-sm font-medium text-white">{{ task.packageName }}</span>
                      <span class="ml-2 text-xs text-smoke-800">
                        {{ task.status === 'running' ? typeLabel(task.type) : 'Pending' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="task.status === 'pending'"
                      class="text-smoke-800 hover:text-red-400"
                      @click.stop="cancelTask(task.id)"
                    >
                      <Icon name="x" size="sm" />
                    </button>
                    <Icon
                      :name="expandedTaskId === task.id ? 'chevron-up' : 'chevron-down'"
                      size="sm"
                      class="text-smoke-800"
                    />
                  </div>
                </div>

                <!-- Task logs (expanded) -->
                <div
                  v-if="expandedTaskId === task.id"
                  class="max-h-48 overflow-y-auto border-t border-charcoal-600 bg-black p-3"
                >
                  <pre
                    v-for="(log, idx) in task.logs"
                    :key="idx"
                    class="whitespace-pre-wrap break-words text-xs"
                    :class="log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-smoke-800'"
                  >{{ log }}</pre>
                  <div v-if="task.status === 'running'" class="mt-1 flex items-center gap-1 text-xs text-smoke-800">
                    <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                    Processing...
                  </div>
                </div>
              </div>
            </div>

            <!-- Completed tasks -->
            <div v-for="task in completedTasks" :key="task.id" class="mb-3">
              <div class="rounded-lg border border-charcoal-600 bg-charcoal-700">
                <div
                  class="flex cursor-pointer items-center justify-between p-3"
                  @click="toggleExpand(task.id)"
                >
                  <div class="flex items-center gap-3">
                    <Icon name="check-circle" size="sm" class="text-emerald-400" />
                    <div>
                      <span class="text-sm font-medium text-white">{{ task.packageName }}</span>
                      <span class="ml-2 text-xs text-emerald-400">Completed</span>
                    </div>
                  </div>
                  <Icon
                    :name="expandedTaskId === task.id ? 'chevron-up' : 'chevron-down'"
                    size="sm"
                    class="text-smoke-800"
                  />
                </div>

                <div
                  v-if="expandedTaskId === task.id"
                  class="max-h-48 overflow-y-auto border-t border-charcoal-600 bg-black p-3"
                >
                  <pre
                    v-for="(log, idx) in task.logs"
                    :key="idx"
                    class="whitespace-pre-wrap break-words text-xs"
                    :class="log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-smoke-800'"
                  >{{ log }}</pre>
                </div>
              </div>
            </div>
          </template>

          <!-- Failed tab -->
          <template v-else>
            <div v-if="failedTasks.length === 0" class="py-8 text-center text-smoke-800">
              <Icon name="check-circle" size="xl" class="mx-auto mb-2 text-emerald-400 opacity-30" />
              <p class="text-sm">No failed tasks</p>
            </div>

            <div v-for="task in failedTasks" :key="task.id" class="mb-3">
              <div class="rounded-lg border border-red-500/30 bg-charcoal-700">
                <div
                  class="flex cursor-pointer items-center justify-between p-3"
                  @click="toggleExpand(task.id)"
                >
                  <div class="flex items-center gap-3">
                    <Icon name="x-circle" size="sm" class="text-red-400" />
                    <div>
                      <span class="text-sm font-medium text-white">{{ task.packageName }}</span>
                      <span class="ml-2 text-xs text-red-400">Failed</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      class="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-500"
                      @click.stop="retryTask(task.id)"
                    >
                      Retry
                    </button>
                    <Icon
                      :name="expandedTaskId === task.id ? 'chevron-up' : 'chevron-down'"
                      size="sm"
                      class="text-smoke-800"
                    />
                  </div>
                </div>

                <div v-if="task.error" class="border-t border-charcoal-600 px-3 py-2">
                  <p class="text-xs text-red-400">{{ task.error }}</p>
                </div>

                <div
                  v-if="expandedTaskId === task.id"
                  class="max-h-48 overflow-y-auto border-t border-charcoal-600 bg-black p-3"
                >
                  <pre
                    v-for="(log, idx) in task.logs"
                    :key="idx"
                    class="whitespace-pre-wrap break-words text-xs"
                    :class="log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-smoke-800'"
                  >{{ log }}</pre>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div v-if="needsRestart" class="flex items-center justify-between border-t border-charcoal-600 p-4">
          <span class="text-xs text-yellow-400">
            <Icon name="alert-triangle" size="sm" class="mr-1 inline" />
            Restart required to apply changes
          </span>
          <button class="rounded bg-yellow-600 px-4 py-2 text-xs font-medium text-white hover:bg-yellow-500">
            Restart ComfyUI
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="mx-auto mt-8 max-w-2xl rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
        <h3 class="mb-2 text-sm font-semibold text-white">About Manager Progress</h3>
        <p class="mb-4 text-xs text-smoke-800">
          This mockup simulates the ComfyUI extension manager's installation progress dialog.
          Tasks are queued and processed sequentially with real-time log output.
        </p>
        <ul class="space-y-1 text-xs text-smoke-800">
          <li>• Tasks show live log output during execution</li>
          <li>• Collapsible task panels with persistent logs</li>
          <li>• Failed tasks can be retried</li>
          <li>• Restart prompt appears after installations</li>
          <li>• Queue/Failed tabs to organize task status</li>
        </ul>
      </div>
    </div>
  </div>
</template>
