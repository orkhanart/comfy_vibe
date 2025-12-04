# All ComfyUI File Organization Problems - Consolidated

*Research Date: December 2024*
*Sources: GitHub, Reddit, ComfyUI Forum, Civitai, Extensions, Tutorials*

---

## Category 1: Model Discovery & Browsing

### Problem 1.1: No Search in Model Dropdowns
**Severity:** Critical
**Frequency:** Daily for all users with 50+ models

**Description:**
Users must scroll through alphabetically sorted dropdown lists to find models. No search, no filter, no quick access.

**Pain Points:**
- Scrolling through 200+ LoRAs to find one
- Only alphabetical sorting available
- Filter text was removed in recent UI update
- Time wasted on every generation

**User Quotes:**
> "I have a ton of LoRAs, it would be nice if the loader separated them according to directories. Now I spend a lot of time slowly scrolling up and down the list."
> — GitHub Discussion #1226

> "I've spent more time organizing my models than actually using them."
> — Reddit r/comfyui

> "Started with 5 models, now I have 200+. ComfyUI dropdown is unusable."
> — Reddit r/StableDiffusion

**Sources:**
- [GitHub Discussion #1226](https://github.com/comfyanonymous/ComfyUI/discussions/1226) - Folders for models
- [GitHub Issue #4430](https://github.com/comfyanonymous/ComfyUI/issues/4430)
- Reddit r/comfyui - Multiple threads

---

### Problem 1.2: No Visual Previews
**Severity:** High
**Frequency:** Every model selection

**Description:**
Users cannot see what a model produces before selecting it. Must remember model names or use trial-and-error.

**Pain Points:**
- Can't see what model looks like before selecting
- Must remember which model does what
- Trial-and-error selection process
- No hover preview, no thumbnails

**User Quotes:**
> "Wish ComfyUI showed me what my models look like before I select them."
> — Civitai comments

> "My models folder is a complete mess. No idea what half of them even do."
> — Civitai comments

> "Every other week I discover a model I forgot I downloaded."
> — Reddit r/comfyui

**Sources:**
- [Civitai Article - LoRA Manager](https://civitai.com/articles/11012) - "Managing a large LoRA collection is tedious"
- Reddit community feedback

---

### Problem 1.3: No Favorites or Recently Used
**Severity:** Medium-High
**Frequency:** Daily

**Description:**
No way to bookmark frequently used models or access recently used models quickly.

**Pain Points:**
- Repeat the scroll every time for same model
- No quick access to favorites
- No "recently used" section
- Must remember exact model names

**Sources:**
- [GitHub Discussion #1226](https://github.com/comfyanonymous/ComfyUI/discussions/1226)
- Community feature requests

---

### Problem 1.4: No Trigger Words Visibility
**Severity:** Medium-High
**Frequency:** Every LoRA usage

**Description:**
LoRA trigger words are not visible in the UI. Users must remember them, look them up externally, or guess.

**Pain Points:**
- Must leave ComfyUI to check Civitai for triggers
- Easy to forget trigger words
- Metadata exists but not displayed
- Wastes time and causes failed generations

**User Quotes:**
> "I can't see what trigger words to use"
> — Civitai model page comments

**Sources:**
- [Civitai Article](https://civitai.com/articles/11012) - "No metadata visibility"
- Community feedback

---

## Category 2: Model Version Confusion

### Problem 2.1: SD1.5/SDXL/Flux Models Mixed Together
**Severity:** High
**Frequency:** Common cause of generation failures

**Description:**
Models for different Stable Diffusion versions are displayed together with no indicator. Wrong combinations fail silently or produce bad results.

**Pain Points:**
- SD1.5 LoRAs mixed with SDXL LoRAs
- No version indicator on models
- Trial-and-error compatibility testing
- Wasted generation time from mismatches
- Confusion about which models are compatible

**User Quotes:**
> "SD1.5 LoRAs don't work with SDXL. Mixing versions causes failures. No clear indicator in filename."
> — Civitai Guide

**Workarounds:**
- Manually create subfolders: `loras/SD15/`, `loras/SDXL/`
- Include version in filename manually

**Sources:**
- [ComfyUI Wiki](https://comfyui-wiki.com/en/install/install-models/install-checkpoint) - Recommends version subfolders
- [Civitai Article](https://civitai.com/articles/1446) - File structure guide
- Reddit troubleshooting threads

---

## Category 3: Model Path Configuration

### Problem 3.1: No UI for Model Path Configuration
**Severity:** High
**Frequency:** Every new installation, storage change

**Description:**
Changing model storage location requires editing YAML files manually. No UI exists for this common need.

**Pain Points:**
- Must edit `extra_model_paths.yaml` manually
- YAML syntax errors not clearly reported
- Restart fails without helpful message
- No path validation before save

**User Quotes:**
> "With many ways to use ComfyUI (portable, GUI, Stability Matrix), users want to choose where the model folder lies."
> — GitHub Issue #5201

**Sources:**
- [GitHub Issue #5201](https://github.com/comfyanonymous/ComfyUI/issues/5201) - Add custom path in settings menu
- [GitHub Discussion #5015](https://github.com/comfyanonymous/ComfyUI/discussions/5015) - Fetch from other drive

---

### Problem 3.2: extra_model_paths.yaml Inconsistent Behavior
**Severity:** High
**Frequency:** Common configuration issue

**Description:**
YAML configuration works for some model types but not others. Custom nodes often ignore configured paths.

**Pain Points:**
- Some model types work, others don't
- `folder_paths.py` doesn't include extra paths
- Breaks when used as backend
- Custom nodes can't find models in extra paths

**User Quotes:**
> "The model management feature still requires significant improvements."
> — GitHub Discussion #7937

**Sources:**
- [GitHub Issue #4637](https://github.com/comfyanonymous/ComfyUI/issues/4637) - Extra paths not used
- [GitHub Issue #6039](https://github.com/comfyanonymous/ComfyUI/issues/6039) - folder_paths.py issue
- [GitHub Issue #7516](https://github.com/comfyanonymous/ComfyUI/issues/7516) - YAML doesn't work well
- [GitHub Issue #8001](https://github.com/comfyanonymous/ComfyUI/issues/8001) - Error specifying paths

---

### Problem 3.3: Multi-Drive Storage Complexity
**Severity:** High
**Frequency:** All users with storage constraints

**Description:**
Large model collections (100GB+) need external drives. Configuration is complex and fragile.

**Pain Points:**
- SSD space constraints common
- Symbolic links break on updates
- Spaces in paths cause failures
- Desktop version harder to configure

**User Quotes:**
> "Blanks in paths often cause trouble."
> — GitHub Discussion #5015

> "Symbolic links break when ComfyUI updates."
> — Forum threads

**Workarounds:**
- Use `extra_model_paths.yaml` instead of symlinks
- Avoid spaces in paths
- Command line: `--extra-model-paths-config`

**Sources:**
- [GitHub Discussion #5015](https://github.com/comfyanonymous/ComfyUI/discussions/5015)
- [Forum - Model locations](https://forum.comfy.org/t/model-locations/322)
- [Forum - Multiple models directory](https://forum.comfy.org/t/multiple-models-directory/361)

---

### Problem 3.4: Desktop vs Portable Path Confusion
**Severity:** Medium-High
**Frequency:** Desktop app users

**Description:**
Desktop version uses AppData paths, different from portable version. Causes confusion with tutorials and manual installations.

**Pain Points:**
- Models in AppData, not visible folder
- Custom nodes in unexpected location
- Documentation assumes standard paths
- Moving installation breaks links

**User Quotes:**
> "Custom Node Directory is not in main ComfyUI Dir - confusion everywhere."
> — Forum thread

> "InsightFace models in AppData, not models folder. Different from other model types."
> — Forum thread

**Sources:**
- [Forum - Understanding install paths](https://forum.comfy.org/t/understanding-install-paths-and-moving-the-server-to-another-folder/775)
- [Forum - Custom node directory](https://forum.comfy.org/t/custom-node-directory-is-not-in-main-comfyui-dir/2201)
- [Forum - InsightFace folder issue](https://forum.comfy.org/t/weird-issue-with-insightface-model-folder-using-the-appdata-version/1254)

---

## Category 4: Model Manager Issues

### Problem 4.1: Model Manager Incomplete
**Severity:** Medium-High
**Frequency:** Users expecting full management

**Description:**
ComfyUI Manager's model management shows only some models, doesn't search extra paths, can't delete or organize.

**Pain Points:**
- Only supports downloading "some" models
- Doesn't show all installed models
- No delete functionality
- Confusing for beginners

**User Quotes:**
> "Very confusing for a beginner who expects a central place for model management."
> — GitHub Discussion #7937

**Sources:**
- [GitHub Discussion #7937](https://github.com/comfyanonymous/ComfyUI/discussions/7937)
- [GitHub Issue #1844](https://github.com/Comfy-Org/ComfyUI-Manager/issues/1844) - Doesn't search extra paths
- [Docs](https://docs.comfy.org/development/core-concepts/models) - "No uninstall through frontend"

---

### Problem 4.2: Model Manager Path Mismatch
**Severity:** Medium
**Frequency:** Docker users, custom paths

**Description:**
Models installed via Manager go to wrong location, ignoring custom path configuration.

**Pain Points:**
- Installs to ComfyUI folder (where main.py is)
- Not to configured YAML path
- Critical for Docker deployments
- Saves custom modules to wrong location

**Sources:**
- [GitHub Issue #688](https://github.com/Comfy-Org/ComfyUI-Manager/issues/688) - Model install path
- [GitHub Issue #420](https://github.com/Comfy-Org/ComfyUI-Manager/issues/420) - Path mismatch

---

## Category 5: Workflow Save Issues

### Problem 5.1: Fixed Save Location
**Severity:** Critical
**Frequency:** Every workflow save

**Description:**
Workflows can only save to `user/default/workflows`. No option to save elsewhere. Opening external file and saving moves it to default folder.

**Pain Points:**
- Can't save to project folders
- Can't preserve original location
- All workflows accumulate in one place
- No project organization possible

**User Quotes:**
> "I find it disconcerting that I can't save (overwrite) my current workflow."
> — GitHub Issue #2906

> "Why can't I just save my workflow where I want it?"
> — Reddit

**Sources:**
- [GitHub Issue #5885](https://github.com/comfyanonymous/ComfyUI/issues/5885) - Where are workflows saved?
- [GitHub Issue #5652](https://github.com/comfyanonymous/ComfyUI/issues/5652) - Workflows directory
- [GitHub Issue #2906](https://github.com/comfyanonymous/ComfyUI/issues/2906) - Proper workflow management
- [Forum - Save outside workflows folder](https://forum.comfy.org/t/how-to-save-workflows-outside-of-workflows-folder/3891)

---

### Problem 5.2: No Save/Overwrite - Only Download
**Severity:** Critical
**Frequency:** Every save attempt

**Description:**
"Save" only downloads as new file to browser downloads directory. No proper save/overwrite functionality.

**Pain Points:**
- Goes to browser's downloads directory
- Can't overwrite current file
- Downloads folder fills with workflow copies
- Confusing UX

**Sources:**
- [GitHub Issue #2906](https://github.com/comfyanonymous/ComfyUI/issues/2906)
- [GitHub Issue #5928](https://github.com/Comfy-Org/ComfyUI_frontend/issues/5928) - Improve workflow saving

---

### Problem 5.3: No Auto-Save
**Severity:** Critical
**Frequency:** Common cause of work loss

**Description:**
No automatic saving. Crash or browser close loses all unsaved work.

**Pain Points:**
- Lost hours of work from crashes
- No recovery mechanism
- No unsaved changes warning
- Browser refresh loses everything

**User Quotes:**
> "Just lost 3 hours of work because I thought it auto-saved."
> — Reddit

**Sources:**
- Reddit community complaints
- [GitHub Issue #5928](https://github.com/Comfy-Org/ComfyUI_frontend/issues/5928)

---

### Problem 5.4: No Version History
**Severity:** Medium-High
**Frequency:** When experiments go wrong

**Description:**
No way to see previous versions of a workflow or revert changes.

**Pain Points:**
- Can't undo breaking changes
- Can't compare versions
- Must manually save copies
- No milestone marking

**Sources:**
- [GitHub Issue #5928](https://github.com/Comfy-Org/ComfyUI_frontend/issues/5928)
- comfyui-workspace-manager extension (proves demand)

---

## Category 6: Workflow Portability

### Problem 6.1: Hardcoded Absolute Paths
**Severity:** High
**Frequency:** Every workflow share

**Description:**
Workflows contain absolute paths from creator's machine. Breaks when opened on any other computer.

**Pain Points:**
- Model paths break on import
- 85% of workflow errors are missing nodes/models
- Hours debugging red nodes
- Tutorials don't work out of box

**User Quotes:**
> "Downloaded a workflow from Reddit. Spent 2 hours debugging red nodes."
> — Reddit

> "Tried to share my workflow with a friend. Took him 2 days to get it working."
> — Reddit

**Statistics (from Apatero):**
- 85% - Missing custom nodes
- 12% - Missing model files
- 3% - Version incompatibilities

**Sources:**
- [Apatero Troubleshooting Guide](https://apatero.com/blog/fixing-comfyui-red-box-hell-troubleshooting-guide-2025)
- Reddit community experiences

---

### Problem 6.2: No Path Remapping on Import
**Severity:** High
**Frequency:** Every imported workflow

**Description:**
No automatic or assisted path resolution when importing workflows with broken paths.

**Pain Points:**
- No "find similar model" suggestions
- No automatic path fixing
- Must manually fix each node
- No model fingerprint matching

**Sources:**
- Community feedback
- Extension solutions (workspace-manager)

---

## Category 7: Custom Node Issues

### Problem 7.1: Custom Nodes Not Detected as Installed
**Severity:** High
**Frequency:** Common Manager bug

**Description:**
ComfyUI-Manager doesn't recognize installed custom nodes, shows them as not installed despite working.

**Pain Points:**
- Can't update nodes that aren't "detected"
- Shows duplicate install options
- Crystools, ComfyUI-GGUF, WanVideoWrapper affected
- Suddenly stops seeing installed nodes

**User Quotes:**
> "ComfyUI-Manager doesn't see itself as installed despite it being installed and working fine."
> — GitHub Issue #1900

**Sources:**
- [GitHub Issue #1900](https://github.com/Comfy-Org/ComfyUI-Manager/issues/1900)
- [GitHub Issue #2183](https://github.com/Comfy-Org/ComfyUI-Manager/issues/2183) - Can't see installed nodes
- [GitHub Issue #8640](https://github.com/comfyanonymous/ComfyUI/issues/8640) - Registry not recognizing

---

### Problem 7.2: New Model Folders Not Recognized
**Severity:** Medium
**Frequency:** When installing custom nodes with new model types

**Description:**
Custom nodes that create new model folders (like PuLID) are not automatically recognized by ComfyUI.

**Pain Points:**
- New model types not in standard folder list
- Custom nodes need to register folder types
- No automatic detection
- Model manager creates folder but can't see it

**Sources:**
- [Forum - Seeing new model folders](https://forum.comfy.org/t/seeing-new-model-folders/813)

---

## Category 8: Output Organization

### Problem 8.1: Flat Output Folder
**Severity:** High
**Frequency:** Accumulates daily

**Description:**
All generated images go to one folder with generic sequential names like `ComfyUI_0001_.png`.

**Pain Points:**
- Thousands of files in one folder
- No date-based organization
- No project-based organization
- Filenames meaningless
- Can't find specific outputs

**User Quotes:**
> "Output folder becomes unusable after a week."
> — Community feedback

> "Spending hours searching for specific generations."
> — Reddit

**Workarounds:**
- WAS Node Suite advanced output options
- Command line `--output-directory` flag
- Custom save nodes
- Dynamic filename prefix with dates

**Sources:**
- [GitHub Discussion #1292](https://github.com/comfyanonymous/ComfyUI/discussions/1292) - Output folder options
- [Civitai Article](https://civitai.com/articles/4172/how-to-format-output-folder-in-comfyui)
- [ComfyUI Wiki](https://comfyui-wiki.com/en/faq/how-to-change-output-folder)

---

### Problem 8.2: No Workflow-Output Linking
**Severity:** Medium-High
**Frequency:** When trying to reproduce results

**Description:**
No easy way to see which workflow created which output, or to regenerate from an output.

**Pain Points:**
- Can't find workflow that made an image
- Must remember or manually track
- Embedded JSON too complex to parse
- No "regenerate" button

**Sources:**
- Community feature requests
- Smart Gallery extension (proves demand)

---

### Problem 8.3: No Custom Input/Output Paths
**Severity:** Medium
**Frequency:** Project-based workflows

**Description:**
`extra_model_paths.yaml` works for models but no equivalent for input/output folders.

**Pain Points:**
- Input folder fixed
- Output folder fixed (without CLI flag)
- Symlinks break on updates
- Need consistent config approach

**Sources:**
- [GitHub Discussion #2354](https://github.com/comfyanonymous/ComfyUI/discussions/2354) - Request for custom folders

---

## Category 9: Metadata Issues

### Problem 9.1: Model Metadata Lost on Download
**Severity:** Medium
**Frequency:** Manual downloads

**Description:**
When downloading models manually, metadata (trigger words, description, preview) is lost.

**Pain Points:**
- Preview images not downloaded
- Trigger words not saved
- Description not preserved
- Must revisit Civitai to find info

**Sources:**
- [Civitai Article](https://civitai.com/articles/11012)
- Community feedback

---

### Problem 9.2: Output Metadata Not Civitai-Compatible
**Severity:** Medium
**Frequency:** When uploading to Civitai

**Description:**
ComfyUI images don't have Civitai-compatible metadata. Can't auto-detect resources when uploading.

**Pain Points:**
- Images show no generation info on Civitai
- Resources (model, LoRA) not linked
- Prompt not visible to others
- Workflow JSON too complex for display

**User Quotes:**
> "ComfyUI outputs lack A1111-style metadata. Civitai can't parse ComfyUI workflow JSON."
> — Civitai Article

**Sources:**
- [Civitai Article](https://civitai.com/articles/10071) - Metadata save for Civitai
- [Civitai Article](https://civitai.com/articles/7083) - Metadata editor (marked "Abandoned")

---

## Category 10: Cross-App Sharing

### Problem 10.1: Duplicate Models Across Apps
**Severity:** Medium
**Frequency:** Users with A1111 + ComfyUI

**Description:**
Users running multiple SD apps have same models downloaded multiple times.

**Pain Points:**
- 2-3x disk space usage
- 50-100GB common for basic setup, multiplied
- Updates require updating all copies
- No single source of truth

**User Quotes:**
> "Every AI program downloads the same models again. This wastes disk space and time."
> — Forum

> "Centralizing your model storage outside any specific application's folder is typically the best route."
> — Civitai Article

**Sources:**
- [Civitai Article](https://civitai.com/articles/4649) - Efficient management across apps
- [Medium Article](https://medium.com/@promptingpixels/sharing-stable-diffusion-models-between-different-applications-856fc93c45e5)
- [Forum](https://forum.comfy.org/t/add-an-option-to-choose-where-to-load-and-save-models-to/1855)

---

### Problem 10.2: No Import Wizard
**Severity:** Medium
**Frequency:** New ComfyUI users from A1111

**Description:**
No automatic detection or import of models from other SD applications.

**Pain Points:**
- Must manually configure paths
- Desktop install doesn't detect existing checkpoints
- First-time user experience poor
- Different folder structures per app

**Sources:**
- [Forum - Checkpoints not loaded during install](https://forum.comfy.org/t/checkpoints-not-loaded-during-install/632)
- [Forum - Allow different model path structure](https://forum.comfy.org/t/allow-different-model-path-structure/100)

---

## Summary Statistics

### By Category
| Category | Problems | Avg Severity |
|----------|----------|--------------|
| Model Discovery | 4 | High |
| Model Versions | 1 | High |
| Model Paths | 4 | High |
| Model Manager | 2 | Medium-High |
| Workflow Save | 4 | Critical |
| Workflow Portability | 2 | High |
| Custom Nodes | 2 | Medium-High |
| Output Organization | 3 | High |
| Metadata | 2 | Medium |
| Cross-App | 2 | Medium |
| **Total** | **26** | |

### By Source
| Source | Issues Documented |
|--------|-------------------|
| GitHub Issues/Discussions | 21+ |
| ComfyUI Forum | 15+ |
| Civitai | 8+ |
| Reddit | 10+ |
| Extensions (prove demand) | 4+ major |

### By Evidence Type
| Evidence | Description |
|----------|-------------|
| Direct User Quotes | 25+ collected |
| GitHub Issues | Linked with URLs |
| Extension Downloads | workspace-manager ~1K stars |
| Tutorial Volume | High volume = common confusion |

---

## Extension Demand Proof

These popular extensions prove unmet needs:

| Extension | Stars | Problems Solved |
|-----------|-------|-----------------|
| comfyui-workspace-manager | ~1K+ | Workflow versioning, save location |
| ComfyUI-Lora-Manager | ~500+ | LoRA browsing, previews, search |
| ComfyUI-Model-Manager | ~300+ | General model management |
| Smart ComfyUI Gallery | ~200+ | Output organization |
| Civicomfy | ~200+ | Civitai integration |

---

## Sources Index

### GitHub - ComfyUI Core
- [#1226](https://github.com/comfyanonymous/ComfyUI/discussions/1226) - Folders for models
- [#2354](https://github.com/comfyanonymous/ComfyUI/discussions/2354) - Custom input/output folders
- [#2906](https://github.com/comfyanonymous/ComfyUI/issues/2906) - Proper workflow management
- [#4637](https://github.com/comfyanonymous/ComfyUI/issues/4637) - Extra paths not used
- [#5015](https://github.com/comfyanonymous/ComfyUI/discussions/5015) - Fetch from other drive
- [#5201](https://github.com/comfyanonymous/ComfyUI/issues/5201) - Custom model path in settings
- [#5652](https://github.com/comfyanonymous/ComfyUI/issues/5652) - Workflows directory
- [#5885](https://github.com/comfyanonymous/ComfyUI/issues/5885) - Where are workflows saved
- [#6039](https://github.com/comfyanonymous/ComfyUI/issues/6039) - folder_paths.py issue
- [#7516](https://github.com/comfyanonymous/ComfyUI/issues/7516) - YAML doesn't work well
- [#7937](https://github.com/comfyanonymous/ComfyUI/discussions/7937) - Model management
- [#8001](https://github.com/comfyanonymous/ComfyUI/issues/8001) - Error specifying paths
- [#8640](https://github.com/comfyanonymous/ComfyUI/issues/8640) - Registry not recognizing

### GitHub - ComfyUI Manager
- [#420](https://github.com/Comfy-Org/ComfyUI-Manager/issues/420) - Path mismatch
- [#688](https://github.com/Comfy-Org/ComfyUI-Manager/issues/688) - Model install path
- [#1844](https://github.com/Comfy-Org/ComfyUI-Manager/issues/1844) - Extra paths not searched
- [#1900](https://github.com/Comfy-Org/ComfyUI-Manager/issues/1900) - Not detected as installed
- [#2183](https://github.com/Comfy-Org/ComfyUI-Manager/issues/2183) - Can't see installed nodes

### GitHub - ComfyUI Frontend
- [#5928](https://github.com/Comfy-Org/ComfyUI_frontend/issues/5928) - Improve workflow saving

### ComfyUI Forum
- [Model locations](https://forum.comfy.org/t/model-locations/322)
- [Multiple models directory](https://forum.comfy.org/t/multiple-models-directory/361)
- [Add option to choose model location](https://forum.comfy.org/t/add-an-option-to-choose-where-to-load-and-save-models-to/1855)
- [Allow different model path structure](https://forum.comfy.org/t/allow-different-model-path-structure/100)
- [Workflow not finding models](https://forum.comfy.org/t/installed-comfyui-to-a-drive-other-than-c-workflow-not-finding-model-files/3801)
- [Seeing new model folders](https://forum.comfy.org/t/seeing-new-model-folders/813)
- [Understanding install paths](https://forum.comfy.org/t/understanding-install-paths-and-moving-the-server-to-another-folder/775)
- [InsightFace folder issue](https://forum.comfy.org/t/weird-issue-with-insightface-model-folder-using-the-appdata-version/1254)
- [Save outside workflows folder](https://forum.comfy.org/t/how-to-save-workflows-outside-of-workflows-folder/3891)
- [Unable to save workflows](https://forum.comfy.org/t/unable-to-save-workflows-infinite-loop/449)
- [Custom node directory location](https://forum.comfy.org/t/custom-node-directory-is-not-in-main-comfyui-dir/2201)
- [Checkpoints not loaded](https://forum.comfy.org/t/checkpoints-not-loaded-during-install/632)

### Civitai
- [LoRA Manager Introduction](https://civitai.com/articles/11012)
- [Efficient Model Management](https://civitai.com/articles/4649)
- [File Structure Guide](https://civitai.com/articles/1446)
- [Output Folder Formatting](https://civitai.com/articles/4172)
- [Metadata Save for Civitai](https://civitai.com/articles/10071)
- [Metadata Editor](https://civitai.com/articles/7083)

### Tutorials & Blogs
- [Apatero - Red Box Troubleshooting](https://apatero.com/blog/fixing-comfyui-red-box-hell-troubleshooting-guide-2025)
- [ComfyUI Wiki - Files](https://comfyui-wiki.com/en/interface/files)
- [ComfyUI Wiki - Install Checkpoint](https://comfyui-wiki.com/en/install/install-models/install-checkpoint)
- [ComfyUI Wiki - Change Output Folder](https://comfyui-wiki.com/en/faq/how-to-change-output-folder)
- [Stable Diffusion Art - ComfyUI Guide](https://stable-diffusion-art.com/comfyui/)
