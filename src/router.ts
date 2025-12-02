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
    path: '/:workspaceId',
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
        path: 'assets',
        name: 'workspace-assets',
        component: () => import('./views/workspace/AssetsView.vue')
      },
      {
        path: 'models',
        name: 'workspace-models',
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
    ]
  },
  {
    path: '/nodemode/:workspaceId/:workflowId',
    name: 'node-editor',
    component: () => import('./views/CanvasView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
