# Getting Started

Quick guide for teammates to start prototyping on this project.

## Setup

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server → http://localhost:5174
pnpm typecheck    # Type checking
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code
pnpm build        # Production build
```

## Project Overview

Vue 3 + TypeScript frontend prototype for ComfyUI - a node-based AI workflow editor. Currently uses **mock data** (no backend required).

**Main interfaces:**
- `/workflow-editor` - Full node graph editor (Vue Flow)
- `/linear-mode` - Simplified step-by-step interface
- `/workspace` - Dashboard for managing workflows, assets, models

---

## How to Prompt AI (Claude Code)

### Starting a New Feature
> "I want to add [feature] to [location]. Look at existing patterns in [similar component] for reference."

### Fixing Bugs
> "There's a bug in [component]: [describe issue]. Expected: [X]. Actual: [Y]."

### Refactoring
> "Refactor [component/file] to [goal]. Keep same functionality but [improvement]."

### Understanding Code
> "Explain how [feature/component] works. What files are involved?"

---

## How to Edit Code

### Where to Put Things

| What | Where |
|------|-------|
| New page/route | `src/views/` |
| Reusable component | `src/components/[domain]/` |
| UI primitives | `src/components/ui/` |
| State management | `src/stores/` |
| TypeScript types | `src/types/` |
| Mock data | `src/data/` |
| API calls | `src/services/` |
| Reusable logic | `src/composables/` |

### Key Patterns
- All components use Vue 3 Composition API with `<script setup lang="ts">`
- Styling uses Tailwind CSS utility classes
- State managed through Pinia stores
- Theme supports light/dark modes via CSS variables

---

## How to Create a PRD

### Step 1: Define the Problem
- What user problem are we solving?
- Who is affected?
- What's the current experience?

### Step 2: Define Success
- Primary and secondary goals
- Non-goals (what's out of scope)

### Step 3: Describe the Solution
- User flow (step by step)
- UI/UX requirements
- Technical requirements (store, components, types)

### Step 4: Break into Tasks
- Create types
- Add state to store
- Create component
- Connect to view
- Add styling

### PRD Template

```
# Feature: [Name]

## Problem
[1-2 sentences]

## Solution
[1-2 sentences]

## User Stories
- As a [user], I want to [action] so that [benefit]

## Requirements
### Must Have
- [ ] Requirement 1
- [ ] Requirement 2

### Nice to Have
- [ ] Optional 1

## Design
[Link to Figma or description]

## Technical Notes
- Affects: [components/stores]
- New files: [list]

## Tasks
- [ ] Task 1
- [ ] Task 2
```

---

## How to Brainstorm

### Exploring the Codebase
> "What components handle [feature]?"
> "How does [functionality] work?"

### Generating Ideas
> "I want to improve [area]. Current behavior: [X]. What approaches could work?"

### Comparing Approaches
> "Compare approaches for [feature]: A vs B. What are the tradeoffs?"

### Validating Ideas
> "I'm thinking of implementing [idea]. Does this fit the existing architecture?"

---

## How to Start Prototyping

### 1. Understand First
- Read `ARCHITECTURE.md`
- Look at similar components in the codebase
- Ask Claude what patterns to follow

### 2. Start Small
- Create minimal version first
- Focus on core functionality
- Skip advanced features initially

### 3. Iterate
- Add features incrementally
- Follow existing patterns
- Test as you go

### 4. Polish
- Improve styling
- Add proper TypeScript types
- Match existing design patterns

---

## Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `src/stores/uiStore.ts` | Main UI state (theme, sidebars, tabs) |
| `src/data/workspaceMockData.ts` | All mock data |
| `src/components/ui/` | Base UI components |
| `src/views/WorkflowEditorView.vue` | Main editor page |
| `ARCHITECTURE.md` | Full architecture docs |

### Available UI Components
Button, Card, Dialog, Icon, Input, Select, Switch, Textarea, Popover, Tooltip

---

## Tips

1. **Read before writing** - Always look at existing patterns first
2. **Keep files small** - Max 500 lines per file
3. **Use existing components** - Check `src/components/ui/` before creating new ones
4. **Type everything** - Use TypeScript interfaces
5. **Mock data first** - Add to `src/data/` before worrying about APIs
6. **Commit often** - Small, focused commits with clear messages
