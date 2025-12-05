import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Workspace,
  WorkspaceWithRole,
  WorkspaceMember,
  WorkspaceRole,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from '@/types/workspace'

// Mock data for development
const MOCK_WORKSPACES: WorkspaceWithRole[] = [
  {
    id: 'private',
    name: 'My Workspace',
    description: 'Your personal workspace',
    isPrivate: true,
    ownerId: 'user-1',
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    memberCount: 1,
    projectCount: 4,
    role: 'owner',
  },
  {
    id: 'studio-alpha',
    name: 'Studio Alpha',
    description: 'Creative team workspace',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=alpha',
    isPrivate: false,
    ownerId: 'user-1',
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
    memberCount: 8,
    projectCount: 12,
    role: 'owner',
  },
  {
    id: 'client-acme',
    name: 'ACME Corp',
    description: 'Client project workspace',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=acme',
    isPrivate: false,
    ownerId: 'user-2',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 24 * 60 * 60 * 1000,
    memberCount: 5,
    projectCount: 3,
    role: 'member',
  },
  {
    id: 'design-collective',
    name: 'Design Collective',
    description: 'Community design group',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
    isPrivate: false,
    ownerId: 'user-3',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    memberCount: 24,
    projectCount: 8,
    role: 'viewer',
  },
]

const MOCK_MEMBERS: Record<string, WorkspaceMember[]> = {
  'studio-alpha': [
    { id: 'm1', userId: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'owner', joinedAt: Date.now() - 90 * 24 * 60 * 60 * 1000 },
    { id: 'm2', userId: 'user-4', name: 'Alice Chen', email: 'alice@example.com', role: 'admin', joinedAt: Date.now() - 60 * 24 * 60 * 60 * 1000 },
    { id: 'm3', userId: 'user-5', name: 'Bob Wilson', email: 'bob@example.com', role: 'member', joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000 },
    { id: 'm4', userId: 'user-6', name: 'Carol Smith', email: 'carol@example.com', role: 'member', joinedAt: Date.now() - 20 * 24 * 60 * 60 * 1000 },
    { id: 'm5', userId: 'user-7', name: 'David Lee', email: 'david@example.com', role: 'viewer', joinedAt: Date.now() - 10 * 24 * 60 * 60 * 1000 },
  ],
}

export const useWorkspaceStore = defineStore('workspace', () => {
  // Current context
  const currentWorkspaceId = ref<string>('private')
  const currentProjectId = ref<string | null>(null)
  const currentWorkflowId = ref<string | null>(null)
  const openWorkflows = ref<string[]>([])

  // Workspaces list
  const workspaces = ref<WorkspaceWithRole[]>([...MOCK_WORKSPACES])

  // Computed
  const currentWorkspace = computed(() =>
    workspaces.value.find(w => w.id === currentWorkspaceId.value)
  )

  const privateWorkspace = computed(() =>
    workspaces.value.find(w => w.isPrivate)
  )

  const teamWorkspaces = computed(() =>
    workspaces.value.filter(w => !w.isPrivate)
  )

  const currentRole = computed(() =>
    currentWorkspace.value?.role ?? 'viewer'
  )

  const isOwner = computed(() => currentRole.value === 'owner')
  const isAdmin = computed(() => ['owner', 'admin'].includes(currentRole.value))
  const canEdit = computed(() => ['owner', 'admin', 'member'].includes(currentRole.value))

  // Actions
  function setCurrentWorkspace(workspaceId: string): void {
    const workspace = workspaces.value.find(w => w.id === workspaceId)
    if (workspace) {
      currentWorkspaceId.value = workspaceId
      currentProjectId.value = null
      currentWorkflowId.value = null
    }
  }

  function setCurrentIds(workspaceId: string, projectId: string, workflowId: string): void {
    currentWorkspaceId.value = workspaceId
    currentProjectId.value = projectId
    currentWorkflowId.value = workflowId
  }

  function createWorkspace(payload: CreateWorkspacePayload): WorkspaceWithRole {
    const newWorkspace: WorkspaceWithRole = {
      id: `workspace-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      avatar: payload.avatar,
      isPrivate: false,
      ownerId: 'user-1', // Current user
      createdAt: Date.now(),
      updatedAt: Date.now(),
      memberCount: 1,
      projectCount: 0,
      role: 'owner',
    }
    workspaces.value.push(newWorkspace)
    return newWorkspace
  }

  function updateWorkspace(workspaceId: string, payload: UpdateWorkspacePayload): void {
    const workspace = workspaces.value.find(w => w.id === workspaceId)
    if (workspace) {
      if (payload.name !== undefined) workspace.name = payload.name
      if (payload.description !== undefined) workspace.description = payload.description
      if (payload.avatar !== undefined) workspace.avatar = payload.avatar
      workspace.updatedAt = Date.now()
    }
  }

  function deleteWorkspace(workspaceId: string): void {
    const index = workspaces.value.findIndex(w => w.id === workspaceId)
    if (index > -1 && !workspaces.value[index].isPrivate) {
      workspaces.value.splice(index, 1)
      if (currentWorkspaceId.value === workspaceId) {
        currentWorkspaceId.value = 'private'
      }
    }
  }

  function leaveWorkspace(workspaceId: string): void {
    const workspace = workspaces.value.find(w => w.id === workspaceId)
    if (workspace && workspace.role !== 'owner') {
      const index = workspaces.value.findIndex(w => w.id === workspaceId)
      if (index > -1) {
        workspaces.value.splice(index, 1)
        if (currentWorkspaceId.value === workspaceId) {
          currentWorkspaceId.value = 'private'
        }
      }
    }
  }

  // Member management (mock)
  function getWorkspaceMembers(workspaceId: string): WorkspaceMember[] {
    return MOCK_MEMBERS[workspaceId] || []
  }

  function inviteMember(_workspaceId: string, _email: string, _role: WorkspaceRole): void {
    // Mock: In real app, send invite email
    console.log('Invite member:', _email, _role)
  }

  function updateMemberRole(_workspaceId: string, _memberId: string, _role: WorkspaceRole): void {
    // Mock: Update member role
    console.log('Update member role:', _memberId, _role)
  }

  function removeMember(_workspaceId: string, _memberId: string): void {
    // Mock: Remove member
    console.log('Remove member:', _memberId)
  }

  // Workflow management
  function openWorkflow(workflowId: string, _name: string, _projectId: string): void {
    if (!openWorkflows.value.includes(workflowId)) {
      openWorkflows.value.push(workflowId)
    }
  }

  function closeWorkflow(workflowId: string): void {
    const index = openWorkflows.value.indexOf(workflowId)
    if (index > -1) {
      openWorkflows.value.splice(index, 1)
    }
  }

  return {
    // State
    currentWorkspaceId,
    currentProjectId,
    currentWorkflowId,
    openWorkflows,
    workspaces,

    // Computed
    currentWorkspace,
    privateWorkspace,
    teamWorkspaces,
    currentRole,
    isOwner,
    isAdmin,
    canEdit,

    // Actions
    setCurrentWorkspace,
    setCurrentIds,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    leaveWorkspace,
    getWorkspaceMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
    openWorkflow,
    closeWorkflow,
  }
})
