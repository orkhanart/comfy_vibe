/**
 * Queue types matching ComfyUI frontend queue system
 */

export type JobState = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export type AutoQueueMode = 'disabled' | 'instant' | 'change'

export interface QueueJob {
  id: string
  promptId: string
  queueIndex: number
  state: JobState
  title: string
  workflowName?: string
  progress?: {
    currentNode?: string
    currentPercent: number
    totalPercent: number
  }
  outputs: QueueJobOutput[]
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  errorMessage?: string
}

export interface QueueJobOutput {
  id: string
  nodeId: string
  filename: string
  subfolder: string
  type: 'output' | 'input' | 'temp'
  mediaType: 'image' | 'video' | 'audio' | '3d' | 'unknown'
}

export interface QueueSettings {
  mode: AutoQueueMode
  batchCount: number
}

export interface QueueState {
  runningJobs: QueueJob[]
  pendingJobs: QueueJob[]
  historyJobs: QueueJob[]
  isLoading: boolean
  maxHistoryItems: number
}

// API response types
export interface QueueApiResponse {
  queue_running: Array<[number, string, unknown]>
  queue_pending: Array<[number, string, unknown]>
}

export interface HistoryApiResponse {
  [promptId: string]: {
    prompt: [number, string, unknown, unknown]
    outputs: Record<string, { images?: Array<{ filename: string; subfolder: string; type: string }> }>
    status: {
      status_str: string
      completed: boolean
      messages: Array<[string, unknown]>
    }
  }
}

// WebSocket message types
export interface ExecutionStartMessage {
  type: 'execution_start'
  data: {
    prompt_id: string
  }
}

export interface ExecutingMessage {
  type: 'executing'
  data: {
    node: string | null
    prompt_id: string
  }
}

export interface ProgressMessage {
  type: 'progress'
  data: {
    value: number
    max: number
    prompt_id?: string
    node?: string
  }
}

export interface ExecutedMessage {
  type: 'executed'
  data: {
    node: string
    prompt_id: string
    output: Record<string, unknown>
  }
}

export interface ExecutionErrorMessage {
  type: 'execution_error'
  data: {
    prompt_id: string
    node_id: string
    node_type: string
    exception_message: string
    exception_type: string
  }
}

export interface StatusMessage {
  type: 'status'
  data: {
    status: {
      exec_info: {
        queue_remaining: number
      }
    }
  }
}

export type WebSocketMessage =
  | ExecutionStartMessage
  | ExecutingMessage
  | ProgressMessage
  | ExecutedMessage
  | ExecutionErrorMessage
  | StatusMessage
