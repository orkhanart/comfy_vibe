<script setup lang="ts">
import { Icon } from '@/components/ui/icon'
import { computed } from 'vue'

export type InputType = 'text' | 'textarea' | 'image' | 'number' | 'slider' | 'select' | 'toggle' | 'color' | 'seed' | 'model'

export interface NodeInput {
  id: string
  name: string
  type: InputType
  label: string
  description?: string
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
  step?: number
  default?: string | number | boolean
  required?: boolean
  advanced?: boolean
  connected?: boolean
  connectedFrom?: string
}

export interface WorkflowNode {
  id: string
  type: string
  name: string
  icon: string
  category: string
  inputs: NodeInput[]
  enabled: boolean
  collapsed: boolean
}

const props = defineProps<{
  node: WorkflowNode
  isDragging?: boolean
  formValues: Record<string, string | number | boolean | null>
  uploadedImages: Record<string, string>
}>()

const emit = defineEmits<{
  toggle: [nodeId: string]
  toggleEnabled: [nodeId: string]
  dragStart: [event: DragEvent, nodeId: string]
  dragEnd: [event: DragEvent]
  updateValue: [inputId: string, value: string | number | boolean | null]
  uploadImage: [inputId: string, event: Event]
  removeImage: [inputId: string]
  randomizeSeed: [inputId: string]
}>()

const visibleInputs = computed(() => props.node.inputs.filter(i => !i.connected))
const connectedInputs = computed(() => props.node.inputs.filter(i => i.connected))
</script>

<template>
  <div
    :class="[
      'group border-b border-border',
      !node.enabled && 'opacity-40'
    ]"
    :draggable="true"
    @dragstart="emit('dragStart', $event, node.id)"
    @dragend="emit('dragEnd', $event)"
  >
    <!-- Node Header -->
    <div
      class="flex cursor-pointer items-center gap-1.5 px-2 py-1.5 hover:bg-muted/50"
      @click="emit('toggle', node.id)"
    >
      <!-- Drag Handle -->
      <span class="cursor-grab text-muted-foreground/40 hover:text-muted-foreground">
        <Icon name="grip-vertical" size="xs" />
      </span>

      <!-- Expand Arrow -->
      <Icon
        :name="node.collapsed ? 'chevron-right' : 'chevron-down'"
        size="xs"
        class="text-muted-foreground"
      />

      <!-- Node Name -->
      <span class="flex-1 truncate text-xs text-foreground">{{ node.name }}</span>

      <!-- Enable Toggle -->
      <button
        :class="[
          'px-1 text-xs',
          node.enabled ? 'text-muted-foreground' : 'text-muted-foreground/50'
        ]"
        @click.stop="emit('toggleEnabled', node.id)"
      >
        <Icon :name="node.enabled ? 'eye' : 'eye-slash'" size="xs" />
      </button>
    </div>

    <!-- Node Content -->
    <div v-show="!node.collapsed && node.enabled" class="px-2 pb-2">
      <!-- Connected Inputs Info -->
      <div v-if="connectedInputs.length > 0" class="mb-2 flex flex-col gap-1">
        <div
          v-for="input in connectedInputs"
          :key="input.id"
          class="flex items-center gap-1.5 text-[10px] text-muted-foreground"
        >
          <Icon name="link" size="xs" class="opacity-50" />
          <span>{{ input.label }}</span>
          <span class="opacity-50">←</span>
          <span class="text-foreground">{{ input.connectedFrom }}</span>
        </div>
      </div>

      <!-- Editable Inputs -->
      <div v-if="visibleInputs.length > 0" class="flex flex-col gap-2">
        <div v-for="input in visibleInputs" :key="input.id" class="flex flex-col gap-0.5">
          <label class="text-[10px] text-muted-foreground">{{ input.label }}</label>

          <!-- Model/Select -->
          <select
            v-if="input.type === 'model' || input.type === 'select'"
            :value="formValues[input.id]"
            class="h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-primary"
            @change="emit('updateValue', input.id, ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in input.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>

          <!-- Textarea -->
          <textarea
            v-else-if="input.type === 'textarea'"
            :value="formValues[input.id] as string"
            :placeholder="input.placeholder"
            rows="2"
            class="w-full resize-none rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-primary"
            @input="emit('updateValue', input.id, ($event.target as HTMLTextAreaElement).value)"
          />

          <!-- Text -->
          <input
            v-else-if="input.type === 'text'"
            :value="formValues[input.id]"
            type="text"
            :placeholder="input.placeholder"
            class="h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-primary"
            @input="emit('updateValue', input.id, ($event.target as HTMLInputElement).value)"
          />

          <!-- Number -->
          <input
            v-else-if="input.type === 'number'"
            :value="formValues[input.id]"
            type="number"
            :min="input.min"
            :max="input.max"
            :step="input.step"
            class="h-7 w-full rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-primary"
            @input="emit('updateValue', input.id, Number(($event.target as HTMLInputElement).value))"
          />

          <!-- Seed -->
          <div v-else-if="input.type === 'seed'" class="flex gap-1">
            <input
              :value="formValues[input.id]"
              type="number"
              placeholder="-1"
              class="h-7 flex-1 rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-primary"
              @input="emit('updateValue', input.id, Number(($event.target as HTMLInputElement).value))"
            />
            <button
              class="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:bg-muted"
              @click="emit('randomizeSeed', input.id)"
            >
              <Icon name="refresh" size="xs" />
            </button>
          </div>

          <!-- Slider -->
          <div v-else-if="input.type === 'slider'" class="flex items-center gap-2">
            <input
              :value="formValues[input.id]"
              type="range"
              :min="input.min"
              :max="input.max"
              :step="input.step"
              class="h-1 flex-1 cursor-pointer appearance-none rounded bg-border [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
              @input="emit('updateValue', input.id, Number(($event.target as HTMLInputElement).value))"
            />
            <input
              :value="formValues[input.id]"
              type="number"
              :min="input.min"
              :max="input.max"
              :step="input.step"
              class="h-6 w-14 rounded border border-border bg-background px-1 text-center text-[10px] text-foreground outline-none focus:border-primary"
              @input="emit('updateValue', input.id, Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <!-- Toggle -->
          <button
            v-else-if="input.type === 'toggle'"
            :class="[
              'h-5 w-9 rounded-full transition-colors',
              formValues[input.id] ? 'bg-primary' : 'bg-border'
            ]"
            @click="emit('updateValue', input.id, !formValues[input.id])"
          >
            <span
              :class="[
                'block h-4 w-4 rounded-full bg-white shadow transition-transform',
                formValues[input.id] ? 'translate-x-4' : 'translate-x-0.5'
              ]"
            />
          </button>

          <!-- Image -->
          <div v-else-if="input.type === 'image'">
            <div v-if="!uploadedImages[input.id]" class="relative">
              <input
                type="file"
                accept="image/*"
                class="absolute inset-0 cursor-pointer opacity-0"
                @change="emit('uploadImage', input.id, $event)"
              />
              <div class="flex h-16 items-center justify-center rounded border border-dashed border-border text-muted-foreground hover:border-muted-foreground">
                <span class="text-[10px]">Drop image</span>
              </div>
            </div>
            <div v-else class="relative">
              <img :src="uploadedImages[input.id]" class="h-16 w-full rounded object-cover" />
              <button
                class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded bg-black/50 text-white hover:bg-red-500"
                @click="emit('removeImage', input.id)"
              >
                <Icon name="times" size="xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
