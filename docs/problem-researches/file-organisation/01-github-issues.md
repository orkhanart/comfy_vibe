# GitHub Issues & Discussions Research

*Source: github.com/comfyanonymous/ComfyUI & github.com/Comfy-Org*
*Research Date: December 2024*

---

## Overview

GitHub is the primary source for bug reports, feature requests, and technical discussions about ComfyUI file organization problems. This document catalogs issues across models, workflows, custom nodes, and assets.

---

## Model Organization Issues

### Issue #5201 - Add custom path for "models" folder in settings menu
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/5201
**Type:** Feature Request
**Status:** Open

**Problem:**
- Users want to share models between different ComfyUI versions
- Need UI to change model folder path (absolute or relative)
- Many ways to use ComfyUI (portable, GUI, Stability Matrix) require flexibility

**Quote:**
> "With many ways to use ComfyUI (portable, GUI, Stability Matrix), users want to choose where the model folder lies."

---

### Issue #4637 - New install, extra models paths not being used
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/4637
**Type:** Bug

**Problem:**
- `extra_model_paths.yaml` configured correctly
- Log shows paths being added
- BUT models NOT available in web app
- Silent failure with no error message

---

### Issue #6039 - folder_paths.py doesn't include extra_model_paths
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/6039
**Type:** Bug/Architecture

**Problem:**
- `folder_paths.py` only uses default folder locations
- Does NOT include custom paths from `extra_model_paths.yaml`
- Breaks ComfyUI when used as a backend
- Custom nodes can't find models in extra paths

---

### Issue #7516 - LOAD MODEL FOLDER: additional model YAML doesn't work well
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/7516
**Type:** Bug

**Problem:**
- YAML configuration inconsistent behavior
- Some model types work, others don't
- Documentation unclear

---

### Issue #8001 - Error when specifying model paths in extra_model_paths.yaml
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/8001
**Type:** Bug

**Problem:**
- YAML syntax errors not clearly reported
- Restart fails without helpful message
- Common mistake: putting models path instead of base path

---

### Discussion #7937 - ComfyUI Manager - management of models
**URL:** https://github.com/comfyanonymous/ComfyUI/discussions/7937
**Type:** Feature Request/Complaint

**Problem:**
- Model Manager doesn't show all installed models
- Only supports downloading "some" models
- "Very confusing for beginners"
- Feature was a "limited convenience tool" - not actively maintained

**Key Quote:**
> "The model management feature still requires significant improvements."

---

### Discussion #1226 - Folders for models
**URL:** https://github.com/comfyanonymous/ComfyUI/discussions/1226
**Type:** Feature Request

**Problem:**
- Large LoRA collections require endless scrolling
- No directory-based separation in UI
- No favorites or recent models
- Only alphabetical sorting

**Key Quote:**
> "I have a ton of LoRAs, it would be nice if the loader separated them according to directories. Now I spend a lot of time slowly scrolling up and down the list."

---

### Discussion #5015 - Fetch models folder from other drive?
**URL:** https://github.com/comfyanonymous/ComfyUI/discussions/5015
**Type:** How-To/Problem

**Problem:**
- SSD space constraints
- Need models on secondary/external drives
- Symbolic links break on updates
- YAML config is complex

**Workaround:**
- Use `extra_model_paths.yaml` instead of symlinks
- Avoid spaces in paths

---

### Discussion #2354 - Request for custom input & output folders
**URL:** https://github.com/comfyanonymous/ComfyUI/discussions/2354
**Type:** Feature Request

**Problem:**
- `extra_model_paths.yaml` works for models
- No equivalent for input/output folders
- Symlinks break on updates
- Need consistent config approach

---

## Workflow Organization Issues

### Issue #5885 - Where are saved workflows saved??
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/5885
**Type:** UX Problem

**Problem:**
- No choice for save location
- Workflows go to `user/default/workflows` only
- Can't change to custom path
- Confusing for new users

---

### Issue #5652 - Workflows Directory
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/5652
**Type:** Feature Request

**Problem:**
- 'Save as' doesn't allow folder selection
- Always saves to 'workflows' folder
- Opening external file → saving → goes to workflows folder
- Can't preserve original location

---

### Issue #2906 - Proper Workflow Management
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/2906
**Type:** Feature Request

**Problem:**
- Can't save (overwrite) current workflow
- Only "download as new file" option
- Goes to browser's downloads directory
- No proper save functionality

**Request:**
- Default "workflows" directory in root
- Modifiable through config
- Proper save/overwrite

---

### Issue #5928 (Frontend) - Improve Workflow File Saving, Manager, and History
**URL:** https://github.com/Comfy-Org/ComfyUI_frontend/issues/5928
**Type:** Feature Request

**Comprehensive request for:**
- Better file saving UX
- Workflow file manager
- Version history management
- Project organization

---

## Custom Nodes Issues

### Issue #420 (Manager) - Custom_nodes path different from folder_paths definition
**URL:** https://github.com/Comfy-Org/ComfyUI-Manager/issues/420
**Type:** Bug

**Problem:**
- ComfyUI and ComfyUI-Manager folder paths mismatch
- Using non-default paths via `extra_model_paths.yaml`
- Manager saves custom modules to wrong location
- Critical for Docker deployments

---

### Issue #688 (Manager) - Model Install Path
**URL:** https://github.com/Comfy-Org/ComfyUI-Manager/issues/688
**Type:** Bug

**Problem:**
- Models installed via Manager go to wrong location
- Ignores custom path configuration
- Installs to ComfyUI folder (where main.py is)
- Not to configured YAML path

---

### Issue #1844 (Manager) - Feature request for model manager using extra_model_paths.yaml
**URL:** https://github.com/Comfy-Org/ComfyUI-Manager/issues/1844
**Type:** Feature Request

**Problem:**
- Model manager doesn't search extra_model_paths.yaml locations
- Only detects models in base path
- No visibility into which folder contains which model

**Request:**
- Search all configured paths
- Show folder path column for installed models

---

### Issue #1900 (Manager) - Manager doesn't detect itself as installed
**URL:** https://github.com/Comfy-Org/ComfyUI-Manager/issues/1900
**Type:** Bug

**Problem:**
- ComfyUI-Manager doesn't recognize itself as installed
- Some custom nodes not detected despite working
- Crystools, ComfyUI-GGUF, WanVideoWrapper affected
- Updates may fail

---

### Issue #2183 (Manager) - Can't see installed custom nodes
**URL:** https://github.com/Comfy-Org/ComfyUI-Manager/issues/2183
**Type:** Bug

**Problem:**
- Suddenly can't see installed custom nodes
- Can't download or update any nodes
- Started happening without user action
- Complete loss of management capability

---

### Issue #8640 - Registry not recognising already installed custom nodes
**URL:** https://github.com/comfyanonymous/ComfyUI/issues/8640
**Type:** Bug

**Problem:**
- Registry and actual installation state mismatch
- Nodes installed but not shown
- Causes confusion about what's installed

---

## Asset/Output Issues

### Discussion #1292 - Output folder options
**URL:** https://github.com/comfyanonymous/ComfyUI/discussions/1292
**Type:** Feature Request

**Problem:**
- Limited output folder configuration
- Need project-based organization
- Want automatic subfolder creation

**Workarounds:**
- WAS Node Suite provides advanced output options
- Command line `--output-directory` flag
- Custom save nodes

---

## Statistics Summary

| Category | Issues Found | Feature Requests | Bugs |
|----------|--------------|------------------|------|
| Models | 8+ | 4 | 4+ |
| Workflows | 5+ | 4 | 1 |
| Custom Nodes | 6+ | 1 | 5+ |
| Assets/Output | 2+ | 2 | - |
| **Total** | **21+** | **11** | **10+** |

---

## Key Themes

1. **Configuration Complexity** - YAML files are error-prone and poorly documented
2. **Path Inconsistency** - Different components don't respect same configuration
3. **No UI for Settings** - Everything requires manual file editing
4. **Silent Failures** - Errors not clearly communicated
5. **Detection Problems** - Installed items not recognized as installed
6. **Save Location Rigidity** - Can't choose where files go
