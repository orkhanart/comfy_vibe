// Centralized mock data for workspace views
// This file makes it easy to replace with API calls later

// ============================================
// TYPES
// ============================================

export interface Folder {
  id: string
  name: string
  parentId: string | null  // null = root level
  type: 'workflows' | 'assets' | 'models'
  createdAt: number
  updatedAt: number
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  uses: number
  tags: string[]
}

export interface ModelVersion {
  id: string
  version: string
  size: string
  downloadUrl?: string
  releaseDate: string
  isInstalled: boolean
  isCurrent: boolean
}

export interface Model {
  id: string
  name: string
  type: 'checkpoint' | 'lora' | 'vae' | 'controlnet'
  baseModel: 'SD1.5' | 'SDXL' | 'Flux' | 'Pony' | 'unknown'
  size: string
  sizeBytes: number
  version: string
  updatedAt: string
  updatedTimestamp: number
  thumbnail?: string
  triggerWords?: string[]
  favorite: boolean
  versions?: ModelVersion[]
  source: 'builtin' | 'imported'
  folderId?: string | null
}

export interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'audio'
  source: 'generated' | 'imported'
  size: string
  sizeBytes: number
  dimensions: string
  updatedAt: string
  updatedTimestamp: number
  thumbnail: string
  favorite: boolean
  folderId?: string | null
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodeCount: number
  updatedAt: string
  updatedTimestamp: number
  thumbnail: string
  favorite: boolean
  runtime: string
  cost: string
  tags: string[]
  folderId?: string | null
}

export interface RecentItem {
  id: string
  name: string
  type: 'workflow' | 'asset' | 'model' | 'template'
  thumbnail: string
  updatedAt: string
  updatedTimestamp: number
}

// ============================================
// FILTER OPTIONS
// ============================================

export const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'getting-started', label: 'Getting Started' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: '3d', label: '3D Model' },
] as const

export const MODEL_FILTER_OPTIONS = [
  { value: 'all', label: 'All Models' },
  { value: 'sdxl', label: 'SDXL' },
  { value: 'sd15', label: 'SD 1.5' },
  { value: 'flux', label: 'Flux' },
  { value: 'wan', label: 'Wan' },
  { value: 'hunyuan', label: 'Hunyuan' },
] as const

export const USE_CASE_OPTIONS = [
  { value: 'all', label: 'All Use Cases' },
  { value: 'text-to-image', label: 'Text to Image' },
  { value: 'image-to-image', label: 'Image to Image' },
  { value: 'inpainting', label: 'Inpainting' },
  { value: 'upscale', label: 'Upscale' },
  { value: 'controlnet', label: 'ControlNet' },
  { value: 'video', label: 'Video Generation' },
] as const

export const RUNS_ON_OPTIONS = [
  { value: 'all', label: 'All Platforms' },
  { value: 'local', label: 'Local' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'api', label: 'API' },
] as const

export const MODEL_TYPES = ['all', 'checkpoint', 'lora', 'vae', 'controlnet'] as const

export const BASE_MODEL_TYPES = ['all', 'SD1.5', 'SDXL', 'Flux', 'Pony'] as const

export const ASSET_TYPES = ['all', 'image', 'video', 'audio'] as const

// ============================================
// MOCK DATA
// ============================================

export const MOCK_TEMPLATES: Template[] = [
  { id: 'txt2img', name: 'Text to Image', description: 'Generate images from text prompts using AI models', category: 'getting-started', thumbnail: '/assets/card_images/workflow_01.webp', uses: 12500, tags: ['Text to Image', 'Image'] },
  { id: 'img2img', name: 'Image to Image', description: 'Transform existing images with AI enhancement', category: 'getting-started', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', uses: 8900, tags: ['Image to Image', 'Image Edit'] },
  { id: 'upscale', name: 'Upscale 4x', description: '4x image upscaling workflow with detail enhancement', category: 'image', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', uses: 7200, tags: ['Image', 'Upscale'] },
  { id: 'inpaint', name: 'Inpainting', description: 'Edit specific parts of an image seamlessly', category: 'image', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', uses: 6100, tags: ['Image Edit', 'Inpaint'] },
  { id: 'controlnet', name: 'ControlNet Pose', description: 'Pose-guided image generation with precise control', category: 'image', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', uses: 5400, tags: ['ControlNet', 'Image'] },
  { id: 'video-gen', name: 'Video Generation', description: 'Create videos from text prompts', category: 'video', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', uses: 4800, tags: ['Text to Video', 'Video'] },
  { id: 'sdxl-turbo', name: 'SDXL Turbo', description: 'Fast SDXL generation with turbo mode', category: 'image', thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', uses: 4200, tags: ['Text to Image', 'SDXL'] },
  { id: 'canny', name: 'ControlNet Canny', description: 'Edge-guided generation using canny detection', category: 'image', thumbnail: '/assets/card_images/comfyui_workflow.jpg', uses: 3800, tags: ['ControlNet', 'Image'] },
  { id: 'depth', name: 'ControlNet Depth', description: 'Depth-guided generation for 3D-aware results', category: 'image', thumbnail: '/assets/card_images/can-you-rate-my-comfyui-workflow-v0-o9clchhji39c1.webp', uses: 3500, tags: ['ControlNet', 'Depth'] },
  { id: 'sdxl-refiner', name: 'SDXL + Refiner', description: 'Two-stage SDXL workflow with refinement pass', category: 'image', thumbnail: '/assets/card_images/dda28581-37c8-44da-8822-57d1ccc2118c_2130x1658.png', uses: 3200, tags: ['SDXL', 'Refiner'] },
  { id: 'animatediff', name: 'AnimateDiff', description: 'Animate still images into dynamic videos', category: 'video', thumbnail: '/thumbnails/workflow-1.jpg', uses: 2900, tags: ['Image to Video', 'Video'] },
  { id: 'audio-gen', name: 'Audio Generation', description: 'Generate audio and music from prompts', category: 'audio', thumbnail: '/thumbnails/workflow-2.jpg', uses: 2600, tags: ['Text to Audio', 'Audio'] },
  { id: '3d-model', name: '3D Model Generation', description: 'Generate 3D models from images or text', category: '3d', thumbnail: '/thumbnails/workflow-1.jpg', uses: 2400, tags: ['Image to 3D', '3D'] },
]

export const MOCK_MODELS: Model[] = [
  {
    id: 'model-1', name: 'SDXL Base 1.0', type: 'checkpoint', baseModel: 'SDXL', size: '6.94 GB', sizeBytes: 7452139315, version: '1.0', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/workflow_01.webp', favorite: true, source: 'builtin',
    versions: [
      { id: 'v1.0', version: '1.0', size: '6.94 GB', releaseDate: 'Jul 26, 2023', isInstalled: true, isCurrent: true },
      { id: 'v0.9', version: '0.9', size: '6.94 GB', releaseDate: 'Jun 22, 2023', isInstalled: false, isCurrent: false },
    ]
  },
  { id: 'model-2', name: 'SDXL Refiner 1.0', type: 'checkpoint', baseModel: 'SDXL', size: '6.08 GB', sizeBytes: 6529336320, version: '1.0', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', favorite: false, source: 'builtin' },
  {
    id: 'model-3', name: 'SDXL Lightning', type: 'lora', baseModel: 'SDXL', size: '393 MB', sizeBytes: 412090368, version: '4-step', updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', triggerWords: ['lightning', 'fast'], favorite: true, source: 'builtin',
    versions: [
      { id: 'v4-step', version: '4-step', size: '393 MB', releaseDate: 'Feb 21, 2024', isInstalled: true, isCurrent: true },
      { id: 'v2-step', version: '2-step', size: '393 MB', releaseDate: 'Feb 21, 2024', isInstalled: false, isCurrent: false },
      { id: 'v8-step', version: '8-step', size: '393 MB', releaseDate: 'Feb 21, 2024', isInstalled: false, isCurrent: false },
    ]
  },
  { id: 'model-4', name: 'Detail Tweaker', type: 'lora', baseModel: 'SD1.5', size: '144 MB', sizeBytes: 150994944, version: '1.0', updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', triggerWords: ['detailed', 'sharp'], favorite: false, source: 'builtin' },
  { id: 'model-5', name: 'SDXL VAE', type: 'vae', baseModel: 'SDXL', size: '335 MB', sizeBytes: 351272960, version: 'fp16', updatedAt: '1 month ago', updatedTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', favorite: false, source: 'builtin' },
  { id: 'model-6', name: 'ControlNet Canny', type: 'controlnet', baseModel: 'SDXL', size: '2.5 GB', sizeBytes: 2684354560, version: '1.1', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', favorite: false, source: 'builtin' },
  {
    id: 'model-7', name: 'Realistic Vision', type: 'checkpoint', baseModel: 'SD1.5', size: '2.1 GB', sizeBytes: 2254857830, version: '5.1', updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', favorite: true, source: 'imported',
    versions: [
      { id: 'v5.1', version: '5.1', size: '2.1 GB', releaseDate: 'Nov 15, 2024', isInstalled: true, isCurrent: true },
      { id: 'v5.0', version: '5.0', size: '2.1 GB', releaseDate: 'Sep 20, 2024', isInstalled: true, isCurrent: false },
      { id: 'v4.0', version: '4.0', size: '2.0 GB', releaseDate: 'Jun 10, 2024', isInstalled: false, isCurrent: false },
      { id: 'v3.0', version: '3.0', size: '1.9 GB', releaseDate: 'Mar 5, 2024', isInstalled: false, isCurrent: false },
    ]
  },
  { id: 'model-8', name: 'Flux Dev', type: 'checkpoint', baseModel: 'Flux', size: '23.8 GB', sizeBytes: 25551392358, version: '1.0', updatedAt: '5 days ago', updatedTimestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/comfyui_workflow.jpg', favorite: false, source: 'builtin' },
  {
    id: 'model-9', name: 'Pony Diffusion', type: 'checkpoint', baseModel: 'Pony', size: '4.2 GB', sizeBytes: 4509715660, version: '6.0', updatedAt: '4 days ago', updatedTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/can-you-rate-my-comfyui-workflow-v0-o9clchhji39c1.webp', favorite: false, source: 'builtin',
    versions: [
      { id: 'v6.0', version: '6.0', size: '4.2 GB', releaseDate: 'Nov 25, 2024', isInstalled: true, isCurrent: true },
      { id: 'v5.5', version: '5.5', size: '4.0 GB', releaseDate: 'Oct 1, 2024', isInstalled: false, isCurrent: false },
      { id: 'v5.0', version: '5.0', size: '3.8 GB', releaseDate: 'Aug 15, 2024', isInstalled: false, isCurrent: false },
    ]
  },
]

export const MOCK_ASSETS: Asset[] = [
  { id: 'asset-1', name: 'input-image.png', type: 'image', source: 'imported', size: '2.4 MB', sizeBytes: 2516582, dimensions: '1024x1024', updatedAt: '2 hours ago', updatedTimestamp: Date.now() - 2 * 60 * 60 * 1000, thumbnail: '/thumbnails/asset-1.jpg', favorite: true },
  { id: 'asset-2', name: 'reference.jpg', type: 'image', source: 'imported', size: '1.8 MB', sizeBytes: 1887437, dimensions: '768x768', updatedAt: '1 day ago', updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000, thumbnail: '/thumbnails/asset-2.jpg', favorite: false },
  { id: 'asset-3', name: 'generated-001.png', type: 'image', source: 'generated', size: '0.5 MB', sizeBytes: 524288, dimensions: '512x512', updatedAt: '2 days ago', updatedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/workflow_01.webp', favorite: true },
  { id: 'asset-4', name: 'output-video.mp4', type: 'video', source: 'generated', size: '24.5 MB', sizeBytes: 25690112, dimensions: '1920x1080', updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', favorite: false },
  { id: 'asset-5', name: 'background.wav', type: 'audio', source: 'imported', size: '8.2 MB', sizeBytes: 8598323, dimensions: '3:24', updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', favorite: false },
  { id: 'asset-6', name: 'ai-portrait.png', type: 'image', source: 'generated', size: '3.1 MB', sizeBytes: 3250585, dimensions: '1024x1024', updatedAt: '4 hours ago', updatedTimestamp: Date.now() - 4 * 60 * 60 * 1000, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', favorite: true },
  { id: 'asset-7', name: 'product-photo.jpg', type: 'image', source: 'imported', size: '4.2 MB', sizeBytes: 4404019, dimensions: '2048x2048', updatedAt: '5 days ago', updatedTimestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', favorite: false },
  { id: 'asset-8', name: 'animation.mp4', type: 'video', source: 'generated', size: '18.7 MB', sizeBytes: 19607347, dimensions: '1280x720', updatedAt: '6 days ago', updatedTimestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', favorite: false },
]

export const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'txt2img-basic', name: 'Text to Image Basic', description: 'Simple text to image generation', nodeCount: 8, updatedAt: '1 day ago', updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000, thumbnail: '/thumbnails/workflow-1.jpg', favorite: true, runtime: '~12s', cost: '$0.02', tags: ['Text to Image', 'Image'] },
  { id: 'img2img-refine', name: 'Image Refinement', description: 'Refine and enhance images', nodeCount: 12, updatedAt: '2 days ago', updatedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, thumbnail: '/thumbnails/workflow-2.jpg', favorite: false, runtime: '~18s', cost: '$0.03', tags: ['Image to Image', 'Upscale'] },
  { id: 'upscale-4x', name: '4x Upscale', description: 'High quality image upscaling', nodeCount: 5, updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/can-you-rate-my-comfyui-workflow-v0-o9clchhji39c1.webp', favorite: true, runtime: '~8s', cost: '$0.01', tags: ['Upscale', 'Image'] },
  { id: 'controlnet-pose', name: 'ControlNet Pose', description: 'Pose-guided generation', nodeCount: 15, updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/dda28581-37c8-44da-8822-57d1ccc2118c_2130x1658.png', favorite: false, runtime: '~25s', cost: '$0.04', tags: ['ControlNet', 'Pose'] },
]

export const MOCK_RECENTS: RecentItem[] = [
  { id: 'recent-1', name: 'Text to Image Basic', type: 'workflow', thumbnail: '/thumbnails/workflow-1.jpg', updatedAt: '2 hours ago', updatedTimestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 'recent-2', name: 'SDXL Base 1.0', type: 'model', thumbnail: '/thumbnails/model-1.jpg', updatedAt: '5 hours ago', updatedTimestamp: Date.now() - 5 * 60 * 60 * 1000 },
  { id: 'recent-3', name: 'output-001.png', type: 'asset', thumbnail: '/assets/card_images/workflow_01.webp', updatedAt: '1 day ago', updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000 },
  { id: 'recent-4', name: 'ControlNet Pose', type: 'template', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', updatedAt: '2 days ago', updatedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getModelIcon(type: Model['type']): string {
  const icons: Record<Model['type'], string> = {
    checkpoint: 'box',
    lora: 'bolt',
    vae: 'sliders-h',
    controlnet: 'sitemap',
  }
  return icons[type] || 'box'
}

export function getModelColor(type: Model['type']): string {
  const colors: Record<Model['type'], string> = {
    checkpoint: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    lora: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    vae: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    controlnet: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  }
  return colors[type] || 'bg-zinc-100 text-muted-foreground/50 dark:bg-muted dark:text-muted-foreground'
}

export function getBaseModelColor(baseModel: Model['baseModel']): string {
  const colors: Record<Model['baseModel'], string> = {
    'SD1.5': 'bg-zinc-500/80 text-white',
    'SDXL': 'bg-blue-500/80 text-white',
    'Flux': 'bg-purple-500/80 text-white',
    'Pony': 'bg-pink-500/80 text-white',
    'unknown': 'bg-zinc-400/80 text-white',
  }
  return colors[baseModel] || 'bg-zinc-400/80 text-white'
}

export function getAssetIcon(type: Asset['type']): string {
  const icons: Record<Asset['type'], string> = {
    image: 'image',
    video: 'video',
    audio: 'volume-up',
  }
  return icons[type] || 'file'
}

export function getRecentItemIcon(type: RecentItem['type']): string {
  const icons: Record<RecentItem['type'], string> = {
    workflow: 'sitemap',
    asset: 'image',
    model: 'box',
    template: 'clone',
  }
  return icons[type] || 'file'
}

export function getRecentItemColor(type: RecentItem['type']): string {
  const colors: Record<RecentItem['type'], string> = {
    workflow: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    asset: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    model: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    template: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
  }
  return colors[type] || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
}

// ============================================
// FOLDER DATA & HELPERS
// ============================================

export const MOCK_FOLDERS: Folder[] = [
  // Workflow folders
  { id: 'wf-folder-1', name: 'Production', parentId: null, type: 'workflows', createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { id: 'wf-folder-2', name: 'Experiments', parentId: null, type: 'workflows', createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  { id: 'wf-folder-3', name: 'Archive', parentId: null, type: 'workflows', createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000 },
  { id: 'wf-folder-4', name: 'Client Projects', parentId: 'wf-folder-1', type: 'workflows', createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
  { id: 'wf-folder-5', name: 'Internal Tools', parentId: 'wf-folder-1', type: 'workflows', createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },

  // Asset folders
  { id: 'as-folder-1', name: 'References', parentId: null, type: 'assets', createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
  { id: 'as-folder-2', name: 'Generated Outputs', parentId: null, type: 'assets', createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { id: 'as-folder-3', name: 'Portraits', parentId: 'as-folder-2', type: 'assets', createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },

  // Model folders
  { id: 'md-folder-1', name: 'Favorites', parentId: null, type: 'models', createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
  { id: 'md-folder-2', name: 'SDXL Collection', parentId: null, type: 'models', createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 4 * 24 * 60 * 60 * 1000 },
  { id: 'md-folder-3', name: 'LoRAs', parentId: 'md-folder-2', type: 'models', createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
]

/**
 * Get all folders of a specific type at a given parent level
 */
export function getChildFolders(parentId: string | null, type: Folder['type']): Folder[] {
  return MOCK_FOLDERS.filter(f => f.type === type && f.parentId === parentId)
}

/**
 * Get the full path from root to a folder (for breadcrumbs)
 */
export function getFolderPath(folderId: string | null): Folder[] {
  if (!folderId) return []

  const path: Folder[] = []
  let currentId: string | null = folderId

  while (currentId) {
    const folder = MOCK_FOLDERS.find(f => f.id === currentId)
    if (folder) {
      path.unshift(folder)
      currentId = folder.parentId
    } else {
      break
    }
  }

  return path
}

/**
 * Get a folder by ID
 */
export function getFolderById(folderId: string): Folder | undefined {
  return MOCK_FOLDERS.find(f => f.id === folderId)
}

/**
 * Count items in a folder (for display purposes)
 */
export function countItemsInFolder<T extends { folderId?: string | null }>(
  folderId: string,
  items: T[]
): number {
  return items.filter(item => item.folderId === folderId).length
}

/**
 * Count subfolders in a folder
 */
export function countSubfolders(folderId: string, type: Folder['type']): number {
  return MOCK_FOLDERS.filter(f => f.parentId === folderId && f.type === type).length
}
