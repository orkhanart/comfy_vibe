/**
 * Workspace/Team System Types
 *
 * Hierarchy:
 * User Account
 * ├── Private Workspace (personal, always exists)
 * └── Team Workspaces (create or join multiple)
 *     ├── Members (Owner / Admin / Member / Viewer)
 *     └── Projects
 *         └── Workflows, Assets, Models
 */

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface WorkspaceMember {
  id: string
  userId: string
  name: string
  email: string
  avatar?: string
  role: WorkspaceRole
  joinedAt: number
}

export interface WorkspaceInvite {
  id: string
  workspaceId: string
  email?: string // For email invites
  code?: string // For link invites
  role: Exclude<WorkspaceRole, 'owner'>
  createdBy: string
  createdAt: number
  expiresAt?: number
  usedAt?: number
  usedBy?: string
}

export interface Workspace {
  id: string
  name: string
  description?: string
  avatar?: string // Custom logo/image URL
  isPrivate: boolean // true = personal workspace, false = team workspace
  ownerId: string
  createdAt: number
  updatedAt: number
  memberCount: number
  projectCount: number
}

export interface WorkspaceWithRole extends Workspace {
  role: WorkspaceRole
}

export interface CreateWorkspacePayload {
  name: string
  description?: string
  avatar?: string
}

export interface UpdateWorkspacePayload {
  name?: string
  description?: string
  avatar?: string
}

export interface InviteMemberPayload {
  email?: string
  generateLink?: boolean
  role: Exclude<WorkspaceRole, 'owner'>
}

export interface UpdateMemberRolePayload {
  memberId: string
  role: Exclude<WorkspaceRole, 'owner'>
}

// Role permissions helper
export const ROLE_PERMISSIONS = {
  owner: {
    canManageWorkspace: true,
    canManageMembers: true,
    canManageProjects: true,
    canEditContent: true,
    canViewContent: true,
    canDelete: true,
  },
  admin: {
    canManageWorkspace: false,
    canManageMembers: true,
    canManageProjects: true,
    canEditContent: true,
    canViewContent: true,
    canDelete: true,
  },
  member: {
    canManageWorkspace: false,
    canManageMembers: false,
    canManageProjects: true,
    canEditContent: true,
    canViewContent: true,
    canDelete: false,
  },
  viewer: {
    canManageWorkspace: false,
    canManageMembers: false,
    canManageProjects: false,
    canEditContent: false,
    canViewContent: true,
    canDelete: false,
  },
} as const

export function getRoleLabel(role: WorkspaceRole): string {
  const labels: Record<WorkspaceRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
    viewer: 'Viewer',
  }
  return labels[role]
}

export function getRoleBadgeColor(role: WorkspaceRole): string {
  const colors: Record<WorkspaceRole, string> = {
    owner: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    member: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    viewer: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500',
  }
  return colors[role]
}
