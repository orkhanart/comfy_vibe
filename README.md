# ComfyUI Prototypes

A Vue 3 + TypeScript UI/UX prototype for ComfyUI. This is a **frontend-only prototype** for rapid iteration on interface designs.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:5174)
pnpm dev

# Type check
pnpm typecheck

# Lint & format
pnpm lint:fix
pnpm format
```

## Project Structure

```
src/
├── components/          # Vue components
│   ├── ui/             # Base UI (shadcn-vue style)
│   ├── workflow-editor/ # Workflow editor mode
│   ├── linear-mode/    # Linear mode (simple workflow)
│   ├── workspace/      # Dashboard & management
│   ├── sidebar/        # Sidebar panels
│   ├── nodes/          # Node components & widgets
│   └── common/         # Shared components
│
├── views/              # Page components (routes)
│   ├── WorkflowEditorView.vue  # Workflow editor
│   ├── linear-mode/    # Linear mode
│   └── workspace/      # Dashboard views
│
├── stores/             # Pinia state management
│   ├── uiStore.ts      # UI state (theme, tabs, sidebars)
│   ├── linearModeStore.ts  # Linear workflow state
│   └── workspaceStore.ts   # Workspace context
│
├── data/               # Mock data (for prototyping)
├── types/              # TypeScript definitions
├── composables/        # Vue composables
└── services/           # API clients (not connected)
```

## Three UI Modes

| Mode | Route | Description |
|------|-------|-------------|
| **Workflow Editor** | `/workflow-editor` | Graph-based workflow editor (Vue Flow) |
| **Linear Mode** | `/linear-mode` | Simplified step-by-step interface |
| **Workspace** | `/workspace` | Dashboard for managing workflows, assets, models |

## Tech Stack

- **Vue 3.5** - Composition API with `<script setup>`
- **TypeScript** - Strict mode enabled
- **Pinia** - State management
- **Tailwind CSS v4** - Styling
- **Reka UI** - Headless components (shadcn-vue style)
- **Vue Flow** - Node graph visualization
- **Vite** - Build tool

## Key Files for Prototypers

| File | Purpose |
|------|---------|
| `src/stores/uiStore.ts` | Main UI state (theme, sidebars, tabs) |
| `src/data/linearTemplates.ts` | Linear mode workflow templates |
| `src/data/workspaceMockData.ts` | Mock workflows, assets, models |
| `src/components/ui/` | Base UI components to reuse |
| `.claude/rules.md` | Coding conventions |

## Adding a New Component

1. Create in appropriate folder (`components/<domain>/`)
2. Use `<script setup lang="ts">` syntax
3. Use Tailwind classes for styling
4. Import types from `src/types/`
5. Reuse UI components from `src/components/ui/`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="p-4">
    <h2 class="text-lg font-medium">{{ title }}</h2>
    <Button>Click me</Button>
  </div>
</template>
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm lint` | Check for linting errors |
| `pnpm lint:fix` | Auto-fix linting errors |
| `pnpm format` | Format code with Prettier |

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, then commit
git add .
git commit -m "feat: description"

# Push for preview deployment
git push origin feature/my-feature
```

Vercel auto-deploys preview URLs for each branch.

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Reka UI](https://reka-ui.com/)
- [Vue Flow](https://vueflow.dev/)
- [Lucide Icons](https://lucide.dev/icons/)
