/**
 * Sample Node Definitions
 */

import type { NodeDefinition } from '@/types/node'

export const LOAD_CHECKPOINT: NodeDefinition = {
  type: 'LoadCheckpoint',
  displayName: 'Load Checkpoint',
  category: { name: 'loaders', color: '#b39ddb' },
  description: 'Load a Stable Diffusion checkpoint model',
  inputs: [],
  outputs: [
    { name: 'MODEL', type: 'MODEL', label: 'Model' },
    { name: 'CLIP', type: 'CLIP', label: 'CLIP' },
    { name: 'VAE', type: 'VAE', label: 'VAE' },
  ],
  widgets: [
    {
      name: 'ckpt_name',
      type: 'select',
      label: 'Checkpoint',
      value: 'v1-5-pruned-emaonly.safetensors',
      options: {
        choices: [
          { label: 'v1-5-pruned-emaonly.safetensors', value: 'v1-5-pruned-emaonly.safetensors' },
          { label: 'sd_xl_base_1.0.safetensors', value: 'sd_xl_base_1.0.safetensors' },
          { label: 'dreamshaper_8.safetensors', value: 'dreamshaper_8.safetensors' },
        ],
      },
    },
  ],
  headerColor: '#5c3d9c',
}

export const CLIP_TEXT_ENCODE: NodeDefinition = {
  type: 'CLIPTextEncode',
  displayName: 'CLIP Text Encode',
  category: { name: 'conditioning', color: '#ffab40' },
  description: 'Encode text using CLIP model',
  inputs: [
    { name: 'clip', type: 'CLIP', label: 'CLIP' },
  ],
  outputs: [
    { name: 'CONDITIONING', type: 'CONDITIONING', label: 'Conditioning' },
  ],
  widgets: [
    {
      name: 'text',
      type: 'textarea',
      label: 'Prompt',
      value: 'beautiful landscape, mountains, sunset',
    },
  ],
  headerColor: '#cc8400',
}

export const KSAMPLER: NodeDefinition = {
  type: 'KSampler',
  displayName: 'KSampler',
  category: { name: 'sampling', color: '#64b5f6' },
  description: 'Sample latent images using various samplers',
  inputs: [
    { name: 'model', type: 'MODEL', label: 'Model' },
    { name: 'positive', type: 'CONDITIONING', label: 'Positive' },
    { name: 'negative', type: 'CONDITIONING', label: 'Negative' },
    { name: 'latent_image', type: 'LATENT', label: 'Latent Image' },
  ],
  outputs: [
    { name: 'LATENT', type: 'LATENT', label: 'Latent' },
  ],
  widgets: [
    {
      name: 'seed',
      type: 'number',
      label: 'Seed',
      value: 123456789,
      options: { min: 0, max: Number.MAX_SAFE_INTEGER },
    },
    {
      name: 'steps',
      type: 'slider',
      label: 'Steps',
      value: 20,
      options: { min: 1, max: 150, step: 1 },
    },
    {
      name: 'cfg',
      type: 'slider',
      label: 'CFG',
      value: 7.5,
      options: { min: 1, max: 30, step: 0.5, precision: 1 },
    },
    {
      name: 'sampler_name',
      type: 'select',
      label: 'Sampler',
      value: 'euler',
      options: {
        choices: [
          { label: 'euler', value: 'euler' },
          { label: 'euler_ancestral', value: 'euler_ancestral' },
          { label: 'dpmpp_2m', value: 'dpmpp_2m' },
          { label: 'dpmpp_sde', value: 'dpmpp_sde' },
        ],
      },
    },
    {
      name: 'scheduler',
      type: 'select',
      label: 'Scheduler',
      value: 'normal',
      options: {
        choices: [
          { label: 'normal', value: 'normal' },
          { label: 'karras', value: 'karras' },
          { label: 'exponential', value: 'exponential' },
        ],
      },
    },
    {
      name: 'denoise',
      type: 'slider',
      label: 'Denoise',
      value: 1.0,
      options: { min: 0, max: 1, step: 0.01, precision: 2 },
    },
  ],
  headerColor: '#1565c0',
}

export const EMPTY_LATENT_IMAGE: NodeDefinition = {
  type: 'EmptyLatentImage',
  displayName: 'Empty Latent Image',
  category: { name: 'latent', color: '#ff80ab' },
  description: 'Create an empty latent image',
  inputs: [],
  outputs: [
    { name: 'LATENT', type: 'LATENT', label: 'Latent' },
  ],
  widgets: [
    {
      name: 'width',
      type: 'slider',
      label: 'Width',
      value: 512,
      options: { min: 64, max: 2048, step: 8 },
    },
    {
      name: 'height',
      type: 'slider',
      label: 'Height',
      value: 512,
      options: { min: 64, max: 2048, step: 8 },
    },
    {
      name: 'batch_size',
      type: 'number',
      label: 'Batch Size',
      value: 1,
      options: { min: 1, max: 64 },
    },
  ],
  headerColor: '#c2185b',
}

export const VAE_DECODE: NodeDefinition = {
  type: 'VAEDecode',
  displayName: 'VAE Decode',
  category: { name: 'latent', color: '#ef5350' },
  description: 'Decode latent images using VAE',
  inputs: [
    { name: 'samples', type: 'LATENT', label: 'Samples' },
    { name: 'vae', type: 'VAE', label: 'VAE' },
  ],
  outputs: [
    { name: 'IMAGE', type: 'IMAGE', label: 'Image' },
  ],
  widgets: [],
  headerColor: '#c62828',
}

export const SAVE_IMAGE: NodeDefinition = {
  type: 'SaveImage',
  displayName: 'Save Image',
  category: { name: 'image', color: '#64b5f6' },
  description: 'Save images to disk',
  inputs: [
    { name: 'images', type: 'IMAGE', label: 'Images' },
  ],
  outputs: [],
  widgets: [
    {
      name: 'filename_prefix',
      type: 'text',
      label: 'Filename Prefix',
      value: 'ComfyUI',
    },
  ],
  headerColor: '#0d47a1',
}

export const SUBGRAPH: NodeDefinition = {
  type: 'Subgraph',
  displayName: 'Subgraph',
  category: { name: 'subgraph', color: '#78909C' },
  description: 'A reusable group of nodes',
  inputs: [
    { name: 'input_1', type: '*', label: 'Input 1' },
    { name: 'input_2', type: '*', label: 'Input 2' },
  ],
  outputs: [
    { name: 'output_1', type: '*', label: 'Output 1' },
  ],
  widgets: [],
  headerColor: '#546E7A',
  bodyColor: '#37474F',
}

export const SUBGRAPH_INPUT: NodeDefinition = {
  type: 'SubgraphInput',
  displayName: 'Subgraph Input',
  category: { name: 'subgraph', color: '#4CAF50' },
  description: 'Input node for subgraph - receives data from parent workflow',
  inputs: [],
  outputs: [
    { name: 'output', type: 'IMAGE', label: 'Image' },
  ],
  widgets: [],
  headerColor: '#2E7D32',
  bodyColor: '#1B5E20',
}

export const SUBGRAPH_OUTPUT: NodeDefinition = {
  type: 'SubgraphOutput',
  displayName: 'Subgraph Output',
  category: { name: 'subgraph', color: '#F44336' },
  description: 'Output node for subgraph - sends data back to parent workflow',
  inputs: [
    { name: 'input', type: 'IMAGE', label: 'Image' },
  ],
  outputs: [],
  widgets: [],
  headerColor: '#C62828',
  bodyColor: '#B71C1C',
}

export const IMAGE_UPSCALE: NodeDefinition = {
  type: 'ImageUpscale',
  displayName: 'Image Upscale',
  category: { name: 'image', color: '#64b5f6' },
  description: 'Upscale image using various methods',
  inputs: [
    { name: 'image', type: 'IMAGE', label: 'Image' },
  ],
  outputs: [
    { name: 'IMAGE', type: 'IMAGE', label: 'Image' },
  ],
  widgets: [
    {
      name: 'upscale_method',
      type: 'select',
      label: 'Method',
      value: 'nearest-exact',
      options: {
        choices: [
          { label: 'nearest-exact', value: 'nearest-exact' },
          { label: 'bilinear', value: 'bilinear' },
          { label: 'bicubic', value: 'bicubic' },
          { label: 'lanczos', value: 'lanczos' },
        ],
      },
    },
    {
      name: 'scale_by',
      type: 'slider',
      label: 'Scale',
      value: 2,
      options: { min: 1, max: 8, step: 0.5, precision: 1 },
    },
  ],
  headerColor: '#1565c0',
}

export const IMAGE_SHARPEN: NodeDefinition = {
  type: 'ImageSharpen',
  displayName: 'Image Sharpen',
  category: { name: 'image', color: '#64b5f6' },
  description: 'Sharpen image edges',
  inputs: [
    { name: 'image', type: 'IMAGE', label: 'Image' },
  ],
  outputs: [
    { name: 'IMAGE', type: 'IMAGE', label: 'Image' },
  ],
  widgets: [
    {
      name: 'strength',
      type: 'slider',
      label: 'Strength',
      value: 1.0,
      options: { min: 0, max: 5, step: 0.1, precision: 1 },
    },
  ],
  headerColor: '#1565c0',
}

export const NODE_DEFINITIONS: Record<string, NodeDefinition> = {
  LoadCheckpoint: LOAD_CHECKPOINT,
  CLIPTextEncode: CLIP_TEXT_ENCODE,
  KSampler: KSAMPLER,
  EmptyLatentImage: EMPTY_LATENT_IMAGE,
  VAEDecode: VAE_DECODE,
  SaveImage: SAVE_IMAGE,
  Subgraph: SUBGRAPH,
  SubgraphInput: SUBGRAPH_INPUT,
  SubgraphOutput: SUBGRAPH_OUTPUT,
  ImageUpscale: IMAGE_UPSCALE,
  ImageSharpen: IMAGE_SHARPEN,
}
