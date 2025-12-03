import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  MOCK_WORKFLOWS,
  MOCK_MODELS,
  MOCK_ASSETS,
  MOCK_TEMPLATES,
  type Workflow,
  type Model,
  type Asset,
  type Template,
} from '@/data/workspaceMockData'

// Types
export type LibraryItemType = 'workflow' | 'model' | 'asset' | 'folder' | 'template'
export type LibrarySectionId = 'recent' | 'my-library' | 'projects' | 'shared' | 'templates'
export type LibraryViewMode = 'grid' | 'list'

export interface LibraryItem {
  id: string
  name: string
  type: LibraryItemType
  parentId: string // folder or section id
  thumbnail?: string
  size?: string
  nodeCount?: number
  description?: string
  updatedAt: string
  createdAt?: string
  isReadOnly?: boolean // for templates
  favorite?: boolean
  // Model-specific
  modelType?: 'checkpoint' | 'lora' | 'vae' | 'controlnet'
  baseModel?: string
  // Asset-specific
  assetType?: 'image' | 'video' | 'audio'
  dimensions?: string
  // Workflow-specific
  runtime?: string
  tags?: string[]
}

export interface LibraryFolder {
  id: string
  name: string
  parentId: string // section id or parent folder id
  icon?: string
  isSystem?: boolean // Workflows, Models, Assets are system folders
  itemCount?: number
}

export interface LibrarySection {
  id: LibrarySectionId
  label: string
  icon: string
  isExpanded: boolean
  folders: LibraryFolder[]
}

export interface RecentItem {
  id: string
  itemId: string
  name: string
  type: LibraryItemType
  accessedAt: Date
  thumbnail?: string
}

export interface Project {
  id: string
  name: string
  thumbnail?: string
  itemCount: number
  updatedAt: string
}

export const useLibraryStore = defineStore('library', () => {
  // View state
  const viewMode = ref<LibraryViewMode>('grid')
  const searchQuery = ref('')

  // Navigation state
  const selectedFolderId = ref<string | null>('my-workflows') // default to My Library > Workflows
  const expandedSections = ref<Set<string>>(new Set(['my-library']))
  const expandedFolders = ref<Set<string>>(new Set(['my-workflows']))

  // Recent items (max 5)
  const recentItems = ref<RecentItem[]>([])
  const MAX_RECENT_ITEMS = 5

  // Projects
  const projects = ref<Project[]>([
    { id: 'proj-1', name: 'Neon Horizon - Game Trailer', thumbnail: '/assets/card_images/workflow_01.webp', itemCount: 18, updatedAt: '2 hours ago' },
    { id: 'proj-2', name: 'Cyberpunk NPC Portraits', thumbnail: '/assets/card_images/2690a78c-c210-4a52-8c37-3cb5bc4d9e71.webp', itemCount: 32, updatedAt: '1 day ago' },
    { id: 'proj-3', name: 'Indie Horror - Promo Assets', thumbnail: '/assets/card_images/bacb46ea-7e63-4f19-a253-daf41461e98f.webp', itemCount: 24, updatedAt: '3 days ago' },
    { id: 'proj-4', name: 'YouTube Thumbnails Pack', thumbnail: '/assets/card_images/228616f4-12ad-426d-84fb-f20e488ba7ee.webp', itemCount: 45, updatedAt: '5 days ago' },
    { id: 'proj-5', name: 'Fantasy RPG - Environment Art', thumbnail: '/assets/card_images/683255d3-1d10-43d9-a6ff-ef142061e88a.webp', itemCount: 67, updatedAt: '1 week ago' },
    { id: 'proj-6', name: 'Twitch Stream Overlays', thumbnail: '/assets/card_images/91f1f589-ddb4-4c4f-b3a7-ba30fc271987.webp', itemCount: 12, updatedAt: '1 week ago' },
    { id: 'proj-7', name: 'VTuber Avatar Concepts', thumbnail: '/assets/card_images/28e9f7ea-ef00-48e8-849d-8752a34939c7.webp', itemCount: 8, updatedAt: '2 weeks ago' },
    { id: 'proj-8', name: 'Sci-Fi Short Film - Storyboards', thumbnail: '/assets/card_images/comfyui_workflow.jpg', itemCount: 156, updatedAt: '2 weeks ago' },
  ])

  // Sections configuration
  const sections = ref<LibrarySection[]>([
    {
      id: 'my-library',
      label: 'My Library',
      icon: 'user',
      isExpanded: true,
      folders: [
        { id: 'my-workflows', name: 'Workflows', parentId: 'my-library', icon: 'sitemap', isSystem: true },
        { id: 'my-models', name: 'Models', parentId: 'my-library', icon: 'box', isSystem: true },
        { id: 'my-assets', name: 'Assets', parentId: 'my-library', icon: 'image', isSystem: true },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'folder',
      isExpanded: false,
      folders: [
        { id: 'proj-workflows', name: 'Workflows', parentId: 'projects', icon: 'sitemap', isSystem: true },
        { id: 'proj-models', name: 'Models', parentId: 'projects', icon: 'box', isSystem: true },
        { id: 'proj-assets', name: 'Assets', parentId: 'projects', icon: 'image', isSystem: true },
      ],
    },
    {
      id: 'shared',
      label: 'Shared',
      icon: 'users',
      isExpanded: false,
      folders: [
        { id: 'shared-workflows', name: 'Workflows', parentId: 'shared', icon: 'sitemap', isSystem: true },
        { id: 'shared-models', name: 'Models', parentId: 'shared', icon: 'box', isSystem: true },
        { id: 'shared-assets', name: 'Assets', parentId: 'shared', icon: 'image', isSystem: true },
      ],
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: 'clone',
      isExpanded: false,
      folders: [
        { id: 'tpl-official', name: 'Official', parentId: 'templates', icon: 'verified', isSystem: true },
        { id: 'tpl-community', name: 'Community', parentId: 'templates', icon: 'users', isSystem: true },
      ],
    },
  ])

  // Convert workspace mock data to library items
  const workflowItems: LibraryItem[] = MOCK_WORKFLOWS.map(wf => ({
    id: wf.id,
    name: wf.name,
    type: 'workflow' as const,
    parentId: 'my-workflows',
    thumbnail: wf.thumbnail,
    nodeCount: wf.nodeCount,
    description: wf.description,
    updatedAt: wf.updatedAt,
    favorite: wf.favorite,
    runtime: wf.runtime,
    tags: wf.tags,
  }))

  const modelItems: LibraryItem[] = MOCK_MODELS.map(model => ({
    id: model.id,
    name: model.name,
    type: 'model' as const,
    parentId: 'my-models',
    thumbnail: model.thumbnail,
    size: model.size,
    updatedAt: model.updatedAt,
    favorite: model.favorite,
    modelType: model.type,
    baseModel: model.baseModel,
  }))

  const assetItems: LibraryItem[] = MOCK_ASSETS.map(asset => ({
    id: asset.id,
    name: asset.name,
    type: 'asset' as const,
    parentId: 'my-assets',
    thumbnail: asset.thumbnail,
    size: asset.size,
    updatedAt: asset.updatedAt,
    favorite: asset.favorite,
    assetType: asset.type,
    dimensions: asset.dimensions,
  }))

  const templateItems: LibraryItem[] = MOCK_TEMPLATES.map(tpl => ({
    id: tpl.id,
    name: tpl.name,
    type: 'template' as const,
    parentId: 'tpl-official',
    thumbnail: tpl.thumbnail,
    description: tpl.description,
    updatedAt: 'Official',
    isReadOnly: true,
    favorite: tpl.favorite,
    tags: tpl.tags,
  }))

  // Combined items
  const items = ref<LibraryItem[]>([
    ...workflowItems,
    ...modelItems,
    ...assetItems,
    ...templateItems,
  ])

  // Computed
  const selectedSection = computed(() => {
    if (!selectedFolderId.value) return null
    for (const section of sections.value) {
      if (section.folders.some(f => f.id === selectedFolderId.value)) {
        return section
      }
    }
    return null
  })

  const selectedFolder = computed(() => {
    if (!selectedFolderId.value) return null
    for (const section of sections.value) {
      const folder = section.folders.find(f => f.id === selectedFolderId.value)
      if (folder) return folder
    }
    return null
  })

  const currentItems = computed(() => {
    if (!selectedFolderId.value) return []
    return items.value.filter(item => item.parentId === selectedFolderId.value)
  })

  const filteredItems = computed(() => {
    if (!searchQuery.value) return currentItems.value
    const query = searchQuery.value.toLowerCase()
    return currentItems.value.filter(item =>
      item.name.toLowerCase().includes(query)
    )
  })

  // Actions
  function setViewMode(mode: LibraryViewMode): void {
    viewMode.value = mode
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function selectFolder(folderId: string): void {
    selectedFolderId.value = folderId

    // Auto-expand parent section
    for (const section of sections.value) {
      if (section.folders.some(f => f.id === folderId)) {
        expandedSections.value.add(section.id)
        break
      }
    }
  }

  function toggleSection(sectionId: string): void {
    if (expandedSections.value.has(sectionId)) {
      expandedSections.value.delete(sectionId)
    } else {
      expandedSections.value.add(sectionId)
    }
  }

  function toggleFolder(folderId: string): void {
    if (expandedFolders.value.has(folderId)) {
      expandedFolders.value.delete(folderId)
    } else {
      expandedFolders.value.add(folderId)
    }
  }

  function isSectionExpanded(sectionId: string): boolean {
    return expandedSections.value.has(sectionId)
  }

  function isFolderExpanded(folderId: string): boolean {
    return expandedFolders.value.has(folderId)
  }

  function addToRecent(item: LibraryItem): void {
    // Remove if already exists
    const existingIndex = recentItems.value.findIndex(r => r.itemId === item.id)
    if (existingIndex > -1) {
      recentItems.value.splice(existingIndex, 1)
    }

    // Add to front
    recentItems.value.unshift({
      id: `recent-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      type: item.type,
      accessedAt: new Date(),
      thumbnail: item.thumbnail,
    })

    // Trim to max
    if (recentItems.value.length > MAX_RECENT_ITEMS) {
      recentItems.value = recentItems.value.slice(0, MAX_RECENT_ITEMS)
    }
  }

  function getItemById(itemId: string): LibraryItem | undefined {
    return items.value.find(item => item.id === itemId)
  }

  function getFolderItemCount(folderId: string): number {
    return items.value.filter(item => item.parentId === folderId).length
  }

  return {
    // State
    viewMode,
    searchQuery,
    selectedFolderId,
    expandedSections,
    expandedFolders,
    recentItems,
    sections,
    items,
    projects,

    // Computed
    selectedSection,
    selectedFolder,
    currentItems,
    filteredItems,

    // Actions
    setViewMode,
    setSearchQuery,
    selectFolder,
    toggleSection,
    toggleFolder,
    isSectionExpanded,
    isFolderExpanded,
    addToRecent,
    getItemById,
    getFolderItemCount,
  }
})
