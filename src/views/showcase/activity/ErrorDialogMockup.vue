<script setup lang="ts">
/**
 * Error Dialog Mockup
 *
 * Simulates execution error scenarios:
 * - CUDA out of memory
 * - Missing models
 * - Node errors
 * - Validation errors
 */

import { ref } from 'vue'
import { Icon } from '@/components/ui/icon'

interface ExecutionError {
  id: string
  nodeType: string
  nodeId: string
  exceptionType: string
  exceptionMessage: string
  traceback: string[]
  timestamp: Date
}

const errors: ExecutionError[] = [
  {
    id: 'e1',
    nodeType: 'KSampler',
    nodeId: '42',
    exceptionType: 'RuntimeError',
    exceptionMessage: 'CUDA out of memory. Tried to allocate 2.00 GiB (GPU 0; 8.00 GiB total capacity; 6.12 GiB already allocated)',
    traceback: [
      'Traceback (most recent call last):',
      '  File "execution.py", line 152, in execute',
      '    output = getattr(obj, func)(**input_data)',
      '  File "nodes.py", line 1423, in sample',
      '    return common_ksampler(model, seed, steps, cfg, sampler_name, scheduler, positive, negative, latent_image, denoise=denoise)',
      '  File "nodes.py", line 1396, in common_ksampler',
      '    samples = comfy.sample.sample(model, noise, steps, cfg, sampler_name, scheduler, positive, negative, latent_image,',
      '  File "comfy/sample.py", line 42, in sample',
      '    return sampler.sample(noise, positive, negative, cfg=cfg, latent_image=latent_image, seed=seed)',
      'torch.cuda.OutOfMemoryError: CUDA out of memory. Tried to allocate 2.00 GiB',
    ],
    timestamp: new Date(),
  },
  {
    id: 'e2',
    nodeType: 'Load Checkpoint',
    nodeId: '4',
    exceptionType: 'FileNotFoundError',
    exceptionMessage: 'Model not found: sd_xl_base_1.0.safetensors',
    traceback: [
      'Traceback (most recent call last):',
      '  File "execution.py", line 152, in execute',
      '    output = getattr(obj, func)(**input_data)',
      '  File "nodes.py", line 523, in load_checkpoint',
      '    ckpt_path = folder_paths.get_full_path("checkpoints", ckpt_name)',
      '  File "folder_paths.py", line 156, in get_full_path',
      '    raise FileNotFoundError(f"Model not found: {filename}")',
      'FileNotFoundError: Model not found: sd_xl_base_1.0.safetensors',
    ],
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 'e3',
    nodeType: 'VAE Decode',
    nodeId: '8',
    exceptionType: 'ValueError',
    exceptionMessage: 'Input tensor shape mismatch: expected (1, 4, 128, 128), got (1, 4, 64, 64)',
    traceback: [
      'Traceback (most recent call last):',
      '  File "execution.py", line 152, in execute',
      '    output = getattr(obj, func)(**input_data)',
      '  File "nodes.py", line 892, in decode',
      '    return (vae.decode(samples["samples"]), )',
      '  File "comfy/sd.py", line 412, in decode',
      '    raise ValueError(f"Input tensor shape mismatch: expected {expected}, got {actual}")',
      'ValueError: Input tensor shape mismatch: expected (1, 4, 128, 128), got (1, 4, 64, 64)',
    ],
    timestamp: new Date(Date.now() - 120000),
  },
]

const activeError = ref<ExecutionError>(errors[0])
const showReport = ref(false)
const copied = ref(false)

function selectError(error: ExecutionError) {
  activeError.value = error
  showReport.value = false
  copied.value = false
}

function copyReport() {
  const report = generateReport(activeError.value)
  navigator.clipboard.writeText(report)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function generateReport(error: ExecutionError): string {
  return `
## Error Report

**Node Type:** ${error.nodeType}
**Node ID:** ${error.nodeId}
**Exception Type:** ${error.exceptionType}
**Message:** ${error.exceptionMessage}

### Traceback
\`\`\`
${error.traceback.join('\n')}
\`\`\`

### System Info
- ComfyUI Version: 0.2.2
- Python: 3.10.12
- PyTorch: 2.1.0+cu121
- OS: Linux x64

### Workflow
[Workflow JSON would be here]
`.trim()
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        <h1 class="text-sm font-medium text-white">Error Dialog Demo</h1>
      </div>
      <span class="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400">
        {{ errors.length }} error{{ errors.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <div class="flex h-[calc(100vh-49px)]">
      <!-- Error list sidebar -->
      <div class="w-72 border-r border-charcoal-600 bg-charcoal-900">
        <div class="border-b border-charcoal-600 p-3">
          <span class="text-xs font-medium text-smoke-800">Recent Errors</span>
        </div>
        <div class="p-2">
          <button
            v-for="error in errors"
            :key="error.id"
            class="mb-2 w-full rounded-lg border p-3 text-left transition-colors"
            :class="activeError.id === error.id
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-charcoal-600 bg-charcoal-800 hover:bg-charcoal-700'"
            @click="selectError(error)"
          >
            <div class="flex items-start gap-2">
              <Icon name="alert-circle" size="sm" class="mt-0.5 text-red-400" />
              <div class="flex-1 min-w-0">
                <p class="truncate text-sm font-medium text-white">{{ error.nodeType }}</p>
                <p class="truncate text-xs text-smoke-800">{{ error.exceptionType }}</p>
                <p class="mt-1 text-xs text-smoke-800">{{ formatTime(error.timestamp) }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Error detail -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="mx-auto max-w-3xl">
          <!-- Error dialog (simulated) -->
          <div class="rounded-lg border border-charcoal-600 bg-charcoal-800 shadow-xl">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-charcoal-600 p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                  <Icon name="alert-circle" size="lg" class="text-red-400" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-white">{{ activeError.nodeType }}</h2>
                  <p class="text-xs text-smoke-800">Node #{{ activeError.nodeId }} • {{ activeError.exceptionType }}</p>
                </div>
              </div>
              <button class="text-smoke-800 hover:text-white">
                <Icon name="x" size="md" />
              </button>
            </div>

            <!-- Error message -->
            <div class="border-b border-charcoal-600 p-4">
              <p class="break-words text-sm text-white">{{ activeError.exceptionMessage }}</p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-center gap-3 border-b border-charcoal-600 p-4">
              <button
                class="text-sm text-blue-400 hover:underline"
                @click="showReport = !showReport"
              >
                {{ showReport ? 'Hide Report' : 'Show Report' }}
              </button>
              <span class="text-charcoal-600">|</span>
              <button class="text-sm text-blue-400 hover:underline">
                Help Fix
              </button>
            </div>

            <!-- Traceback (always visible in mockup) -->
            <div class="border-b border-charcoal-600 p-4">
              <h3 class="mb-2 text-xs font-medium text-smoke-800">Traceback</h3>
              <div class="max-h-64 overflow-y-auto rounded-lg bg-black p-4">
                <pre
                  v-for="(line, idx) in activeError.traceback"
                  :key="idx"
                  class="whitespace-pre-wrap break-words text-xs"
                  :class="line.includes('Error') ? 'text-red-400' : 'text-smoke-800'"
                >{{ line }}</pre>
              </div>
            </div>

            <!-- Full report (expanded) -->
            <div v-if="showReport" class="border-b border-charcoal-600 p-4">
              <h3 class="mb-2 text-xs font-medium text-smoke-800">Full Error Report</h3>
              <div class="max-h-80 overflow-y-auto rounded-lg bg-black p-4">
                <pre class="whitespace-pre-wrap break-words text-xs text-smoke-800">{{ generateReport(activeError) }}</pre>
              </div>
            </div>

            <!-- Footer actions -->
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-2">
                <button class="flex items-center gap-1 rounded bg-charcoal-600 px-3 py-2 text-xs text-white hover:bg-charcoal-500">
                  <Icon name="search" size="sm" />
                  Find Issue
                </button>
                <button
                  class="flex items-center gap-1 rounded bg-charcoal-600 px-3 py-2 text-xs text-white hover:bg-charcoal-500"
                  @click="copyReport"
                >
                  <Icon :name="copied ? 'check' : 'copy'" size="sm" />
                  {{ copied ? 'Copied!' : 'Copy Report' }}
                </button>
              </div>
              <button class="rounded bg-blue-600 px-4 py-2 text-xs text-white hover:bg-blue-500">
                Report Issue
              </button>
            </div>
          </div>

          <!-- Suggestions -->
          <div class="mt-6 rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
            <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Icon name="lightbulb" size="sm" class="text-yellow-400" />
              Suggested Fixes
            </h3>

            <div v-if="activeError.exceptionType === 'RuntimeError'" class="space-y-2">
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Reduce batch size or image resolution to free up GPU memory</span>
              </div>
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Enable "Low VRAM" mode in settings</span>
              </div>
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Close other GPU-intensive applications</span>
              </div>
            </div>

            <div v-else-if="activeError.exceptionType === 'FileNotFoundError'" class="space-y-2">
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Download the missing model from Civitai or Hugging Face</span>
              </div>
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Check that the model file is in the correct folder</span>
              </div>
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Verify the model filename matches exactly (case-sensitive)</span>
              </div>
            </div>

            <div v-else class="space-y-2">
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Check that all node inputs are connected correctly</span>
              </div>
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Verify input dimensions match expected values</span>
              </div>
              <div class="flex items-start gap-2 text-xs text-smoke-800">
                <Icon name="chevron-right" size="sm" class="mt-0.5 text-blue-400" />
                <span>Try restarting ComfyUI and running the workflow again</span>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="mt-6 rounded-lg border border-charcoal-600 bg-charcoal-800 p-4">
            <h3 class="mb-2 text-sm font-semibold text-white">About Error Dialogs</h3>
            <ul class="space-y-1 text-xs text-smoke-800">
              <li>• Error dialogs appear when workflow execution fails</li>
              <li>• Shows the node that caused the error and the exception type</li>
              <li>• Full traceback helps developers debug issues</li>
              <li>• "Find Issue" searches GitHub for similar problems</li>
              <li>• "Report Issue" opens a new issue with error details pre-filled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
