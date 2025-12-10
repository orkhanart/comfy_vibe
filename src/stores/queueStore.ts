import { ref, computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { comfyApi } from '@/services/comfyApi'
import type {
  QueueJob,
  QueueJobOutput,
  JobState,
  AutoQueueMode,
  WebSocketMessage,
  ProgressMessage,
  ExecutingMessage,
  ExecutedMessage
} from '@/types/queue'

export const useQueueStore = defineStore('queue', () => {
  // State
  const runningJobs = shallowRef<QueueJob[]>([])
  const pendingJobs = shallowRef<QueueJob[]>([])
  const historyJobs = shallowRef<QueueJob[]>([])
  const isLoading = ref(false)
  const maxHistoryItems = ref(64)

  // Auto-queue settings
  const autoQueueMode = ref<AutoQueueMode>('disabled')
  const batchCount = ref(1)

  // Current execution state
  const currentNodeName = ref<string | null>(null)
  const currentProgress = ref(0)
  const totalProgress = ref(0)
  const queueRemaining = ref(0)

  // Computed
  const allJobs = computed(() => [
    ...runningJobs.value,
    ...pendingJobs.value,
    ...historyJobs.value
  ])

  const runningCount = computed(() => runningJobs.value.length)
  const pendingCount = computed(() => pendingJobs.value.length)
  const hasRunningJobs = computed(() => runningJobs.value.length > 0)
  const hasPendingJobs = computed(() => pendingJobs.value.length > 0)
  const isExecuting = computed(() => hasRunningJobs.value || hasPendingJobs.value)

  const currentProgressPercent = computed(() => {
    if (currentProgress.value === 0) return 0
    return Math.round(currentProgress.value * 100)
  })

  const totalProgressPercent = computed(() => {
    if (totalProgress.value === 0) return 0
    return Math.round(totalProgress.value * 100)
  })

  // Actions
  async function fetchQueue(): Promise<void> {
    isLoading.value = true
    try {
      const queueData = await comfyApi.getQueue()

      // Parse running jobs
      runningJobs.value = queueData.queue_running.map(([index, promptId, data]) => ({
        id: promptId,
        promptId,
        queueIndex: index,
        state: 'running' as JobState,
        title: `Job #${index}`,
        outputs: [],
        createdAt: new Date()
      }))

      // Parse pending jobs
      pendingJobs.value = queueData.queue_pending.map(([index, promptId, data]) => ({
        id: promptId,
        promptId,
        queueIndex: index,
        state: 'pending' as JobState,
        title: `Job #${index}`,
        outputs: [],
        createdAt: new Date()
      }))
    } catch (error) {
      console.error('Failed to fetch queue:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchHistory(): Promise<void> {
    try {
      const historyData = await comfyApi.getHistory(maxHistoryItems.value)

      historyJobs.value = Object.entries(historyData).map(([promptId, data]: [string, any]) => {
        const prompt = data.prompt
        const status = data.status

        // Parse outputs from all nodes
        const outputs: QueueJobOutput[] = []
        if (data.outputs) {
          Object.entries(data.outputs).forEach(([nodeId, nodeOutput]: [string, any]) => {
            if (nodeOutput.images) {
              nodeOutput.images.forEach((img: any) => {
                outputs.push({
                  id: `${promptId}-${nodeId}-${img.filename}`,
                  nodeId,
                  filename: img.filename,
                  subfolder: img.subfolder || '',
                  type: img.type || 'output',
                  mediaType: getMediaType(img.filename)
                })
              })
            }
          })
        }

        return {
          id: promptId,
          promptId,
          queueIndex: prompt?.[0] || 0,
          state: (status?.completed ? 'completed' : 'failed') as JobState,
          title: `Job #${prompt?.[0] || 0}`,
          outputs,
          createdAt: new Date(),
          completedAt: new Date()
        }
      }).slice(0, maxHistoryItems.value)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  async function update(): Promise<void> {
    await Promise.all([fetchQueue(), fetchHistory()])
  }

  async function queuePrompt(prompt: unknown, clientId?: string): Promise<string | null> {
    try {
      const response = await comfyApi.queuePrompt(prompt, clientId)
      await fetchQueue()
      return response.prompt_id
    } catch (error) {
      console.error('Failed to queue prompt:', error)
      return null
    }
  }

  async function cancelJob(promptId: string): Promise<void> {
    try {
      await comfyApi.deleteFromQueue(promptId)
      // Update local state
      pendingJobs.value = pendingJobs.value.filter(j => j.promptId !== promptId)
    } catch (error) {
      console.error('Failed to cancel job:', error)
    }
  }

  async function deleteJob(promptId: string): Promise<void> {
    try {
      await comfyApi.deleteHistory(promptId)
      historyJobs.value = historyJobs.value.filter(j => j.promptId !== promptId)
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  async function clearQueue(): Promise<void> {
    try {
      await comfyApi.clearQueue()
      pendingJobs.value = []
    } catch (error) {
      console.error('Failed to clear queue:', error)
    }
  }

  async function clearHistory(): Promise<void> {
    try {
      await comfyApi.clearHistory()
      historyJobs.value = []
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }

  async function interrupt(): Promise<void> {
    try {
      await comfyApi.interrupt()
    } catch (error) {
      console.error('Failed to interrupt:', error)
    }
  }

  // WebSocket message handlers
  function handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'execution_start':
        handleExecutionStart(message.data.prompt_id)
        break
      case 'executing':
        handleExecuting(message as ExecutingMessage)
        break
      case 'progress':
        handleProgress(message as ProgressMessage)
        break
      case 'executed':
        handleExecuted(message as ExecutedMessage)
        break
      case 'execution_error':
        handleExecutionError(message.data.prompt_id, message.data.exception_message)
        break
      case 'status':
        queueRemaining.value = message.data.status.exec_info.queue_remaining
        break
    }
  }

  function handleExecutionStart(promptId: string): void {
    // Move from pending to running
    const jobIndex = pendingJobs.value.findIndex(j => j.promptId === promptId)
    if (jobIndex !== -1) {
      const job = { ...pendingJobs.value[jobIndex], state: 'running' as JobState, startedAt: new Date() }
      pendingJobs.value = pendingJobs.value.filter(j => j.promptId !== promptId)
      runningJobs.value = [...runningJobs.value, job]
    }
    currentProgress.value = 0
    totalProgress.value = 0
  }

  function handleExecuting(message: ExecutingMessage): void {
    const { node, prompt_id } = message.data
    if (node === null) {
      // Execution finished for this prompt
      const job = runningJobs.value.find(j => j.promptId === prompt_id)
      if (job) {
        const completedJob = { ...job, state: 'completed' as JobState, completedAt: new Date() }
        runningJobs.value = runningJobs.value.filter(j => j.promptId !== prompt_id)
        historyJobs.value = [completedJob, ...historyJobs.value].slice(0, maxHistoryItems.value)
      }
      currentNodeName.value = null
      currentProgress.value = 0
    } else {
      currentNodeName.value = node
    }
  }

  function handleProgress(message: ProgressMessage): void {
    const { value, max } = message.data
    currentProgress.value = value / max

    // Calculate total progress based on completed nodes
    // This is a simplified calculation
    if (runningJobs.value.length > 0) {
      totalProgress.value = currentProgress.value
    }
  }

  function handleExecuted(message: ExecutedMessage): void {
    const { node, prompt_id, output } = message.data

    // Add outputs to the job
    const job = runningJobs.value.find(j => j.promptId === prompt_id)
    if (job && output) {
      const newOutputs: QueueJobOutput[] = []

      if ((output as any).images) {
        (output as any).images.forEach((img: any) => {
          newOutputs.push({
            id: `${prompt_id}-${node}-${img.filename}`,
            nodeId: node,
            filename: img.filename,
            subfolder: img.subfolder || '',
            type: img.type || 'output',
            mediaType: getMediaType(img.filename)
          })
        })
      }

      if (newOutputs.length > 0) {
        job.outputs = [...job.outputs, ...newOutputs]
      }
    }
  }

  function handleExecutionError(promptId: string, errorMessage: string): void {
    const job = runningJobs.value.find(j => j.promptId === promptId)
    if (job) {
      const failedJob = {
        ...job,
        state: 'failed' as JobState,
        errorMessage,
        completedAt: new Date()
      }
      runningJobs.value = runningJobs.value.filter(j => j.promptId !== promptId)
      historyJobs.value = [failedJob, ...historyJobs.value].slice(0, maxHistoryItems.value)
    }
    currentNodeName.value = null
    currentProgress.value = 0
  }

  // Settings
  function setAutoQueueMode(mode: AutoQueueMode): void {
    autoQueueMode.value = mode
  }

  function setBatchCount(count: number): void {
    batchCount.value = Math.max(1, Math.min(100, count))
  }

  // Demo mode for testing without backend
  let demoJobCounter = 0
  let demoInterval: ReturnType<typeof setInterval> | null = null

  function runDemo(): void {
    const jobId = `demo-${++demoJobCounter}`
    const job: QueueJob = {
      id: jobId,
      promptId: jobId,
      queueIndex: demoJobCounter,
      state: 'running',
      title: `Demo Job #${demoJobCounter}`,
      outputs: [],
      createdAt: new Date()
    }

    runningJobs.value = [job]
    currentProgress.value = 0
    totalProgress.value = 0
    currentNodeName.value = 'KSampler'

    // Simulate progress
    let progress = 0
    const nodeNames = ['CLIP Text Encode', 'KSampler', 'VAE Decode', 'Save Image']
    let nodeIndex = 0

    demoInterval = setInterval(() => {
      progress += 0.02
      currentProgress.value = progress % 1
      totalProgress.value = Math.min(progress, 1)

      // Change node name periodically
      if (progress > (nodeIndex + 1) * 0.25 && nodeIndex < nodeNames.length - 1) {
        nodeIndex++
        currentNodeName.value = nodeNames[nodeIndex] || null
      }

      if (progress >= 1) {
        // Complete the job
        if (demoInterval) clearInterval(demoInterval)
        demoInterval = null

        const completedJob: QueueJob = {
          ...job,
          state: 'completed',
          completedAt: new Date(),
          outputs: [{
            id: `${jobId}-output`,
            nodeId: 'SaveImage',
            filename: 'demo_output.png',
            subfolder: '',
            type: 'output',
            mediaType: 'image'
          }]
        }

        runningJobs.value = []
        historyJobs.value = [completedJob, ...historyJobs.value].slice(0, maxHistoryItems.value)
        currentNodeName.value = null
        currentProgress.value = 0
        totalProgress.value = 0
      }
    }, 100)
  }

  function stopDemo(): void {
    if (demoInterval) {
      clearInterval(demoInterval)
      demoInterval = null
    }
    runningJobs.value = []
    pendingJobs.value = []
    currentNodeName.value = null
    currentProgress.value = 0
    totalProgress.value = 0
  }

  function addDemoToQueue(): void {
    const jobId = `demo-pending-${++demoJobCounter}`
    const job: QueueJob = {
      id: jobId,
      promptId: jobId,
      queueIndex: demoJobCounter,
      state: 'pending',
      title: `Queued Job #${demoJobCounter}`,
      outputs: [],
      createdAt: new Date()
    }
    pendingJobs.value = [...pendingJobs.value, job]
  }

  // Helpers
  function getMediaType(filename: string): QueueJobOutput['mediaType'] {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
      case 'gif':
        return 'image'
      case 'mp4':
      case 'webm':
      case 'mov':
        return 'video'
      case 'mp3':
      case 'wav':
      case 'flac':
        return 'audio'
      case 'glb':
      case 'gltf':
      case 'obj':
        return '3d'
      default:
        return 'unknown'
    }
  }

  function getOutputUrl(output: QueueJobOutput): string {
    return comfyApi.getImageUrl(output.filename, output.subfolder, output.type)
  }

  return {
    // State
    runningJobs,
    pendingJobs,
    historyJobs,
    isLoading,
    maxHistoryItems,
    autoQueueMode,
    batchCount,
    currentNodeName,
    currentProgress,
    totalProgress,
    queueRemaining,

    // Computed
    allJobs,
    runningCount,
    pendingCount,
    hasRunningJobs,
    hasPendingJobs,
    isExecuting,
    currentProgressPercent,
    totalProgressPercent,

    // Actions
    fetchQueue,
    fetchHistory,
    update,
    queuePrompt,
    cancelJob,
    deleteJob,
    clearQueue,
    clearHistory,
    interrupt,
    handleWebSocketMessage,
    setAutoQueueMode,
    setBatchCount,
    getOutputUrl,

    // Demo mode
    runDemo,
    stopDemo,
    addDemoToQueue
  }
})
