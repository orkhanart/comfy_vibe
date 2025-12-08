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
    path: '/workspace_v2',
    component: () => import('./views/WorkspaceViewV2.vue'),
    props: true,
    children: [
      {
        path: '',
        name: 'workspace-v2-dashboard',
        component: () => import('./views/workspace_v2/DashboardView.vue')
      },
      {
        path: 'workflows',
        name: 'workspace-v2-workflows',
        component: () => import('./views/workspace_v2/WorkflowsView.vue')
      },
      {
        path: 'workflows/folder/:folderId',
        name: 'workspace-v2-workflows-folder',
        component: () => import('./views/workspace_v2/WorkflowsView.vue')
      },
      {
        path: 'assets',
        name: 'workspace-v2-assets',
        component: () => import('./views/workspace_v2/AssetsView.vue')
      },
      {
        path: 'assets/folder/:folderId',
        name: 'workspace-v2-assets-folder',
        component: () => import('./views/workspace_v2/AssetsView.vue')
      },
      {
        path: 'models',
        name: 'workspace-v2-models',
        component: () => import('./views/workspace_v2/ModelsView.vue')
      },
      {
        path: 'models/folder/:folderId',
        name: 'workspace-v2-models-folder',
        component: () => import('./views/workspace_v2/ModelsView.vue')
      },
      {
        path: 'recents',
        name: 'workspace-v2-recents',
        component: () => import('./views/workspace_v2/RecentsView.vue')
      },
      {
        path: 'templates',
        name: 'workspace-v2-templates',
        component: () => import('./views/workspace_v2/TemplatesView.vue')
      },
      {
        path: 'tutorials',
        name: 'workspace-v2-tutorials',
        component: () => import('./views/workspace_v2/TutorialsView.vue')
      },
      {
        path: 'projects',
        name: 'workspace-v2-projects',
        component: () => import('./views/workspace_v2/ProjectsView.vue')
      },
      {
        path: 'nodes',
        name: 'workspace-v2-nodes',
        component: () => import('./views/workspace_v2/NodesView.vue')
      },
      {
        path: 'trash',
        name: 'workspace-v2-trash',
        component: () => import('./views/workspace_v2/TrashView.vue')
      },
      {
        path: 'card-designs',
        name: 'workspace-v2-card-designs',
        component: () => import('./views/workspace_v2/CardDesignsView.vue')
      },
      {
        path: 'clean',
        name: 'workspace-v2-clean',
        component: () => import('./views/workspace_v2/CleanView.vue')
      },
      {
        path: 'projects/:projectId',
        name: 'workspace-v2-project',
        component: () => import('./views/workspace_v2/ProjectView.vue')
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
        component: () => import('./views/workspace-admin/WorkspacePeopleView.vue'),
        children: [
          {
            path: '',
            name: 'workspace-manage-people',
            redirect: 'members'
          },
          {
            path: 'members',
            name: 'workspace-manage-people-members',
            component: () => import('./views/workspace-admin/people/PeopleMembersView.vue')
          },
          {
            path: 'invites',
            name: 'workspace-manage-people-invites',
            component: () => import('./views/workspace-admin/people/PeopleInvitesView.vue')
          },
        ]
      },
      {
        path: 'billing',
        component: () => import('./views/workspace-admin/WorkspaceBillingView.vue'),
        children: [
          {
            path: '',
            name: 'workspace-manage-billing',
            redirect: 'usage'
          },
          {
            path: 'usage',
            name: 'workspace-manage-billing-usage',
            component: () => import('./views/workspace-admin/billing/BillingUsageView.vue')
          },
          {
            path: 'history',
            name: 'workspace-manage-billing-history',
            component: () => import('./views/workspace-admin/billing/BillingHistoryView.vue')
          },
          {
            path: 'payment-methods',
            name: 'workspace-manage-billing-payment',
            component: () => import('./views/workspace-admin/billing/BillingPaymentView.vue')
          },
          {
            path: 'plans',
            name: 'workspace-manage-billing-plans',
            component: () => import('./views/workspace-admin/billing/BillingPlansView.vue')
          },
        ]
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
  {
    path: '/linear-mode-v2/:workflowId?',
    name: 'linear-mode-v2',
    component: () => import('./views/linear-mode-v2/LinearViewV2.vue'),
    props: true
  },
  {
    path: '/shared/:code',
    name: 'shared-workflow',
    component: () => import('./views/SharedWorkflowView.vue'),
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
