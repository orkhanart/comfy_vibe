# ComfyUI Official Forum Research

*Source: forum.comfy.org*
*Research Date: December 2024*

---

## Overview

The official ComfyUI forum contains user discussions, feature requests, and troubleshooting threads related to file organization across Windows, macOS, Linux, and the Desktop app.

---

## Model Location & Path Issues

### Thread: Model locations
**URL:** https://forum.comfy.org/t/model-locations/322
**Category:** Windows

**Problems Discussed:**
- Models scattered across different drives
- Migration concerns about moving all models to same folder
- YAML configuration unclear
- Symbolic links support questions
- Desktop vs portable version path differences

**Key Concern:**
> "What happens during migration? Will it move all my models to the same folder?"

---

### Thread: Multiple models directory?
**URL:** https://forum.comfy.org/t/multiple-models-directory/361
**Category:** Windows

**Problem:**
- Import from existing installation shows some models
- Second models location in AppData
- Unclear which location is "primary"
- Confusing for users with existing A1111 setup

**Impact:**
- Models appear duplicated
- Disk space wasted
- Uncertainty about which to use

---

### Thread: Add option to choose where to load/save models
**URL:** https://forum.comfy.org/t/add-an-option-to-choose-where-to-load-and-save-models-to/1855
**Category:** Ideas

**Feature Request:**
- UI to select model storage location
- Auto-detection of existing models
- Prevent redownloading same models for every AI program
- Integration with other SD applications

**User Pain:**
> "Every AI program downloads the same models again. This wastes disk space and time."

---

### Thread: Allow Different Model Path Structure
**URL:** https://forum.comfy.org/t/allow-different-model-path-structure/100
**Category:** Windows

**Problem:**
- Users of Forge have different folder structure
- Want to share models without reorganizing
- Original ComfyUI allowed path changes
- Desktop version lacks this flexibility

---

### Thread: Workflow not finding Model files (different drive)
**URL:** https://forum.comfy.org/t/installed-comfyui-to-a-drive-other-than-c-workflow-not-finding-model-files/3801
**Category:** Windows

**Problem:**
- Installed ComfyUI to non-C: drive (space constraints)
- Saved model files to new location
- Workflows can't find models
- Path resolution broken

**Impact:**
- Workflows from tutorials don't work
- Downloaded workflows fail
- No clear solution

---

### Thread: Seeing new model folders
**URL:** https://forum.comfy.org/t/seeing-new-model-folders/813
**Category:** Custom Nodes

**Problem:**
- PuLID custom node installs correctly
- Creates 'pulid' folder in Models directory
- ComfyUI cannot see the model
- Model manager created the folder itself!

**Root Cause:**
- New model types not in standard folder list
- Custom nodes need to register folder types
- No automatic detection

---

### Thread: Understanding install paths and moving the "server"
**URL:** https://forum.comfy.org/t/understanding-install-paths-and-moving-the-server-to-another-folder/775
**Category:** Windows

**Problem:**
- Desktop version path structure unclear
- Moving installation breaks model links
- custom_nodes path confusion during migration
- No clear documentation

**Questions Raised:**
- Where are models stored?
- Can I move the entire folder?
- How do symlinks work with Desktop version?

---

### Thread: Weird issue with insightface model folder
**URL:** https://forum.comfy.org/t/weird-issue-with-insightface-model-folder-using-the-appdata-version/1254
**Category:** Desktop Feedback

**Problem:**
- InsightFace models in AppData, not models folder
- Different from other model types
- Hard to backup
- Easy to forget about these hidden models

---

## Workflow Organization Issues

### Thread: How to save workflows outside of 'workflows' folder?
**URL:** https://forum.comfy.org/t/how-to-save-workflows-outside-of-workflows-folder/3891
**Category:** Ideas

**Problem:**
- Forced to use single workflows folder
- Can't save to project-specific locations
- All workflows accumulate in one place
- No project organization possible

**User Need:**
- Save workflows with project files
- Version control integration
- Team collaboration on workflows

---

### Thread: Unable to save workflows - Infinite loop
**URL:** https://forum.comfy.org/t/unable-to-save-workflows-infinite-loop/449
**Category:** Windows

**Bug:**
- Trying to save creates infinite loop
- Workflows folder remains empty
- Only workaround: rename workflow before saving
- Blocks workflow preservation

---

## Custom Nodes Issues

### Thread: Problem with installation
**URL:** https://forum.comfy.org/t/problem-with-installation/999
**Category:** Custom Nodes

**Problems:**
- Custom node installation failures
- Dependency conflicts
- Requirements.txt not properly installed
- Virtual environment issues

---

### Thread: Custom Node Directory is not in main ComfyUI Dir
**URL:** https://forum.comfy.org/t/custom-node-directory-is-not-in-main-comfyui-dir/2201
**Category:** Custom Nodes

**Problem:**
- Desktop version puts custom_nodes in AppData
- Different from expected location
- Documentation assumes standard paths
- Causes confusion for tutorials

**Impact:**
- Manual installations go to wrong place
- Updates may not work
- Hard to backup custom nodes

---

## Output/Asset Issues

### Thread: Folder text_encoder
**URL:** https://forum.comfy.org/t/folder-text-encoder/731
**Category:** Windows

**Problem:**
- text_encoder folder in AppData
- Not in main models folder
- Inconsistent with other model types
- Complicates backup strategy

**User Frustration:**
> "Why isn't this in the models folder with everything else for easier backup and management?"

---

## Desktop App Specific Issues

### Thread: Checkpoints not loaded during install
**URL:** https://forum.comfy.org/t/checkpoints-not-loaded-during-install/632
**Category:** Desktop Feedback

**Problem:**
- Desktop install doesn't detect existing checkpoints
- No import from existing installation
- Have to manually configure paths
- First-time user experience poor

---

## Key Themes from Forum

### 1. Desktop vs Portable Confusion
- Different path structures
- AppData vs local folders
- Migration between versions

### 2. Multi-Drive Storage
- Can't easily put models on secondary drives
- Symlinks unreliable
- YAML config complex

### 3. Cross-App Compatibility
- Want to share models with A1111, Forge
- Different folder structures
- No universal import

### 4. Workflow Portability
- Save location inflexible
- Paths break when sharing
- No project-based organization

### 5. Hidden Folders Problem
- Models in AppData
- text_encoder separate
- InsightFace in different location

---

## User Sentiment Summary

| Topic | Frustration Level | Frequency |
|-------|-------------------|-----------|
| Model paths | High | Very Common |
| Desktop app paths | High | Common |
| Workflow saving | Medium | Common |
| Cross-app sharing | Medium | Common |
| Custom node paths | Medium | Occasional |
| Output organization | Low | Occasional |
