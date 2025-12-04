# Vibe Testing Guide

Prototype testing and user feedback strategy for ComfyUI Vibe.

## Quick Start

### 1. Deploy a Prototype
```bash
# Push to a feature branch
git checkout -b feature/new-ui-experiment
git push origin feature/new-ui-experiment
# Vercel auto-generates: https://comfyui-vibe-git-feature-new-ui-experiment.vercel.app
```

### 2. Collect Feedback
- Share preview URL with existing users
- Enable in-app feedback widget
- Monitor behavior with analytics

### 3. Iterate
- Review session recordings
- Prioritize based on feedback votes
- A/B test winning variations

## Documentation

| Document | Description |
|----------|-------------|
| [Tool Stack](./tool-stack.md) | Recommended tools and integrations |
| [Testing Workflow](./testing-workflow.md) | Step-by-step testing process |
| [Feedback Collection](./feedback-collection.md) | Methods for gathering user feedback |
| [Analytics Setup](./analytics-setup.md) | Heatmaps, session recording, A/B testing |
| [Best Practices](./best-practices.md) | Guidelines and tips |

## Recommended Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Deployment)                      │
│  - Preview deployments per branch/PR                        │
│  - Edge A/B testing with Flags SDK                          │
│  - Web Analytics (built-in, flags-integrated)               │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   BEHAVIOR      │  │   FEEDBACK      │  │  USABILITY      │
│   ANALYTICS     │  │   COLLECTION    │  │  TESTING        │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ PostHog/Clarity │  │ Canny           │  │ Maze            │
│ - Heatmaps      │  │ - In-app widget │  │ - Task flows    │
│ - Recordings    │  │ - Voting boards │  │ - Metrics       │
│ - Funnels       │  │ - Changelog     │  │ - Reports       │
│ - Feature flags │  │ - Roadmap       │  │ - Recruitment   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Key Principles

1. **Test early, test often** - Low-fidelity prototypes before polished designs
2. **Quantitative + Qualitative** - Numbers show what, interviews show why
3. **Close the loop** - Always follow up with users who gave feedback
4. **Ship small** - Feature flags enable incremental rollouts

## Resources

- [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)
- [PostHog Docs](https://posthog.com/docs)
- [Canny](https://canny.io)
- [Maze Guides](https://maze.co/guides/)
