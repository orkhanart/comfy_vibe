import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  type Folder,
  MOCK_FOLDERS,
  getChildFolders,
  getFolderPath,
  getFolderById,
  countItemsInFolder,
  countSubfolders,
} from '@/data/workspaceMockData'

export type FolderType = 'workflows' | 'assets' | 'models'

export function useFolders(type: FolderType) {
  const route = useRoute()
  const router = useRouter()

  // Current folder from route params
  const currentFolderId = computed<string | null>(() => {
    const folderId = route.params.folderId
    return typeof folderId === 'string' ? folderId : null
  })

  // Current folder object
  const currentFolder = computed<Folder | null>(() => {
    if (!currentFolderId.value) return null
    return getFolderById(currentFolderId.value) || null
  })

  // Breadcrumb path from root to current folder
  const breadcrumbPath = computed<Folder[]>(() => {
    return getFolderPath(currentFolderId.value)
  })

  // Folders at current level
  const foldersAtCurrentLevel = computed<Folder[]>(() => {
    return getChildFolders(currentFolderId.value, type)
  })

  // Navigation
  function navigateToFolder(folderId: string | null) {
    const workspaceId = route.params.workspaceId

    if (folderId === null) {
      // Navigate to root
      router.push({ name: `workspace-${type}`, params: { workspaceId } })
    } else {
      // Navigate to folder
      router.push({
        name: `workspace-${type}-folder`,
        params: { workspaceId, folderId }
      })
    }
  }

  function navigateToRoot() {
    navigateToFolder(null)
  }

  function navigateUp() {
    if (currentFolder.value?.parentId) {
      navigateToFolder(currentFolder.value.parentId)
    } else {
      navigateToRoot()
    }
  }

  // CRUD operations (mutating the mock data for demo purposes)
  function createFolder(name: string, parentId?: string | null): Folder {
    const newFolder: Folder = {
      id: `${type.slice(0, 2)}-folder-${Date.now()}`,
      name,
      parentId: parentId ?? currentFolderId.value,
      type,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    MOCK_FOLDERS.push(newFolder)
    return newFolder
  }

  function renameFolder(folderId: string, newName: string): boolean {
    const folder = MOCK_FOLDERS.find(f => f.id === folderId)
    if (folder) {
      folder.name = newName
      folder.updatedAt = Date.now()
      return true
    }
    return false
  }

  function deleteFolder(folderId: string): boolean {
    const index = MOCK_FOLDERS.findIndex(f => f.id === folderId)
    if (index !== -1) {
      MOCK_FOLDERS.splice(index, 1)
      // Also delete all subfolders recursively
      const childFolders = MOCK_FOLDERS.filter(f => f.parentId === folderId)
      childFolders.forEach(child => deleteFolder(child.id))
      return true
    }
    return false
  }

  // Filter items by current folder
  function filterItemsByFolder<T extends { folderId?: string | null }>(items: T[]): T[] {
    return items.filter(item => (item.folderId ?? null) === currentFolderId.value)
  }

  // Helper to get item count for a specific folder
  function getItemCount<T extends { folderId?: string | null }>(folderId: string, items: T[]): number {
    return countItemsInFolder(folderId, items)
  }

  // Helper to get subfolder count
  function getSubfolderCount(folderId: string): number {
    return countSubfolders(folderId, type)
  }

  return {
    // State
    currentFolderId,
    currentFolder,
    breadcrumbPath,
    foldersAtCurrentLevel,

    // Navigation
    navigateToFolder,
    navigateToRoot,
    navigateUp,

    // CRUD
    createFolder,
    renameFolder,
    deleteFolder,

    // Filtering
    filterItemsByFolder,
    getItemCount,
    getSubfolderCount,
  }
}
