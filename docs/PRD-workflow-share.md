# PRD: Workflow Share Feature

**Document Version:** 2.0
**Created:** December 6, 2025
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement
Currently, ComfyUI users create workflows in isolation with no ability to share their work with teammates or the broader community. This limits collaboration, knowledge sharing, and the ability to build upon others' work.

### 1.2 Solution Summary
Implement a workflow sharing system that enables users to:
- Share workflows via shareable links
- Allow recipients to preview, open, and fork workflows

---

## 2. User Stories

### 2.1 Workflow Owner
- As a workflow owner, I want to generate a shareable link so I can quickly share my workflow
- As a workflow owner, I want to revoke/disable a share link when needed
- As a workflow owner, I want to share my workflow with specific users (Phase 2)

### 2.2 Share Recipient
- As a recipient, I want to preview a shared workflow before opening it
- As a recipient, I want to open a shared workflow in the Workflow Editor
- As a recipient, I want to fork a shared workflow to my library
- As a recipient, I want to see workflows shared with me in my library (Phase 2)

---

## 3. Implementation Phases

### Phase 1: Link Sharing (MVP)
Basic link-based sharing with preview and fork capabilities.

| Feature | Description |
|---------|-------------|
| Generate share link | Create unique shareable URL for a workflow |
| Copy link | One-click copy link to clipboard |
| Share link page | Preview page showing workflow info (name, description, thumbnail, author) |
| Open in Editor | Open shared workflow in Workflow Editor (read-only, not saved to library) |
| Fork to library | Duplicate workflow to recipient's library with "Forked from" attribution |
| Disable link | Owner can disable/revoke share link |
| Login required | Recipients must be logged in to access shared links |

### Phase 2: Direct Sharing & Library
User-to-user sharing with library integration.

| Feature | Description |
|---------|-------------|
| Direct user invite | Share with specific users by email/username |
| Shared with me | "Shared with me" section in workflow library |
| Access management | View and remove users with access |
| In-app notifications | Notify users when a workflow is shared with them |
| Leave shared | Recipients can remove themselves from shared workflows |

### Phase 3: Advanced Features
Enhanced controls and admin capabilities.

| Feature | Description |
|---------|-------------|
| Access mode control | Owner chooses: Linear Mode only, Workflow Mode only, or Both |
| Link expiration | Optional expiration date for share links |
| Workspace admin controls | Admins can manage all shared workflows in workspace |
| Transfer ownership | Transfer workflow ownership to another user |
| Pending invites | Invite non-registered users (invite activates on signup) |

---

## 4. Phase 1 Requirements

### 4.1 Share Dialog
| Requirement | Description |
|-------------|-------------|
| Generate link button | Creates share link if none exists |
| Display link | Shows current share link URL |
| Copy button | Copies link to clipboard with confirmation |
| Link toggle | Enable/disable the share link |

### 4.2 Shared Workflow Page
| Requirement | Description |
|-------------|-------------|
| Workflow preview | Display thumbnail, name, description |
| Author info | Show who shared the workflow |
| Open button | Opens workflow in Workflow Editor |
| Fork button | Forks workflow to user's library |
| Login gate | Redirect to login if not authenticated |

### 4.3 Fork Behavior
| Requirement | Description |
|-------------|-------------|
| Private copy | Fork creates a private copy owned by the user |
| Attribution | Forked workflow displays "Forked from [Name] by [Author]" |
| Independent | Forked workflow is fully independent (no sync with original) |

---

## 5. Security

- All share operations require authentication
- Share links require login to access (no anonymous viewing)
- Share links use cryptographically secure random codes (32+ chars)
- Links can be disabled instantly by owner
- Links only grant view + fork access (no edit)

---

## 6. Success Criteria

| Phase | Criteria |
|-------|----------|
| Phase 1 | Users can generate links, recipients can preview/open/fork workflows |
| Phase 2 | Users can share directly with others, see shared workflows in library |
| Phase 3 | Full access mode control and admin features working |

---

*Last updated: December 8, 2025*
