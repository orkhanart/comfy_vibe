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
  favorite?: boolean
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
  // Getting Started - beginner friendly templates
  { id: 'txt2img', name: 'Basic txt2img (SD1.5)', description: 'Simple text to image workflow for beginners', category: 'getting-started', thumbnail: '/assets/card_images/workflow_01.webp', uses: 12500, tags: ['txt2img', 'SD1.5'], favorite: true },
  { id: 'img2img', name: 'Img2Img with Denoise', description: 'Transform existing images with adjustable strength', category: 'getting-started', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', uses: 8900, tags: ['img2img', 'Beginner'], favorite: false },
  { id: 'simple-upscale', name: 'Ultimate Upscale 2x', description: 'Simple upscaling with ESRGAN models', category: 'getting-started', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', uses: 7800, tags: ['Upscale', 'ESRGAN'], favorite: false },
  { id: 'simple-inpaint', name: 'Inpaint + Outpaint Basic', description: 'Edit and extend images with masking', category: 'getting-started', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', uses: 6500, tags: ['Inpaint', 'Outpaint'], favorite: false },
  { id: 'face-swap', name: 'IPAdapter Face Swap', description: 'Face transfer using IPAdapter FaceID', category: 'getting-started', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', uses: 5900, tags: ['IPAdapter', 'Face'], favorite: true },
  { id: 'bg-remove', name: 'BRIA RMBG v1.4', description: 'AI background removal with BRIA model', category: 'getting-started', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', uses: 5500, tags: ['Background', 'BRIA'], favorite: false },
  { id: 'style-transfer', name: 'IPAdapter Style Transfer', description: 'Apply reference image styles with IPAdapter', category: 'getting-started', thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', uses: 4900, tags: ['IPAdapter', 'Style'], favorite: false },
  { id: 'portrait-enhance', name: 'FaceDetailer + Upscale', description: 'Enhance faces with YOLO detection', category: 'getting-started', thumbnail: '/assets/card_images/comfyui_workflow.jpg', uses: 4500, tags: ['FaceDetailer', 'Portrait'], favorite: false },
  // Image category
  { id: 'upscale', name: 'Ultimate Upscale 4x Tiled', description: 'Tile-based 4x upscaling for large images', category: 'image', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', uses: 7200, tags: ['Upscale', 'Tiled'], favorite: true },
  { id: 'inpaint', name: 'Differential Diffusion Inpaint', description: 'Advanced inpainting with gradient masks', category: 'image', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', uses: 6100, tags: ['Inpaint', 'Differential'], favorite: false },
  { id: 'controlnet', name: 'ControlNet OpenPose + Depth', description: 'Multi-ControlNet with pose and depth', category: 'image', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', uses: 5400, tags: ['ControlNet', 'OpenPose'], favorite: false },
  { id: 'sdxl-turbo', name: 'SDXL Turbo 4-Step', description: 'Fast 4-step generation with SDXL Turbo', category: 'image', thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', uses: 4200, tags: ['SDXL', 'Turbo'], favorite: false },
  { id: 'canny', name: 'ControlNet Canny SDXL', description: 'Edge-guided generation for SDXL', category: 'image', thumbnail: '/assets/card_images/comfyui_workflow.jpg', uses: 3800, tags: ['ControlNet', 'Canny'], favorite: false },
  { id: 'depth', name: 'ControlNet Depth Anything v2', description: 'Depth estimation with Depth Anything v2', category: 'image', thumbnail: '/assets/card_images/can-you-rate-my-comfyui-workflow-v0-o9clchhji39c1.webp', uses: 3500, tags: ['ControlNet', 'Depth'], favorite: false },
  { id: 'sdxl-refiner', name: 'SDXL Base + Refiner Pipeline', description: 'Two-pass SDXL with refiner model', category: 'image', thumbnail: '/assets/card_images/dda28581-37c8-44da-8822-57d1ccc2118c_2130x1658.png', uses: 3200, tags: ['SDXL', 'Refiner'], favorite: false },
  // Video category
  { id: 'video-gen', name: 'Stable Video Diffusion img2vid', description: 'Generate videos from images with SVD', category: 'video', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', uses: 4800, tags: ['SVD', 'img2vid'], favorite: true },
  { id: 'animatediff', name: 'AnimateDiff + LCM Turbo', description: 'Fast animation with LCM acceleration', category: 'video', thumbnail: '/assets/card_images/workflow_01.webp', uses: 2900, tags: ['AnimateDiff', 'LCM'], favorite: false },
  // Audio category
  { id: 'audio-gen', name: 'Stable Audio Open', description: 'Generate audio with Stable Audio', category: 'audio', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', uses: 2600, tags: ['Audio', 'Stable Audio'], favorite: false },
  // 3D category
  { id: '3d-model', name: 'TripoSR Image to 3D', description: 'Generate 3D models from single images', category: '3d', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', uses: 2400, tags: ['TripoSR', '3D'], favorite: false },
]

export const MOCK_MODELS: Model[] = [
  {
    id: 'model-1', name: 'sd_xl_base_1.0', type: 'checkpoint', baseModel: 'SDXL', size: '6.94 GB', sizeBytes: 7452139315, version: '1.0', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/workflow_01.webp', favorite: true, source: 'builtin',
    versions: [
      { id: 'v1.0', version: '1.0', size: '6.94 GB', releaseDate: 'Jul 26, 2023', isInstalled: true, isCurrent: true },
      { id: 'v0.9', version: '0.9', size: '6.94 GB', releaseDate: 'Jun 22, 2023', isInstalled: false, isCurrent: false },
    ]
  },
  { id: 'model-2', name: 'sd_xl_refiner_1.0', type: 'checkpoint', baseModel: 'SDXL', size: '6.08 GB', sizeBytes: 6529336320, version: '1.0', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', favorite: false, source: 'builtin' },
  {
    id: 'model-3', name: 'ponyDiffusionV6XL', type: 'checkpoint', baseModel: 'Pony', size: '6.46 GB', sizeBytes: 6936657920, version: 'v6', updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', favorite: true, source: 'imported',
    versions: [
      { id: 'v6', version: 'v6', size: '6.46 GB', releaseDate: 'Mar 15, 2024', isInstalled: true, isCurrent: true },
      { id: 'v5.5', version: 'v5.5', size: '6.46 GB', releaseDate: 'Jan 10, 2024', isInstalled: false, isCurrent: false },
    ]
  },
  { id: 'model-4', name: 'illustriousXL_v01', type: 'checkpoint', baseModel: 'SDXL', size: '6.94 GB', sizeBytes: 7452139315, version: '0.1', updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', favorite: true, source: 'imported' },
  { id: 'model-5', name: 'realisticVisionV51_v51VAE', type: 'checkpoint', baseModel: 'SD1.5', size: '2.13 GB', sizeBytes: 2287828992, version: '5.1', updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', favorite: false, source: 'imported' },
  { id: 'model-6', name: 'noobaiXLNAIXL_epsilonPred10', type: 'checkpoint', baseModel: 'SDXL', size: '6.94 GB', sizeBytes: 7452139315, version: 'eps10', updatedAt: '5 days ago', updatedTimestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', favorite: false, source: 'imported' },
  { id: 'model-7', name: 'flux1-dev-fp8', type: 'checkpoint', baseModel: 'Flux', size: '17.2 GB', sizeBytes: 18471329792, version: '1.0', updatedAt: '4 days ago', updatedTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', favorite: true, source: 'builtin' },
  { id: 'model-8', name: 'flux1-schnell-fp8', type: 'checkpoint', baseModel: 'Flux', size: '17.2 GB', sizeBytes: 18471329792, version: '1.0', updatedAt: '4 days ago', updatedTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/comfyui_workflow.jpg', favorite: false, source: 'builtin' },
  // LoRAs
  { id: 'model-9', name: 'sdxl_lightning_4step_lora', type: 'lora', baseModel: 'SDXL', size: '393 MB', sizeBytes: 412090368, version: '4-step', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/can-you-rate-my-comfyui-workflow-v0-o9clchhji39c1.webp', triggerWords: [], favorite: true, source: 'builtin' },
  { id: 'model-10', name: 'lcm-lora-sdxl', type: 'lora', baseModel: 'SDXL', size: '393 MB', sizeBytes: 412090368, version: '1.0', updatedAt: '1 month ago', updatedTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/dda28581-37c8-44da-8822-57d1ccc2118c_2130x1658.png', triggerWords: [], favorite: false, source: 'builtin' },
  { id: 'model-11', name: 'detail_tweaker_xl', type: 'lora', baseModel: 'SDXL', size: '144 MB', sizeBytes: 150994944, version: '1.0', updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/workflow_01.webp', triggerWords: [], favorite: false, source: 'imported' },
  { id: 'model-12', name: 'add_more_details_v14', type: 'lora', baseModel: 'SDXL', size: '72 MB', sizeBytes: 75497472, version: '1.4', updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', triggerWords: [], favorite: false, source: 'imported' },
  // VAE
  { id: 'model-13', name: 'sdxl_vae', type: 'vae', baseModel: 'SDXL', size: '335 MB', sizeBytes: 351272960, version: 'fp16', updatedAt: '1 month ago', updatedTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', favorite: false, source: 'builtin' },
  { id: 'model-14', name: 'ae_flux_dev', type: 'vae', baseModel: 'Flux', size: '335 MB', sizeBytes: 351272960, version: '1.0', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', favorite: false, source: 'builtin' },
  // ControlNet
  { id: 'model-15', name: 'control_v11p_sd15_canny', type: 'controlnet', baseModel: 'SD1.5', size: '1.45 GB', sizeBytes: 1556925644, version: '1.1', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', favorite: false, source: 'builtin' },
  { id: 'model-16', name: 'control_v11f1p_sd15_depth', type: 'controlnet', baseModel: 'SD1.5', size: '1.45 GB', sizeBytes: 1556925644, version: '1.1', updatedAt: '2 weeks ago', updatedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', favorite: false, source: 'builtin' },
  { id: 'model-17', name: 'control_v11p_sd15_openpose', type: 'controlnet', baseModel: 'SD1.5', size: '1.45 GB', sizeBytes: 1556925644, version: '1.1', updatedAt: '3 weeks ago', updatedTimestamp: Date.now() - 21 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', favorite: true, source: 'builtin' },
]

export const MOCK_ASSETS: Asset[] = [
  // Generated images
  { id: 'asset-1', name: 'ComfyUI_00001_.png', type: 'image', source: 'generated', size: '2.4 MB', sizeBytes: 2516582, dimensions: '1024x1024', updatedAt: '2 hours ago', updatedTimestamp: Date.now() - 2 * 60 * 60 * 1000, thumbnail: '/assets/card_images/workflow_01.webp', favorite: true },
  { id: 'asset-2', name: 'ComfyUI_00002_.png', type: 'image', source: 'generated', size: '2.1 MB', sizeBytes: 2202009, dimensions: '1024x1024', updatedAt: '3 hours ago', updatedTimestamp: Date.now() - 3 * 60 * 60 * 1000, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', favorite: false },
  { id: 'asset-3', name: 'ComfyUI_00003_.png', type: 'image', source: 'generated', size: '1.9 MB', sizeBytes: 1992294, dimensions: '768x1024', updatedAt: '5 hours ago', updatedTimestamp: Date.now() - 5 * 60 * 60 * 1000, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', favorite: false },
  // Reference images
  { id: 'asset-4', name: 'pose_reference_01.jpg', type: 'image', source: 'imported', size: '1.8 MB', sizeBytes: 1887437, dimensions: '768x1024', updatedAt: '1 day ago', updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', favorite: true },
  { id: 'asset-5', name: 'style_ref_cyberpunk.png', type: 'image', source: 'imported', size: '3.2 MB', sizeBytes: 3355443, dimensions: '1920x1080', updatedAt: '2 days ago', updatedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', favorite: false },
  { id: 'asset-6', name: 'face_ref_female_01.jpg', type: 'image', source: 'imported', size: '0.8 MB', sizeBytes: 838860, dimensions: '512x512', updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', favorite: true },
  { id: 'asset-7', name: 'controlnet_depth_input.png', type: 'image', source: 'imported', size: '1.2 MB', sizeBytes: 1258291, dimensions: '1024x1024', updatedAt: '4 days ago', updatedTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', favorite: false },
  // Videos
  { id: 'asset-8', name: 'AnimateDiff_00001.mp4', type: 'video', source: 'generated', size: '24.5 MB', sizeBytes: 25690112, dimensions: '512x512', updatedAt: '1 day ago', updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/comfyui_workflow.jpg', favorite: true },
  { id: 'asset-9', name: 'SVD_output_00001.mp4', type: 'video', source: 'generated', size: '18.7 MB', sizeBytes: 19607347, dimensions: '1024x576', updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/can-you-rate-my-comfyui-workflow-v0-o9clchhji39c1.webp', favorite: false },
  // Audio
  { id: 'asset-10', name: 'stable_audio_ambient_01.wav', type: 'audio', source: 'generated', size: '8.2 MB', sizeBytes: 8598323, dimensions: '0:32', updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/dda28581-37c8-44da-8822-57d1ccc2118c_2130x1658.png', favorite: false },
]

export const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'wf-1', name: 'SDXL txt2img + Refiner', description: 'High quality SDXL with refiner pass', nodeCount: 14, updatedAt: '1 hour ago', updatedTimestamp: Date.now() - 60 * 60 * 1000, thumbnail: '/assets/card_images/workflow_01.webp', favorite: true, runtime: '~18s', cost: '$0.03', tags: ['SDXL', 'Refiner'] },
  { id: 'wf-2', name: 'Flux.1 Dev txt2img', description: 'Flux Dev model generation', nodeCount: 8, updatedAt: '3 hours ago', updatedTimestamp: Date.now() - 3 * 60 * 60 * 1000, thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', favorite: true, runtime: '~25s', cost: '$0.05', tags: ['Flux', 'txt2img'] },
  { id: 'wf-3', name: 'Pony Realism Portrait', description: 'Realistic portraits with Pony V6', nodeCount: 18, updatedAt: '1 day ago', updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', favorite: false, runtime: '~15s', cost: '$0.02', tags: ['Pony', 'Portrait'] },
  { id: 'wf-4', name: 'ControlNet Canny + Depth', description: 'Multi-ControlNet guidance', nodeCount: 16, updatedAt: '2 days ago', updatedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', favorite: false, runtime: '~22s', cost: '$0.04', tags: ['ControlNet', 'Multi'] },
  { id: 'wf-5', name: 'Ultimate Upscale 4x Tiled', description: 'Tile-based 4x upscaling', nodeCount: 8, updatedAt: '3 days ago', updatedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', favorite: true, runtime: '~45s', cost: '$0.06', tags: ['Upscale', 'Tiled'] },
  { id: 'wf-6', name: 'AnimateDiff + LCM', description: 'Fast video generation with LCM', nodeCount: 24, updatedAt: '4 days ago', updatedTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', favorite: false, runtime: '~35s', cost: '$0.08', tags: ['AnimateDiff', 'Video'] },
  { id: 'wf-7', name: 'IPAdapter Face Swap', description: 'Face transfer with IPAdapter', nodeCount: 12, updatedAt: '5 days ago', updatedTimestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', favorite: false, runtime: '~20s', cost: '$0.03', tags: ['IPAdapter', 'Face'] },
  { id: 'wf-8', name: 'Illustrious XL Anime', description: 'Anime generation with Illustrious', nodeCount: 12, updatedAt: '1 week ago', updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, thumbnail: '/assets/card_images/comfyui_workflow.jpg', favorite: true, runtime: '~12s', cost: '$0.02', tags: ['Illustrious', 'Anime'] },
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

// ============================================
// SHARING RELATED TYPES & DATA
// ============================================

import type { ShareAccessMode } from '@/types/workflowShare'

/**
 * Extended workflow with sharing info
 */
export interface WorkflowWithSharing extends Workflow {
  ownerId: string
  isShared?: boolean
  shareCount?: number
  accessMode?: ShareAccessMode
  sharedBy?: {
    id: string
    name: string
    avatar?: string
  }
  forkedFrom?: {
    workflowId: string
    workflowName: string
    authorName: string
  }
}

/**
 * Mock shared workflows (workflows shared with current user)
 */
export const MOCK_SHARED_WORKFLOWS: WorkflowWithSharing[] = [
  {
    id: 'shared-wf-1',
    name: 'Portrait Generator Pro',
    description: 'High-quality portrait generation with face enhancement',
    nodeCount: 18,
    updatedAt: '2 days ago',
    updatedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    thumbnail: '/assets/card_images/workflow_01.webp',
    favorite: false,
    runtime: '~20s',
    cost: '$0.04',
    tags: ['Portrait', 'Face'],
    ownerId: 'user-2',
    isShared: true,
    accessMode: 'linear',
    sharedBy: {
      id: 'user-2',
      name: 'Alice Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
  },
  {
    id: 'shared-wf-2',
    name: 'SDXL Turbo Pipeline',
    description: 'Fast 4-step generation with SDXL Turbo',
    nodeCount: 12,
    updatedAt: '5 days ago',
    updatedTimestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp',
    favorite: true,
    runtime: '~8s',
    cost: '$0.02',
    tags: ['SDXL', 'Turbo', 'Fast'],
    ownerId: 'user-3',
    isShared: true,
    accessMode: 'both',
    sharedBy: {
      id: 'user-3',
      name: 'Bob Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
  },
  {
    id: 'shared-wf-3',
    name: 'ControlNet Multi-Stack',
    description: 'Advanced multi-ControlNet setup for precise control',
    nodeCount: 24,
    updatedAt: '1 week ago',
    updatedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp',
    favorite: false,
    runtime: '~30s',
    cost: '$0.06',
    tags: ['ControlNet', 'Advanced'],
    ownerId: 'user-4',
    isShared: true,
    accessMode: 'workflow',
    sharedBy: {
      id: 'user-4',
      name: 'Carol Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    },
  },
  {
    id: 'shared-wf-4',
    name: 'Anime Style Transfer',
    description: 'Transform photos into anime style with IPAdapter',
    nodeCount: 16,
    updatedAt: '10 days ago',
    updatedTimestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
    thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp',
    favorite: false,
    runtime: '~15s',
    cost: '$0.03',
    tags: ['Anime', 'IPAdapter', 'Style'],
    ownerId: 'user-5',
    isShared: true,
    accessMode: 'linear',
    sharedBy: {
      id: 'user-5',
      name: 'David Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    },
  },
]

/**
 * Mock forked workflows (workflows the user has forked)
 */
export const MOCK_FORKED_WORKFLOWS: WorkflowWithSharing[] = [
  {
    id: 'forked-wf-1',
    name: 'My Portrait Generator',
    description: 'Customized portrait generation based on Portrait Generator Pro',
    nodeCount: 20,
    updatedAt: '1 day ago',
    updatedTimestamp: Date.now() - 24 * 60 * 60 * 1000,
    thumbnail: '/assets/card_images/workflow_01.webp',
    favorite: true,
    runtime: '~22s',
    cost: '$0.04',
    tags: ['Portrait', 'Face', 'Custom'],
    ownerId: 'user-1',
    forkedFrom: {
      workflowId: 'shared-wf-1',
      workflowName: 'Portrait Generator Pro',
      authorName: 'Alice Chen',
    },
  },
]

/**
 * Mock users for share search
 */
export const MOCK_SHAREABLE_USERS = [
  { id: 'user-2', name: 'Alice Chen', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
  { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
  { id: 'user-4', name: 'Carol Smith', email: 'carol@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol' },
  { id: 'user-5', name: 'David Lee', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
  { id: 'user-6', name: 'Emma Johnson', email: 'emma@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
  { id: 'user-7', name: 'Frank Brown', email: 'frank@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank' },
  { id: 'user-8', name: 'Grace Kim', email: 'grace@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace' },
  { id: 'user-9', name: 'Henry Davis', email: 'henry@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry' },
]

/**
 * Get all workflows including shared and forked
 */
export function getAllWorkflowsWithSharing(): WorkflowWithSharing[] {
  const ownWorkflows: WorkflowWithSharing[] = MOCK_WORKFLOWS.map(wf => ({
    ...wf,
    ownerId: 'user-1',
  }))

  return [...ownWorkflows, ...MOCK_FORKED_WORKFLOWS]
}

/**
 * Get workflows shared with current user
 */
export function getSharedWithMeWorkflows(): WorkflowWithSharing[] {
  return MOCK_SHARED_WORKFLOWS
}

/**
 * Get forked workflows
 */
export function getForkedWorkflows(): WorkflowWithSharing[] {
  return MOCK_FORKED_WORKFLOWS
}
