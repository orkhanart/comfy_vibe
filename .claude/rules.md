# ComfyUI Prototypes

A Vue 3 + TypeScript **frontend-only UI/UX prototype** for ComfyUI. No backend required.

## Quick Start

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:5174)
pnpm typecheck        # Check TypeScript types
pnpm lint:fix         # Fix linting errors
pnpm build            # Production build
```

## Three UI Modes

| Mode | Route | Description |
|------|-------|-------------|
| **Workflow Editor** | `/workflow-editor` | Graph-based workflow editor (Vue Flow) |
| **Linear Mode** | `/linear-mode` | Simplified step-by-step interface |
| **Workspace** | `/workspace` | Dashboard for workflows, assets, models |

## Tech Stack

- **Vue 3.5+** - Composition API with `<script setup>`
- **TypeScript** - Strict mode
- **Pinia** - State management
- **Tailwind CSS v4** - Styling
- **Reka UI** - Headless components (shadcn-vue style)
- **Vue Flow** - Node graph editor
- **Lucide** - Icons

## Project Structure

```
src/
├── components/
│   ├── ui/              # Base UI components (DO NOT modify)
│   ├── workflow-editor/ # Workflow editor mode
│   ├── linear-mode/     # Linear mode
│   ├── workspace/       # Dashboard
│   ├── sidebar/         # Sidebar panels
│   ├── nodes/           # Node & widgets
│   └── common/          # Shared components
├── views/               # Page components (routes)
├── stores/              # Pinia stores
├── data/                # Mock data
├── types/               # TypeScript types
├── composables/         # Vue composables
└── lib/                 # Utilities
```

## Available UI Components

Located in `src/components/ui/` (imported from index files):

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
```

### Adding New UI Components

```bash
npx shadcn-vue@latest add <component-name>
# Example: npx shadcn-vue@latest add dropdown-menu
```

## Icons (Lucide)

```vue
<script setup>
import { Plus, Settings, Trash2, Search } from 'lucide-vue-next'
</script>

<template>
  <Plus class="size-4" />
  <Settings :size="20" />
</template>
```

Browse icons: https://lucide.dev/icons/

## Theme / Dark Mode

Theme is managed in `uiStore`:

```typescript
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
uiStore.theme        // 'light' | 'dark'
uiStore.toggleTheme() // Switch theme
```

Use theme-aware Tailwind classes:

```vue
<!-- These adapt to light/dark automatically -->
<div class="bg-background text-foreground">
<div class="bg-card border-border">
<div class="bg-muted text-muted-foreground">
<div class="bg-primary text-primary-foreground">
```

## Key Files

| File | What it does |
|------|--------------|
| `src/stores/uiStore.ts` | UI state (theme, sidebars, tabs) |
| `src/stores/linearModeStore.ts` | Linear mode workflow state |
| `src/data/workspaceMockData.ts` | Mock workflows, assets, models |
| `src/data/linearTemplates.ts` | Linear mode templates |
| `src/types/node.ts` | Node type definitions |

## Composables

```typescript
// Folder navigation with drag & drop
import { useFolders } from '@/composables/common/useFolders'

// Analytics tracking
import { useAnalytics } from '@/composables/useAnalytics'
```

## Component Template

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'

interface Props {
  title: string
  variant?: 'default' | 'outline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="p-4 rounded-lg bg-card border border-border">
    <h2 class="text-lg font-medium">{{ title }}</h2>
    <Button :variant="variant" @click="emit('click')">
      <Plus class="size-4 mr-2" />
      Add Item
    </Button>
  </div>
</template>
```

## Styling Guidelines

### Use Tailwind Classes

```vue
<!-- Good -->
<div class="flex items-center gap-2 p-4 rounded-lg bg-card">

<!-- Avoid inline styles -->
<div style="display: flex; padding: 16px;">
```

### Spacing Scale

Use consistent spacing: `gap-1`, `gap-2`, `gap-3`, `gap-4`, `p-2`, `p-4`, etc.

### Common Patterns

```vue
<!-- Card container -->
<div class="rounded-lg border border-border bg-card p-4">

<!-- Flex row with gap -->
<div class="flex items-center gap-2">

<!-- Grid layout -->
<div class="grid grid-cols-3 gap-4">

<!-- Hover state -->
<div class="hover:bg-accent transition-colors">

<!-- Truncate text -->
<span class="truncate">{{ longText }}</span>
```

### Dynamic Classes

```typescript
import { cn } from '@/lib/utils'

// Conditional classes
<div :class="cn('base-class', { 'active': isActive })">

// Merge with props
<div :class="cn('default-styles', props.class)">
```

## Rules

### Do's
- Reuse existing components from `src/components/ui/`
- Use Tailwind classes for styling
- Keep components under 500 lines
- Use TypeScript types from `src/types/`
- Extract repeated logic to composables

### Don'ts
- Don't modify files in `src/components/ui/`
- Don't hardcode colors (use Tailwind theme classes)
- Don't use inline styles for standard values
- Don't create duplicate components

## Import Order

```typescript
// 1. Vue
import { ref, computed } from 'vue'

// 2. External libraries
import { useVueFlow } from '@vue-flow/core'

// 3. Types
import type { NodeDefinition } from '@/types/node'

// 4. Stores
import { useUiStore } from '@/stores/uiStore'

// 5. Components
import { Button } from '@/components/ui/button'

// 6. Icons
import { Plus, Settings } from 'lucide-vue-next'

// 7. Utilities
import { cn } from '@/lib/utils'
```

## File Naming

- Components: `PascalCase.vue` → `WorkflowCard.vue`
- Composables: `useCamelCase.ts` → `useFolders.ts`
- Stores: `camelCaseStore.ts` → `uiStore.ts`
- Types: `camelCase.ts` → `node.ts`
