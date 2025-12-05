import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'auth',
    component: () => import('./views/AuthView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/workspace',
    component: () => import('./views/WorkspaceView.vue'),
    props: true,
    children: [
      {
        path: '',
        name: 'workspace-dashboard',
        component: () => import('./views/workspace/DashboardView.vue')
      },
      {
        path: 'workflows',
        name: 'workspace-workflows',
        component: () => import('./views/workspace/WorkflowsView.vue')
      },
      {
        path: 'workflows/folder/:folderId',
        name: 'workspace-workflows-folder',
        component: () => import('./views/workspace/WorkflowsView.vue')
      },
      {
        path: 'assets',
        name: 'workspace-assets',
        component: () => import('./views/workspace/AssetsView.vue')
      },
      {
        path: 'assets/folder/:folderId',
        name: 'workspace-assets-folder',
        component: () => import('./views/workspace/AssetsView.vue')
      },
      {
        path: 'models',
        name: 'workspace-models',
        component: () => import('./views/workspace/ModelsView.vue')
      },
      {
        path: 'models/folder/:folderId',
        name: 'workspace-models-folder',
        component: () => import('./views/workspace/ModelsView.vue')
      },
      {
        path: 'recents',
        name: 'workspace-recents',
        component: () => import('./views/workspace/RecentsView.vue')
      },
      {
        path: 'templates',
        name: 'workspace-templates',
        component: () => import('./views/workspace/TemplatesView.vue')
      },
      {
        path: 'projects',
        name: 'workspace-projects',
        component: () => import('./views/workspace/ProjectsView.vue')
      },
      {
        path: 'nodes',
        name: 'workspace-nodes',
        component: () => import('./views/workspace/NodesView.vue')
      },
      {
        path: 'trash',
        name: 'workspace-trash',
        component: () => import('./views/workspace/TrashView.vue')
      },
      {
        path: 'card-designs',
        name: 'workspace-card-designs',
        component: () => import('./views/workspace/CardDesignsView.vue')
      },
      {
        path: 'clean',
        name: 'workspace-clean',
        component: () => import('./views/workspace/CleanView.vue')
      },
      {
        path: 'projects/:projectId',
        name: 'workspace-project',
        component: () => import('./views/workspace/ProjectView.vue')
      },
    ]
  },
  {
    path: '/workspace/manage',
    component: () => import('./views/WorkspaceAdminView.vue'),
    children: [
      {
        path: '',
        name: 'workspace-manage-dashboard',
        component: () => import('./views/workspace-admin/WorkspaceDashboardView.vue')
      },
      {
        path: 'people',
        name: 'workspace-manage-people',
        component: () => import('./views/workspace-admin/WorkspacePeopleView.vue')
      },
      {
        path: 'billing',
        name: 'workspace-manage-billing',
        component: () => import('./views/workspace-admin/WorkspaceBillingView.vue')
      },
      {
        path: 'content',
        name: 'workspace-manage-content',
        component: () => import('./views/workspace-admin/WorkspaceContentView.vue')
      },
      {
        path: 'settings',
        name: 'workspace-manage-settings',
        component: () => import('./views/workspace-admin/WorkspaceSettingsView.vue')
      },
    ]
  },
  {
    path: '/workflow-editor/:workflowId?',
    name: 'workflow-editor',
    component: () => import('./views/WorkflowEditorView.vue'),
    props: true
  },
  {
    path: '/linear-mode/:workflowId?',
    name: 'linear-mode',
    component: () => import('./views/linear-mode/LinearView.vue'),
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
