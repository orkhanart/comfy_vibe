import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type SidebarTabId = 'nodes' | 'models' | 'workflows' | 'assets' | 'templates' | 'library' | 'packages' | null

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
  { id: 'workflows', label: 'Workflows', icon: 'folder-open', tooltip: 'Workflows' },
  { id: 'assets', label: 'Assets', icon: 'images', tooltip: 'Assets' },
  { id: 'templates', label: 'Templates', icon: 'clone', tooltip: 'Templates' },
  { id: 'library', label: 'Library', icon: 'bookmark', tooltip: 'Library' },
]

export type ThemeMode = 'light' | 'dark' | 'system'

export const useUiStore = defineStore('ui', () => {
  const leftSidebarOpen = ref(true)
  const rightSidebarOpen = ref(false)

  // Theme mode: light, dark, or system - initialize from localStorage
  const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('ui-theme') as ThemeMode : null
  const themeMode = ref<ThemeMode>(storedTheme || 'dark')

  // Sidebar tab state (left sidebar)
  const activeSidebarTab = ref<SidebarTabId>(null)

  // Node category state (TouchDesigner/Houdini-style)
  const activeNodeCategory = ref<NodeCategoryId>(null)
  const expandedSubcategories = ref<Set<string>>(new Set())
  const nodeSearchQuery = ref('')

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
    // Theme functions
    setThemeMode,
    toggleTheme,
  }
})
