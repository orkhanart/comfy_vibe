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

## UI/UX Heuristics (Nielsen's 10 Principles)

Based on [Jakob Nielsen's 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)

### 1. Visibility of System Status

Always keep users informed about what's happening.

```vue
<!-- Show loading states -->
<Button :disabled="isLoading">
  <Loader2 v-if="isLoading" class="size-4 animate-spin mr-2" />
  {{ isLoading ? 'Saving...' : 'Save' }}
</Button>

<!-- Show progress for long operations -->
<Progress :value="progress" />
<span class="text-sm text-muted-foreground">{{ progress }}% complete</span>

<!-- Indicate selection state -->
<div :class="cn('border rounded-lg p-2', selected && 'ring-2 ring-primary')">
```

**Rules:**
- Always show loading spinners during async operations
- Display progress bars for operations > 2 seconds
- Highlight selected/active items clearly
- Show success/error toasts after user actions

### 2. Match Between System and Real World

Use familiar language and concepts.

```vue
<!-- Good: Clear, user-friendly labels -->
<Button>Create Workflow</Button>
<Button>Add Image</Button>
<Button variant="destructive">Delete</Button>

<!-- Avoid: Technical jargon -->
<Button>Instantiate Pipeline</Button>
<Button>Append Blob Reference</Button>
```

**Rules:**
- Use action verbs: "Create", "Add", "Save", "Delete"
- Avoid internal/technical terms in UI text
- Use icons that match real-world objects (trash for delete, folder for directory)
- Order options logically (chronologically, alphabetically, or by importance)

### 3. User Control and Freedom

Provide clear exits and undo options.

```vue
<!-- Always provide cancel/close options -->
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Workflow</DialogTitle>
      <DialogClose /> <!-- X button -->
    </DialogHeader>
    <!-- content -->
    <DialogFooter>
      <Button variant="outline" @click="cancel">Cancel</Button>
      <Button @click="save">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<!-- Support undo for destructive actions -->
<Button @click="deleteWithUndo">
  Delete
</Button>
<!-- Toast with undo -->
<Toast>
  Workflow deleted. <Button variant="link" @click="undo">Undo</Button>
</Toast>
```

**Rules:**
- Every modal must have a close button and Cancel option
- Support Escape key to close dialogs/popovers
- Provide undo for destructive actions (delete, clear, reset)
- Never trap users in a flow without exit

### 4. Consistency and Standards

Follow established patterns.

```vue
<!-- Consistent button placement -->
<DialogFooter>
  <Button variant="outline">Cancel</Button>  <!-- Secondary left -->
  <Button>Confirm</Button>                   <!-- Primary right -->
</DialogFooter>

<!-- Consistent icon meanings -->
<Plus />     <!-- Always means "add/create" -->
<Trash2 />   <!-- Always means "delete" -->
<Settings /> <!-- Always means "settings/config" -->
<X />        <!-- Always means "close/dismiss" -->
```

**Rules:**
- Primary action buttons always on the right
- Destructive buttons use `variant="destructive"`
- Icons should have consistent meanings across the app
- Use the same terminology everywhere (don't mix "Delete" and "Remove")
- Follow platform conventions (Cmd on Mac, Ctrl on Windows)

### 5. Error Prevention

Prevent problems before they occur.

```vue
<!-- Disable invalid actions -->
<Button :disabled="!canSubmit">Submit</Button>

<!-- Confirm destructive actions -->
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Workflow</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete "{{ workflowName }}".
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction @click="deleteWorkflow">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

<!-- Provide smart defaults -->
<Input v-model="filename" placeholder="Untitled Workflow" />
```

**Rules:**
- Disable buttons when action isn't valid
- Require confirmation for destructive/irreversible actions
- Use input constraints (maxlength, type="number", etc.)
- Provide sensible default values
- Auto-save work when possible

### 6. Recognition Rather Than Recall

Make options visible; don't require memorization.

```vue
<!-- Show recent items -->
<div class="space-y-1">
  <p class="text-sm text-muted-foreground">Recent workflows</p>
  <Button v-for="workflow in recentWorkflows" variant="ghost">
    {{ workflow.name }}
  </Button>
</div>

<!-- Use autocomplete -->
<Command>
  <CommandInput placeholder="Search nodes..." />
  <CommandList>
    <CommandItem v-for="node in filteredNodes">
      <node.icon class="size-4 mr-2" />
      {{ node.name }}
    </CommandItem>
  </CommandList>
</Command>

<!-- Show previews -->
<Card class="group">
  <img :src="workflow.thumbnail" alt="" class="aspect-video" />
  <CardContent>{{ workflow.name }}</CardContent>
</Card>
```

**Rules:**
- Show recently used items
- Use visual previews/thumbnails for workflows
- Provide search with autocomplete
- Display keyboard shortcuts next to menu items
- Show tooltips for icon-only buttons

### 7. Flexibility and Efficiency of Use

Support both novice and expert users.

```vue
<!-- Keyboard shortcuts for power users -->
<DropdownMenuItem @click="save">
  Save
  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>

<!-- Multiple ways to perform actions -->
<!-- 1. Menu item -->
<DropdownMenuItem>Duplicate</DropdownMenuItem>
<!-- 2. Right-click context menu -->
<ContextMenuItem>Duplicate</ContextMenuItem>
<!-- 3. Keyboard shortcut: Cmd+D -->

<!-- Allow customization -->
<Tabs v-model="viewMode">
  <TabsList>
    <TabsTrigger value="grid">Grid</TabsTrigger>
    <TabsTrigger value="list">List</TabsTrigger>
  </TabsList>
</Tabs>
```

**Rules:**
- Implement keyboard shortcuts for common actions
- Support right-click context menus
- Allow drag-and-drop where intuitive
- Provide grid/list view options
- Remember user preferences (last view, sort order)

### 8. Aesthetic and Minimalist Design

Show only what's needed.

```vue
<!-- Progressive disclosure -->
<Collapsible>
  <CollapsibleTrigger>Advanced Options</CollapsibleTrigger>
  <CollapsibleContent>
    <!-- Advanced settings hidden by default -->
  </CollapsibleContent>
</Collapsible>

<!-- Clean, focused cards -->
<Card>
  <CardContent class="p-4">
    <h3 class="font-medium truncate">{{ workflow.name }}</h3>
    <p class="text-sm text-muted-foreground">
      {{ formatDate(workflow.updatedAt) }}
    </p>
  </CardContent>
</Card>
<!-- Don't add: view count, star rating, share buttons, etc. unless needed -->
```

**Rules:**
- Hide advanced options in collapsible sections
- Use whitespace effectively
- One primary action per screen/card
- Remove decorative elements that don't aid comprehension
- Truncate long text; show full on hover

### 9. Help Users Recover from Errors

Clear error messages with solutions.

```vue
<!-- Good error message -->
<Alert variant="destructive">
  <AlertCircle class="size-4" />
  <AlertTitle>Upload failed</AlertTitle>
  <AlertDescription>
    The file "image.png" exceeds the 10MB limit.
    Please choose a smaller file or compress the image.
  </AlertDescription>
</Alert>

<!-- Inline validation with guidance -->
<div class="space-y-1">
  <Input v-model="name" :class="{ 'border-destructive': error }" />
  <p v-if="error" class="text-sm text-destructive">
    {{ error }}
  </p>
</div>
```

**Rules:**
- Use plain language, not error codes
- Explain what went wrong specifically
- Suggest how to fix the problem
- Show errors inline, close to the source
- Use `variant="destructive"` styling for errors

### 10. Help and Documentation

Provide contextual help when needed.

```vue
<!-- Tooltips for unclear items -->
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <HelpCircle class="size-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>CFG Scale controls how closely the image follows the prompt.</p>
      <p class="text-muted-foreground">Recommended: 7-9</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

<!-- Empty states with guidance -->
<div class="text-center py-12">
  <FolderOpen class="size-12 mx-auto text-muted-foreground" />
  <h3 class="mt-4 font-medium">No workflows yet</h3>
  <p class="text-muted-foreground">Create your first workflow to get started.</p>
  <Button class="mt-4">
    <Plus class="size-4 mr-2" />
    New Workflow
  </Button>
</div>
```

**Rules:**
- Add tooltips for technical/unfamiliar controls
- Provide helpful empty states with next action
- Use placeholder text to show expected input format
- Link to documentation for complex features
- Show onboarding hints for new users
