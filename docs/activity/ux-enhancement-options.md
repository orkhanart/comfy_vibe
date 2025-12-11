# Activity/Notification UX Enhancement Options

## Current State Analysis

ComfyUI currently has **6 separate activity/notification systems** that operate independently:

| System | Location | Purpose |
|--------|----------|---------|
| Queue Progress Overlay | Top-right dropdown | Workflow execution progress |
| Toast Notifications | Bottom-right stack | Transient alerts |
| Model Downloads | Model Library sidebar | Electron download progress |
| Manager Progress | Modal dialog | Extension install/update |
| Error Dialogs | Modal | Execution errors |
| Browser Tab/Favicon | Browser chrome | Background progress indicator |

---

## Enhancement Hypotheses

### Hypothesis A: Unified Activity Center

**Combine all activity into a single panel/drawer**

```
┌─────────────────────────────────┐
│ Activity Center            [x]  │
├─────────────────────────────────┤
│ [Queue] [Downloads] [Manager]   │  ← Tabs
├─────────────────────────────────┤
│ ▼ Running (2)                   │
│   ├─ Portrait Enhancement  67%  │
│   └─ Background Removal    12%  │
│ ▼ Downloads (1)                 │
│   └─ sd_xl_base.safetensors 45% │
│ ▼ Completed (5)                 │
│   └─ [thumbnails...]            │
└─────────────────────────────────┘
```

**Pros:**
- Single place for all activity
- Consistent interaction patterns
- Reduces cognitive load

**Cons:**
- May hide important info (downloads in wrong tab)
- More complex implementation
- Breaks familiar patterns

---

### Hypothesis B: Enhanced Queue Overlay (Current + Extensions)

**Keep current queue overlay, add sections for other activities**

```
┌─────────────────────────────────┐
│ 3 Active Jobs              [▼]  │
├─────────────────────────────────┤
│ ████████████░░░░░░ 67%          │  ← Queue progress
│ KSampler 45%                    │
├─────────────────────────────────┤
│ ↓ 1 Download                    │  ← Collapsed section
│ ⚙ 2 Installing                  │  ← Collapsed section
└─────────────────────────────────┘
```

**Pros:**
- Minimal change to existing UX
- Progressive disclosure
- All activity visible at glance

**Cons:**
- Overlay may become too tall
- Mixed concerns in one component

---

### Hypothesis C: Sidebar Activity Tab

**Add dedicated "Activity" tab to left sidebar**

```
[📁] [🔍] [📊] [⚡]  ← New Activity tab

┌─────────────────┐
│ Activity        │
├─────────────────┤
│ QUEUE           │
│ ├─ Running: 2   │
│ └─ Pending: 3   │
├─────────────────┤
│ DOWNLOADS       │
│ └─ 1 active     │
├─────────────────┤
│ HISTORY         │
│ └─ 12 today     │
└─────────────────┘
```

**Pros:**
- Persistent visibility
- Doesn't overlay canvas
- Room for detailed view

**Cons:**
- Takes sidebar space
- Another tab to manage
- Downloads already in Model Library

---

### Hypothesis D: Status Bar (Bottom)

**Add persistent status bar at bottom of screen**

```
┌──────────────────────────────────────────────────┐
│ [Canvas Area]                                     │
│                                                   │
├──────────────────────────────────────────────────┤
│ ▶ 2 running │ ⏳ 3 queued │ ↓ 1 download │ ✓ 5  │
└──────────────────────────────────────────────────┘
```

**Pros:**
- Always visible
- Minimal footprint
- Click to expand details

**Cons:**
- Reduces canvas height
- May feel cluttered
- Mobile unfriendly

---

### Hypothesis E: Floating Action Button (FAB)

**Single FAB that shows activity count, expands to panel**

```
                    ┌───┐
                    │ 6 │  ← Badge shows total activity
                    └───┘
                      │
                      ▼
        ┌─────────────────────┐
        │ 2 Running           │
        │ 3 Queued            │
        │ 1 Download          │
        │ ─────────────────── │
        │ View All Activity → │
        └─────────────────────┘
```

**Pros:**
- Minimal UI footprint
- Works on mobile
- Non-intrusive

**Cons:**
- Hidden by default
- Extra click to see details
- May miss important updates

---

### Hypothesis F: Smart Notifications (Context-Aware)

**Keep separate systems but unify notification behavior**

| Event | Notification Type | Auto-dismiss |
|-------|------------------|--------------|
| Job started | None (progress shows) | - |
| Job completed | Toast + Sound | 5s |
| Job failed | Toast (sticky) + Sound | Manual |
| Download started | Toast | 3s |
| Download completed | Toast | 5s |
| Download failed | Toast (sticky) | Manual |
| Extension installed | Toast + Restart prompt | Manual |

**Pros:**
- Keeps familiar patterns
- Adds consistency
- Low implementation cost

**Cons:**
- Still fragmented
- Toast spam risk
- No unified view

---

### Hypothesis G: Picture-in-Picture Progress

**Floating mini-preview that shows current generation**

```
┌──────────────────┐
│ [Live Preview]   │
│ ████████░░ 67%   │
│ 2 more queued    │
└──────────────────┘
  ↑ Draggable, resizable
```

**Pros:**
- Visual feedback
- Can work while monitoring
- Engaging UX

**Cons:**
- Overlays canvas
- Resource intensive
- Not all workflows have previews

---

## Combination Options

---

### Option 1: B + F — Enhanced Queue Overlay + Smart Notifications
**Recommended - Low Risk, High Impact**

#### Concept
Extend the current queue overlay to show activity from all systems (downloads, manager) while unifying notification behavior across the app.

#### Wireframe
```
┌─────────────────────────────────────────────────────────────────┐
│                                      [Run ▼] [🕐 3]             │ ← Badge on history button
└─────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
                               ┌──────────────────────────┐
                               │ 2 Active Jobs        [▼] │
                               ├──────────────────────────┤
                               │ ████████████░░░ 67%      │
                               │ Total • KSampler 45%     │
                               ├──────────────────────────┤
                               │ 1 Running  [✕]  2 Queued │ ← Hover reveals
                               │ [View All Jobs]          │
                               ├──────────────────────────┤
                               │ ↓ 1 Downloading    [→]   │ ← New: Downloads indicator
                               │ ⚙ Installing 2/3  [→]   │ ← New: Manager indicator
                               └──────────────────────────┘
```

#### User Flows

**Flow 1: Monitor Queue + Download simultaneously**
```
User clicks Run → Queue overlay shows progress
                → Downloads section appears (if active)
                → User sees both without switching views
                → Click [→] on downloads to jump to Model Library
```

**Flow 2: Smart notification on completion**
```
Job completes → Toast appears: "✓ Portrait Enhancement completed"
             → Toast auto-dismisses after 5s
             → Overlay updates to show completion summary
             → Optional: Sound plays (if enabled in settings)
```

**Flow 3: Error handling**
```
Job fails → Toast appears: "✕ Job failed: CUDA OOM" (sticky)
         → Toast has [View Details] button
         → Click opens error dialog with full traceback
         → Overlay shows failed job with retry option
```

#### Components to Modify
- `QueueProgressOverlay.vue` - Add downloads/manager sections
- `QueueOverlayActive.vue` - Add indicator badges
- `toastStore.ts` - Unify timing logic
- `GlobalToast.vue` - Add sound support

#### Notification Rules
| Event | Toast | Sound | Auto-dismiss | Overlay Update |
|-------|-------|-------|--------------|----------------|
| Job queued | None | None | - | Badge +1 |
| Job started | None | None | - | Progress shows |
| Job completed | Success | Chime | 5s | Summary banner |
| Job failed | Error | Alert | Sticky | Failed indicator |
| Download started | Info | None | 3s | Section appears |
| Download completed | Success | None | 5s | Section updates |
| Download failed | Error | Alert | Sticky | Error chip |
| Extension installing | Info | None | 3s | Section appears |
| Extension installed | Success + Restart | Chime | Sticky | Restart prompt |

#### Implementation Phases
1. **Phase 1 (1 week):** Add downloads/manager indicators to overlay
2. **Phase 2 (3 days):** Unify toast timing across app
3. **Phase 3 (2 days):** Add optional sound notifications
4. **Phase 4 (2 days):** Polish and testing

**Effort:** ★★☆☆☆ (2-3 weeks)
**UX Gain:** ★★★★☆
**Risk:** ★☆☆☆☆

---

### Option 2: C + F — Sidebar Activity Tab + Smart Notifications
**Medium Risk - Comprehensive Solution**

#### Concept
Add a dedicated Activity tab to the left sidebar that consolidates all activity views. Combined with smart notifications for real-time awareness.

#### Wireframe
```
┌────┬─────────────────────────────────────────────────────────────┐
│ 📁 │                                                             │
│ 🔍 │                                                             │
│ 📊 │                       [Canvas Area]                         │
│ ⚡ │ ← Activity tab (new)                                        │
│    │                                                             │
│[3] │ ← Badge shows total active                                  │
└────┴─────────────────────────────────────────────────────────────┘

When Activity tab is open:
┌────┬──────────────────┬──────────────────────────────────────────┐
│ 📁 │ Activity         │                                          │
│ 🔍 ├──────────────────┤                                          │
│ 📊 │ QUEUE        [⋮] │              [Canvas Area]               │
│ ⚡ │ ┌──────────────┐ │                                          │
│    │ │▶ Running (1) │ │                                          │
│[3] │ │ Portrait  67%│ │                                          │
│    │ │ ████████░░░░ │ │                                          │
│    │ └──────────────┘ │                                          │
│    │ ┌──────────────┐ │                                          │
│    │ │⏳ Queued (2) │ │                                          │
│    │ │ Background   │ │                                          │
│    │ │ Style Trans  │ │                                          │
│    │ └──────────────┘ │                                          │
│    ├──────────────────┤                                          │
│    │ DOWNLOADS    [⋮] │                                          │
│    │ ┌──────────────┐ │                                          │
│    │ │↓ vae-ft-mse  │ │                                          │
│    │ │ ████░░░ 45%  │ │                                          │
│    │ │ [⏸] [✕]     │ │                                          │
│    │ └──────────────┘ │                                          │
│    ├──────────────────┤                                          │
│    │ MANAGER      [⋮] │                                          │
│    │ Installing 2/3   │                                          │
│    ├──────────────────┤                                          │
│    │ HISTORY      [⋮] │                                          │
│    │ ✓ 5 completed    │                                          │
│    │ ✕ 1 failed       │                                          │
│    │ [View All →]     │                                          │
└────┴──────────────────┴──────────────────────────────────────────┘
```

#### User Flows

**Flow 1: Quick activity check**
```
User sees badge [3] on Activity tab
→ Clicks to expand
→ Sees queue, downloads, manager status at once
→ Can interact with any section
→ Closes tab to return to canvas
```

**Flow 2: Download management**
```
User starts model download from registry
→ Activity tab badge updates
→ User clicks Activity tab
→ Sees download progress in DOWNLOADS section
→ Can pause/resume/cancel directly
→ No need to navigate to Model Library
```

**Flow 3: History review**
```
User wants to see past jobs
→ Opens Activity tab
→ HISTORY section shows recent jobs
→ Click "View All" for full history
→ Can filter by success/failed
→ Can retry failed jobs
```

#### Components to Create
- `ActivitySidebarTab.vue` - New sidebar tab
- `ActivityQueueSection.vue` - Queue display
- `ActivityDownloadsSection.vue` - Downloads display
- `ActivityManagerSection.vue` - Manager display
- `ActivityHistorySection.vue` - History display
- `activityStore.ts` - Unified activity state

#### Data Model
```typescript
interface ActivityState {
  queue: {
    running: Job[]
    pending: Job[]
    completed: Job[]
    failed: Job[]
  }
  downloads: ElectronDownload[]
  manager: {
    installing: ManagerTask[]
    completed: ManagerTask[]
    failed: ManagerTask[]
  }
  history: ActivityHistoryItem[]
}

interface ActivityHistoryItem {
  id: string
  type: 'job' | 'download' | 'manager'
  status: 'completed' | 'failed'
  timestamp: Date
  data: Job | ElectronDownload | ManagerTask
}
```

#### Implementation Phases
1. **Phase 1 (1 week):** Create ActivitySidebarTab shell + activityStore
2. **Phase 2 (1 week):** Implement Queue section (migrate from overlay)
3. **Phase 3 (3 days):** Implement Downloads section
4. **Phase 4 (3 days):** Implement Manager section
5. **Phase 5 (3 days):** Implement History section
6. **Phase 6 (1 week):** Smart notifications integration
7. **Phase 7 (3 days):** Polish, testing, edge cases

**Effort:** ★★★☆☆ (4-5 weeks)
**UX Gain:** ★★★★☆
**Risk:** ★★☆☆☆

---

### Option 3: A — Full Unified Activity Center
**High Risk, High Reward - Complete Redesign**

#### Concept
Replace all separate activity systems with a single unified Activity Center drawer that slides in from the right side.

#### Wireframe
```
┌─────────────────────────────────────────────────────────────────┐
│ [Menu]                                      [Run ▼] [Activity🔔]│
└─────────────────────────────────────────────────────────────────┘
                                                          │
                                                          ▼ Click
┌─────────────────────────────────────────┬───────────────────────┐
│                                         │ Activity Center    [×]│
│                                         ├───────────────────────┤
│                                         │[Queue][Downloads][Sys]│
│              [Canvas Area]              ├───────────────────────┤
│                                         │ ▼ Running             │
│                                         │ ┌─────────────────┐   │
│                                         │ │ Portrait    67% │   │
│                                         │ │ ████████░░░░░░░ │   │
│                                         │ │ KSampler   45%  │   │
│                                         │ │ [Interrupt][⋮]  │   │
│                                         │ └─────────────────┘   │
│                                         │                       │
│                                         │ ▼ Queued (2)          │
│                                         │ • Background Removal  │
│                                         │ • Style Transfer      │
│                                         │ [Clear Queue]         │
│                                         │                       │
│                                         │ ▶ Completed (5)       │
│                                         │ [thumbnails row]      │
│                                         │                       │
│                                         │ ▶ Failed (1)          │
│                                         │ • Upscale 4x [Retry]  │
│                                         ├───────────────────────┤
│                                         │ ↓ 1 Download active   │
│                                         │ ⚙ Manager idle        │
│                                         └───────────────────────┘
└─────────────────────────────────────────┴───────────────────────┘
```

#### Tab Views

**Queue Tab:**
```
┌───────────────────────────────────────┐
│ [All] [Running] [Queued] [History]    │ ← Sub-tabs
├───────────────────────────────────────┤
│ Filter: [All Workflows ▼] [Sort ▼]    │
├───────────────────────────────────────┤
│ ▼ Portrait Enhancement                │
│   ├─ Job #1 - Running 67%             │
│   └─ Job #2 - Queued                  │
│ ▼ Background Removal                  │
│   └─ Job #3 - Completed ✓             │
└───────────────────────────────────────┘
```

**Downloads Tab:**
```
┌───────────────────────────────────────┐
│ [Active] [Completed] [Failed]         │
├───────────────────────────────────────┤
│ vae-ft-mse-840000.safetensors         │
│ ████████░░░░░░░░░░░░ 45.2%            │
│ 2.1 GB / 4.7 GB • 12.5 MB/s • 3:24    │
│ [⏸ Pause] [✕ Cancel]                  │
├───────────────────────────────────────┤
│ sd_xl_base_1.0.safetensors            │
│ ████████████████████ 100%             │
│ Completed • 6.9 GB                    │
└───────────────────────────────────────┘
```

**System Tab:**
```
┌───────────────────────────────────────┐
│ MANAGER                               │
│ Installing ComfyUI-Impact-Pack...     │
│ ████████████░░░░░░░░ 60%              │
│ [View Log ▼]                          │
│ > Cloning repository...               │
│ > Installing dependencies...          │
├───────────────────────────────────────┤
│ NOTIFICATIONS                         │
│ • Update available: ComfyUI 1.2.3     │
│ • New model: SDXL Turbo released      │
├───────────────────────────────────────┤
│ SETTINGS                              │
│ [🔔] Sound notifications: ON          │
│ [📍] Show in taskbar: ON              │
└───────────────────────────────────────┘
```

#### User Flows

**Flow 1: Multi-tasking awareness**
```
User has jobs running + download + extension installing
→ Activity button shows badge with total count
→ User clicks to see Activity Center
→ Can see all activity at once
→ Tabs allow focus on specific type
→ Minimized indicators show other activity
```

**Flow 2: Error recovery**
```
Job fails while user is working
→ Badge shows error indicator (red dot)
→ Toast appears briefly
→ User opens Activity Center
→ Failed section expanded
→ Click to see error details
→ One-click retry
```

#### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     ActivityCenter.vue                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ QueueTab    │  │DownloadsTab │  │ SystemTab   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    unifiedActivityStore                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │queueStore│ │downloadSt│ │managerSt │ │ notifSt  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Phases
1. **Phase 1 (2 weeks):** Design system + unified store architecture
2. **Phase 2 (2 weeks):** ActivityCenter shell + drawer mechanics
3. **Phase 3 (2 weeks):** Queue tab (full feature parity with current)
4. **Phase 4 (1 week):** Downloads tab
5. **Phase 5 (1 week):** System tab (manager + notifications)
6. **Phase 6 (1 week):** Notification integration + sounds
7. **Phase 7 (1 week):** Migration path + feature flags
8. **Phase 8 (1 week):** Testing + polish + documentation

**Effort:** ★★★★★ (10-12 weeks)
**UX Gain:** ★★★★★
**Risk:** ★★★★☆

---

### Option 4: D + G — Status Bar + Picture-in-Picture
**Experimental - Visual-First Approach**

#### Concept
A persistent status bar at the bottom showing activity counts, combined with a floating picture-in-picture preview window for visual feedback during generation.

#### Wireframe
```
┌─────────────────────────────────────────────────────────────────┐
│ [Menu]                                              [Run ▼]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                          ┌──────────────────┐   │
│                                          │ [Live Preview]   │   │
│              [Canvas Area]               │                  │   │
│                                          │ ████████░░ 67%   │   │
│                                          │ Step 14/20       │   │
│                                          │ [📌][↗][✕]       │   │
│                                          └──────────────────┘   │
│                                             ↑ Draggable PiP     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ▶ 1 running │ ⏳ 2 queued │ ↓ 1 download │ ✓ 5 done │ ✕ 0 err │
└─────────────────────────────────────────────────────────────────┘
  ↑ Click any segment to expand details
```

#### Status Bar Segments
```
┌─────────────────────────────────────────────────────────────────┐
│ [▶ 1 running ▼]                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Portrait Enhancement                                             │
│ ████████████░░░░░░░░ 67%                                        │
│ KSampler • Step 14/20                                           │
│ [Interrupt] [View in Canvas]                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ [↓ 1 download ▼]                                                │
├─────────────────────────────────────────────────────────────────┤
│ vae-ft-mse.safetensors                                          │
│ ████████░░░░░░░░░░░░ 45% • 12.5 MB/s                           │
│ [⏸ Pause] [✕ Cancel]                                           │
└─────────────────────────────────────────────────────────────────┘
```

#### PiP Window Features
```
┌────────────────────────────────────┐
│ Portrait Enhancement        [─][✕] │
├────────────────────────────────────┤
│                                    │
│        [Live Preview Image]        │
│                                    │
│      Updates every N steps         │
│                                    │
├────────────────────────────────────┤
│ ████████████░░░░░░░░ 67%           │
│ KSampler • Step 14/20 • 0:45       │
├────────────────────────────────────┤
│ Queue: 2 more after this           │
│ [⏸ Pause Queue] [Skip to Next]    │
└────────────────────────────────────┘

PiP Controls:
[📌] - Pin to always on top
[↗] - Expand to full gallery view
[✕] - Close PiP
[↔] - Resize handle (corner drag)
```

#### User Flows

**Flow 1: Passive monitoring**
```
User starts batch job
→ Status bar shows "▶ 1 running | ⏳ 4 queued"
→ User continues working on canvas
→ Glances at status bar for progress
→ No interruption to workflow
```

**Flow 2: Visual preview**
```
User wants to see generation progress
→ Clicks "▶ running" in status bar
→ PiP window appears with live preview
→ Drags PiP to corner
→ Continues working while monitoring
→ PiP updates with each preview step
```

**Flow 3: Quick action from status bar**
```
User sees "✕ 1 err" in status bar
→ Clicks segment
→ Popup shows failed job
→ One-click retry
→ Status bar updates
```

#### Implementation Phases
1. **Phase 1 (1 week):** Status bar component + layout integration
2. **Phase 2 (1 week):** Status bar segments + click-to-expand
3. **Phase 3 (2 weeks):** PiP window + draggable/resizable
4. **Phase 4 (1 week):** Live preview integration (WebSocket frames)
5. **Phase 5 (1 week):** Polish + performance optimization

**Effort:** ★★★★☆ (6-7 weeks)
**UX Gain:** ★★★☆☆
**Risk:** ★★★☆☆

---

### Option 5: B + G — Enhanced Queue Overlay + PiP Preview
**Visual Focus - Best of Both Worlds**

#### Concept
Keep the familiar queue overlay but enhance it, plus add optional PiP preview for users who want visual feedback.

#### Wireframe
```
┌─────────────────────────────────────────────────────────────────┐
│                                      [Run ▼] [🕐 3] [👁 PiP]    │
└─────────────────────────────────────────────────────────────────┘
                                              │         │
                              Queue overlay ──┘         └── Toggle PiP

┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                                           ┌────────────────────┐ │
│                                           │ [Preview]          │ │
│              [Canvas Area]                │ ████████░░ 67%     │ │
│                                           │ 2 more queued      │ │
│                                           └────────────────────┘ │
│                                                                   │
│   ┌─────────────────────────┐                                    │
│   │ 2 Active Jobs      [▼]  │ ← Queue overlay (enhanced)         │
│   ├─────────────────────────┤                                    │
│   │ ████████████░░░ 67%     │                                    │
│   │ KSampler 45%            │                                    │
│   ├─────────────────────────┤                                    │
│   │ ↓1 downloading          │ ← New indicator                    │
│   └─────────────────────────┘                                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### PiP Toggle States
```
[👁 PiP] - Off (default)
         - Click to enable

[👁 PiP ●] - On, showing preview
           - Click to disable
           - Preview window visible

Settings option:
[ ] Auto-show PiP when generation starts
[ ] PiP shows preview every N steps: [5 ▼]
[ ] PiP position: [Bottom Right ▼]
```

#### User Flows

**Flow 1: Traditional user (no PiP)**
```
User prefers current behavior
→ Uses queue overlay as normal
→ PiP toggle remains off
→ Downloads indicator added (new)
→ Minimal change to workflow
```

**Flow 2: Visual user (with PiP)**
```
User enables PiP from toolbar
→ Small preview window appears
→ Shows live generation progress
→ Can drag to preferred position
→ Queue overlay still available
→ Best of both worlds
```

**Flow 3: Auto-PiP mode**
```
User enables "Auto-show PiP" in settings
→ PiP automatically appears when job starts
→ Auto-hides when job completes
→ User gets visual feedback without manual toggle
```

#### Implementation Phases
1. **Phase 1 (3 days):** Add downloads/manager indicators to overlay
2. **Phase 2 (1 week):** Create PiP component (basic)
3. **Phase 3 (3 days):** Add PiP toggle to toolbar
4. **Phase 4 (1 week):** Live preview integration
5. **Phase 5 (3 days):** Auto-PiP setting
6. **Phase 6 (3 days):** Polish + testing

**Effort:** ★★★☆☆ (3-4 weeks)
**UX Gain:** ★★★★☆
**Risk:** ★★☆☆☆

---

## Comparison Matrix

| Option | Effort | UX Gain | Risk | Mobile | Consistency |
|--------|--------|---------|------|--------|-------------|
| B + F  | ★★☆☆☆ | ★★★★☆ | ★☆☆☆☆ | ★★★☆☆ | ★★★★☆ |
| C + F  | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ | ★★☆☆☆ | ★★★★★ |
| A      | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| D + G  | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★☆☆☆☆ | ★★★☆☆ |
| B + G  | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ | ★★☆☆☆ | ★★★☆☆ |

---

## Quick Wins (Can Implement Now)

1. **Unify toast timing** - Consistent auto-dismiss (3s info, 5s success, sticky error)
2. **Add sounds** - Optional audio feedback for completion/error
3. **Badge on Run button** - Show queued count on the Run button itself
4. **Download indicator in queue overlay** - Small "↓1" badge when downloads active
5. **Keyboard shortcut** - `Ctrl+Shift+A` to open activity panel
6. **Progress in page title** - Already exists, ensure consistent format

---

## Questions to Answer

1. **What's the primary use case?** Monitoring progress vs. Managing queue vs. Reviewing history
2. **Desktop vs. Web priority?** Downloads only matter for Electron
3. **Power users vs. Beginners?** Complex unified view vs. Simple notifications
4. **Mobile support needed?** Affects layout decisions significantly
5. **Real-time updates critical?** WebSocket vs. polling considerations

---

## Next Steps

1. [ ] User research: Which activities do users check most?
2. [ ] A/B test: Current vs. Option B+F on subset of users
3. [ ] Prototype: Build Option B+F in vibe project
4. [ ] Measure: Track engagement with activity UI
5. [ ] Iterate: Based on feedback, consider Option C+F or A
