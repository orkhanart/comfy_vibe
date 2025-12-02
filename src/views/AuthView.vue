<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Users } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUiStore } from '@/stores/uiStore'

const router = useRouter()
const uiStore = useUiStore()

const username = ref('')

type AccountType = 'user' | 'teams'

function signIn(accountType: AccountType): void {
  if (!username.value.trim()) return
  router.push('/workspace')
}
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left Side - Branding with Background Image -->
    <div
      class="relative hidden w-1/2 flex-col justify-between p-12 lg:flex"
      style="background: url('/signin.png') center/cover no-repeat"
    >
      <!-- Overlay for better text readability -->
      <div class="absolute inset-0 bg-black/40" />

      <!-- Content -->
      <div class="relative z-10">
        <img
          src="/assets/images/comfy-logo-mono.svg"
          alt="ComfyUI"
          class="h-10"
        />
      </div>

      <div class="relative z-10">
        <blockquote class="text-lg text-white">
          "The most powerful and modular diffusion model GUI and backend."
        </blockquote>
        <p class="mt-4 text-white/70">Open Source Community</p>
      </div>
    </div>

    <!-- Right Side - Auth Form -->
    <div
      class="flex w-full flex-col items-center justify-center bg-base-background text-base-foreground p-8 lg:w-1/2"
    >
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="mb-8 lg:hidden">
          <img
            :src="uiStore.themeMode === 'dark' ? '/assets/images/comfy-logo-mono.svg' : '/comfy-logo-blue.svg'"
            alt="ComfyUI"
            class="h-8"
          />
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-base-foreground">Welcome</h1>
          <p class="mt-2 text-muted-foreground">
            Enter your username to get started
          </p>
        </div>

        <!-- Form -->
        <div class="flex flex-col gap-6">
          <!-- Username Input -->
          <div class="flex flex-col gap-2">
            <label for="username" class="font-medium text-base-foreground">Username</label>
            <Input
              id="username"
              v-model="username"
              placeholder="Enter your username"
              class="w-full"
              @keyup.enter="signIn('user')"
            />
          </div>

          <!-- Account Type Buttons -->
          <div class="flex flex-col gap-3">
            <p class="text-sm text-muted-foreground">Select account type</p>

            <div class="grid grid-cols-2 gap-4">
              <Button
                :disabled="!username.trim()"
                class="w-full"
                @click="signIn('user')"
              >
                <User class="size-4" />
                User
              </Button>
              <Button
                variant="secondary"
                :disabled="!username.trim()"
                class="w-full"
                @click="signIn('teams')"
              >
                <Users class="size-4" />
                Teams
              </Button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <p class="mt-8 text-center text-sm text-muted-foreground">
          This is a prototype interface for testing purposes
        </p>
      </div>
    </div>
  </div>
</template>
