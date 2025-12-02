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
    path: '/node',
    name: 'node',
    component: () => import('./views/CanvasView.vue')
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
        path: 'trash',
        name: 'workspace-trash',
        component: () => import('./views/workspace/TrashView.vue')
      },
      {
        path: 'settings',
        name: 'workspace-settings',
        component: () => import('./views/workspace/SettingsView.vue')
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
    path: '/nodemode/:workflowId?',
    name: 'node-editor',
    component: () => import('./views/CanvasView.vue'),
    props: true
  },
  {
    path: '/linear/:workflowId?',
    name: 'linear',
    component: () => import('./views/linear/LinearView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
