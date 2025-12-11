import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type ModelType = 'checkpoint' | 'lora' | 'vae' | 'controlnet'
export type BaseModel = 'SD1.5' | 'SDXL' | 'Flux' | 'Pony' | 'unknown'
export type ModelSource = 'builtin' | 'imported'

export interface Model {
  id: string
  name: string
  type: ModelType
  baseModel: BaseModel
  size: string
  sizeBytes: number
  version: string
  updatedAt: string
  updatedTimestamp: number
  thumbnail?: string
  triggerWords?: string[]
  favorite: boolean
  source: ModelSource
  sourceUrl?: string // Original download URL for imported models
  folderId?: string | null
}

export interface ModelFolder {
  id: string
  name: string
  parentId: string | null
}

const STORAGE_KEY = 'comfyui-imported-models'

export const useModelsStore = defineStore('models', () => {
  // State
  const importedModels = ref<Model[]>([])
  const folders = ref<ModelFolder[]>([])

  // Load from localStorage on init
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        importedModels.value = data.models || []
        folders.value = data.folders || []
      }
    } catch (e) {
      console.error('Failed to load models from storage:', e)
    }
  }

  // Save to localStorage
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        models: importedModels.value,
        folders: folders.value
      }))
    } catch (e) {
      console.error('Failed to save models to storage:', e)
    }
  }

  // Initialize
  loadFromStorage()

  // Computed
  const allModels = computed(() => importedModels.value)

  const checkpoints = computed(() =>
    importedModels.value.filter(m => m.type === 'checkpoint')
  )

  const loras = computed(() =>
    importedModels.value.filter(m => m.type === 'lora')
  )

  const vaes = computed(() =>
    importedModels.value.filter(m => m.type === 'vae')
  )

  const controlnets = computed(() =>
    importedModels.value.filter(m => m.type === 'controlnet')
  )

  const favoriteModels = computed(() =>
    importedModels.value.filter(m => m.favorite)
  )

  const modelCount = computed(() => importedModels.value.length)

  // Actions
  function addModel(model: Omit<Model, 'id' | 'updatedAt' | 'updatedTimestamp' | 'favorite'>): Model {
    const newModel: Model = {
      ...model,
      id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      updatedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      updatedTimestamp: Date.now(),
      favorite: false,
    }

    importedModels.value = [newModel, ...importedModels.value]
    saveToStorage()

    return newModel
  }

  function removeModel(modelId: string) {
    importedModels.value = importedModels.value.filter(m => m.id !== modelId)
    saveToStorage()
  }

  function updateModel(modelId: string, updates: Partial<Model>) {
    importedModels.value = importedModels.value.map(m =>
      m.id === modelId ? { ...m, ...updates } : m
    )
    saveToStorage()
  }

  function toggleFavorite(modelId: string) {
    const model = importedModels.value.find(m => m.id === modelId)
    if (model) {
      model.favorite = !model.favorite
      saveToStorage()
    }
  }

  function moveToFolder(modelId: string, folderId: string | null) {
    updateModel(modelId, { folderId })
  }

  // Folder actions
  function addFolder(name: string, parentId: string | null = null): ModelFolder {
    const folder: ModelFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
    }
    folders.value = [...folders.value, folder]
    saveToStorage()
    return folder
  }

  function removeFolder(folderId: string) {
    // Move models in folder to root
    importedModels.value = importedModels.value.map(m =>
      m.folderId === folderId ? { ...m, folderId: null } : m
    )
    folders.value = folders.value.filter(f => f.id !== folderId)
    saveToStorage()
  }

  function renameFolder(folderId: string, newName: string) {
    folders.value = folders.value.map(f =>
      f.id === folderId ? { ...f, name: newName } : f
    )
    saveToStorage()
  }

  // Get models by folder
  function getModelsByFolder(folderId: string | null) {
    return importedModels.value.filter(m => m.folderId === folderId)
  }

  // Get model by ID
  function getModelById(modelId: string) {
    return importedModels.value.find(m => m.id === modelId)
  }

  // Check if model with URL already exists (duplicate detection)
  function hasModelWithUrl(url: string): boolean {
    return importedModels.value.some(m => m.sourceUrl === url)
  }

  // Clear all imported models
  function clearAllModels() {
    importedModels.value = []
    folders.value = []
    saveToStorage()
  }

  return {
    // State
    importedModels,
    folders,

    // Computed
    allModels,
    checkpoints,
    loras,
    vaes,
    controlnets,
    favoriteModels,
    modelCount,

    // Actions
    addModel,
    removeModel,
    updateModel,
    toggleFavorite,
    moveToFolder,
    addFolder,
    removeFolder,
    renameFolder,
    getModelsByFolder,
    getModelById,
    hasModelWithUrl,
    clearAllModels,
    loadFromStorage,
  }
})
