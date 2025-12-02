<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Link, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { useComfyStore } from '@/stores/comfyStore'

const comfyStore = useComfyStore()
const isConnecting = ref(false)

async function connectToServer() {
  isConnecting.value = true
  try {
    await comfyStore.connect()
  } finally {
    isConnecting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-8">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">ComfyUI Prototypes</CardTitle>
        <CardDescription>Prototype new features for ComfyUI</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'inline-block h-3 w-3 rounded-full',
                comfyStore.isConnected ? 'bg-green-500' : 'bg-red-500'
              ]"
            />
            <span>
              {{
                comfyStore.isConnected
                  ? 'Connected to ComfyUI'
                  : 'Not connected'
              }}
            </span>
          </div>

          <Button
            :disabled="isConnecting"
            @click="
              comfyStore.isConnected
                ? $router.push('/nodemode/default/untitled')
                : connectToServer()
            "
          >
            <Loader2 v-if="isConnecting" class="size-4 animate-spin" />
            <ArrowRight v-else-if="comfyStore.isConnected" class="size-4" />
            <Link v-else class="size-4" />
            {{ comfyStore.isConnected ? 'Open Editor' : 'Connect' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
