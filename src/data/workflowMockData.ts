import type { Node, Edge } from '@vue-flow/core'
import type { FlowNodeData, NodeState } from '@/types/node'
import {
  LOAD_CHECKPOINT,
  CLIP_TEXT_ENCODE,
  KSAMPLER,
  EMPTY_LATENT_IMAGE,
  VAE_DECODE,
  SAVE_IMAGE,
  SUBGRAPH,
  SUBGRAPH_INPUT,
  SUBGRAPH_OUTPUT,
  IMAGE_UPSCALE,
  IMAGE_SHARPEN,
} from '@/data/nodeDefinitions'

// Helper to create FlowNodeData
export function createNodeData(
  definition: typeof LOAD_CHECKPOINT,
  overrides: Partial<FlowNodeData> = {}
): FlowNodeData {
  return {
    definition,
    widgetValues: Object.fromEntries(
      definition.widgets.map((w) => [w.name, w.value])
    ),
    state: 'idle' as NodeState,
    flags: {},
    ...overrides,
  }
}

// Sample workflow nodes
export const DEMO_WORKFLOW_NODES: Node<FlowNodeData>[] = [
  {
    id: 'load-checkpoint',
    type: 'flowNode',
    position: { x: 50, y: 150 },
    data: createNodeData(LOAD_CHECKPOINT),
  },
  {
    id: 'empty-latent',
    type: 'flowNode',
    position: { x: 50, y: 400 },
    data: createNodeData(EMPTY_LATENT_IMAGE),
  },
  {
    id: 'clip-text-pos',
    type: 'flowNode',
    position: { x: 350, y: 50 },
    data: createNodeData(CLIP_TEXT_ENCODE, {
      title: 'Positive Prompt',
      widgetValues: { text: 'beautiful mountain landscape, sunset, dramatic lighting, 8k, detailed' },
    }),
  },
  {
    id: 'clip-text-neg',
    type: 'flowNode',
    position: { x: 350, y: 280 },
    data: createNodeData(CLIP_TEXT_ENCODE, {
      title: 'Negative Prompt',
      widgetValues: { text: 'blurry, low quality, watermark, text' },
    }),
  },
  {
    id: 'ksampler',
    type: 'flowNode',
    position: { x: 700, y: 150 },
    data: createNodeData(KSAMPLER, {
      state: 'executing',
      progress: 0.65,
    }),
  },
  {
    id: 'vae-decode',
    type: 'flowNode',
    position: { x: 1050, y: 200 },
    data: createNodeData(VAE_DECODE),
  },
  {
    id: 'upscale-subgraph',
    type: 'flowNode',
    position: { x: 1300, y: 200 },
    data: createNodeData(SUBGRAPH, {
      title: 'Upscale Pipeline',
      subgraphId: 'subgraph-upscale-1',
    }),
  },
  {
    id: 'save-image',
    type: 'flowNode',
    position: { x: 1550, y: 200 },
    data: createNodeData(SAVE_IMAGE),
  },
]

// Edges with proper slot connections
export const DEMO_WORKFLOW_EDGES: Edge[] = [
  // LoadCheckpoint -> CLIP Text Encode (Positive)
  {
    id: 'e1',
    source: 'load-checkpoint',
    sourceHandle: 'output-1', // CLIP output
    target: 'clip-text-pos',
    targetHandle: 'input-0', // clip input
    style: { stroke: '#ffcc80', strokeWidth: 2 },
  },
  // LoadCheckpoint -> CLIP Text Encode (Negative)
  {
    id: 'e2',
    source: 'load-checkpoint',
    sourceHandle: 'output-1', // CLIP output
    target: 'clip-text-neg',
    targetHandle: 'input-0', // clip input
    style: { stroke: '#ffcc80', strokeWidth: 2 },
  },
  // LoadCheckpoint -> KSampler (model)
  {
    id: 'e3',
    source: 'load-checkpoint',
    sourceHandle: 'output-0', // MODEL output
    target: 'ksampler',
    targetHandle: 'input-0', // model input
    style: { stroke: '#b39ddb', strokeWidth: 2 },
  },
  // CLIP Positive -> KSampler (positive)
  {
    id: 'e4',
    source: 'clip-text-pos',
    sourceHandle: 'output-0', // CONDITIONING output
    target: 'ksampler',
    targetHandle: 'input-1', // positive input
    style: { stroke: '#ffab40', strokeWidth: 2 },
  },
  // CLIP Negative -> KSampler (negative)
  {
    id: 'e5',
    source: 'clip-text-neg',
    sourceHandle: 'output-0', // CONDITIONING output
    target: 'ksampler',
    targetHandle: 'input-2', // negative input
    style: { stroke: '#ffab40', strokeWidth: 2 },
  },
  // Empty Latent -> KSampler (latent_image)
  {
    id: 'e6',
    source: 'empty-latent',
    sourceHandle: 'output-0', // LATENT output
    target: 'ksampler',
    targetHandle: 'input-3', // latent_image input
    style: { stroke: '#ff80ab', strokeWidth: 2 },
  },
  // KSampler -> VAE Decode (samples)
  {
    id: 'e7',
    source: 'ksampler',
    sourceHandle: 'output-0', // LATENT output
    target: 'vae-decode',
    targetHandle: 'input-0', // samples input
    style: { stroke: '#ff80ab', strokeWidth: 2 },
  },
  // LoadCheckpoint -> VAE Decode (vae)
  {
    id: 'e8',
    source: 'load-checkpoint',
    sourceHandle: 'output-2', // VAE output
    target: 'vae-decode',
    targetHandle: 'input-1', // vae input
    style: { stroke: '#ef5350', strokeWidth: 2 },
  },
  // VAE Decode -> Upscale Subgraph
  {
    id: 'e9',
    source: 'vae-decode',
    sourceHandle: 'output-0', // IMAGE output
    target: 'upscale-subgraph',
    targetHandle: 'input-0', // input_1
    style: { stroke: '#64b5f6', strokeWidth: 2 },
  },
  // Upscale Subgraph -> Save Image
  {
    id: 'e10',
    source: 'upscale-subgraph',
    sourceHandle: 'output-0', // output_1
    target: 'save-image',
    targetHandle: 'input-0', // images input
    style: { stroke: '#78909C', strokeWidth: 2 },
  },
]

// ============================================
// SUBGRAPH INTERNAL NODES (Upscale Pipeline)
// ============================================

export const SUBGRAPH_UPSCALE_NODES: Node<FlowNodeData>[] = [
  {
    id: 'subgraph-input',
    type: 'flowNode',
    position: { x: 50, y: 150 },
    data: createNodeData(SUBGRAPH_INPUT, {
      title: 'Image Input',
    }),
  },
  {
    id: 'image-upscale',
    type: 'flowNode',
    position: { x: 300, y: 100 },
    data: createNodeData(IMAGE_UPSCALE, {
      widgetValues: { upscale_method: 'lanczos', scale_by: 2 },
    }),
  },
  {
    id: 'sharpen-subgraph',
    type: 'flowNode',
    position: { x: 550, y: 150 },
    data: createNodeData(SUBGRAPH, {
      title: 'Sharpen Pipeline',
      subgraphId: 'subgraph-sharpen-1',
    }),
  },
  {
    id: 'subgraph-output',
    type: 'flowNode',
    position: { x: 800, y: 150 },
    data: createNodeData(SUBGRAPH_OUTPUT, {
      title: 'Image Output',
    }),
  },
]

export const SUBGRAPH_UPSCALE_EDGES: Edge[] = [
  // Input -> Upscale
  {
    id: 'sub-e1',
    source: 'subgraph-input',
    sourceHandle: 'output-0',
    target: 'image-upscale',
    targetHandle: 'input-0',
    style: { stroke: '#64b5f6', strokeWidth: 2 },
  },
  // Upscale -> Sharpen Subgraph
  {
    id: 'sub-e2',
    source: 'image-upscale',
    sourceHandle: 'output-0',
    target: 'sharpen-subgraph',
    targetHandle: 'input-0',
    style: { stroke: '#78909C', strokeWidth: 2 },
  },
  // Sharpen Subgraph -> Output
  {
    id: 'sub-e3',
    source: 'sharpen-subgraph',
    sourceHandle: 'output-0',
    target: 'subgraph-output',
    targetHandle: 'input-0',
    style: { stroke: '#78909C', strokeWidth: 2 },
  },
]

// ============================================
// SUBGRAPH INTERNAL NODES (Sharpen Pipeline - nested inside Upscale)
// ============================================

export const SUBGRAPH_SHARPEN_NODES: Node<FlowNodeData>[] = [
  {
    id: 'sharpen-input',
    type: 'flowNode',
    position: { x: 50, y: 150 },
    data: createNodeData(SUBGRAPH_INPUT, {
      title: 'Image Input',
    }),
  },
  {
    id: 'sharpen-node-1',
    type: 'flowNode',
    position: { x: 300, y: 100 },
    data: createNodeData(IMAGE_SHARPEN, {
      title: 'Light Sharpen',
      widgetValues: { strength: 0.5 },
    }),
  },
  {
    id: 'sharpen-node-2',
    type: 'flowNode',
    position: { x: 550, y: 150 },
    data: createNodeData(IMAGE_SHARPEN, {
      title: 'Detail Sharpen',
      widgetValues: { strength: 1.2 },
    }),
  },
  {
    id: 'sharpen-output',
    type: 'flowNode',
    position: { x: 800, y: 150 },
    data: createNodeData(SUBGRAPH_OUTPUT, {
      title: 'Image Output',
    }),
  },
]

export const SUBGRAPH_SHARPEN_EDGES: Edge[] = [
  // Input -> Light Sharpen
  {
    id: 'sharpen-e1',
    source: 'sharpen-input',
    sourceHandle: 'output-0',
    target: 'sharpen-node-1',
    targetHandle: 'input-0',
    style: { stroke: '#64b5f6', strokeWidth: 2 },
  },
  // Light Sharpen -> Detail Sharpen
  {
    id: 'sharpen-e2',
    source: 'sharpen-node-1',
    sourceHandle: 'output-0',
    target: 'sharpen-node-2',
    targetHandle: 'input-0',
    style: { stroke: '#64b5f6', strokeWidth: 2 },
  },
  // Detail Sharpen -> Output
  {
    id: 'sharpen-e3',
    source: 'sharpen-node-2',
    sourceHandle: 'output-0',
    target: 'sharpen-output',
    targetHandle: 'input-0',
    style: { stroke: '#64b5f6', strokeWidth: 2 },
  },
]

// Map of subgraph IDs to their internal nodes, edges, and parent info
export const SUBGRAPH_DATA: Record<string, { nodes: Node<FlowNodeData>[]; edges: Edge[]; parentId?: string }> = {
  'subgraph-upscale-1': {
    nodes: SUBGRAPH_UPSCALE_NODES,
    edges: SUBGRAPH_UPSCALE_EDGES,
    parentId: undefined, // Top-level subgraph (parent is main workflow)
  },
  'subgraph-sharpen-1': {
    nodes: SUBGRAPH_SHARPEN_NODES,
    edges: SUBGRAPH_SHARPEN_EDGES,
    parentId: 'subgraph-upscale-1', // Nested inside Upscale Pipeline
  },
}
