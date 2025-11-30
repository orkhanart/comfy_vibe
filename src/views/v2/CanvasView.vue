<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import CanvasTabBar from '@/components/v2/canvas/CanvasTabBar.vue'
import CanvasLeftSidebar from '@/components/v2/canvas/CanvasLeftSidebar.vue'
import CanvasBottomBar from '@/components/v2/canvas/CanvasBottomBar.vue'
import CanvasRightToolbar from '@/components/v2/canvas/CanvasRightToolbar.vue'
import CanvasRunControls from '@/components/v2/canvas/CanvasRunControls.vue'
import NodePropertiesPanel from '@/components/v2/canvas/NodePropertiesPanel.vue'
import { FlowNode } from '@/components/v2/nodes'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useUiStore } from '@/stores/uiStore'
import { DEMO_WORKFLOW_NODES, DEMO_WORKFLOW_EDGES } from '@/data/workflowMockData'
import { WORKFLOWS_DATA } from '@/data/sidebarMockData'
import Menu from 'primevue/menu'

import type { CanvasRouteParams } from '@/types/canvas'
import type { FlowNodeData, NodeState } from '@/types/node'
import type { Node } from '@vue-flow/core'

const props = defineProps<CanvasRouteParams>()

const workspaceStore = useWorkspaceStore()
const uiStore = useUiStore()

const isInterface2 = computed(() => uiStore.interface2Enabled)

// Custom node types for Vue Flow
const nodeTypes = {
  flowNode: markRaw(FlowNode),
}

onMounted(() => {
  workspaceStore.setCurrentIds(props.workspaceId, props.projectId, props.canvasId)
  workspaceStore.openCanvas(props.canvasId, props.canvasId, props.projectId)
  // Set canvas mode to node when this view mounts
  uiStore.setCanvasMode('node')
})

// Vue Flow
const { onNodeClick, onPaneClick, fitView, zoomIn, zoomOut } = useVueFlow()

// Center the workflow on mount with 50% zoom
onMounted(() => {
  setTimeout(() => {
    fitView({ padding: 0.3, maxZoom: 0.75 })
  }, 100)
})

// Workflow data
const nodes = ref([...DEMO_WORKFLOW_NODES])
const edges = ref([...DEMO_WORKFLOW_EDGES])

const selectedNode = ref<Node<FlowNodeData> | null>(null)

// Workflow dropdown
const workflowMenu = ref<InstanceType<typeof Menu> | null>(null)
const currentWorkflowName = ref(props.canvasId || 'Untitled Workflow')

const workflowMenuItems = computed(() =>
  WORKFLOWS_DATA.map(workflow => ({
    label: workflow.name,
    icon: 'pi pi-arrow-right',
    command: () => selectWorkflow(workflow.name),
    class: workflow.name === currentWorkflowName.value ? 'workflow-item-active' : ''
  }))
)

function toggleWorkflowMenu(event: Event): void {
  workflowMenu.value?.toggle(event)
}

function selectWorkflow(name: string): void {
  currentWorkflowName.value = name
}

onNodeClick(({ node }) => {
  selectedNode.value = node as Node<FlowNodeData>
})

onPaneClick(() => {
  selectedNode.value = null
})

// State toggle functions for demo
function toggleNodeState(state: NodeState): void {
  if (!selectedNode.value) return
  const node = nodes.value.find((n) => n.id === selectedNode.value?.id)
  if (node) {
    node.data.state = node.data.state === state ? 'idle' : state
  }
}

function toggleCollapsed(): void {
  if (!selectedNode.value) return
  const node = nodes.value.find((n) => n.id === selectedNode.value?.id)
  if (node) {
    node.data.flags.collapsed = !node.data.flags.collapsed
  }
}

function closePropertiesPanel(): void {
  selectedNode.value = null
}
</script>

<template>
  <div class="flex h-screen flex-col bg-white dark:bg-zinc-950">
    <!-- Tab Bar -->
    <CanvasTabBar />

    <!-- Main content area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left sidebar -->
      <CanvasLeftSidebar />

      <!-- Canvas area -->
      <main class="relative flex-1 bg-zinc-100 dark:bg-zinc-900">
        <!-- Vue Flow Canvas -->
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :default-viewport="{ x: 0, y: 0, zoom: 0.75 }"
          :min-zoom="0.1"
          :max-zoom="4"
          class="vue-flow-canvas"
        >
          <Background pattern-color="#27272a" :gap="20" :size="1" />
        </VueFlow>

        <!-- Interface 2.0: Floating bottom bar -->
        <CanvasBottomBar v-if="isInterface2" />

        <!-- Right toolbar: vertical for v2, horizontal for v1 -->
        <CanvasRightToolbar
          :orientation="isInterface2 ? 'vertical' : 'horizontal'"
          @fit-view="fitView({ padding: 0.3 })"
          @zoom-in="zoomIn()"
          @zoom-out="zoomOut()"
        />

        <!-- Workflow name dropdown -->
        <div class="absolute left-4 top-4 z-10">
          <button
            class="flex items-center gap-1.5 rounded bg-white/80 px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur transition-colors hover:bg-white/90 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800/90"
            @click="toggleWorkflowMenu"
          >
            <i class="pi pi-sitemap text-[10px] opacity-70" />
            {{ currentWorkflowName }}
            <i class="pi pi-chevron-down text-[10px] opacity-70" />
          </button>
          <Menu
            ref="workflowMenu"
            :model="workflowMenuItems"
            :popup="true"
            class="workflow-dropdown-menu"
          />
        </div>

        <!-- Run Controls (top-right) -->
        <CanvasRunControls />
      </main>

      <!-- Right sidebar - Node Properties -->
      <NodePropertiesPanel
        v-if="selectedNode"
        :node="selectedNode"
        @close="closePropertiesPanel"
        @toggle-state="toggleNodeState"
        @toggle-collapsed="toggleCollapsed"
      />
    </div>
  </div>
</template>

<style>
.vue-flow-canvas {
  width: 100%;
  height: 100%;
  background-color: #18181b;
}

/* Override default node styles - our FlowNode component handles its own styling */
.vue-flow .vue-flow__node-flowNode {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
}

.vue-flow .vue-flow__node-flowNode.selected {
  box-shadow: none;
}

/* Edge styling */
.vue-flow .vue-flow__edge-path {
  stroke-width: 2;
}

.vue-flow .vue-flow__edge.selected .vue-flow__edge-path {
  stroke-width: 3;
}

/* Handle styling - handles are invisible, SlotDots are the visual indicators */
.vue-flow .vue-flow__handle {
  opacity: 0 !important;
  width: 16px;
  height: 16px;
  background: transparent !important;
  border: none !important;
}

/* Connection line styling */
.vue-flow .vue-flow__connection-line {
  stroke: #3b82f6;
  stroke-width: 2;
}

</style>
