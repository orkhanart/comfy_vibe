import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type SidebarTabId = 'nodes' | 'models' | 'workflows' | 'assets' | 'templates' | null

export interface SidebarTab {
  id: Exclude<SidebarTabId, null>
  label: string
  icon: string
  tooltip: string
}

// ============================================================================
// NODE CATEGORY SYSTEM (TouchDesigner/Houdini-style 2-level)
// ============================================================================

export type NodeCategoryId =
  | 'loaders'
  | 'conditioning'
  | 'sampling'
  | 'latent'
  | 'image'
  | 'mask'
  | 'audio'
  | 'video'
  | '3d'
  | 'advanced'
  | 'api'
  | null

export interface NodeSubcategory {
  id: string
  label: string
  nodes: string[] // Node names
}

export interface NodeCategory {
  id: Exclude<NodeCategoryId, null>
  label: string
  shortLabel: string // 3-4 char for icon bar
  icon: string
  color: string
  subcategories: NodeSubcategory[]
}

// Main node categories with subcategories and color coding
export const NODE_CATEGORIES: NodeCategory[] = [
  {
    id: 'loaders',
    label: 'Loaders',
    shortLabel: 'LOAD',
    icon: 'download',
    color: '#B39DDB', // Purple
    subcategories: [
      { id: 'checkpoints', label: 'Checkpoints', nodes: ['CheckpointLoader', 'CheckpointLoaderSimple', 'unCLIPCheckpointLoader'] },
      { id: 'lora', label: 'LoRA', nodes: ['LoraLoader', 'LoraLoaderModelOnly'] },
      { id: 'vae', label: 'VAE', nodes: ['VAELoader'] },
      { id: 'clip', label: 'CLIP', nodes: ['CLIPLoader', 'DualCLIPLoader', 'CLIPVisionLoader', 'TripleCLIPLoader'] },
      { id: 'controlnet', label: 'ControlNet', nodes: ['ControlNetLoader', 'DiffControlNetLoader'] },
      { id: 'unet', label: 'UNET', nodes: ['UNETLoader'] },
      { id: 'images', label: 'Images', nodes: ['LoadImage', 'LoadImageMask', 'LoadImageOutput'] },
      { id: 'other', label: 'Other', nodes: ['GLIGENLoader', 'StyleModelLoader', 'DiffusersLoader'] },
    ],
  },
  {
    id: 'conditioning',
    label: 'Conditioning',
    shortLabel: 'COND',
    icon: 'comment',
    color: '#FFAB40', // Orange
    subcategories: [
      { id: 'text-encode', label: 'Text Encoding', nodes: ['CLIPTextEncode', 'CLIPTextEncodeSDXL', 'CLIPTextEncodeSD3'] },
      { id: 'clip', label: 'CLIP Operations', nodes: ['CLIPSetLastLayer', 'CLIPVisionEncode'] },
      { id: 'controlnet', label: 'ControlNet', nodes: ['ControlNetApply', 'ControlNetApplyAdvanced'] },
      { id: 'area-mask', label: 'Area & Mask', nodes: ['ConditioningSetArea', 'ConditioningSetAreaPercentage', 'ConditioningSetAreaStrength', 'ConditioningSetMask'] },
      { id: 'combine', label: 'Combine', nodes: ['ConditioningCombine', 'ConditioningConcat', 'ConditioningAverage'] },
      { id: 'style', label: 'Style & GLIGEN', nodes: ['StyleModelApply', 'GLIGENTextBoxApply', 'unCLIPConditioning'] },
      { id: 'other', label: 'Other', nodes: ['ConditioningSetTimestepRange', 'ConditioningZeroOut', 'InpaintModelConditioning'] },
    ],
  },
  {
    id: 'sampling',
    label: 'Sampling',
    shortLabel: 'SMPL',
    icon: 'play',
    color: '#64B5F6', // Blue
    subcategories: [
      { id: 'basic', label: 'Basic', nodes: ['KSampler', 'KSamplerAdvanced'] },
      { id: 'custom-samplers', label: 'Custom Samplers', nodes: ['SamplerCustom', 'SamplerCustomAdvanced'] },
      { id: 'schedulers', label: 'Schedulers', nodes: ['BasicScheduler', 'KarrasScheduler', 'ExponentialScheduler', 'PolyexponentialScheduler', 'AlignYourStepsScheduler'] },
      { id: 'guiders', label: 'Guiders', nodes: ['BasicGuider', 'CFGGuider', 'DualCFGGuider'] },
      { id: 'noise', label: 'Noise', nodes: ['RandomNoise', 'DisableNoise'] },
      { id: 'sigmas', label: 'Sigmas', nodes: ['SplitSigmas', 'FlipSigmas', 'SplitSigmasDenoise'] },
    ],
  },
  {
    id: 'latent',
    label: 'Latent',
    shortLabel: 'LAT',
    icon: 'th-large',
    color: '#FF80AB', // Pink
    subcategories: [
      { id: 'create', label: 'Create', nodes: ['EmptyLatentImage', 'EmptySD3LatentImage'] },
      { id: 'encode-decode', label: 'Encode / Decode', nodes: ['VAEEncode', 'VAEDecode', 'VAEEncodeTiled', 'VAEDecodeTiled', 'VAEEncodeForInpaint'] },
      { id: 'transform', label: 'Transform', nodes: ['LatentUpscale', 'LatentUpscaleBy', 'LatentCrop', 'LatentRotate', 'LatentFlip'] },
      { id: 'composite', label: 'Composite', nodes: ['LatentComposite', 'LatentBlend', 'SetLatentNoiseMask'] },
      { id: 'batch', label: 'Batch', nodes: ['LatentFromBatch', 'RepeatLatentBatch'] },
      { id: 'io', label: 'Save / Load', nodes: ['SaveLatent', 'LoadLatent'] },
    ],
  },
  {
    id: 'image',
    label: 'Image',
    shortLabel: 'IMG',
    icon: 'image',
    color: '#4DD0E1', // Cyan
    subcategories: [
      { id: 'io', label: 'Load & Save', nodes: ['LoadImage', 'SaveImage', 'PreviewImage'] },
      { id: 'transform', label: 'Transform', nodes: ['ImageScale', 'ImageScaleBy', 'ImageCrop', 'ImageRotate', 'ImageFlip'] },
      { id: 'batch', label: 'Batch', nodes: ['ImageBatch', 'ImageFromBatch', 'RepeatImageBatch'] },
      { id: 'composite', label: 'Composite', nodes: ['ImageComposite', 'ImageBlend', 'ImagePadForOutpaint'] },
      { id: 'adjust', label: 'Adjustments', nodes: ['ImageInvert', 'ImageSharpen', 'ImageBlur'] },
      { id: 'upscale', label: 'Upscaling', nodes: ['ImageUpscaleWithModel', 'UpscaleModelLoader'] },
    ],
  },
  {
    id: 'mask',
    label: 'Mask',
    shortLabel: 'MASK',
    icon: 'circle',
    color: '#FFD54F', // Yellow
    subcategories: [
      { id: 'create', label: 'Create', nodes: ['SolidMask', 'EmptyMask', 'ImageToMask', 'MaskFromColor'] },
      { id: 'composite', label: 'Composite', nodes: ['MaskComposite', 'CombineMasks'] },
      { id: 'transform', label: 'Transform', nodes: ['CropMask', 'FeatherMask', 'GrowMask', 'ThresholdMask'] },
      { id: 'convert', label: 'Convert', nodes: ['MaskToImage', 'ImageToMask', 'InvertMask'] },
    ],
  },
  {
    id: 'audio',
    label: 'Audio',
    shortLabel: 'AUD',
    icon: 'volume-up',
    color: '#81C784', // Green
    subcategories: [
      { id: 'io', label: 'Load & Save', nodes: ['LoadAudio', 'SaveAudio', 'SaveAudioMP3', 'SaveAudioOpus', 'PreviewAudio', 'RecordAudio'] },
      { id: 'encode-decode', label: 'Encode / Decode', nodes: ['VAEEncodeAudio', 'VAEDecodeAudio'] },
      { id: 'process', label: 'Processing', nodes: ['AudioAdjustVolume', 'AudioConcat', 'AudioMerge', 'TrimAudioDuration', 'SplitAudioChannels'] },
      { id: 'latent', label: 'Latent', nodes: ['EmptyLatentAudio', 'EmptyAudio'] },
    ],
  },
  {
    id: 'video',
    label: 'Video',
    shortLabel: 'VID',
    icon: 'video',
    color: '#26A69A', // Teal
    subcategories: [
      { id: 'generation', label: 'Generation', nodes: ['SVD_img2vid_Conditioning', 'VideoLinearCFGGuidance'] },
      { id: 'wan', label: 'Wan', nodes: ['WanImageToVideo', 'WanFunInpaintToVideo', 'WanCameraEmbedding'] },
      { id: 'hunyuan', label: 'Hunyuan', nodes: ['HunyuanImageToVideo'] },
      { id: 'ltxv', label: 'LTXV', nodes: ['LTXVImgToVideo', 'LTXVConditioning'] },
      { id: 'mochi', label: 'Mochi', nodes: ['MochiImageEncode'] },
      { id: 'cosmos', label: 'Cosmos', nodes: ['CosmosImageToVideoConditioning'] },
    ],
  },
  {
    id: '3d',
    label: '3D',
    shortLabel: '3D',
    icon: 'box',
    color: '#EF5350', // Red
    subcategories: [
      { id: 'hunyuan3d', label: 'Hunyuan3D', nodes: ['Hunyuan3Dv2Conditioning', 'Hunyuan3Dv2ConditioningMultiView'] },
      { id: 'mesh', label: 'Mesh', nodes: ['Load3D', 'Load3DAnimation', 'Preview3D'] },
      { id: 'point-cloud', label: 'Point Cloud', nodes: ['StableZero123_Conditioning'] },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    shortLabel: 'ADV',
    icon: 'cog',
    color: '#78909C', // Gray
    subcategories: [
      { id: 'model-merging', label: 'Model Merging', nodes: ['ModelMergeSimple', 'ModelMergeBlocks', 'ModelMergeSD1', 'ModelMergeSDXL'] },
      { id: 'model-patches', label: 'Model Patches', nodes: ['PatchModelAddDownscale', 'FreeU', 'FreeU_V2'] },
      { id: 'hooks', label: 'Hooks', nodes: ['CreateHookLora', 'CreateHookModelAsLora', 'SetClipHooks'] },
      { id: 'debug', label: 'Debug', nodes: ['DebugLog', 'DebugPrint'] },
      { id: 'experimental', label: 'Experimental', nodes: ['SamplerEulerCFGpp'] },
    ],
  },
  {
    id: 'api',
    label: 'API',
    shortLabel: 'API',
    icon: 'cloud',
    color: '#7E57C2', // Dark Purple
    subcategories: [
      { id: 'image-gen', label: 'Image Generation', nodes: ['OpenAI DALL-E', 'Stability AI', 'Recraft', 'Ideogram', 'BFL Flux'] },
      { id: 'video-gen', label: 'Video Generation', nodes: ['Kling', 'Runway', 'Pika', 'Luma', 'MiniMax'] },
      { id: '3d-gen', label: '3D Generation', nodes: ['Rodin', 'Tripo'] },
      { id: 'text', label: 'Text / LLM', nodes: ['OpenAI GPT', 'Gemini', 'Anthropic'] },
    ],
  },
]

// Sidebar tabs (for workspace navigation)
export const SIDEBAR_TABS: SidebarTab[] = [
  { id: 'nodes', label: 'Nodes', icon: 'sitemap', tooltip: 'Node Library' },
  { id: 'models', label: 'Models', icon: 'box', tooltip: 'Model Library' },
  { id: 'workflows', label: 'Workflows', icon: 'workflow', tooltip: 'Workflows' },
  { id: 'assets', label: 'Assets', icon: 'images', tooltip: 'Assets' },
  { id: 'templates', label: 'Templates', icon: 'th-large', tooltip: 'Templates' },
]

export type ThemeMode = 'light' | 'dark' | 'system'

// ============================================================================
// SIDEBAR SHORTCUTS
// ============================================================================

export type ShortcutType =
  | 'library-section'  // My Library, Projects, Templates
  | 'library-folder'   // Workflows, Models, Assets folders
  | 'workflow'         // Individual workflow
  | 'model'            // Individual model
  | 'asset'            // Individual asset
  | 'project'          // Individual project
  | 'node'             // Node from node library
  | 'node-category'    // Node category

export interface SidebarShortcut {
  id: string
  label: string
  icon: string
  type: ShortcutType
  // For library navigation
  section?: 'shared' | 'projects'
  filter?: 'All' | 'Workflows' | 'Assets'
  // For individual items
  itemId?: string
  thumbnail?: string
  // For nodes
  nodeCategory?: string
  nodeName?: string
}

// ============================================================================
// WORKFLOW TABS (shared between Workflow Editor and Linear Mode)
// ============================================================================

export type WorkflowMode = 'workflow' | 'linear'

export interface WorkflowTab {
  id: string
  name: string
  mode: WorkflowMode
  isActive: boolean
  isDirty?: boolean
}

// ============================================================================
// SUBGRAPHS (reusable workflow components)
// ============================================================================

export interface SubgraphInput {
  id: string
  name: string
  type: string // e.g., 'IMAGE', 'LATENT', 'MODEL', 'CONDITIONING', etc.
}

export interface SubgraphOutput {
  id: string
  name: string
  type: string
}

export interface SubgraphWidget {
  id: string
  name: string
  type: 'number' | 'string' | 'boolean' | 'combo'
  value: any
  config?: Record<string, any> // min, max, step for numbers; options for combo
}

export interface Subgraph {
  id: string
  name: string
  description?: string
  color?: string
  inputs: SubgraphInput[]
  outputs: SubgraphOutput[]
  widgets: SubgraphWidget[]
  // The actual workflow data stored as JSON
  workflowData?: Record<string, any>
  createdAt: number
  updatedAt: number
  isDirty?: boolean
}

export const useUiStore = defineStore('ui', () => {
  const leftSidebarOpen = ref(true)
  const rightSidebarOpen = ref(false)

  // Theme mode: light, dark, or system - initialize from localStorage
  const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('ui-theme') as ThemeMode : null
  const themeMode = ref<ThemeMode>(storedTheme || 'dark')

  // Workflow tabs (shared between Workflow Editor and Linear Mode)
  const workflowTabs = ref<WorkflowTab[]>([
    { id: 'workflow-1', name: 'Main Workflow', mode: 'workflow', isActive: true },
    { id: 'workflow-2', name: 'Upscale Pipeline', mode: 'linear', isActive: false, isDirty: true },
    { id: 'workflow-3', name: 'ControlNet Test', mode: 'workflow', isActive: false },
  ])
  const activeWorkflowTabId = ref('workflow-1')

  // Subgraphs (reusable workflow components)
  const subgraphs = ref<Subgraph[]>([
    {
      id: 'subgraph-1',
      name: 'Image Upscaler',
      description: 'Upscales images using ESRGAN',
      color: '#4DD0E1',
      inputs: [
        { id: 'input-1', name: 'image', type: 'IMAGE' },
      ],
      outputs: [
        { id: 'output-1', name: 'upscaled_image', type: 'IMAGE' },
      ],
      widgets: [
        { id: 'widget-1', name: 'scale', type: 'number', value: 2, config: { min: 1, max: 4, step: 1 } },
      ],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
    },
    {
      id: 'subgraph-2',
      name: 'Prompt Enhancer',
      description: 'Enhances prompts with style keywords',
      color: '#FFAB40',
      inputs: [
        { id: 'input-1', name: 'prompt', type: 'STRING' },
      ],
      outputs: [
        { id: 'output-1', name: 'enhanced_prompt', type: 'STRING' },
      ],
      widgets: [
        { id: 'widget-1', name: 'style', type: 'combo', value: 'cinematic', config: { options: ['cinematic', 'anime', 'photorealistic', 'artistic'] } },
      ],
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 7200000,
    },
    {
      id: 'subgraph-3',
      name: 'ControlNet Preprocessor',
      description: 'Applies ControlNet preprocessing',
      color: '#B39DDB',
      inputs: [
        { id: 'input-1', name: 'image', type: 'IMAGE' },
      ],
      outputs: [
        { id: 'output-1', name: 'control_image', type: 'IMAGE' },
      ],
      widgets: [
        { id: 'widget-1', name: 'preprocessor', type: 'combo', value: 'canny', config: { options: ['canny', 'depth', 'openpose', 'lineart'] } },
        { id: 'widget-2', name: 'resolution', type: 'number', value: 512, config: { min: 256, max: 2048, step: 64 } },
      ],
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 14400000,
    },
  ])
  const activeSubgraphId = ref<string | null>(null)

  const activeWorkflowName = computed(() => {
    return workflowTabs.value.find(t => t.id === activeWorkflowTabId.value)?.name || 'Workflow'
  })

  const activeWorkflowMode = computed(() => {
    return workflowTabs.value.find(t => t.id === activeWorkflowTabId.value)?.mode || 'workflow'
  })

  function getWorkflowMode(tabId: string): WorkflowMode {
    return workflowTabs.value.find(t => t.id === tabId)?.mode || 'workflow'
  }

  // Sidebar tab state (left sidebar)
  const activeSidebarTab = ref<SidebarTabId>(null)

  // Library navigation state (for shortcuts)
  const activeLibrarySection = ref<'shared' | 'projects'>('shared')
  const activeLibraryFilter = ref<'All' | 'Workflows' | 'Assets'>('All')

  // Node category state (TouchDesigner/Houdini-style)
  const activeNodeCategory = ref<NodeCategoryId>(null)
  const expandedSubcategories = ref<Set<string>>(new Set())
  const nodeSearchQuery = ref('')

  // Sidebar shortcuts - load from localStorage
  const storedShortcuts = typeof window !== 'undefined' ? localStorage.getItem('sidebar-shortcuts') : null
  const sidebarShortcuts = ref<SidebarShortcut[]>(storedShortcuts ? JSON.parse(storedShortcuts) : [])

  // Show quickstart section on home - load from localStorage (default: hidden)
  const storedShowQuickstart = typeof window !== 'undefined' ? localStorage.getItem('show-quickstart') : null
  const showQuickstart = ref<boolean>(storedShowQuickstart === 'true')

  // Sidebar panel is expanded when a tab is active
  const sidebarPanelExpanded = computed(() => activeSidebarTab.value !== null)

  // Node panel is expanded when a category is active
  const nodePanelExpanded = computed(() => activeNodeCategory.value !== null)

  // Get active node category data
  const activeNodeCategoryData = computed(() =>
    NODE_CATEGORIES.find(cat => cat.id === activeNodeCategory.value) ?? null
  )

  function toggleLeftSidebar(): void {
    leftSidebarOpen.value = !leftSidebarOpen.value
  }

  function toggleRightSidebar(): void {
    rightSidebarOpen.value = !rightSidebarOpen.value
  }

  function toggleSidebarTab(tabId: Exclude<SidebarTabId, null>): void {
    activeSidebarTab.value = activeSidebarTab.value === tabId ? null : tabId
  }

  function setSidebarTab(tabId: SidebarTabId): void {
    activeSidebarTab.value = tabId
  }

  function closeSidebarPanel(): void {
    activeSidebarTab.value = null
  }

  // Node category functions
  function toggleNodeCategory(categoryId: Exclude<NodeCategoryId, null>): void {
    activeNodeCategory.value = activeNodeCategory.value === categoryId ? null : categoryId
  }

  function setNodeCategory(categoryId: NodeCategoryId): void {
    activeNodeCategory.value = categoryId
  }

  function closeNodePanel(): void {
    activeNodeCategory.value = null
  }

  function toggleSubcategory(subcategoryId: string): void {
    if (expandedSubcategories.value.has(subcategoryId)) {
      expandedSubcategories.value.delete(subcategoryId)
    } else {
      expandedSubcategories.value.add(subcategoryId)
    }
  }

  function setNodeSearchQuery(query: string): void {
    nodeSearchQuery.value = query
  }

  // Theme functions
  function setThemeMode(mode: ThemeMode): void {
    themeMode.value = mode
    applyTheme(mode)
  }

  function toggleTheme(): void {
    const newMode = themeMode.value === 'dark' ? 'light' : 'dark'
    setThemeMode(newMode)
  }

  // Workflow tab functions
  function selectWorkflowTab(tabId: string): void {
    activeWorkflowTabId.value = tabId
    workflowTabs.value = workflowTabs.value.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    }))
  }

  function closeWorkflowTab(tabId: string): void {
    const index = workflowTabs.value.findIndex(t => t.id === tabId)
    if (index > -1) {
      workflowTabs.value.splice(index, 1)
      if (tabId === activeWorkflowTabId.value && workflowTabs.value.length > 0) {
        const newIndex = Math.min(index, workflowTabs.value.length - 1)
        selectWorkflowTab(workflowTabs.value[newIndex]!.id)
      }
    }
  }

  function createWorkflowTab(mode: WorkflowMode = 'workflow'): void {
    const newId = `workflow-${Date.now()}`
    workflowTabs.value.push({
      id: newId,
      name: 'Untitled Workflow',
      mode,
      isActive: false,
    })
    selectWorkflowTab(newId)
  }

  // Subgraph functions
  function selectSubgraph(subgraphId: string): void {
    activeSubgraphId.value = subgraphId
    console.log('[Subgraph] Selected:', subgraphId)
  }

  function createSubgraph(): Subgraph {
    const newId = `subgraph-${Date.now()}`
    const newSubgraph: Subgraph = {
      id: newId,
      name: 'Untitled Subgraph',
      inputs: [],
      outputs: [],
      widgets: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    subgraphs.value.push(newSubgraph)
    activeSubgraphId.value = newId
    return newSubgraph
  }

  function updateSubgraph(subgraphId: string, updates: Partial<Subgraph>): void {
    const index = subgraphs.value.findIndex(s => s.id === subgraphId)
    if (index > -1) {
      subgraphs.value[index] = {
        ...subgraphs.value[index]!,
        ...updates,
        updatedAt: Date.now(),
      }
    }
  }

  function deleteSubgraph(subgraphId: string): void {
    const index = subgraphs.value.findIndex(s => s.id === subgraphId)
    if (index > -1) {
      subgraphs.value.splice(index, 1)
      if (activeSubgraphId.value === subgraphId) {
        activeSubgraphId.value = subgraphs.value[0]?.id || null
      }
    }
  }

  function duplicateSubgraph(subgraphId: string): Subgraph | null {
    const original = subgraphs.value.find(s => s.id === subgraphId)
    if (!original) return null

    const newId = `subgraph-${Date.now()}`
    const duplicate: Subgraph = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      name: `${original.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    subgraphs.value.push(duplicate)
    return duplicate
  }

  const activeSubgraph = computed(() => {
    return subgraphs.value.find(s => s.id === activeSubgraphId.value) || null
  })

  function applyTheme(mode: ThemeMode): void {
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Persist to localStorage
    localStorage.setItem('ui-theme', mode)
  }

  // Initialize theme on store creation
  applyTheme(themeMode.value)

  // Quickstart section toggle
  function toggleQuickstart(): void {
    showQuickstart.value = !showQuickstart.value
    localStorage.setItem('show-quickstart', String(showQuickstart.value))
  }

  // Sidebar shortcut functions
  function addSidebarShortcut(shortcut: SidebarShortcut): void {
    // Check if already exists
    if (sidebarShortcuts.value.some(s => s.id === shortcut.id)) return
    sidebarShortcuts.value.push(shortcut)
    saveSidebarShortcuts()
  }

  function removeSidebarShortcut(shortcutId: string): void {
    const index = sidebarShortcuts.value.findIndex(s => s.id === shortcutId)
    if (index > -1) {
      sidebarShortcuts.value.splice(index, 1)
      saveSidebarShortcuts()
    }
  }

  function reorderSidebarShortcuts(fromIndex: number, toIndex: number): void {
    const [removed] = sidebarShortcuts.value.splice(fromIndex, 1)
    if (removed) {
      sidebarShortcuts.value.splice(toIndex, 0, removed)
      saveSidebarShortcuts()
    }
  }

  function saveSidebarShortcuts(): void {
    localStorage.setItem('sidebar-shortcuts', JSON.stringify(sidebarShortcuts.value))
  }

  function openShortcut(shortcut: SidebarShortcut): void {
    console.log('[Shortcut] Opening shortcut:', shortcut)

    switch (shortcut.type) {
      case 'library-section':
      case 'library-folder':
        // Open library tab and navigate to section/filter
        activeSidebarTab.value = 'library'
        if (shortcut.section) {
          activeLibrarySection.value = shortcut.section
        }
        if (shortcut.filter) {
          activeLibraryFilter.value = shortcut.filter
        }
        break

      case 'workflow':
      case 'model':
      case 'asset':
        // Open library and navigate to the item
        activeSidebarTab.value = 'library'
        if (shortcut.section) {
          activeLibrarySection.value = shortcut.section
        }
        // TODO: Implement item selection/opening
        console.log('[Shortcut] Opening item:', shortcut.itemId)
        break

      case 'project':
        // Open library projects section
        activeSidebarTab.value = 'library'
        activeLibrarySection.value = 'projects'
        // TODO: Implement project selection
        console.log('[Shortcut] Opening project:', shortcut.itemId)
        break

      case 'node':
        // Open nodes panel and highlight the node
        activeSidebarTab.value = 'nodes'
        if (shortcut.nodeCategory) {
          activeNodeCategory.value = shortcut.nodeCategory as NodeCategoryId
        }
        console.log('[Shortcut] Opening node:', shortcut.nodeName)
        break

      case 'node-category':
        // Open nodes panel to category
        activeSidebarTab.value = 'nodes'
        if (shortcut.nodeCategory) {
          activeNodeCategory.value = shortcut.nodeCategory as NodeCategoryId
        }
        break

      default:
        console.warn('[Shortcut] Unknown shortcut type:', shortcut.type)
    }
  }

  function setLibrarySection(section: 'shared' | 'projects'): void {
    activeLibrarySection.value = section
  }

  function setLibraryFilter(filter: 'All' | 'Workflows' | 'Assets'): void {
    activeLibraryFilter.value = filter
  }

  return {
    leftSidebarOpen,
    rightSidebarOpen,
    activeSidebarTab,
    sidebarPanelExpanded,
    // Node category exports
    activeNodeCategory,
    activeNodeCategoryData,
    nodePanelExpanded,
    expandedSubcategories,
    nodeSearchQuery,
    // Workflow tabs
    workflowTabs,
    activeWorkflowTabId,
    activeWorkflowName,
    activeWorkflowMode,
    getWorkflowMode,
    // Theme
    themeMode,
    // Functions
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleSidebarTab,
    setSidebarTab,
    closeSidebarPanel,
    toggleNodeCategory,
    setNodeCategory,
    closeNodePanel,
    toggleSubcategory,
    setNodeSearchQuery,
    // Workflow tab functions
    selectWorkflowTab,
    closeWorkflowTab,
    createWorkflowTab,
    // Subgraph functions
    subgraphs,
    activeSubgraphId,
    activeSubgraph,
    selectSubgraph,
    createSubgraph,
    updateSubgraph,
    deleteSubgraph,
    duplicateSubgraph,
    // Theme functions
    setThemeMode,
    toggleTheme,
    // Library navigation
    activeLibrarySection,
    activeLibraryFilter,
    setLibrarySection,
    setLibraryFilter,
    // Sidebar shortcuts
    sidebarShortcuts,
    addSidebarShortcut,
    removeSidebarShortcut,
    reorderSidebarShortcuts,
    openShortcut,
    // Quickstart
    showQuickstart,
    toggleQuickstart,
  }
})
