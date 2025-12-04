# Workflow Sharing Platforms & Solutions

*Research Date: December 2024*
*Sources: Platform websites, GitHub repositories, community discussions*

---

## Overview

Multiple platforms and tools have emerged to address ComfyUI's workflow sharing limitations. This document catalogs the current landscape.

---

## Workflow Sharing Platforms

### CivitAI

**What it offers:**
- Workflow uploads with model integration
- Large community of creators
- Model + workflow bundling

**Issues reported:**
- Metadata parsing problems with complex workflows
- Recent platform instability
- Content policy changes causing creator exodus
- Mass model deletions affecting workflow availability

**User feedback:**
> "Metadata is present in images, but it doesn't load in CivitAI. Even when manually checking the metadata and finding flags for prompts, samplers, models, etc., CivitAI may fail to parse it from complex workflows."

---

### OpenArt

**What it offers:**
- Visual workflow browsing
- Built-in execution capability
- Large workflow library

**URL:** https://openart.ai/workflows/home

---

### ComfyWorkflows

**What it offers:**
- Share, discover, & run thousands of ComfyUI workflows
- Online execution without local installation

**Key feature:**
> "This will enable anyone to run your workflow online, without having to install ComfyUI. After a few minutes, your workflow will be runnable online by anyone, via the workflow's URL."

**URL:** https://comfyworkflows.com/

---

## Team Collaboration Platforms

### Comfy Deploy (Y Combinator-backed)

**What it solves:**
> "Comfy Deploy fixes this by creating a collaborative workspace, where a team's environment, models and workflows can be shared as easily with a link."

**Key features:**
- Managed ComfyUI environment
- Pre-configured machines and models
- Workflow sharing within teams
- Custom node and model installation
- API deployment for production

**Founded:** 2024
**Location:** San Francisco, CA

---

### ComfyICU for Teams

**What it offers:**
- Single environment for entire team
- 95 pre-installed nodes (always compatible)
- Automatic updates without breaking changes
- Project management
- Permission controls
- Cost tracking

**Target audience:** Professional teams and studios

---

### RunComfy Cloud

**What it offers:**
- Cloud Save with full environment preservation
- Instant sharing via link
- No setup required for recipients

**Key feature:**
> "With Cloud Save, you can seamlessly save your workflow along with the entire GPU machine environment to the cloud. All your configurations will be saved alongside any workflow, so you can pick up right where you left off."

---

## Workflow-to-App Solutions

### ViewComfy

**What it offers:**
- Convert workflows to web apps
- API generation
- Embed in websites via iframe
- Production-ready deployment

**Key value:**
> "In just a few clicks, turn your workflows into production-ready AI applications that you can easily share with your team and clients."

---

### ComfyFlowApp

**What it offers:**
- Develop web apps from workflows
- Lower barrier to sharing
- No ComfyUI knowledge required for end users

**Key value:**
> "Users don't need to understand the principles of AI generation models. Users don't need to know the tuning parameters of various AI models. Users don't need to understand where to download models. Users don't need to know how to set up ComfyUI workflows."

---

## Packaging & Deployment Tools

### comfy-pack (BentoML)

**What it offers:**
- Lock entire workflow environment
- Package as .cpack.zip file
- Includes Python packages, custom nodes, model hashes

**Key feature:**
> "With a single click, it captures and locks your entire workflow environment into a .cpack.zip file, including Python packages, custom nodes, model hashes, and required assets."

**Deployment capabilities:**
- HTTP endpoints via BentoML
- Standardized API schemas
- Enterprise-grade deployment to BentoCloud

---

### Replicate cog-comfyui

**What it offers:**
- Production-ready API
- Integrate workflow into apps/websites
- Uses API version of workflow (not visual JSON)

---

## Open Source Extensions

### ComfyUI Workspace Manager

**What it offers:**
- Version history (like git)
- Workflow organization
- Model management
- Import/export
- Subworkflow reuse

**Key feature:**
> "Every time you save, it will create a new record in Version History. You can go back and switch versions in version history like git."

**GitHub:** https://github.com/11cafe/comfyui-workspace-manager

---

## Centralized Model Sharing

### Network Drive Approach

**Method:**
Use `--extra-model-paths-config` to point to shared network drive.

**Benefits:**
> "Using a centralized drive creates several efficiencies: saving disk space by avoiding multiple installs of large files, faster onboarding because models and custom nodes are immediately available for new users, easy version management by using one copy of the files, and updates instantly available to everyone."

---

## Gap Analysis

| Need | Covered By | Gaps |
|------|------------|------|
| Dependency packaging | comfy-pack | Not built into core |
| Team environments | Comfy Deploy, ComfyICU | Requires paid service |
| Version history | Workspace Manager | Extension, not core |
| Easy sharing | RunComfy, ComfyWorkflows | External platforms |
| API deployment | ViewComfy, BentoML | Complex setup |
| Model sharing | Network drives | Manual configuration |

---

## Sources

- [CivitAI Workflows](https://civitai.com/articles/3244/comfyui-workflows-and-what-you-need-to-know-by-thinkdiffusion)
- [OpenArt Workflows](https://openart.ai/workflows/home)
- [Comfy Deploy](https://www.comfydeploy.com/)
- [ComfyICU](https://comfy.icu/for/teams)
- [RunComfy](https://comfyui-guides.runcomfy.com/ultimate-comfyui-how-tos-a-runcomfy-guide/runcomfy-comfyui-workflow-cloud-save-and-sharing-features)
- [ViewComfy](https://www.viewcomfy.com/blog/turn-a-comfyui-workflow-into-an-app)
- [comfy-pack GitHub](https://github.com/bentoml/comfy-pack)
- [Workspace Manager GitHub](https://github.com/11cafe/comfyui-workspace-manager)
- [Magnopus - Sharing Models](https://www.magnopus.com/blog/sharing-models-and-custom-nodes-in-comfyui)
