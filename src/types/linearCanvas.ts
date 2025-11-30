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
 * Layout constants for auto-stacking
 */
export const CANVAS_LAYOUT = {
  FRAME_WIDTH: 320,
  FRAME_HEIGHT: 280,
  GAP: 24,
  COLUMNS: 3,
  START_X: 50,
  START_Y: 50,
} as const

/**
 * Calculate grid position for auto-stacking
 */
export function calculateGridPosition(index: number): { x: number; y: number } {
  const col = index % CANVAS_LAYOUT.COLUMNS
  const row = Math.floor(index / CANVAS_LAYOUT.COLUMNS)
  return {
    x: CANVAS_LAYOUT.START_X + col * (CANVAS_LAYOUT.FRAME_WIDTH + CANVAS_LAYOUT.GAP),
    y: CANVAS_LAYOUT.START_Y + row * (CANVAS_LAYOUT.FRAME_HEIGHT + CANVAS_LAYOUT.GAP),
  }
}
