# PRD: Workflow Share Feature

**Document Version:** 1.2
**Created:** December 6, 2025
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement
Currently, ComfyUI users create workflows in isolation with no ability to share their work with teammates or the broader community. This limits collaboration, knowledge sharing, and the ability to build upon others' work.

### 1.2 Solution Summary
Implement a workflow sharing system that enables users to:
- Share workflows with specific ComfyUI users or team members via direct invite
- Share workflows via shareable links (requires login to access)
- Allow recipients to view and fork (duplicate with attribution) workflows
- **Control access mode: allow recipients to view in Workflow Mode (node editor), Linear Mode (simplified UI), or both**

### 1.3 Goals
- Enable sharing workflows with other ComfyUI users and team members
- Support both direct invite and link-based sharing
- Provide View + Duplicate permissions (no collaborative editing)
- Allow workflow builders to control which mode(s) recipients can access
- Deliver in-app notifications for share events

### 1.4 Non-Goals (v1)
- Real-time collaborative editing (Google Docs-style)
- Edit permissions for shared workflows (view + duplicate only)
- Version control/history for shared workflows
- Comments/annotations on shared workflows
- Email notifications (in-app only for v1)
- Analytics/tracking on shares

---

## 2. User Stories

### 2.1 Workflow Owner
- **US-1:** As a workflow owner, I want to share my workflow with specific users so they can view and fork it.
- **US-2:** As a workflow owner, I want to generate a shareable link so I can quickly share without entering emails.
- **US-3:** As a workflow owner, I want to revoke access from users who no longer need it.
- **US-4:** As a workflow owner, I want to see who has access to my workflow at any time.
- **US-5:** As a workflow owner, I want to control whether recipients can access my workflow in Workflow Mode (node editor), Linear Mode (simplified UI), or both.

### 2.2 Share Recipient
- **US-7:** As a share recipient, I want to receive an in-app notification when someone shares a workflow with me.
- **US-8:** As a share recipient, I want to easily find workflows shared with me in my library.
- **US-9:** As a share recipient, I want to fork (duplicate) a shared workflow to create my own copy with attribution to the original.
- **US-10:** As a share recipient, I want to leave a shared workflow when I no longer need access.
- **US-11:** As a user with a share link, I want to log in and access the shared workflow.
- **US-12:** As a share recipient, I want to open the workflow in the allowed mode(s) - Linear Mode for easy use or Workflow Mode if permitted by the owner.

### 2.3 Workspace Admin
- **US-13:** As a workspace admin, I want to see all shared workflows within my workspace.
- **US-14:** As a workspace admin, I want to manage sharing permissions for team workflows.

---

## 3. Functional Requirements

### 3.1 Share Methods

#### 3.1.1 Direct Share (User Invite)
| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-1.1 | Search users by email or username | P0 |
| FR-1.2 | Add multiple users in single operation | P0 |
| FR-1.3 | Send in-app notification to invitee | P0 |
| FR-1.4 | Support inviting non-registered users (pending invite) | P2 |

#### 3.1.2 Link Sharing
| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-2.1 | Generate unique shareable link | P0 |
| FR-2.2 | Require login to access link (no anonymous access) | P0 |
| FR-2.3 | Copy link to clipboard | P0 |
| FR-2.4 | Disable/revoke link | P0 |
| FR-2.5 | Set link expiration date | P2 |

### 3.2 Permission Levels

| Permission | View | Fork (Duplicate) | Edit | Delete | Manage Access |
|------------|------|------------------|------|--------|---------------|
| Owner      | ✅   | ✅               | ✅   | ✅     | ✅            |
| Recipient  | ✅   | ✅               | ❌   | ❌     | ❌            |

**Note:** All share recipients have the same permission level: View + Fork. No granular permission selection needed for v1.

### 3.3 Access Mode Control

Workflow builders can control which mode(s) recipients are allowed to access:

| Access Mode | Description | Use Case |
|-------------|-------------|----------|
| **Linear Mode Only** | Recipients can only use the simplified step-by-step UI | For end-users who just want to generate outputs without understanding the workflow internals |
| **Workflow Mode Only** | Recipients can only use the full node-graph editor | For developers/builders who want to learn from or modify the workflow |
| **Both Modes** | Recipients can switch between Linear and Workflow modes | Full flexibility for recipients |

#### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-2.5 | Owner can select allowed access mode(s) when sharing | P0 |
| FR-2.6 | Default access mode is "Linear Mode Only" for simpler UX | P0 |
| FR-2.7 | Access mode setting applies to both direct shares and link shares | P0 |
| FR-2.8 | Recipients see only allowed mode options when opening shared workflow | P0 |
| FR-2.9 | If only one mode is allowed, workflow opens directly in that mode | P0 |
| FR-2.10 | Forked workflows inherit no access restrictions (owner has full access) | P0 |

### 3.4 Fork Behavior (Duplicate with Attribution)

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-4.1 | Fork creates a private copy owned by the user | P0 |
| FR-4.2 | Forked workflow displays "Forked from [Original Name] by [Author]" | P0 |
| FR-4.3 | Original workflow link/reference stored in forked workflow metadata | P0 |
| FR-4.4 | Forked workflow is fully independent (no sync with original) | P0 |
| FR-4.5 | Forked workflow has no access mode restrictions (owner has full access to both modes) | P0 |

### 3.5 Access Management

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-5.1 | View list of all users with access | P0 |
| FR-5.2 | Remove user access | P0 |
| FR-5.3 | Workspace admins can manage any workflow in their workspace | P0 |
| FR-5.4 | Transfer ownership | P1 |

### 3.6 Shared Workflows View

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-6.1 | "Shared with me" section in library | P0 |
| FR-6.2 | Show shared-by user on workflow card | P0 |
| FR-6.3 | Show allowed access mode badge on workflow card (Linear/Workflow/Both) | P0 |
| FR-6.4 | Leave/remove from "Shared with me" | P0 |
| FR-6.5 | Sort by date shared | P1 |

### 3.7 Notifications

| Requirement | Description | Priority |
|-------------|-------------|----------|
| FR-8.1 | In-app notification when workflow shared with you | P0 |
| FR-8.2 | Notification links directly to shared workflow | P0 |
| FR-8.3 | Notification center shows all share notifications | P1 |

---

## 4. UI/UX Design

### 4.1 Share Dialog (with Access Mode Control)

```
┌─────────────────────────────────────────────────────────────┐
│  Share "Workflow Name"                              [X]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Access Mode                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ (•) Linear Mode    - Simple step-by-step UI         │   │
│  │ ( ) Workflow Mode  - Full node editor               │   │
│  │ ( ) Both Modes     - Recipient can choose           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ℹ️ Controls how recipients can open this workflow         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Add people                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Search by email or username...                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  People with access                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👤 John Doe (you)                           Owner   │   │
│  │ 👤 jane@example.com             [Linear Mode]     ✕ │   │
│  │ 👤 bob@example.com              [Linear Mode]     ✕ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Get shareable link                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔗 https://comfy.app/shared/abc123...    [Copy] [⚙] │   │
│  └─────────────────────────────────────────────────────┘   │
│  ℹ️ Anyone with this link can view/fork in Linear Mode     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                    [Done]   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Workflow Card States

**My Workflow (with shares):**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 Workflow Name     [⋮]  │
│  [👥 3 people]             │
│  Updated 2h ago            │
└────────────────────────────┘
```

**Shared with Me (Linear Mode):**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 Workflow Name     [⋮]  │
│  Shared by Jane Doe        │
│  [▶ Run] [Linear]          │
└────────────────────────────┘
```

**Shared with Me (Both Modes):**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 Workflow Name     [⋮]  │
│  Shared by Jane Doe        │
│  [▶ Run] [Linear | Editor] │
└────────────────────────────┘
```

**Forked Workflow:**
```
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │    [Thumbnail]       │  │
│  └──────────────────────┘  │
│  📄 My Copy           [⋮]  │
│  🍴 Forked from "Original" │
│     by Jane Doe            │
└────────────────────────────┘
```

### 4.3 Workflows View with Tabs

```
┌──────────────────────────────────────────────────────────────────┐
│  Workflows                                                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ [All] [My Workflows] [Shared with me]                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Shared with me (4)                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │
│  │ Flow 1  │ │ Flow 2  │ │ Flow 3  │ │ Flow 4  │                 │
│  │ by John │ │ by Jane │ │ by Bob  │ │ by Amy  │                 │
│  │ [Fork]  │ │ [Fork]  │ │ [Fork]  │ │ [Fork]  │                 │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                 │
└──────────────────────────────────────────────────────────────────┘
```

### 4.4 Notification Bell

```
┌──────────────────────────────────────┐
│  🔔 Notifications                    │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ 👤 Jane shared "Portrait Gen"  │  │
│  │    with you                    │  │
│  │    2 minutes ago        [View] │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 👤 Bob shared "Upscaler v2"    │  │
│  │    with you                    │  │
│  │    1 hour ago           [View] │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Mark all as read]                  │
└──────────────────────────────────────┘
```

### 4.5 Shared Link Access Page

**Linear Mode Only:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    🔗 Shared Workflow                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │              [Workflow Thumbnail Preview]                  │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│                   "Portrait Generator v3"                        │
│                   Shared by Jane Doe                             │
│                   📱 Linear Mode                                 │
│                                                                   │
│                [▶ Open in Linear] [Fork to My Library]           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Both Modes Available:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    🔗 Shared Workflow                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │              [Workflow Thumbnail Preview]                  │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│                   "Portrait Generator v3"                        │
│                   Shared by Jane Doe                             │
│                                                                   │
│                   Open as:                                        │
│                   [▶ Linear Mode] [🔧 Workflow Editor]           │
│                                                                   │
│                   [Fork to My Library]                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Security Considerations

### 5.1 Access Control
- All share operations require authentication
- Share links require login to access (no anonymous viewing)
- Workflow owner and workspace admins can manage shares
- Permission checks on every workflow access

### 5.2 Link Security
- Share links use cryptographically secure random codes (32+ chars)
- Links can be disabled/revoked instantly by owner or admin
- Links only grant view + fork access (no edit)

### 5.3 Data Privacy
- Private workflows only accessible via direct share or link
- Fork attribution preserves original author credit

---

## 6. Decisions Made

| Question | Decision |
|----------|----------|
| Who can access shared links? | Logged-in users only |
| What permissions do recipients get? | View + Fork (no edit) |
| How does forking work? | Creates private copy with "Forked from X by Y" attribution |
| Analytics on shares? | None for v1 |
| Who can manage shares? | Owner + Workspace admins |
| Notification method? | In-app only (no email for v1) |
| **Access mode control?** | **Owner chooses: Linear Mode only, Workflow Mode only, or Both** |
| **Default access mode?** | **Linear Mode only (simplest for end users)** |
| **Forked workflow access?** | **Full access to both modes (no restrictions for owner)** |

---

## 7. Success Criteria

| Criteria | Definition |
|----------|------------|
| Feature complete | All P0 items implemented and working |
| Usable | Users can share via direct invite and link |
| Fork works | Forked workflows show attribution correctly |
| Notifications work | Users see share notifications in-app |

---

*Last updated: December 8, 2025*
