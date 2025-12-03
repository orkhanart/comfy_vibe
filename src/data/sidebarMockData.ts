// Mock data for sidebar tabs
// TODO: Replace with real API data from ComfyUI backend

export interface NodeItem {
  name: string
  display: string
}

export interface NodeCategory {
  id: string
  label: string
  icon: string
  expanded: boolean
  nodes: NodeItem[]
}

export interface ModelItem {
  name: string
  display: string
  size: string
}

export interface ModelCategory {
  id: string
  label: string
  icon: string
  expanded: boolean
  models: ModelItem[]
}

export interface WorkflowItem {
  name: string
  date: string
  nodes: number
  thumbnail: string
}

export interface AssetItem {
  name: string
  type: string
}

export interface TemplateItem {
  name: string
  display: string
  description: string
  nodes: number
}

export interface TemplateCategory {
  id: string
  label: string
  icon: string
  expanded: boolean
  templates: TemplateItem[]
}

export const NODE_CATEGORIES_DATA: NodeCategory[] = [
  {
    id: 'loaders',
    label: 'Loaders',
    icon: 'download',
    expanded: true,
    nodes: [
      { name: 'CheckpointLoaderSimple', display: 'Load Checkpoint' },
      { name: 'VAELoader', display: 'Load VAE' },
      { name: 'LoraLoader', display: 'Load LoRA' },
      { name: 'CLIPLoader', display: 'Load CLIP' },
      { name: 'ControlNetLoader', display: 'Load ControlNet Model' },
      { name: 'UNETLoader', display: 'Load Diffusion Model' },
    ]
  },
  {
    id: 'conditioning',
    label: 'Conditioning',
    icon: 'sliders-h',
    expanded: false,
    nodes: [
      { name: 'CLIPTextEncode', display: 'CLIP Text Encode (Prompt)' },
      { name: 'ConditioningCombine', display: 'Conditioning (Combine)' },
      { name: 'ConditioningSetArea', display: 'Conditioning (Set Area)' },
      { name: 'ControlNetApply', display: 'Apply ControlNet' },
    ]
  },
  {
    id: 'sampling',
    label: 'Sampling',
    icon: 'box',
    expanded: false,
    nodes: [
      { name: 'KSampler', display: 'KSampler' },
      { name: 'KSamplerAdvanced', display: 'KSampler (Advanced)' },
      { name: 'SamplerCustom', display: 'SamplerCustom' },
    ]
  },
  {
    id: 'latent',
    label: 'Latent',
    icon: 'th-large',
    expanded: false,
    nodes: [
      { name: 'EmptyLatentImage', display: 'Empty Latent Image' },
      { name: 'LatentUpscale', display: 'Upscale Latent' },
      { name: 'LatentComposite', display: 'Latent Composite' },
      { name: 'VAEDecode', display: 'VAE Decode' },
      { name: 'VAEEncode', display: 'VAE Encode' },
    ]
  },
  {
    id: 'image',
    label: 'Image',
    icon: 'image',
    expanded: false,
    nodes: [
      { name: 'LoadImage', display: 'Load Image' },
      { name: 'SaveImage', display: 'Save Image' },
      { name: 'PreviewImage', display: 'Preview Image' },
      { name: 'ImageScale', display: 'Upscale Image' },
      { name: 'ImageInvert', display: 'Invert Image' },
    ]
  },
  {
    id: 'masking',
    label: 'Masking',
    icon: 'clone',
    expanded: false,
    nodes: [
      { name: 'LoadImageMask', display: 'Load Image (as Mask)' },
      { name: 'MaskComposite', display: 'Mask Composite' },
      { name: 'ImageToMask', display: 'Convert Image to Mask' },
    ]
  },
]

export const MODEL_CATEGORIES_DATA: ModelCategory[] = [
  {
    id: 'checkpoints',
    label: 'Checkpoints',
    icon: 'box',
    expanded: true,
    models: [
      { name: 'sd_v1-5', display: 'SD 1.5', size: '4.27 GB' },
      { name: 'sd_xl_base_1.0', display: 'SDXL Base 1.0', size: '6.94 GB' },
      { name: 'realistic_vision_v5', display: 'Realistic Vision V5', size: '2.13 GB' },
      { name: 'dreamshaper_8', display: 'DreamShaper 8', size: '2.13 GB' },
      { name: 'deliberate_v3', display: 'Deliberate V3', size: '2.13 GB' },
    ]
  },
  {
    id: 'loras',
    label: 'LoRAs',
    icon: 'link',
    expanded: false,
    models: [
      { name: 'add_detail', display: 'Add Detail', size: '144 MB' },
      { name: 'epi_noiseoffset', display: 'Epi Noise Offset', size: '36 MB' },
      { name: 'film_grain', display: 'Film Grain', size: '72 MB' },
      { name: 'lcm_lora_sdxl', display: 'LCM LoRA SDXL', size: '393 MB' },
    ]
  },
  {
    id: 'vae',
    label: 'VAE',
    icon: 'sitemap',
    expanded: false,
    models: [
      { name: 'vae-ft-mse-840000', display: 'VAE ft MSE', size: '335 MB' },
      { name: 'sdxl_vae', display: 'SDXL VAE', size: '335 MB' },
    ]
  },
  {
    id: 'controlnet',
    label: 'ControlNet',
    icon: 'sliders-v',
    expanded: false,
    models: [
      { name: 'control_v11p_sd15_canny', display: 'Canny (SD1.5)', size: '1.45 GB' },
      { name: 'control_v11p_sd15_openpose', display: 'OpenPose (SD1.5)', size: '1.45 GB' },
      { name: 'control_v11f1p_sd15_depth', display: 'Depth (SD1.5)', size: '1.45 GB' },
      { name: 'controlnet_sdxl_canny', display: 'Canny (SDXL)', size: '2.5 GB' },
    ]
  },
  {
    id: 'embeddings',
    label: 'Embeddings',
    icon: 'tag',
    expanded: false,
    models: [
      { name: 'easynegative', display: 'EasyNegative', size: '24 KB' },
      { name: 'bad_prompt_v2', display: 'Bad Prompt V2', size: '24 KB' },
      { name: 'ng_deepnegative', display: 'NG DeepNegative', size: '24 KB' },
    ]
  },
  {
    id: 'upscale',
    label: 'Upscale Models',
    icon: 'expand',
    expanded: false,
    models: [
      { name: '4x_ultrasharp', display: '4x UltraSharp', size: '67 MB' },
      { name: 'realesrgan_x4plus', display: 'RealESRGAN x4+', size: '64 MB' },
      { name: '4x_nmkd_superscale', display: '4x NMKD Superscale', size: '67 MB' },
    ]
  },
]

export const WORKFLOWS_DATA: WorkflowItem[] = [
  { name: 'Basic txt2img', date: '2024-01-15', nodes: 8, thumbnail: 'txt2img' },
  { name: 'Img2Img Pipeline', date: '2024-01-14', nodes: 12, thumbnail: 'img2img' },
  { name: 'ControlNet Canny', date: '2024-01-13', nodes: 15, thumbnail: 'controlnet' },
  { name: 'SDXL with Refiner', date: '2024-01-12', nodes: 18, thumbnail: 'sdxl' },
  { name: 'Inpainting Setup', date: '2024-01-10', nodes: 10, thumbnail: 'inpaint' },
]

export const ASSETS_DATA: AssetItem[] = [
  { name: 'reference_01.png', type: 'image' },
  { name: 'mask_template.png', type: 'image' },
  { name: 'init_image.jpg', type: 'image' },
]

// Team Library Types
export interface TeamMember {
  name: string
  avatar?: string
  initials: string
  role: 'admin' | 'editor' | 'viewer'
}

export interface BrandAsset {
  id: string
  name: string
  type: 'logo' | 'color' | 'font' | 'template' | 'guideline'
  thumbnail?: string
  value?: string
  description?: string
}

export interface SharedWorkflow {
  id: string
  name: string
  description: string
  author: TeamMember
  updatedAt: string
  nodes: number
  category: string
  starred: boolean
  thumbnail?: string
}

export interface TeamModel {
  id: string
  name: string
  type: 'checkpoint' | 'lora' | 'embedding' | 'controlnet'
  description: string
  size: string
  author: TeamMember
  downloads: number
  thumbnail?: string
}

export const TEMPLATE_CATEGORIES_DATA: TemplateCategory[] = [
  {
    id: 'official',
    label: 'Official',
    icon: 'verified',
    expanded: true,
    templates: [
      { name: 'txt2img-basic', display: 'Text to Image (Basic)', description: 'Simple text-to-image generation', nodes: 6 },
      { name: 'img2img-basic', display: 'Image to Image', description: 'Transform existing images', nodes: 8 },
      { name: 'inpainting', display: 'Inpainting', description: 'Fill masked regions', nodes: 10 },
      { name: 'upscaling', display: 'Upscaling', description: '2x-4x image upscaling', nodes: 5 },
    ]
  },
  {
    id: 'sdxl',
    label: 'SDXL',
    icon: 'star',
    expanded: false,
    templates: [
      { name: 'sdxl-txt2img', display: 'SDXL Text to Image', description: 'SDXL base workflow', nodes: 8 },
      { name: 'sdxl-refiner', display: 'SDXL + Refiner', description: 'Base with refiner', nodes: 14 },
      { name: 'sdxl-lightning', display: 'SDXL Lightning', description: '4-step fast generation', nodes: 9 },
    ]
  },
  {
    id: 'controlnet',
    label: 'ControlNet',
    icon: 'sliders-v',
    expanded: false,
    templates: [
      { name: 'cn-canny', display: 'Canny Edge', description: 'Edge detection control', nodes: 12 },
      { name: 'cn-depth', display: 'Depth Map', description: 'Depth-based control', nodes: 12 },
      { name: 'cn-openpose', display: 'OpenPose', description: 'Pose control', nodes: 14 },
      { name: 'cn-lineart', display: 'Line Art', description: 'Sketch to image', nodes: 11 },
    ]
  },
  {
    id: 'video',
    label: 'Video',
    icon: 'video',
    expanded: false,
    templates: [
      { name: 'svd-basic', display: 'SVD Image to Video', description: 'Stable Video Diffusion', nodes: 10 },
      { name: 'animatediff', display: 'AnimateDiff', description: 'Animation generation', nodes: 16 },
    ]
  },
  {
    id: 'community',
    label: 'Community',
    icon: 'users',
    expanded: false,
    templates: [
      { name: 'portrait-enhance', display: 'Portrait Enhancer', description: 'Face restoration workflow', nodes: 12 },
      { name: 'style-transfer', display: 'Style Transfer', description: 'Apply art styles', nodes: 14 },
      { name: 'batch-process', display: 'Batch Processing', description: 'Process multiple images', nodes: 18 },
    ]
  },
]

// Team Library Mock Data
export const TEAM_MEMBERS_DATA: TeamMember[] = [
  { name: 'Sarah Chen', initials: 'SC', role: 'admin' },
  { name: 'Mike Johnson', initials: 'MJ', role: 'editor' },
  { name: 'Alex Rivera', initials: 'AR', role: 'editor' },
  { name: 'Emma Wilson', initials: 'EW', role: 'viewer' },
]

export const BRAND_ASSETS_DATA: BrandAsset[] = [
  { id: '1', name: 'Primary Logo', type: 'logo', description: 'Main Netflix N logo' },
  { id: '2', name: 'Wordmark', type: 'logo', description: 'Netflix text logo' },
  { id: '3', name: 'Netflix Red', type: 'color', value: '#E50914', description: 'Primary brand color' },
  { id: '4', name: 'Background Black', type: 'color', value: '#141414', description: 'Standard background' },
  { id: '5', name: 'Netflix Sans', type: 'font', description: 'Primary typeface' },
  { id: '6', name: 'Thumbnail Template', type: 'template', description: '16:9 show thumbnail' },
  { id: '7', name: 'Brand Guidelines', type: 'guideline', description: 'Full brand documentation' },
]

export function createSharedWorkflowsData(members: TeamMember[]): SharedWorkflow[] {
  return [
    {
      id: '1',
      name: 'Show Thumbnail Generator',
      description: 'Standard workflow for generating show thumbnails with proper dimensions and styling',
      author: members[0]!,
      updatedAt: '2 hours ago',
      nodes: 12,
      category: 'Production',
      starred: true,
      thumbnail: '/assets/card_images/workflow_01.webp',
    },
    {
      id: '2',
      name: 'Character Portrait Pipeline',
      description: 'Generate consistent character portraits for marketing materials',
      author: members[1]!,
      updatedAt: '1 day ago',
      nodes: 18,
      category: 'Marketing',
      starred: true,
      thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp',
    },
    {
      id: '3',
      name: 'Background Scene Creator',
      description: 'Create atmospheric background scenes with Netflix visual style',
      author: members[2]!,
      updatedAt: '3 days ago',
      nodes: 24,
      category: 'Production',
      starred: false,
      thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp',
    },
    {
      id: '4',
      name: 'Social Media Variants',
      description: 'Batch generate social media sized versions',
      author: members[0]!,
      updatedAt: '1 week ago',
      nodes: 8,
      category: 'Marketing',
      starred: false,
      thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp',
    },
  ]
}

export function createTeamModelsData(members: TeamMember[]): TeamModel[] {
  return [
    {
      id: '1',
      name: 'Netflix Style v2',
      type: 'lora',
      description: 'Fine-tuned for Netflix visual aesthetic',
      size: '144 MB',
      author: members[0]!,
      downloads: 156,
      thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp',
    },
    {
      id: '2',
      name: 'Show Thumbnail SDXL',
      type: 'checkpoint',
      description: 'SDXL checkpoint trained on approved thumbnails',
      size: '6.94 GB',
      author: members[1]!,
      downloads: 89,
      thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp',
    },
    {
      id: '3',
      name: 'Character Consistency',
      type: 'lora',
      description: 'Maintain character consistency across generations',
      size: '72 MB',
      author: members[2]!,
      downloads: 234,
      thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp',
    },
    {
      id: '4',
      name: 'Brand Color Embedding',
      type: 'embedding',
      description: 'Netflix color palette embedding',
      size: '24 KB',
      author: members[0]!,
      downloads: 312,
      thumbnail: '/assets/card_images/comfyui_workflow.jpg',
    },
  ]
}

// ============================================================================
// LIBRARY SIDEBAR DATA (My Library, Projects, Shared, Templates)
// ============================================================================

export type LibraryItemType = 'workflow' | 'model' | 'asset' | 'folder' | 'template'

export interface LibraryItem {
  id: string
  name: string
  type: LibraryItemType
  icon?: string
  size?: string
  updatedAt: string
  thumbnail?: string
  nodeCount?: number // for workflows
  description?: string // for templates
}

export interface LibraryFolder {
  id: string
  name: string
  icon?: string
  color?: string
  items: LibraryItem[]
  isExpanded?: boolean
}

export interface LibrarySection {
  id: 'my-library' | 'projects' | 'shared' | 'templates'
  label: string
  icon: string
  isExpanded: boolean
  items?: LibraryItem[] // Direct items (for My Library)
  folders?: LibraryFolder[] // Folders (for Projects, Shared)
}

export const LIBRARY_SECTIONS_DATA: LibrarySection[] = [
  {
    id: 'my-library',
    label: 'My Library',
    icon: 'user',
    isExpanded: true,
    folders: [
      {
        id: 'my-workflows',
        name: 'Workflows',
        icon: 'sitemap',
        isExpanded: true,
        items: [
          { id: 'my-wf-1', name: 'Portrait Generator', type: 'workflow', updatedAt: '1 hour ago', nodeCount: 14 },
          { id: 'my-wf-2', name: 'Landscape SDXL', type: 'workflow', updatedAt: '3 hours ago', nodeCount: 18 },
          { id: 'my-wf-3', name: 'Product Photography', type: 'workflow', updatedAt: '1 day ago', nodeCount: 12 },
        ],
      },
      {
        id: 'my-models',
        name: 'Models',
        icon: 'box',
        isExpanded: false,
        items: [
          { id: 'my-model-1', name: 'Custom Style LoRA', type: 'model', size: '144 MB', updatedAt: '1 day ago' },
          { id: 'my-model-2', name: 'Portrait LoRA v2', type: 'model', size: '72 MB', updatedAt: '3 days ago' },
        ],
      },
      {
        id: 'my-assets',
        name: 'Assets',
        icon: 'image',
        isExpanded: false,
        items: [
          { id: 'my-asset-1', name: 'Reference Pack', type: 'asset', updatedAt: '2 days ago' },
          { id: 'my-asset-2', name: 'Brand Logos', type: 'asset', updatedAt: '1 week ago' },
        ],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'folder',
    isExpanded: true,
    folders: [
      {
        id: 'proj-workflows',
        name: 'Workflows',
        icon: 'sitemap',
        isExpanded: false,
        items: [
          { id: 'proj-wf-1', name: 'Hero Image Generator', type: 'workflow', updatedAt: '2 hours ago', nodeCount: 12 },
          { id: 'proj-wf-2', name: 'Background Removal', type: 'workflow', updatedAt: '1 day ago', nodeCount: 8 },
          { id: 'proj-wf-3', name: 'Social Media Generator', type: 'workflow', updatedAt: '5 hours ago', nodeCount: 15 },
        ],
      },
      {
        id: 'proj-models',
        name: 'Models',
        icon: 'box',
        isExpanded: false,
        items: [
          { id: 'proj-model-1', name: 'Product LoRA v2', type: 'model', size: '144 MB', updatedAt: '3 days ago' },
          { id: 'proj-model-2', name: 'Brand Style', type: 'model', size: '72 MB', updatedAt: '1 week ago' },
        ],
      },
      {
        id: 'proj-assets',
        name: 'Assets',
        icon: 'image',
        isExpanded: false,
        items: [
          { id: 'proj-asset-1', name: 'Product Images', type: 'asset', updatedAt: '2 days ago' },
          { id: 'proj-asset-2', name: 'Brand Assets', type: 'asset', updatedAt: '1 week ago' },
        ],
      },
    ],
  },
  {
    id: 'shared',
    label: 'Shared',
    icon: 'users',
    isExpanded: false,
    folders: [
      {
        id: 'shared-workflows',
        name: 'Workflows',
        icon: 'sitemap',
        isExpanded: false,
        items: [
          { id: 'shared-wf-1', name: 'Standard Thumbnail', type: 'workflow', updatedAt: '3 hours ago', nodeCount: 10 },
          { id: 'shared-wf-2', name: 'Quick Upscale', type: 'workflow', updatedAt: '1 day ago', nodeCount: 5 },
        ],
      },
      {
        id: 'shared-models',
        name: 'Models',
        icon: 'box',
        isExpanded: false,
        items: [
          { id: 'shared-model-1', name: 'Brand Checkpoint', type: 'model', size: '6.94 GB', updatedAt: '1 week ago' },
        ],
      },
      {
        id: 'shared-assets',
        name: 'Assets',
        icon: 'image',
        isExpanded: false,
        items: [
          { id: 'shared-asset-1', name: 'Team Resources', type: 'asset', updatedAt: '2 weeks ago' },
        ],
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: 'clone',
    isExpanded: false,
    items: [
      { id: 'tpl-1', name: 'Text to Image (Basic)', type: 'template', description: 'Simple txt2img workflow', nodeCount: 6, updatedAt: 'Official' },
      { id: 'tpl-2', name: 'Image to Image', type: 'template', description: 'Transform existing images', nodeCount: 8, updatedAt: 'Official' },
      { id: 'tpl-3', name: 'SDXL + Refiner', type: 'template', description: 'High quality SDXL pipeline', nodeCount: 14, updatedAt: 'Official' },
      { id: 'tpl-4', name: 'ControlNet Canny', type: 'template', description: 'Edge-guided generation', nodeCount: 12, updatedAt: 'Official' },
    ],
  },
]

