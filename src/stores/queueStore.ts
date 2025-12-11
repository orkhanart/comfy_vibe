import { ref, computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import { comfyApi } from '@/services/comfyApi'
import { useModelsStore, type ModelType, type BaseModel } from './modelsStore'
import type {
  QueueJob,
  QueueJobOutput,
  JobState,
  AutoQueueMode,
  WebSocketMessage,
  ProgressMessage,
  ExecutingMessage,
  ExecutedMessage,
  DownloadJob,
  DownloadSource
} from '@/types/queue'

export const useQueueStore = defineStore('queue', () => {
  // State - Workflow Jobs
  const runningJobs = shallowRef<QueueJob[]>([])
  const pendingJobs = shallowRef<QueueJob[]>([])
  const historyJobs = shallowRef<QueueJob[]>([])
  const isLoading = ref(false)
  const maxHistoryItems = ref(64)

  // State - Download Jobs
  const downloadJobs = shallowRef<DownloadJob[]>([])

  // Auto-queue settings
  const autoQueueMode = ref<AutoQueueMode>('disabled')
  const batchCount = ref(1)

  // UI state
  const showQueuePanel = ref(false)

  // Current execution state
  const currentNodeName = ref<string | null>(null)
  const currentProgress = ref(0)
  const totalProgress = ref(0)
  const queueRemaining = ref(0)

  // Computed - Workflow Jobs
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

  // Computed - Download Jobs
  const activeDownloads = computed(() =>
    downloadJobs.value.filter(j => j.state === 'running' || j.state === 'pending')
  )
  const downloadHistory = computed(() =>
    downloadJobs.value.filter(j => j.state === 'completed' || j.state === 'failed' || j.state === 'cancelled')
  )
  const runningDownloads = computed(() =>
    downloadJobs.value.filter(j => j.state === 'running')
  )
  const pendingDownloads = computed(() =>
    downloadJobs.value.filter(j => j.state === 'pending')
  )
  const hasActiveDownloads = computed(() => activeDownloads.value.length > 0)
  const downloadCount = computed(() => activeDownloads.value.length)

  // Computed - Combined (for unified queue view)
  const allActiveJobs = computed(() => [
    ...runningJobs.value,
    ...pendingJobs.value,
    ...runningDownloads.value,
    ...pendingDownloads.value
  ])
  const totalActiveCount = computed(() =>
    runningCount.value + pendingCount.value + downloadCount.value
  )
  const hasAnyActiveJobs = computed(() => isExecuting.value || hasActiveDownloads.value)

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

  // ============================================
  // Download Job Actions
  // ============================================

  // Helper to format bytes for display
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  let downloadJobCounter = 0
  let downloadIntervals: Map<string, ReturnType<typeof setInterval>> = new Map()

  function addDownloadJob(
    sourceUrl: string,
    modelName: string,
    source: DownloadSource = 'civitai',
    modelType?: ModelType,
    baseModel?: BaseModel
  ): DownloadJob {
    const jobId = `download-${++downloadJobCounter}-${Date.now()}`
    const job: DownloadJob = {
      id: jobId,
      type: 'download',
      state: 'pending',
      title: modelName,
      source,
      sourceUrl,
      modelName,
      modelType,
      baseModel,
      createdAt: new Date()
    }

    downloadJobs.value = [job, ...downloadJobs.value]

    // Auto-start if no other download is running
    if (runningDownloads.value.length === 0) {
      startNextDownload()
    }

    // Auto-open queue panel when download starts
    showQueuePanel.value = true

    return job
  }

  function startNextDownload(): void {
    const nextJob = pendingDownloads.value[0]
    if (!nextJob) return

    // Start the download (simulation for now)
    simulateDownload(nextJob.id)
  }

  function simulateDownload(jobId: string): void {
    const job = downloadJobs.value.find(j => j.id === jobId)
    if (!job || job.state !== 'pending') return

    // Update to running
    downloadJobs.value = downloadJobs.value.map(j =>
      j.id === jobId
        ? { ...j, state: 'running' as JobState, startedAt: new Date() }
        : j
    )

    // Simulate file size (1-5 GB)
    const totalBytes = Math.floor(Math.random() * 4 * 1024 * 1024 * 1024) + 1024 * 1024 * 1024
    let downloadedBytes = 0

    const interval = setInterval(() => {
      // Simulate download speed (10-50 MB/s)
      const speed = Math.floor(Math.random() * 40 * 1024 * 1024) + 10 * 1024 * 1024
      downloadedBytes = Math.min(downloadedBytes + speed / 10, totalBytes)

      const percent = Math.round((downloadedBytes / totalBytes) * 100)
      const eta = Math.round((totalBytes - downloadedBytes) / speed)

      // Update progress
      downloadJobs.value = downloadJobs.value.map(j =>
        j.id === jobId
          ? {
              ...j,
              progress: {
                percent,
                downloadedBytes,
                totalBytes,
                speed,
                eta
              }
            }
          : j
      )

      // Check if complete
      if (downloadedBytes >= totalBytes) {
        clearInterval(interval)
        downloadIntervals.delete(jobId)

        // Get job before updating for model store
        const completedJob = downloadJobs.value.find(j => j.id === jobId)

        // Mark as completed
        downloadJobs.value = downloadJobs.value.map(j =>
          j.id === jobId
            ? {
                ...j,
                state: 'completed' as JobState,
                completedAt: new Date(),
                progress: { ...j.progress!, percent: 100 },
                result: {
                  filePath: `models/checkpoints/${j.modelName.toLowerCase().replace(/\s+/g, '_')}.safetensors`,
                  fileSize: totalBytes
                }
              }
            : j
        )

        // Add model to models store
        if (completedJob) {
          const modelsStore = useModelsStore()
          const modelType = completedJob.modelType || 'checkpoint'
          const baseModel = completedJob.baseModel || 'SDXL'

          modelsStore.addModel({
            name: completedJob.modelName,
            type: modelType as ModelType,
            baseModel: baseModel as BaseModel,
            size: formatBytes(totalBytes),
            sizeBytes: totalBytes,
            version: '1.0',
            source: 'imported',
            sourceUrl: completedJob.sourceUrl,
          })

          // Show success toast
          toast.success('Model imported successfully', {
            description: `${completedJob.modelName} (${formatBytes(totalBytes)}) is now available in your library.`,
          })
        }

        // Start next download if any
        startNextDownload()
      }
    }, 100)

    downloadIntervals.set(jobId, interval)
  }

  function cancelDownload(jobId: string): void {
    const interval = downloadIntervals.get(jobId)
    if (interval) {
      clearInterval(interval)
      downloadIntervals.delete(jobId)
    }

    downloadJobs.value = downloadJobs.value.map(j =>
      j.id === jobId
        ? { ...j, state: 'cancelled' as JobState, completedAt: new Date() }
        : j
    )

    // Start next download if this was running
    startNextDownload()
  }

  function retryDownload(jobId: string): void {
    const job = downloadJobs.value.find(j => j.id === jobId)
    if (!job || (job.state !== 'failed' && job.state !== 'cancelled')) return

    // Reset job state
    downloadJobs.value = downloadJobs.value.map(j =>
      j.id === jobId
        ? { ...j, state: 'pending' as JobState, progress: undefined, errorMessage: undefined }
        : j
    )

    // Start if no other download running
    if (runningDownloads.value.length === 0) {
      startNextDownload()
    }
  }

  function deleteDownload(jobId: string): void {
    const interval = downloadIntervals.get(jobId)
    if (interval) {
      clearInterval(interval)
      downloadIntervals.delete(jobId)
    }

    downloadJobs.value = downloadJobs.value.filter(j => j.id !== jobId)
  }

  function clearDownloadHistory(): void {
    // Only remove completed/failed/cancelled downloads
    downloadJobs.value = downloadJobs.value.filter(
      j => j.state === 'running' || j.state === 'pending'
    )
  }

  // Parse model info from CivitAI URL
  function parseModelUrl(url: string): { source: DownloadSource; modelName: string } {
    try {
      const urlObj = new URL(url)

      if (urlObj.hostname.includes('civitai.com')) {
        // Extract model name from URL path
        // Format: /models/123456/model-name or /models/123456
        const pathParts = urlObj.pathname.split('/')
        const modelIndex = pathParts.indexOf('models')
        if (modelIndex !== -1 && pathParts[modelIndex + 2]) {
          // Convert slug to readable name: "flux-1-dev-lora" -> "Flux 1 Dev Lora"
          const slug = pathParts[modelIndex + 2]
          const modelName = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          return { source: 'civitai', modelName }
        }
        const modelId = pathParts[modelIndex + 1] || ''
        return {
          source: 'civitai',
          modelName: `CivitAI Model ${modelId}`
        }
      }

      if (urlObj.hostname.includes('huggingface.co')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean)
        // Format: /org/model-name or /model-name
        const modelName = pathParts.length >= 2
          ? pathParts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : pathParts[0] || 'HuggingFace Model'
        return {
          source: 'huggingface',
          modelName
        }
      }

      return {
        source: 'url',
        modelName: urlObj.pathname.split('/').pop() || 'Downloaded Model'
      }
    } catch {
      return {
        source: 'url',
        modelName: 'Downloaded Model'
      }
    }
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
    // State - Workflow Jobs
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

    // State - Download Jobs
    downloadJobs,

    // UI State
    showQueuePanel,

    // Computed - Workflow Jobs
    allJobs,
    runningCount,
    pendingCount,
    hasRunningJobs,
    hasPendingJobs,
    isExecuting,
    currentProgressPercent,
    totalProgressPercent,

    // Computed - Download Jobs
    activeDownloads,
    downloadHistory,
    runningDownloads,
    pendingDownloads,
    hasActiveDownloads,
    downloadCount,

    // Computed - Combined
    allActiveJobs,
    totalActiveCount,
    hasAnyActiveJobs,

    // Actions - Workflow Jobs
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

    // Actions - Download Jobs
    addDownloadJob,
    cancelDownload,
    retryDownload,
    deleteDownload,
    clearDownloadHistory,
    parseModelUrl,

    // Demo mode
    runDemo,
    stopDemo,
    addDemoToQueue
  }
})
