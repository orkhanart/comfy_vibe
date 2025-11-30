/**
 * Linear Canvas Type Definitions
 *
 * Types for the Canvas View in Linear Mode - displays generation frames
 * on an infinite canvas (Figma-like experience).
 */

/**
 * Generation parameters for canvas display
 */
export interface GenerationParameters {
  steps: number
  cfg: number
  width: number
  height: number
  seed: number
  sampler?: string
  model?: string
}

/**
 * Generation item for canvas - matches LinearHistoryPanel structure
 */
export interface GenerationItem {
  id: string
  prompt: string
  workflow: string
  mode: string
  status: 'completed' | 'generating' | 'queued'
  progress?: number
  createdAt: Date
  images: string[]
  batchSize: number
  parameters: GenerationParameters
}

/**
 * Data structure for generation frame VueFlow node
 */
export interface GenerationFrameData extends GenerationItem {
  // Additional canvas-specific properties can be added here
}

/**
 * Data structure for standalone asset node
 */
export interface AssetNodeData {
  id: string
  imageUrl: string
  sourceGenerationId: string
  sourceIndex: number
  prompt?: string
  seed?: number
  width: number
  height: number
  createdAt: Date
}

/**
 * Canvas viewport state
 */
export interface CanvasViewport {
  x: number
  y: number
  zoom: number
}

/**
 * View mode for the history panel
 */
export type HistoryViewMode = 'timeline' | 'canvas'

/**
 * Layout constants for canvas
 */
export const CANVAS_LAYOUT = {
  FRAME_WIDTH: 320,
  FRAME_HEIGHT: 280,
  GAP: 24,
  COLUMNS: 3,
  START_X: 50,
  START_Y: 50,
  // Random placement bounds
  RANDOM_AREA_WIDTH: 1200,
  RANDOM_AREA_HEIGHT: 800,
  MIN_SPACING: 100,
} as const

/**
 * Seeded random number generator for consistent positions
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

/**
 * Calculate random position for canvas items
 * Uses seeded random so positions are consistent across renders
 */
export function calculateGridPosition(index: number): { x: number; y: number } {
  // Use index as seed for consistent random positions
  const seed1 = index * 127 + 1
  const seed2 = index * 311 + 7

  // Spread items across a wider area with some randomness
  const baseCol = index % 4
  const baseRow = Math.floor(index / 4)

  // Add random offset to base grid position
  const randomOffsetX = (seededRandom(seed1) - 0.5) * 200
  const randomOffsetY = (seededRandom(seed2) - 0.5) * 150

  return {
    x: CANVAS_LAYOUT.START_X + baseCol * (CANVAS_LAYOUT.FRAME_WIDTH + 80) + randomOffsetX,
    y: CANVAS_LAYOUT.START_Y + baseRow * (CANVAS_LAYOUT.FRAME_HEIGHT + 60) + randomOffsetY,
  }
}
