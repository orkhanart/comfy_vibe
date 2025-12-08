# PRD: Workflow Share Feature

**Status:** Draft
**Last Updated:** December 8, 2025

---

## Problem

Users cannot share workflows with others. This limits collaboration and knowledge sharing.

## Solution

Enable users to share workflows via shareable links. Recipients can preview, open in editor, or fork to their library.

---

## Phase 1: Link Sharing (MVP)

### Features

1. **Generate Share Link**
   - Create unique shareable link for any workflow
   - Copy link to clipboard

2. **Shared Workflow Page**
   - Preview workflow info (name, description, node count, thumbnail)
   - Show who shared it
   - "Open in Editor" button (read-only view)
   - "Fork to Library" button (creates personal copy)

3. **Fork with Attribution**
   - Fork creates independent copy in user's library
   - Shows "Forked from [Name] by [Author]" attribution

### Requirements

- Share links require login to access
- Recipients get View + Fork permissions only (no edit)
- Forked workflows are fully owned by the user

---

## Phase 2: Link Management

### Features

1. **Manage Share Links**
   - View active share links
   - Disable/revoke link anytime
   - Link expiration dates

2. **"Shared with me" View**
   - Section in library showing workflows shared with you
   - Leave/remove shared workflows

---

## Phase 3: Direct Sharing

### Features

1. **Direct User Invite**
   - Search and invite users by email/username
   - In-app notifications when shared with you

2. **Access Management**
   - View who has access to your workflow
   - Remove user access

3. **Access Mode Control**
   - Control if recipients can access Linear Mode, Workflow Editor, or both
   - Default: Workflow Editor only

---

## Success Criteria

| Phase | Criteria |
|-------|----------|
| Phase 1 | Users can share via link, recipients can preview and fork |
| Phase 2 | Users can manage links, see shared workflows in library |
| Phase 3 | Users can invite others directly, manage access, receive notifications |

---

*End of document*
