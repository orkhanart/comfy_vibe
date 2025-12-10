# PRD: Workflow Share Feature

**Document Version:** 3.0
**Created:** December 6, 2025
**Updated:** December 9, 2025
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement
Currently, ComfyUI users create workflows in isolation with no ability to share their work with teammates or the broader community. This limits collaboration, knowledge sharing, and the ability to build upon others' work.

### 1.2 Solution Summary
Implement a workflow sharing system that enables users to:
- Share workflows via shareable links
- Share workflows with specific users
- Allow recipients to preview, open, and fork workflows
- Handle assets safely with clear ownership boundaries

---

## 2. User Personas & Stories

### 2.1 Creator/Influencer Persona
Users who want to share workflows broadly with their audience.

| Story | Description |
|-------|-------------|
| Generate public link | "I want to create a link I can share on social media" |
| Track usage | "I want to see how many people have viewed/forked my workflow" |
| Publish to gallery | "I want my workflow discoverable by the community" (Future) |

### 2.2 Team Collaborator Persona
Users who want to share workflows with specific teammates or coworkers.

| Story | Description |
|-------|-------------|
| Invite specific people | "I want to share with my teammate without making it public" |
| Manage access | "I want to see who has access and revoke if needed" |
| Share privately | "I want to share work-in-progress without exposing it broadly" |

### 2.3 Recipient Persona
Users who receive shared workflows.

| Story | Description |
|-------|-------------|
| Preview before opening | "I want to see what I'm getting before loading it" |
| Open in editor | "I want to try the workflow without saving to my library" |
| Fork to library | "I want my own copy I can modify" |
| See requirements | "I want to know what models/inputs I need" |

---

## 3. Key Design Decisions

### 3.1 Snapshot vs Live Sharing

**Decision: Snapshot Model (Recommended)**

When a user shares a workflow, we capture the state at that moment.

| Aspect | Snapshot Model | Live Model |
|--------|---------------|------------|
| What recipient sees | Frozen version at share time | Current version (updates visible) |
| Owner deletes original | Share still works | Share breaks |
| Owner updates workflow | Recipients see old version | Recipients see new version |
| Complexity | Higher (storage) | Lower |
| Safety | Higher | Lower (accidental exposure) |

**Rationale:** Snapshot matches the mental model of "sending" something. It avoids edge cases where owner modifications or deletions break shared workflows.

### 3.2 Asset Handling Strategy

**Decision: Workflow-Only for MVP, Asset Bundling for Phase 2**

| Phase | What's Shared | Assets |
|-------|--------------|--------|
| Phase 1 (MVP) | Workflow JSON only | Recipients must have own models/inputs |
| Phase 2 | Workflow + input assets | Assets copied to shared storage |

**Rationale:** Deferring asset bundling avoids complex ACL and storage decisions for MVP. Workflows can still be useful - recipients just need compatible assets.

### 3.3 Two Sharing Paths

| Path | Use Case | Mechanism |
|------|----------|-----------|
| **Copy Link** | Influencer/broad sharing | Unlisted URL, anyone with link can access |
| **Invite People** | Team/private sharing | Specific users, shows in "Shared with me" |

Both paths available from the same Share Dialog.

---

## 4. Implementation Phases

### Phase 1: Link Sharing (MVP)
Basic link-based sharing with preview and fork capabilities.

| Feature | Description |
|---------|-------------|
| Generate share link | Create unique shareable URL for a workflow |
| Copy link | One-click copy link to clipboard |
| Share link page | Preview page showing workflow info |
| Asset requirements | Show what models/nodes recipient needs |
| Open in Editor | Open shared workflow in editor (read-only, not saved) |
| Fork to library | Duplicate workflow to recipient's library |
| Disable link | Owner can disable/revoke share link |
| Login required | Recipients must be logged in to access |

### Phase 2: Direct Sharing & Asset Bundling
User-to-user sharing with library integration and asset support.

| Feature | Description |
|---------|-------------|
| Direct user invite | Share with specific users by email/username |
| Shared with me | "Shared with me" section in workflow library |
| Access management | View and remove users with access |
| In-app notifications | Notify users when a workflow is shared |
| Leave shared | Recipients can remove themselves |
| Asset preview | Show which assets will be included before sharing |
| Asset bundling | Include input images/files with shared workflow |
| Asset exclusion | Owner can uncheck sensitive assets before sharing |

### Phase 3: Advanced Features
Enhanced controls and admin capabilities.

| Feature | Description |
|---------|-------------|
| Access mode control | Owner chooses: Linear Mode only, Workflow Mode only, or Both |
| Link expiration | Optional expiration date for share links |
| One-time links | Link expires after first use |
| Workspace admin controls | Admins can manage all shared workflows |
| Transfer ownership | Transfer workflow ownership to another user |
| Pending invites | Invite non-registered users (activates on signup) |
| Public gallery | Publish workflows for community discovery |

### Phase 4: Organizations & Teams (Future)
Team-based access control.

| Feature | Description |
|---------|-------------|
| Team sharing | Share with entire team at once |
| Organization defaults | Default permissions for org members |
| Role-based access | Admin, editor, viewer roles |

---

## 5. Phase 1 Requirements (Detailed)

### 5.1 Share Dialog

| Requirement | Description |
|-------------|-------------|
| Generate link button | Creates share link if none exists |
| Display link | Shows current share link URL |
| Copy button | Copies link to clipboard with confirmation |
| Link toggle | Enable/disable the share link |
| Requirements preview | Show list of required models/custom nodes |

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ Share "Portrait Generator"              │
├─────────────────────────────────────────┤
│ 🔗 Share Link                           │
│ ┌─────────────────────────────────────┐ │
│ │ comfy.ai/shared/abc123...    [Copy] │ │
│ └─────────────────────────────────────┘ │
│ Anyone with the link can view & fork    │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Requirements (recipient needs these):   │
│ • SDXL Base 1.0                         │
│ • ControlNet Canny                      │
│ • 2 custom nodes                        │
│                                         │
│              [Disable Link]             │
└─────────────────────────────────────────┘
```

### 5.2 Shared Workflow Page (Link Landing)

| Requirement | Description |
|-------------|-------------|
| Workflow preview | Display thumbnail, name, description |
| Author info | Show who shared the workflow |
| Node count | Show complexity indicator |
| Requirements list | List required models, custom nodes |
| Open button | Opens workflow in Workflow Editor |
| Fork button | Forks workflow to user's library |
| Login gate | Redirect to login if not authenticated |

**UI Mockup:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         [Workflow Thumbnail Image]              │
│                                                 │
│         Portrait Generator Pro                  │
│         by Alice Chen                           │
│                                                 │
│         18 nodes • Shared Dec 9, 2025           │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │   Open in Editor │  │  Fork to Library │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Requirements:                                  │
│  ✓ SDXL Base 1.0 (you have this)               │
│  ✗ ControlNet Canny (missing)                  │
│  ✓ IPAdapter (you have this)                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5.3 Fork Behavior

| Requirement | Description |
|-------------|-------------|
| Private copy | Fork creates a private copy owned by recipient |
| Attribution | Displays "Forked from [Name] by [Author]" |
| Independent | Forked workflow has no connection to original |
| Rename option | Recipient can rename during or after fork |

### 5.4 Compute & Credits

| Action | Credits Charged To |
|--------|-------------------|
| View shared workflow | No cost |
| Open in editor (preview) | No cost |
| Run generation | **Recipient's account** |
| Fork to library | No cost |

---

## 6. Asset Handling (Phase 2)

### 6.1 What Gets Shared

| Component | Phase 1 | Phase 2 | Notes |
|-----------|---------|---------|-------|
| Workflow JSON | ✅ | ✅ | Structure, connections, parameters |
| Node settings | ✅ | ✅ | Prompts, values, configurations |
| Input images | ❌ | ✅ | User-uploaded inputs |
| Input videos | ❌ | ✅ | User-uploaded inputs |
| Models/checkpoints | ❌ | ❌ | Reference only - too large |
| Custom nodes | ❌ | ❌ | Reference only - install required |
| Outputs | ❌ | ❌ | Recipient generates their own |

### 6.2 Asset Preview (Phase 2)

Before sharing, owner sees exactly what's included:

```
┌─────────────────────────────────────────┐
│ Assets included in share:               │
├─────────────────────────────────────────┤
│ ☑ input_portrait.png         2.4 MB    │
│ ☑ style_reference.jpg        1.1 MB    │
│ ☐ private_test.png           0.8 MB    │ ← unchecked
│                                         │
│ Total size: 3.5 MB                      │
│                                         │
│ ⚠ Unchecked assets won't be included.  │
│   Workflow may not work without them.   │
└─────────────────────────────────────────┘
```

### 6.3 Asset Ownership After Fork

| Scenario | Behavior |
|----------|----------|
| Recipient forks | Assets copied to recipient's storage |
| Owner deletes original asset | Forked copy unaffected |
| Owner disables share | Previously forked copies unaffected |

---

## 7. Security & Privacy

### 7.1 Authentication
- All share operations require authentication
- Share links require login to access (no anonymous viewing)
- Share links use cryptographically secure random codes (32+ chars)

### 7.2 Access Control

| Action | Who Can Do It |
|--------|---------------|
| Generate share link | Workflow owner |
| Disable share link | Workflow owner |
| View shared workflow | Anyone with link (logged in) |
| Fork shared workflow | Anyone with link (logged in) |
| Delete original | Workflow owner (doesn't break shares - snapshot model) |

### 7.3 Revocation & Edge Cases

| Action | Effect on Link | Effect on Existing Forks |
|--------|---------------|--------------------------|
| Disable link | Link stops working | Forks unaffected |
| Delete workflow | Link returns 404 | Forks unaffected |
| Delete input asset | N/A (Phase 2) | Forks have their own copy |

### 7.4 Sensitive Content Protection (Phase 2)
- Asset preview before sharing prevents accidental exposure
- Owner can exclude files before generating link
- Clear indication of what will be visible to recipients

---

## 8. Future Considerations

### 8.1 ACL Architecture (for backend planning)
Design should support evolving access control:

```
Phase 1: user_id has READ on workflow_id
Phase 2: user_id has READ because shared_directly
Phase 3: user_id has READ because in team_id
Phase 4: user_id has READ because in org_id
```

### 8.2 Public Gallery
- Opt-in publishing to community gallery
- Categories and tags for discovery
- Moderation requirements for public content

### 8.3 Analytics
- View count per shared link
- Fork count
- Geographic distribution (anonymized)

---

## 9. Success Criteria

| Phase | Criteria |
|-------|----------|
| Phase 1 | Users can generate links, recipients can preview/open/fork workflows. Requirements shown clearly. |
| Phase 2 | Users can share directly, see "Shared with me", include/exclude assets |
| Phase 3 | Full access mode control, expiration, admin features |
| Phase 4 | Team and organization-level sharing |

---

## 10. Open Questions

| Question | Options | Status |
|----------|---------|--------|
| Snapshot vs Live? | Snapshot (recommended) | Pending team decision |
| Asset bundling in MVP? | No (defer to Phase 2) | Pending team decision |
| Link expiration in MVP? | No (defer to Phase 3) | Pending team decision |
| Public gallery timeline? | Phase 3 or later | TBD |

---

## Appendix A: Comparison with Templates

Current template system uses a "public-assets" user:
- Assets owned by system account
- All users can access these assets
- Works for curated content

User-to-user sharing differs:
- Assets owned by individual users
- Access must be explicitly granted
- Storage and ownership more complex

**Note:** Template approach doesn't scale to user sharing without either:
1. Users marking assets as "public" (moderation concerns)
2. Copying assets on fork (storage cost, clean ownership)

Phase 2 recommends option 2 (copy on fork).

---

*Last updated: December 9, 2025*
