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
  // Group section settings
  GROUP_HEADER_HEIGHT: 40,
  GROUP_GAP: 60,
  GROUP_PADDING: 20,
  // Random placement bounds
  RANDOM_AREA_WIDTH: 1200,
  RANDOM_AREA_HEIGHT: 800,
  MIN_SPACING: 100,
} as const

/**
 * Status group labels and order
 */
export const STATUS_GROUPS = ['generating', 'queued', 'completed'] as const
export type StatusGroup = (typeof STATUS_GROUPS)[number]

export const STATUS_GROUP_LABELS: Record<StatusGroup, string> = {
  generating: 'Generating',
  queued: 'Queued',
  completed: 'Completed',
}

/**
 * Calculate position within a status group
 */
export function calculateGroupedPosition(
  status: StatusGroup,
  indexInGroup: number,
  groupStartY: number
): { x: number; y: number } {
  const col = indexInGroup % CANVAS_LAYOUT.COLUMNS
  const row = Math.floor(indexInGroup / CANVAS_LAYOUT.COLUMNS)

  return {
    x: CANVAS_LAYOUT.START_X + col * (CANVAS_LAYOUT.FRAME_WIDTH + CANVAS_LAYOUT.GAP),
    y: groupStartY + CANVAS_LAYOUT.GROUP_HEADER_HEIGHT + row * (CANVAS_LAYOUT.FRAME_HEIGHT + CANVAS_LAYOUT.GAP),
  }
}

/**
 * Calculate the Y position where each group starts
 */
export function calculateGroupStartPositions(
  generations: GenerationItem[]
): Record<StatusGroup, { startY: number; count: number }> {
  // Count items in each group
  const counts: Record<StatusGroup, number> = {
    generating: 0,
    queued: 0,
    completed: 0,
  }

  generations.forEach(gen => {
    counts[gen.status]++
  })

  // Calculate start Y for each group
  let currentY = CANVAS_LAYOUT.START_Y
  const result: Record<StatusGroup, { startY: number; count: number }> = {
    generating: { startY: 0, count: 0 },
    queued: { startY: 0, count: 0 },
    completed: { startY: 0, count: 0 },
  }

  for (const status of STATUS_GROUPS) {
    const count = counts[status]
    result[status] = { startY: currentY, count }

    if (count > 0) {
      const rows = Math.ceil(count / CANVAS_LAYOUT.COLUMNS)
      const groupHeight =
        CANVAS_LAYOUT.GROUP_HEADER_HEIGHT +
        rows * CANVAS_LAYOUT.FRAME_HEIGHT +
        (rows - 1) * CANVAS_LAYOUT.GAP +
        CANVAS_LAYOUT.GROUP_PADDING
      currentY += groupHeight + CANVAS_LAYOUT.GROUP_GAP
    }
  }

  return result
}

/**
 * Legacy: Calculate random position for canvas items (kept for asset nodes)
 * Uses seeded random so positions are consistent across renders
 */
export function calculateGridPosition(index: number): { x: number; y: number } {
  const col = index % CANVAS_LAYOUT.COLUMNS
  const row = Math.floor(index / CANVAS_LAYOUT.COLUMNS)

  return {
    x: CANVAS_LAYOUT.START_X + col * (CANVAS_LAYOUT.FRAME_WIDTH + CANVAS_LAYOUT.GAP),
    y: CANVAS_LAYOUT.START_Y + row * (CANVAS_LAYOUT.FRAME_HEIGHT + CANVAS_LAYOUT.GAP),
  }
}
