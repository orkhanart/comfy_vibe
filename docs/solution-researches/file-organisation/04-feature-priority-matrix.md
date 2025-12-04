# Feature Priority Matrix

*Implementation Roadmap for File Organization Features*
*Updated: December 2024 - Reflects current ComfyUI_vibe implementation*

---

## Current Implementation Status

### Already Completed (~51% of UI)
- Models View: Search, filter by type, sort, grid/list view
- Workflows View: Search, sort, grid/list, thumbnails
- Assets View: Search, filter, sort, grid/list
- Templates View: Complete with categories, search, sort
- Recents View: Complete with mixed types, filter
- Dashboard: Quick actions, starter templates
- Shared Components: WorkspaceCard, SearchInput, ViewToggle, etc.

### Major Gaps Remaining
- Real data integration (currently mock data)
- Model version badges (SD1.5/SDXL/Flux)
- Workflow save system (Ctrl+S, auto-save)
- Favorites system
- Backend API connection

---

## Priority Framework

### Scoring Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| User Impact | 40% | How much it improves daily workflow |
| Frequency | 25% | How often users encounter the problem |
| Effort | 20% | Development complexity (inverse) |
| Differentiation | 15% | Competitive advantage vs extensions |

### Priority Levels

| Level | Score | Timeline |
|-------|-------|----------|
| P0 - Critical | 85-100 | Next Sprint |
| P1 - High | 70-84 | Sprint 2-3 |
| P2 - Medium | 50-69 | Sprint 4-5 |
| P3 - Low | <50 | Backlog |

---

## Feature Status by Priority

### Model Management Features

| Feature | Status | Priority | Next Action |
|---------|--------|----------|-------------|
| Search in model browser | DONE | P0 | - |
| Filter by type | DONE | P0 | - |
| Grid/List views | DONE | P0 | - |
| Model type badges | DONE | P0 | - |
| Sort options (4) | DONE | P1 | - |
| File size display | DONE | P1 | - |
| Model version badges (SD/SDXL/Flux) | TODO | P0 | Add baseModel field |
| Preview thumbnails (real) | TODO | P0 | Connect to backend |
| Favorites/bookmarks | TODO | P1 | Add favorites store |
| Recently used models | TODO | P1 | Track usage |
| Trigger words display | TODO | P1 | Fetch metadata |
| Tag-based organization | TODO | P2 | Design UI |
| Model metadata panel | TODO | P2 | Create component |
| Folder/category system | TODO | P2 | Design structure |
| Download from Civitai | TODO | P2 | API integration |
| Delete/remove models | TODO | P2 | Confirm dialog |
| Usage statistics | TODO | P3 | Analytics tracking |

### Workflow Management Features

| Feature | Status | Priority | Next Action |
|---------|--------|----------|-------------|
| Workflow browser | DONE | P1 | - |
| Search workflows | DONE | P1 | - |
| Workflow thumbnails | DONE | P1 | - |
| Grid/List views | DONE | P1 | - |
| Sort options | DONE | P1 | - |
| Import button (UI) | DONE | P1 | - |
| Create new button | DONE | P0 | - |
| Real workflow data | TODO | P0 | Backend API |
| Save in place (Ctrl+S) | TODO | P0 | Implement handler |
| Auto-save | TODO | P0 | Timer + storage |
| Custom save location | TODO | P0 | Save dialog |
| Unsaved indicator | TODO | P0 | Track dirty state |
| Crash recovery | TODO | P1 | LocalStorage backup |
| Version history | TODO | P1 | Store versions |
| Workflow favorites | TODO | P2 | Add to store |
| Project folders | TODO | P2 | Folder structure |
| Portable path format | TODO | P1 | Path resolver |
| Import path resolution | TODO | P1 | Match models |

### Asset/Output Features

| Feature | Status | Priority | Next Action |
|---------|--------|----------|-------------|
| Gallery browser | DONE | P1 | - |
| Search assets | DONE | P1 | - |
| Filter by type | DONE | P1 | - |
| Sort options | DONE | P1 | - |
| Grid/List views | DONE | P1 | - |
| File size/dimensions | DONE | P2 | - |
| Upload button (UI) | DONE | P1 | - |
| Real asset data | TODO | P0 | Backend API |
| Date-based folders | TODO | P1 | Auto-organize |
| Meaningful filenames | TODO | P1 | Pattern config |
| Workflow-output linking | TODO | P1 | Store metadata |
| Open workflow from output | TODO | P1 | Link resolver |
| Multi-location storage UI | TODO | P1 | Settings page |
| Path configuration UI | TODO | P1 | Settings page |
| Regenerate from output | TODO | P2 | Load params |
| Metadata preservation | TODO | P2 | Embed in PNG |

---

## Implementation Phases (Updated)

### Phase 1: Data Integration (Current Priority)

**Goal**: Connect UI to real ComfyUI backend

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Model API integration | P0 | Medium | TODO |
| Workflow API integration | P0 | Medium | TODO |
| Assets/outputs API | P0 | Medium | TODO |
| Model version detection | P0 | Low | TODO |
| Model thumbnail fetching | P0 | Medium | TODO |

**Deliverable**: Views show real data instead of mocks

---

### Phase 2: Save System

**Goal**: Prevent data loss, enable proper workflow management

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Ctrl+S save handler | P0 | Low | TODO |
| Auto-save timer | P0 | Low | TODO |
| Dirty state tracking | P0 | Low | TODO |
| Save dialog UI | P0 | Medium | TODO |
| LocalStorage backup | P1 | Low | TODO |
| Crash recovery prompt | P1 | Medium | TODO |

**Deliverable**: Users never lose work

---

### Phase 3: Model Enhancements

**Goal**: Solve model discovery problems

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| SD version badges | P0 | Low | TODO |
| Real model previews | P0 | Medium | TODO |
| Favorites system | P1 | Medium | TODO |
| Recently used | P1 | Low | TODO |
| Trigger words | P1 | Medium | TODO |

**Deliverable**: Finding models is fast and easy

---

### Phase 4: Advanced Features

**Goal**: Power user features

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Version history | P1 | High | TODO |
| Path configuration UI | P1 | Medium | TODO |
| Workflow-output linking | P1 | Medium | TODO |
| Import path resolution | P1 | High | TODO |
| Tags/categories | P2 | Medium | TODO |

**Deliverable**: Professional-grade organization

---

## Effort Estimates

### Quick Wins (< 1 day each)
- [x] Search in all views - DONE
- [x] Filter by type - DONE
- [x] Sort options - DONE
- [x] Grid/List toggle - DONE
- [ ] SD version badges - Add field to model data
- [ ] Dirty state indicator - Track changes
- [ ] Ctrl+S handler - Keyboard event

### Medium Effort (1-3 days each)
- [x] WorkspaceCard component - DONE
- [x] Templates view - DONE
- [x] Recents view - DONE
- [ ] Backend API integration - Define endpoints
- [ ] Favorites store - Pinia store + persistence
- [ ] Auto-save system - Timer + localStorage
- [ ] Save dialog - Modal component

### Larger Effort (3-5 days each)
- [ ] Version history - Storage + UI
- [ ] Path configuration - Settings page
- [ ] Import resolution - Model matching algorithm
- [ ] Workflow-output linking - Metadata system

---

## What's Already Working Well

### Completed Features to Celebrate

| Feature | View | Notes |
|---------|------|-------|
| Real-time search | All views | Fast computed filtering |
| Type filtering | Models, Assets | Button group UI |
| Multi-sort options | All views | Dropdown select |
| Grid/List toggle | All views | Reusable component |
| Visual cards | All views | WorkspaceCard component |
| Thumbnails | All views | Hover zoom effect |
| Category badges | Models, Templates | Color-coded |
| Empty states | All views | Helpful messages |
| Templates system | Complete | Categories, popularity |
| Dashboard | Complete | Quick start templates |

### Reusable Components Built

| Component | Used In | Purpose |
|-----------|---------|---------|
| WorkspaceCard | 5 views | Visual item display |
| WorkspaceSearchInput | 5 views | Search box |
| WorkspaceViewToggle | 5 views | Grid/List switch |
| WorkspaceSortSelect | 5 views | Sort dropdown |
| WorkspaceFilterSelect | 4 views | Filter dropdown |
| WorkspaceViewHeader | 5 views | Title + subtitle |

---

## Risk Assessment (Updated)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Backend API not ready | High | Medium | Define API contract first |
| Model detection inaccurate | Medium | Medium | Use file hash + metadata |
| Save system data loss | High | Low | Multiple backup layers |
| Performance with large data | Medium | Medium | Already have virtualization patterns |

---

## Success Metrics

### Phase 1 Success (Data Integration)
| Metric | Current | Target |
|--------|---------|--------|
| Views with real data | 0% | 100% |
| Model detection accuracy | N/A | 95%+ |

### Phase 2 Success (Save System)
| Metric | Current | Target |
|--------|---------|--------|
| Work loss incidents | Unknown | 0 |
| Auto-save reliability | 0% | 99.9% |

### Phase 3 Success (Model Enhancements)
| Metric | Current | Target |
|--------|---------|--------|
| Time to find model | Unknown | <5 seconds |
| Version mismatch errors | Common | Rare |

---

## Next Sprint Focus

### Must Complete
1. Backend API integration for models
2. Backend API integration for workflows
3. SD version badges (SD1.5/SDXL/Flux)
4. Basic save functionality (Ctrl+S)

### Should Complete
5. Auto-save timer
6. Model preview thumbnails
7. Dirty state indicator

### Nice to Have
8. Favorites store setup
9. Recently used tracking
