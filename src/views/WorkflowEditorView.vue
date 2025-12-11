<script setup lang="ts">
import { ref, computed, onMounted, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import WorkflowEditorTabBar from '@/components/workflow-editor/WorkflowEditorTabBar.vue'
import WorkflowEditorLeftSidebar from '@/components/workflow-editor/WorkflowEditorLeftSidebar.vue'
import WorkflowEditorRightToolbar from '@/components/workflow-editor/WorkflowEditorRightToolbar.vue'
import WorkflowEditorRunControls from '@/components/workflow-editor/WorkflowEditorRunControls.vue'
import NodePropertiesPanel from '@/components/workflow-editor/NodePropertiesPanel.vue'
import { FlowNode } from '@/components/nodes'
import { NodesExtendedModal, ModelsExtendedModal, LibraryExtendedModal } from '@/components/common'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useUiStore, type SidebarTabId } from '@/stores/uiStore'
import { DEMO_WORKFLOW_NODES, DEMO_WORKFLOW_EDGES, SUBGRAPH_DATA } from '@/data/workflowMockData'

// Extended view modals
const showNodesModal = ref(false)
const showModelsModal = ref(false)
const showLibraryModal = ref(false)

import type { WorkflowEditorRouteParams } from '@/types/workflowEditor'
import type { FlowNodeData, NodeState } from '@/types/node'
import type { Node } from '@vue-flow/core'

const props = defineProps<WorkflowEditorRouteParams>()

const route = useRoute()
const router = useRouter()
const workspaceStore = useWorkspaceStore()
const uiStore = useUiStore()

// Sync sidebar tab with route
watch(
  () => route.meta.sidebar,
  (sidebar) => {
    if (sidebar) {
      uiStore.setSidebarTab(sidebar as SidebarTabId)
    }
  },
  { immediate: true }
)

// Sync route with sidebar tab changes
watch(
  () => uiStore.activeSidebarTab,
  (tab) => {
    const currentSidebar = route.meta.sidebar as string | undefined
    if (tab && tab !== currentSidebar) {
      // Navigate to the sidebar route
      router.push({ name: `workflow-editor-${tab}` })
    } else if (!tab && currentSidebar) {
      // Navigate back to base workflow-editor
      router.push({ name: 'workflow-editor' })
    }
  }
)

// Dynamic pattern color based on theme
const patternColor = computed(() => uiStore.themeMode === 'dark' ? '#27272a' : '#c0c0c0')

// Custom node types for Vue Flow
const nodeTypes = {
  flowNode: markRaw(FlowNode),
}

onMounted(() => {
  workspaceStore.setCurrentIds(props.workspaceId, props.projectId, props.workflowId)
  workspaceStore.openWorkflow(props.workflowId, props.workflowId, props.projectId)
})

// Vue Flow
const { onNodeClick, onNodeDoubleClick, onPaneClick, fitView, zoomIn, zoomOut } = useVueFlow()

// Center the workflow on mount with 50% zoom
onMounted(() => {
  setTimeout(() => {
    fitView({ padding: 0.3, maxZoom: 0.75 })
  }, 100)
})

// Store main workflow data separately so we can restore it
const mainWorkflowNodes = [...DEMO_WORKFLOW_NODES]
const mainWorkflowEdges = [...DEMO_WORKFLOW_EDGES]

// Workflow data - reactive to active subgraph
const nodes = ref([...DEMO_WORKFLOW_NODES])
const edges = ref([...DEMO_WORKFLOW_EDGES])

// Watch for subgraph changes and switch canvas content
watch(
  () => uiStore.activeSubgraphId,
  (newSubgraphId, oldSubgraphId) => {
    if (newSubgraphId) {
      // Entering a subgraph - load its internal nodes
      const subgraphData = SUBGRAPH_DATA[newSubgraphId]
      if (subgraphData) {
        nodes.value = [...subgraphData.nodes]
        edges.value = [...subgraphData.edges]
        // Fit view to new content
        setTimeout(() => fitView({ padding: 0.3, maxZoom: 1 }), 100)
      }
    } else {
      // Exiting subgraph - restore main workflow
      nodes.value = [...mainWorkflowNodes]
      edges.value = [...mainWorkflowEdges]
      // Fit view to main workflow
      setTimeout(() => fitView({ padding: 0.3, maxZoom: 0.75 }), 100)
    }
    // Clear selection when switching
    selectedNode.value = null
  }
)

const selectedNode = ref<Node<FlowNodeData> | null>(null)

onNodeClick(({ node }) => {
  selectedNode.value = node as Node<FlowNodeData>
})

onNodeDoubleClick(({ node }) => {
  const flowNode = node as Node<FlowNodeData>
  // Check if this is a subgraph node
  if (flowNode.data.definition.type === 'Subgraph' && flowNode.data.subgraphId) {
    uiStore.selectSubgraph(flowNode.data.subgraphId)
    console.log('Entering subgraph:', flowNode.data.subgraphId)
  }
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

// Extended view modals
function handleExtendLibrary(): void {
  showLibraryModal.value = true
}

function handleExtendNodes(): void {
  showNodesModal.value = true
}

function handleExtendModels(): void {
  showModelsModal.value = true
}
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <!-- Tab Bar -->
    <WorkflowEditorTabBar />

    <!-- Main content area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left sidebar -->
      <WorkflowEditorLeftSidebar
        @extend-library="handleExtendLibrary"
        @extend-nodes="handleExtendNodes"
        @extend-models="handleExtendModels"
      />

      <!-- Canvas area -->
      <main class="relative flex-1 bg-muted">
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
          <Background :pattern-color="patternColor" :gap="20" :size="1" />
        </VueFlow>

        <!-- Right toolbar -->
        <WorkflowEditorRightToolbar
          orientation="horizontal"
          @fit-view="fitView({ padding: 0.3 })"
          @zoom-in="zoomIn()"
          @zoom-out="zoomOut()"
        />

        <!-- Run Controls (top-right) -->
        <WorkflowEditorRunControls />
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

    <!-- Extended View Modals -->
    <NodesExtendedModal v-model:visible="showNodesModal" />
    <ModelsExtendedModal v-model:visible="showModelsModal" />
    <LibraryExtendedModal v-model:visible="showLibraryModal" />
  </div>
</template>

<style>
.vue-flow-canvas {
  width: 100%;
  height: 100%;
  background-color: var(--secondary-background);
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
