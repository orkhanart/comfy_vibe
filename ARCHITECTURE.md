# Architecture Overview

## Application Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.vue                                  │
│  - Vue Router outlet                                            │
│  - Toast notifications (vue-sonner)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│WorkflowEditor   │  │   LinearView    │  │  WorkspaceView  │
│/workflow-editor │  │  /linear-mode   │  │  /workspace     │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ Node-based      │  │ Step-by-step    │  │ Dashboard &     │
│ graph editor    │  │ simple UI       │  │ management      │
│ (Vue Flow)      │  │ (templates)     │  │ (files, assets) │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## State Management (Pinia Stores)

### uiStore.ts - Central UI State

The main store managing UI state across all modes.

```typescript
// Key state
theme: 'light' | 'dark'           // Persisted to localStorage
leftSidebarOpen: boolean          // Sidebar visibility
rightSidebarOpen: boolean
activeLeftTab: string             // Current sidebar tab
workflowTabs: WorkflowTab[]       // Open workflow tabs
selectedNodeId: string | null     // Currently selected node

// Node categories (11 categories)
NODE_CATEGORIES: {
  Loaders, Conditioning, Sampling, Latent,
  Image, Mask, Audio, Video, 3D, Advanced, API
}
```

### linearModeStore.ts - Linear Mode State

Manages step-by-step workflow execution.

```typescript
selectedTemplateId: string | null  // Active template
currentWorkflow: WorkflowInstance  // Running workflow
generatedOutputs: Output[]         // Generated images/videos
workflowHistory: HistoryEntry[]    // Past executions
```

### workspaceStore.ts - Workspace Context

Manages current workspace/project context.

```typescript
currentWorkspaceId: string | null
currentProjectId: string | null
openWorkflows: string[]
```

## Component Hierarchy

### UI Components (`src/components/ui/`)

Base components following shadcn-vue patterns:

```
ui/
├── button/Button.vue      # Primary interactive element
├── card/                  # Card, CardHeader, CardContent, etc.
├── dialog/                # Modal dialogs
├── input/Input.vue        # Text input
├── select/                # Dropdown selector
├── switch/Switch.vue      # Toggle switch
├── textarea/Textarea.vue  # Multi-line input
├── popover/               # Floating popover
└── icon/Icon.vue          # Icon wrapper
```

### Workflow Editor (`src/components/workflow-editor/`)

Node editor components:

```
workflow-editor/
├── CanvasTabBar.vue       # Workflow tabs at top
├── CanvasLeftSidebar.vue  # Library/nodes/templates
├── CanvasRightToolbar.vue # Properties panel
├── NodePropertiesPanel.vue
├── LibrarySidebar.vue
├── WorkflowsSidebar.vue
└── CanvasShareDialog.vue
```

### Linear Mode (`src/components/linear-mode/`)

Simplified workflow interface:

```
linear-mode/
├── LinearTopBar.vue          # Header with controls
├── LinearSidebar.vue         # Assets/workflows tabs
├── LinearHistoryPanel.vue    # Queue and history
├── LinearParametersPanel.vue # Input parameters
├── LinearNodeItem.vue        # Step representation
└── LinearMediaViewerModal.vue
```

### Workspace (`src/components/workspace/`)

Dashboard and file management:

```
workspace/
├── WorkspaceLayout.vue      # Main layout wrapper
├── WorkspaceSidebar.vue     # Navigation
├── WorkspaceTopBar.vue      # Header
├── WorkflowCard.vue         # Workflow preview card
├── AssetCard.vue            # Generated asset card
├── ModelCard.vue            # AI model card
├── FolderCard.vue           # Folder navigation
└── ResourceListView.vue     # Generic list display
```

### Node Components (`src/components/nodes/`)

Node graph building blocks:

```
nodes/
├── FlowNode.vue             # Main node component
├── NodeHeader.vue           # Node title bar
├── NodeSlots.vue            # Input/output slots
├── NodeWidgets.vue          # Parameter widgets
├── SlotDot.vue              # Connection point
└── widgets/
    ├── WidgetColor.vue
    ├── WidgetNumber.vue
    ├── WidgetSelect.vue
    ├── WidgetSlider.vue
    ├── WidgetText.vue
    └── WidgetToggle.vue
```

## Data Flow

### Mock Data (`src/data/`)

All data is mocked for prototyping:

```
data/
├── linearTemplates.ts     # Pre-built workflow templates
├── workspaceMockData.ts   # Workflows, assets, models, folders
├── sidebarMockData.ts     # Node catalog, model list
└── nodeDefinitions.ts     # Node type definitions
```

### Type Definitions (`src/types/`)

```
types/
├── node.ts            # Node, Slot, Widget types
├── workflowEditor.ts  # Workflow editor route params
├── linear.ts          # Linear mode types
└── linearCanvas.ts    # Linear canvas types
```

## Routing Structure

```typescript
// Main routes
'/'                    → AuthView (landing)
'/home'                → HomeView (connection status)
'/workflow-editor/:id?' → WorkflowEditorView
'/linear-mode/:id?'    → LinearView
'/workspace'           → WorkspaceView (parent)

// Workspace child routes
'/workspace/workflows'       → WorkflowsView
'/workspace/assets'          → AssetsView
'/workspace/models'          → ModelsView
'/workspace/nodes'           → NodesView
'/workspace/templates'       → TemplatesView
'/workspace/settings'        → SettingsView
'/workspace/projects/:id'    → ProjectView
```

## Styling System

### Tailwind CSS v4

Uses CSS custom properties for theming:

```css
/* Theme colors (in main.css) */
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--primary: 240 5.9% 10%;
--muted: 240 4.8% 95.9%;
--accent: 240 4.8% 95.9%;
--border: 240 5.9% 90%;
```

### Dark Mode

Controlled via `uiStore.theme` and Tailwind's class strategy:

```vue
<div :class="{ dark: theme === 'dark' }">
  <!-- Content adapts to theme -->
</div>
```

## Key Patterns

### 1. Component Composition

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
const isOpen = computed(() => uiStore.leftSidebarOpen)
</script>
```

### 2. Props & Emits

```vue
<script setup lang="ts">
interface Props {
  title: string
  variant?: 'default' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

### 3. Composables

```typescript
// src/composables/common/useFolders.ts
export function useFolders(type: FolderType) {
  const currentFolderId = computed(() => ...)
  const navigateToFolder = (id: string) => { ... }

  return { currentFolderId, navigateToFolder }
}
```

## File Size Guidelines

- **Max 500 lines per file**
- Split large components into sub-components
- Extract logic to composables
- Group related types in dedicated files

## Development Guidelines

1. **Read before write** - Check existing code before adding new
2. **Reuse components** - Use `src/components/ui/` base components
3. **Type everything** - Import types from `src/types/`
4. **Use stores** - Access state via Pinia, not prop drilling
5. **Follow naming** - PascalCase components, camelCase files
