# ComfyUI Workflow Sharing: User Feedback and Feature Requests Research

**Research Date:** December 8, 2025
**Repository Focus:** github.com/comfyanonymous/ComfyUI
**Related Repositories:** Comfy-Org/ComfyUI_frontend, Comfy-Org/ComfyUI-Manager

---

## Executive Summary

This research compiles user feedback and feature requests related to workflow sharing in ComfyUI from GitHub issues, discussions, and community platforms. The findings reveal significant pain points around workflow management, versioning, collaboration, and dependency handling. While ComfyUI has basic workflow import/export capabilities, users are requesting more robust features for organizing, syncing, and sharing workflows effectively.

---

## 1. Workflow Management & Organization

### 1.1 File Management Issues

**[Issue #6170](https://github.com/comfyanonymous/ComfyUI/issues/6170) - A better way to manage workflow files** (Dec 23, 2024)
- **Request:** Files should be managed by creating new directories, synchronized to the cloud or local backup directories, and have version management
- **Pain Points:** Current system lacks organization capabilities as workflow collections grow
- **Upvotes/Reactions:** Not specified

**[Issue #7507](https://github.com/comfyanonymous/ComfyUI/issues/7507) - Feature Request: Workflow folder and tag** (April 2025)
- **Request:** Add folder and tag support for workflow organization and management
- **Pain Point:** After using ComfyUI for a while, the workflow list becomes very long and unmanageable
- **Upvotes/Reactions:** Not specified

**[Issue #2906](https://github.com/comfyanonymous/ComfyUI/issues/2906) - Proper Workflow Management** (Feb 26, 2024)
- **Request:** Ability to save/overwrite current workflow instead of only downloading to browser's default downloads directory
- **Suggestion:** Default "workflows" directory in the root which should be modifiable through extra_model_paths or general config
- **Pain Point:** Users can't save (overwrite) their current workflow in place
- **Upvotes/Reactions:** Not specified

**[Issue #5652](https://github.com/comfyanonymous/ComfyUI/issues/5652) - Workflows Directory** (Nov 17, 2024)
- **Request:** Ability to change the default workflows save location from user/default/workflows
- **Pain Point:** After updating ComfyUI, workflows are saved to a specific folder and users want custom paths
- **Upvotes/Reactions:** Not specified

**[Issue #9902](https://github.com/comfyanonymous/ComfyUI/issues/9902) - Improve file/workflow manager** (Sep 17, 2025)
- **Request:** Incorporate comfyui-workspace-manager extension features into ComfyUI core
- **Pain Point:** Current system is "extremely barebones"
- **Note:** Extension already provides: local folder sync, OS File Explorer integration with two-way sync, version control
- **Upvotes/Reactions:** Not specified

### 1.2 Workflow Browser & Discovery

**Third-Party Solution: ComfyUI Workspace Manager** ([11cafe/comfyui-workspace-manager](https://github.com/11cafe/comfyui-workspace-manager))
- Workflows saved and synced in local folder (default: /ComfyUI/my_workflows)
- Every save creates new record in Version History with easy reversion
- One-click install for missing models from Hugging Face and Civitai when importing workflows
- Community feedback: Should be incorporated into core ComfyUI

**Third-Party Solution: ComfyUI Browser** ([talesofai/comfyui-browser](https://github.com/talesofai/comfyui-browser))
- Browse and manage images/videos/workflows in output folder
- Add workflows to 'Saves' for easier switching
- Git integration for syncing favorite workflows to remote repository
- Useful for collaborative projects

**ComfyUI V1 Built-in Feature:**
- Workflow Browser introduced for saving workflows for quick access
- Workflow Templates feature for browsing natively supported model workflows and custom node examples

---

## 2. Versioning & Backup

### 2.1 Version Control Issues

**[Issue #5200](https://github.com/comfyanonymous/ComfyUI/issues/5200) - Add version of ComfyUI to the saving workflow file**
- **Problem:** workflow.json contains `{"version": 0.4}` that doesn't correspond to actual ComfyUI versions
- **Pain Point:** Users encounter red/missing nodes after loading workflows due to version mismatches
- **Request:** Include actual ComfyUI version in workflow files
- **Upvotes/Reactions:** Not specified

**[Issue #6565](https://github.com/comfyanonymous/ComfyUI/issues/6565) - Per-Workflow Versioning Details for Node Packs, Packages, Libraries, Python, and Torch**
- **Problem:** Even with fresh installs of portable releases per workflow, it's very difficult to reproduce exact environment
- **Pain Point:** Cannot reliably reproduce environment where workflow behaves best or at all
- **Request:** Per-workflow versioning for all dependencies
- **Note:** Users heard versioning will resolve many headaches in ComfyUI Desktop, but want it for portable users too
- **Upvotes/Reactions:** Not specified

**[Issue #10490](https://github.com/comfyanonymous/ComfyUI/issues/10490) - "Some nodes require a newer version" error even after updating**
- **Problem:** Version mismatch errors when loading workflows, even when ComfyUI is latest version
- **Pain Point:** Required version shown is paradoxically older than current version
- **Upvotes/Reactions:** Not specified

**[Issue #7667](https://github.com/comfyanonymous/ComfyUI/issues/7667) - Workflow crashed after upgrading to latest version**
- **Problem:** Workflows that work in previous versions should still work, but validation errors occur after upgrade
- **Pain Point:** Rolling back to version lower than v0.3.18 makes workflows work; v0.3.19+ causes errors
- **Upvotes/Reactions:** Not specified

### 2.2 Backup & History Issues

**[Issue #5095](https://github.com/comfyanonymous/ComfyUI/issues/5095) - Workflow got overwritten when computer shut down** (Sep 28, 2024)
- **Problem:** Big workflow (200+ hours of work) overwritten when remote PC shut down improperly
- **Pain Point:** Had main workflow open with another in second tab; main workflow file was overwritten with other workflow's content
- **Severity:** Critical data loss
- **Upvotes/Reactions:** Not specified

**[Issue #9457](https://github.com/comfyanonymous/ComfyUI/issues/9457) - ComfyUI Desktop Windows will copy entire workflow to another workflow in already open tab**
- **Problem:** Cannot navigate multiple workflows without app copying entire workflows across different tabs
- **Pain Point:** When switching between tabs, entire W2 workflow is copied to W1; unless immediately undo and save, it overwrites original
- **Quote:** "I absolutely cannot navigate multiple workflows in ComfyUI desktop app without the app copying entire workflows across different tabs and saving them when they are closed"
- **Severity:** Users have lost hours of work multiple times
- **Upvotes/Reactions:** Not specified

**[Issue #10225](https://github.com/comfyanonymous/ComfyUI/issues/10225) - Constant and permanent loss of open and saved workflows**
- **Problem:** All saved workflows lost after updating/installing new custom nodes
- **Pain Point:** Saved workflow will be gone and old generic workflow appears instead
- **Quote:** "A show-stopper for developing new workflow, as one can't be expected to export workflows every 2 minutes"
- **Severity:** Critical for development workflow
- **Upvotes/Reactions:** Not specified

**[Issue #7600](https://github.com/comfyanonymous/ComfyUI/issues/7600) - ComfyUI Desktop loads old workflow versions**
- **Problem:** Desktop loads from cache instead of saved files
- **Pain Point:** When loading workflow exported from non-desktop ComfyUI, making modifications, saving, then reopening, it loads first version from before saving
- **Upvotes/Reactions:** Not specified

**[Issue #4667](https://github.com/comfyanonymous/ComfyUI/issues/4667) - Persist more settings in workflow.json backup files**
- **Request:** Persist more settings in workflow.json backup files, including Batch count
- **Pain Point:** Backup and restore system doesn't consistently track all settings; must manually reapply them
- **Upvotes/Reactions:** Not specified

**[ComfyUI_frontend Issue #5928](https://github.com/Comfy-Org/ComfyUI_frontend/issues/5928) - Improve Workflow File Saving and History Manager**
- **Request:** Version history where every save creates new record allowing easy reversion to any version
- **Request:** Autosave options
- **Request:** Cloud sync & backup workspace functionality
- **Upvotes/Reactions:** Not specified

**[comfyui-workspace-manager Issue #229](https://github.com/11cafe/comfyui-workspace-manager/issues/229) - Version history lost after backing up workflow**
- **Problem:** Workspace manager supports saving version history, but when backing up workflow and reimporting it, workflow's history version is lost
- **Upvotes/Reactions:** Not specified

---

## 3. Import/Export & Format Issues

### 3.1 Workflow Format Confusion

**[Issue #1335](https://github.com/comfyanonymous/ComfyUI/issues/1335) - Workflow format in UI is not the same as API format - creates confusion**
- **Problem:** Two different JSON formats (UI workflow vs API format) cause confusion and challenges
- **Pain Point:** Users creating apps wish to use node titles like IDs, but API JSON doesn't contain title
- **Current Workaround:** Save both JSONs and use UI JSON for querying and prompt for injecting values
- **Request:** Should be as easy as sending any workflow JSON saved from UI without needing dev mode
- **Upvotes/Reactions:** Not specified

**[Issue #1112](https://github.com/comfyanonymous/ComfyUI/issues/1112) - API to convert workflow format to prompt format**
- **Request:** Conversion function available in Python for workflow to API format
- **Pain Point:** Conversion logic only available in client-side JavaScript
- **Upvotes/Reactions:** Not specified

**[Issue #1498](https://github.com/comfyanonymous/ComfyUI/issues/1498) - Load workflow from API format json**
- **Question:** Why can't workflows saved in API format be dragged in or loaded like regular workflow.json files?
- **Pain Point:** API format workflows don't work the same as UI workflows
- **Upvotes/Reactions:** Not specified

**[Issue #3627](https://github.com/comfyanonymous/ComfyUI/issues/3627) - Export/Load JSON API Format is broken**
- **Problem:** Steps to reproduce: Load default workflow, save as JSON (API) format, clear workflow, load JSON that was just saved
- **Result:** Nothing happens, error logged: "TypeError graphData.nodes is not iterable"
- **Pain Point:** API version's nodes have broken links when reimported
- **Upvotes/Reactions:** Not specified

**[ComfyUI_frontend Issue #3753](https://github.com/Comfy-Org/ComfyUI_frontend/issues/3753) - Workflow in API format placed in example_workflows folder fails to load**
- **Problem:** API format workflows fail to load from templates folder
- **Error:** "Workflow does not contain a valid version" with Zod validation errors
- **Upvotes/Reactions:** Not specified

**[Discussion #4787](https://github.com/comfyanonymous/ComfyUI/discussions/4787) - The general format of JSON workflow is horrendous to work with as a developer**
- **Problem:** Workflow contains multiple times the same values for frontend and backend; widget_values and values specified can be different
- **Pain Point:** Hard to change workflows using programs
- **Request:** Key-value structure would be more desirable
- **Note:** Current structure causes compatibility issues when node shape is updated
- **Upvotes/Reactions:** Not specified

### 3.2 Import/Export Issues

**[Issue #5521](https://github.com/comfyanonymous/ComfyUI/issues/5521) - control_after_generate not exported in API format**
- **Problem:** "control_after_generate" can't be exported when using Save (API format)
- **Pain Point:** RandomNoise node's control_after_generate is not exported in JSON
- **Upvotes/Reactions:** Not specified

**[Issue #5929](https://github.com/comfyanonymous/ComfyUI/issues/5929) - Cannot import Workflow if a node is missing** (Dec 2024)
- **Problem:** When importing workflow with missing node, popup shows up but workflow is not loaded
- **Pain Point:** Dragging or opening workflow does nothing
- **Note:** Recent issue appearing to be regression after update
- **Upvotes/Reactions:** Not specified

**[Issue #6556](https://github.com/comfyanonymous/ComfyUI/issues/6556) - After modifying workflow, cannot save successfully**
- **Problem:** Users expect to save json file after modifying workflow using Ctrl+S or save as json file
- **Pain Point:** When new page is saved or opened, workflow returns to state before modification
- **Upvotes/Reactions:** Not specified

**[Issue #4085](https://github.com/comfyanonymous/ComfyUI/issues/4085) - How to set default workflow**
- **Problem:** When importing other's workflow.json files or making own workflow, can't set as default workflow
- **Pain Point:** Will reset as default workflow if you export image and reimport the image again
- **Upvotes/Reactions:** Not specified

**[Issue #5859](https://github.com/comfyanonymous/ComfyUI/issues/5859) - Workflow DOES NOT SHOW up when drag and dropping JSON** (Dec 1, 2024)
- **Problem:** After workflow operations, dragging and dropping new workflow results in nothing visual happening
- **Pain Point:** Workflow loads but no visual update; impossible to click nodes to change models
- **Upvotes/Reactions:** Not specified

**[Issue #5742](https://github.com/comfyanonymous/ComfyUI/issues/5742) - Some workflows cannot be displayed** (Nov 23, 2024)
- **Problem:** When dragging JSON files of certain workflows, nothing happens; refresh shows blank area
- **Pain Point:** No log updates
- **Upvotes/Reactions:** Not specified

---

## 4. Cloud, Remote, & Network Sharing

### 4.1 Cloud Sync & Remote Access

**[Issue #6170](https://github.com/comfyanonymous/ComfyUI/issues/6170) - Cloud sync request** (covered above)
- **Request:** Files synchronized to cloud or local backup directories
- **Upvotes/Reactions:** Not specified

**[Issue #2795](https://github.com/comfyanonymous/ComfyUI/issues/2795) - Can't load workflows from network share** (Feb 15, 2024)
- **Problem:** User has workflows folder on NAS but trying to load workflow from UI from anything but local folder results in nothing happening
- **Tested:** SMB mount and Nextcloud/WebDAV, both do nothing
- **Pain Point:** No error appears in UI or Console
- **Upvotes/Reactions:** Not specified

**[Issue #7107](https://github.com/comfyanonymous/ComfyUI/issues/7107) - Custom default workflow in docker** (Mar 6, 2025)
- **Problem:** Trying to make ComfyUI load custom workflow via cloud docker container
- **Pain Point:** Placing workflow into user/default/workflows only shows it on workflow tab; doesn't load as default
- **Upvotes/Reactions:** Not specified

**[Issue #728](https://github.com/comfyanonymous/ComfyUI/issues/728) - Sync prompt API**
- **Request:** Add sync HTTP endpoint that awaits workflow to finish
- **Reason:** Implementing websocket adds complexity to other systems using ComfyUI API
- **Suggestion:** POST /prompt_sync endpoint that waits for prompt_id to be executed
- **Upvotes/Reactions:** Not specified

### 4.2 Multi-User & Team Collaboration

**[Issue #3417](https://github.com/comfyanonymous/ComfyUI/issues/3417) - --multi-user cmd arg doesn't work properly**
- **Problem:** Different output dirs for different sessions
- **Pain Point:** User folders don't separate outputs - all saved in same folder
- **Note:** Multi-user system only affects settings, not outputs
- **Fundamental Issue:** ComfyUI was not designed for multi-user use; AI image generation utilizes GPU fully
- **Upvotes/Reactions:** Not specified

**[Discussion #4185](https://github.com/comfyanonymous/ComfyUI/discussions/4185) - Server on network for multiple users**
- **Discussion:** Multi-user setup challenges
- **Note:** Even if parallelization were allowed, would be meaningless because GPU usage cannot be parallelized
- **Upvotes/Reactions:** Not specified

**Third-Party Solution: ComfyUI-Nexus** ([daxcay/ComfyUI-Nexus](https://github.com/daxcay/ComfyUI-Nexus))
- Custom node enabling multiuser collaboration
- Multiple users can work on same workflow simultaneously
- Local and remote access using tools like ngrok
- Admin permissions: control who can edit workflow and who can queue prompts
- Queue permissions can be given or revoked per user
- Workflow backup system: short-term backups (5 backups saved 60 seconds apart) and long-term backups on every reload

**Third-Party Platforms:**
- **ComfyDeploy:** Share workflows with links, instant cloud use, team-wide custom nodes and models
- **ComfyICU for Teams:** Built-in project management, permissions, cost tracking, role-based permissions
- **ViewComfy:** Keep workflows private where only team admins have access

---

## 5. Metadata & Embedding

### 5.1 Workflow Metadata in Images

**[Issue #942](https://github.com/comfyanonymous/ComfyUI/issues/942) - Feature request - Visual image of workflow with workflow metadata attached**
- **Request:** Create image of current workflow with workflow embedded
- **Concept:** Similar to how generated images have prompt/workflow metadata embedded, workflow image would have visual + metadata
- **Benefit:** Can drop it into UI to load
- **Upvotes/Reactions:** Not specified

**[Issue #1182](https://github.com/comfyanonymous/ComfyUI/issues/1182) - Metadata not being loaded on Civitai from complex workflows** (Aug 2023)
- **Problem:** Metadata present in images but doesn't load in Civitai when using complex workflows
- **Pain Point:** Export metadata compatibility with external platforms
- **Upvotes/Reactions:** Not specified

**[Issue #2137](https://github.com/comfyanonymous/ComfyUI/issues/2137) - Twitter / ComfyUI Metadata** (Dec 2023)
- **Problem:** Twitter strips off image metadata, including embedded workflows from PNG images
- **Suggestion:** Use hIST chunk instead of tEXt to preserve embedded workflow
- **Pain Point:** Social platforms cleaning metadata from images
- **Upvotes/Reactions:** Not specified

**[Issue #2100](https://github.com/comfyanonymous/ComfyUI/issues/2100) - Output image without workflow in metadata by ComfyUI API call** (Nov 2023)
- **Problem:** When running websockets API example, output images don't include workflow metadata
- **Upvotes/Reactions:** Not specified

**[Issue #6758](https://github.com/comfyanonymous/ComfyUI/issues/6758) - --disable-metadata does not work as intended** (Feb 2025)
- **Problem:** Images saved via API still have workflow metadata embedded even when using --disable-metadata flag
- **Command:** `comfy launch --background -- --listen 0.0.0.0 --port 8188 --disable-metadata`
- **Upvotes/Reactions:** Not specified

**[Issue #6915](https://github.com/comfyanonymous/ComfyUI/issues/6915) - NaN causes workflows not to load from PNG** (Feb 2025)
- **Problem:** Files with metadata should load workflows when dragged onto ComfyUI
- **Pain Point:** Occasionally PNGs fail to load due to NaN values in JSON metadata causing JSON.parse to reject data
- **Upvotes/Reactions:** Not specified

### 5.2 Third-Party Metadata Tools

- **ComfyUI-PNG-Metadata:** Custom nodes for adding custom metadata to PNG files
- **comfy-image-saver:** Tools to save images with generation metadata compatible with Civitai & Prompthero; works with png, jpeg, webp
- **comfyui-metadata.com:** Free online tool to extract and visualize workflow metadata from PNG images

---

## 6. Dependencies & Missing Resources

### 6.1 Missing Custom Nodes

**Community Feedback:**
- Missing custom nodes is #1 cause of workflow loading failures
- When loading workflow with missing nodes, ComfyUI shows error prompt or loads with red boxes
- **Solution:** ComfyUI Manager's "Install Missing Nodes" button detects and installs required nodes

**[Discussion #5615](https://github.com/comfyanonymous/ComfyUI/discussions/5615) - Newbie struggling with workflow errors - Missing Models and Nodes**
- **Pain Point:** New users struggle with missing models and nodes when importing workflows
- **Upvotes/Reactions:** Not specified

**[Issue #8640](https://github.com/comfyanonymous/ComfyUI/issues/8640) - ComfyUI Registry not recognising already installed custom nodes**
- **Problem:** Registry doesn't recognize installed custom nodes
- **Upvotes/Reactions:** Not specified

### 6.2 Missing Models & Resources

**[Issue #3587](https://github.com/comfyanonymous/ComfyUI/issues/3587) - Missing Models and Custom Nodes including IP-Adapters**
- **Problem:** "Install Missing Nodes" functionality doesn't extend to missing models or IP-adapters
- **Request:** Allow installation of missing models and components directly from manager tab when importing JSON
- **Pain Point:** When installing new custom nodes, models they use aren't always downloaded automatically
- **Note:** Must check custom node repositories to find where to place models
- **Upvotes/Reactions:** Not specified

**Community Pain Points:**
- Errors when workflows reference models that don't exist in user's collection
- Workflow expects specific fine-tuned models, LoRAs, or embeddings that haven't been downloaded
- Pathing issues: downloaded workflows have pathing from original computer

**Solution: comfy-pack**
- Packages everything into .cpack.zip file
- Includes custom nodes pinned to exact versions
- All Python dependencies
- Model hashes

### 6.3 Dependencies Issues

**Community Feedback:**
- Dependencies must be installed in ComfyUI environment
- Each custom node has requirements.txt with Python dependencies
- Some custom nodes fail to load due to dependency import errors (e.g., "Cannot import module: Unable to import dependency onnxruntime")

**[ComfyUI-Manager Issue #1761](https://github.com/Comfy-Org/ComfyUI-Manager/issues/1761) - Million hours waiting for manager to install missing nodes**
- **Problem:** Manager takes extremely long time to install missing nodes
- **Pain Point:** Performance issue with dependency installation
- **Upvotes/Reactions:** Not specified

---

## 7. Template & Example Workflows

### 7.1 Official Resources

**[Comfy-Org/workflow_templates](https://github.com/Comfy-Org/workflow_templates)**
- Hosts official ComfyUI workflow templates
- Package-per-media structure
- Best practice: Start ComfyUI with --disable-all-custom-nodes to prevent custom extensions from adding metadata

**[comfyanonymous/ComfyUI_examples](https://github.com/comfyanonymous/ComfyUI_examples)**
- Examples of what's achievable with ComfyUI
- All images contain metadata - can be loaded into ComfyUI with Load button or drag-and-drop
- Includes ComfyUI Basic Tutorial VN

### 7.2 Community Workflow Collections

**Community Resources:**
- **lquesada/ComfyUI-Starter-Workflows:** Simple but powerful workflows with curated settings
- **cubiq/ComfyUI_Workflows:** Well-documented, easy to follow workflows designed for readability (left to right, top to bottom execution)
- **ComfyUI-Wiki-Workflows:** Workflow templates from ComfyUI Wiki
- **ComfyWorkflows.com:** Largest ComfyUI community for sharing, discovering, and running workflows
- **OpenArt.ai:** Platform to discover, share and run workflows with category and custom node filtering

**[Issue #1421](https://github.com/comfyanonymous/ComfyUI/issues/1421) - Ability to attach example workflow to node**
- **Request:** Inspired by vvvv software where each node could have associated workflow to explain parameters and usage
- **Upvotes/Reactions:** Not specified

---

## 8. Workflow Loading & Display Issues

**[Issue #3810](https://github.com/comfyanonymous/ComfyUI/issues/3810) - Load workflow alongside existing one**
- **Request:** Option to load workflow without replacing first one
- **Pain Point:** Loading new workflow always replaces current one
- **Upvotes/Reactions:** Not specified

**[Issue #5513](https://github.com/comfyanonymous/ComfyUI/issues/5513) - Update workflow during running queue**
- **Request:** Update workflow mid-queue while running and have running queue use altered workflow
- **Upvotes/Reactions:** Not specified

**[Issue #9601](https://github.com/comfyanonymous/ComfyUI/issues/9601) - Open workflow with API call**
- **Request:** API endpoint to open specific workflow
- **Upvotes/Reactions:** Not specified

**[ComfyUI_frontend Issue #6014](https://github.com/Comfy-Org/ComfyUI_frontend/issues/6014) - Loading aborted due to error reloading workflow data** (Oct 2025)
- **Problem:** Issue when copying nested subgraphs between workflows when physical links are present
- **Steps:** Create subgraph with physical links to widgets, put inside another subgraph, copy and paste in empty workflow, switch to another workflow and back
- **Upvotes/Reactions:** Not specified

**[Issue #7309](https://github.com/comfyanonymous/ComfyUI/issues/7309) - Invalid workflow against zod schema**
- **Problem:** Error messages about invalid workflow against zod schema keep appearing
- **Note:** Doesn't seem to affect actual operation of workflows
- **Upvotes/Reactions:** Not specified

**[Issue #9816](https://github.com/comfyanonymous/ComfyUI/issues/9816) - Workflow does not contain valid version**
- **Problem:** Unable to open recently saved workflows after updating to latest ComfyUI version
- **Alert:** "Workflow does not contain a valid version. Zod error: Validation error: Required at 'version'"
- **Upvotes/Reactions:** Not specified

---

## 9. Community Pain Points (2024-2025)

### 9.1 From External Community Sources

**Missing Custom Nodes & Red Nodes**
- #1 cause of workflow loading failures
- Users see red nodes due to missing custom nodes
- Pathing issues: workflows have paths from original computer

**Messy, Unorganized Workflows**
- Quote: "The difference between spaghetti workflows and professional ones isn't just aesthetics"
- Clean workflows easier to debug, modify, and share
- Process faster, cause fewer errors
- Organized workflows easier to share and explain to team members
- Recommendation: Start with organization from beginning, even for experimental workflows

**Version Control & Backup Challenges**
- Community recommendation: Save workflow snapshots before major changes with descriptive names including dates
- Use git for serious version control
- Store workflows in cloud storage (Dropbox, Google Drive) for automatic backup
- Quote: "Losing months of workflow development to hardware failure destroys productivity"

**Documentation Gap**
- Recommendation: Document changes in workflow notes nodes so future you understands configurations
- Most users plan to organize after workflows work, but this rarely happens

**Production & Scaling Issues**
- Quote: "ComfyUI is notoriously hard to productionize"
- Server cold starts: Very high server load time makes it inefficient for faster scale ups
- No autoscaling logic: Not built for SLA-driven scaling under fluctuating user loads

### 9.2 Workflow Sharing Methods

**Current Methods:**
- Workflows can be saved as JSON files for reuse
- Embedded within generated PNGs or WebP files
- All images in official examples contain metadata - can be loaded with Load button or drag-and-drop

**Third-Party Platforms:**
- **Comfy Workflows:** Dynamic platform for artists to share workflows and art; Discord login; includes ComfyUI Launcher for running workflows with zero setup
- **OpenArt.ai:** Filter by categories, custom nodes; large community of creators
- **ComfyRun:** Easy way to run & share workflows; users can copy Share key, click "Share via ComfyRun" on menu, upload workflow; deploys to cloud and returns URL

---

## 10. Key Themes & Patterns

### Critical Pain Points (by frequency and severity)

1. **Workflow Loss & Data Safety** (CRITICAL)
   - Multiple reports of workflows being overwritten or lost
   - Issues: #5095, #9457, #10225
   - Affects: Users losing 200+ hours of work

2. **Version Management** (HIGH)
   - Difficulty reproducing exact environment
   - Version mismatches causing workflows to break
   - Issues: #5200, #6565, #10490, #7667

3. **Missing Dependencies** (HIGH)
   - Missing custom nodes #1 cause of loading failures
   - Models not auto-downloaded with custom nodes
   - No unified solution for dependency management

4. **Format Confusion** (MEDIUM)
   - Two different JSON formats (UI vs API)
   - API format workflows don't load properly
   - Issues: #1335, #1498, #3627

5. **Organization & Discovery** (MEDIUM)
   - No folders/tags for organizing workflows
   - Long workflow lists become unmanageable
   - Issues: #7507, #6170

6. **Multi-User Collaboration** (LOW-MEDIUM)
   - ComfyUI not designed for multi-user
   - Third-party solutions exist but not native
   - Limited native support

### Most Requested Features

1. **Version Control & History**
   - Every save creates new record
   - Easy reversion to any version
   - Autosave functionality

2. **Cloud Sync & Backup**
   - Automatic backup to cloud
   - Sync across devices
   - Network share support

3. **Workflow Organization**
   - Folders and tags
   - Custom save locations
   - Better file management

4. **Dependency Management**
   - Auto-install missing models
   - Package all dependencies
   - Version pinning for reproducibility

5. **Unified Format**
   - Single workflow format that works everywhere
   - Easy conversion between formats
   - Consistent import/export

### Third-Party Ecosystem

**Extensions Addressing Gaps:**
- comfyui-workspace-manager (workflow management & versioning)
- ComfyUI Browser (browsing & Git integration)
- ComfyUI-Nexus (multi-user collaboration)
- ComfyUI-Manager (custom node management)
- comfy-pack (dependency packaging)

**Platforms:**
- ComfyWorkflows.com (largest community)
- OpenArt.ai (workflow discovery)
- ComfyDeploy (team collaboration)
- ComfyICU (project management)
- ComfyRun (cloud deployment)

---

## 11. Recommendations for Workflow Sharing Features

Based on this research, here are priority recommendations:

### P0 - Critical (Data Safety)
1. Implement robust autosave with version history
2. Prevent workflow overwrites with proper tab management
3. Add workflow backup system (short-term & long-term)

### P1 - High Priority (Core Sharing)
1. Built-in workflow versioning with dependency tracking
2. Cloud sync capabilities (optional, user-configurable)
3. Unified workflow format (eliminate UI vs API confusion)
4. Automatic dependency detection and installation for models
5. Folders and tags for workflow organization

### P2 - Medium Priority (Enhanced Sharing)
1. Workflow templates/examples browser in core
2. Workflow metadata improvements (descriptions, tags, author)
3. Share workflows with access controls (view/edit/run permissions)
4. Network share support for team workflows
5. Workflow diff/comparison tools

### P3 - Nice to Have
1. Multi-user real-time collaboration
2. Workflow marketplace/discovery in-app
3. Visual workflow thumbnails with embedded metadata
4. Workflow analytics (usage, success rate)
5. Git integration for version control

---

## Sources

### GitHub Issues - Main Repository (comfyanonymous/ComfyUI)
- [Issue #2795 - Why can't ComfyUI load workflows from a network share?](https://github.com/comfyanonymous/ComfyUI/issues/2795)
- [Issue #728 - Sync prompt API](https://github.com/comfyanonymous/ComfyUI/issues/728)
- [Issue #942 - Feature request - Visual image of workflow with workflow metadata attached](https://github.com/comfyanonymous/ComfyUI/issues/942)
- [Issue #1112 - API to convert workflow format to prompt format](https://github.com/comfyanonymous/ComfyUI/issues/1112)
- [Issue #1182 - Metadata not being loaded on civitai from complex workflows](https://github.com/comfyanonymous/ComfyUI/issues/1182)
- [Issue #1335 - Workflow format in UI is not the same as API format](https://github.com/comfyanonymous/ComfyUI/issues/1335)
- [Issue #1421 - Ability to attach example workflow to node](https://github.com/comfyanonymous/ComfyUI/issues/1421)
- [Issue #1498 - Feature Request: Load workflow from api format json](https://github.com/comfyanonymous/ComfyUI/issues/1498)
- [Issue #2100 - Output image without workflow in metadata by ComfyUI API call](https://github.com/comfyanonymous/ComfyUI/issues/2100)
- [Issue #2137 - Twitter / ComfyUI Metadata](https://github.com/comfyanonymous/ComfyUI/issues/2137)
- [Issue #2906 - Proper Workflow Management](https://github.com/comfyanonymous/ComfyUI/issues/2906)
- [Issue #3417 - --multi-user cmd arg doesn't work properly](https://github.com/comfyanonymous/ComfyUI/issues/3417)
- [Issue #3587 - Missing Models and Custom Nodes in ComfyUI](https://github.com/comfyanonymous/ComfyUI/issues/3587)
- [Issue #3627 - Export/Load JSON API Format is broken](https://github.com/comfyanonymous/ComfyUI/issues/3627)
- [Issue #3810 - Load workflow alongside existing one](https://github.com/comfyanonymous/ComfyUI/issues/3810)
- [Issue #4085 - How to set default workflow?](https://github.com/comfyanonymous/ComfyUI/issues/4085)
- [Issue #4667 - Persist more settings in workflow.json backup files](https://github.com/comfyanonymous/ComfyUI/issues/4667)
- [Issue #5095 - My workflow got overwritten by another one when computer shutted down](https://github.com/comfyanonymous/ComfyUI/issues/5095)
- [Issue #5200 - Add version of ComfyUI to the saving workflow file](https://github.com/comfyanonymous/ComfyUI/issues/5200)
- [Issue #5513 - Update/change workflow during a running queue?](https://github.com/comfyanonymous/ComfyUI/issues/5513)
- [Issue #5521 - why control_after_generate can't be exported when export workflow?](https://github.com/comfyanonymous/ComfyUI/issues/5521)
- [Issue #5652 - Workflows Directory](https://github.com/comfyanonymous/ComfyUI/issues/5652)
- [Issue #5742 - some workflows cannot be displayed](https://github.com/comfyanonymous/ComfyUI/issues/5742)
- [Issue #5859 - Workflow DOES NOT SHOW up](https://github.com/comfyanonymous/ComfyUI/issues/5859)
- [Issue #5929 - Cannot import Workflow if a node is missing](https://github.com/comfyanonymous/ComfyUI/issues/5929)
- [Issue #6170 - A better way to manage workflow files](https://github.com/comfyanonymous/ComfyUI/issues/6170)
- [Issue #6556 - After modifying the workflow, it cannot be saved successfully](https://github.com/comfyanonymous/ComfyUI/issues/6556)
- [Issue #6565 - Per Workflow Versioning Details](https://github.com/comfyanonymous/ComfyUI/issues/6565)
- [Issue #6758 - --disable-metadata does not work as intended](https://github.com/comfyanonymous/ComfyUI/issues/6758)
- [Issue #6915 - NaN causes workflows not to load from PNG](https://github.com/comfyanonymous/ComfyUI/issues/6915)
- [Issue #7107 - How to make comfyui load a custom default workflow (docker)?](https://github.com/comfyanonymous/ComfyUI/issues/7107)
- [Issue #7309 - Invalid workflow against zod schema](https://github.com/comfyanonymous/ComfyUI/issues/7309)
- [Issue #7507 - Feature Request: Workflow folder and tag](https://github.com/comfyanonymous/ComfyUI/issues/7507)
- [Issue #7600 - When starting ComfyUI Desktop, it loads an old version of Workflow](https://github.com/comfyanonymous/ComfyUI/issues/7600)
- [Issue #7667 - workflow crashed after upgrading to latest version](https://github.com/comfyanonymous/ComfyUI/issues/7667)
- [Issue #8640 - ComfyUI Registry not recognising already installed custom nodes](https://github.com/comfyanonymous/ComfyUI/issues/8640)
- [Issue #9457 - ComfyUI Desktop Windows will copy entire workflow to another workflow](https://github.com/comfyanonymous/ComfyUI/issues/9457)
- [Issue #9601 - Open a workflow with an API call](https://github.com/comfyanonymous/ComfyUI/issues/9601)
- [Issue #9816 - Alert Workflow does not contain a valid version](https://github.com/comfyanonymous/ComfyUI/issues/9816)
- [Issue #9902 - Feature Request: Improve file/workflow manager](https://github.com/comfyanonymous/ComfyUI/issues/9902)
- [Issue #10225 - Constantly and permanent loss of open and saved workflows](https://github.com/comfyanonymous/ComfyUI/issues/10225)
- [Issue #10490 - "Some nodes require a newer version" error](https://github.com/comfyanonymous/ComfyUI/issues/10490)
- [Discussion #4185 - Server on a network for multiple users](https://github.com/comfyanonymous/ComfyUI/discussions/4185)
- [Discussion #4787 - The general format of JSON workflow is horrendous](https://github.com/comfyanonymous/ComfyUI/discussions/4787)
- [Discussion #5615 - A newbee struggling with a workflow errors](https://github.com/comfyanonymous/ComfyUI/discussions/5615)
- [Discussion #5753 - Where is the workflow saved?](https://github.com/comfyanonymous/ComfyUI/discussions/5753)

### GitHub Issues - Frontend Repository (Comfy-Org/ComfyUI_frontend)
- [Issue #3753 - Workflow in the API format placed in example_workflows folder fails to load](https://github.com/Comfy-Org/ComfyUI_frontend/issues/3753)
- [Issue #5928 - Improve the Workflow File Saving, Workflow File Manager, and Workflow History Manager](https://github.com/Comfy-Org/ComfyUI_frontend/issues/5928)
- [Issue #6014 - Loading aborted due to error reloading workflow data](https://github.com/Comfy-Org/ComfyUI_frontend/issues/6014)

### GitHub Issues - Manager Repository (Comfy-Org/ComfyUI-Manager)
- [Issue #1761 - Million hours waiting for the manager to install missing nodes](https://github.com/Comfy-Org/ComfyUI-Manager/issues/1761)

### Third-Party Extensions
- [ComfyUI Workspace Manager](https://github.com/11cafe/comfyui-workspace-manager)
- [ComfyUI Browser](https://github.com/talesofai/comfyui-browser)
- [ComfyUI-Nexus](https://github.com/daxcay/ComfyUI-Nexus)
- [ComfyUI-ComfyWorkflows](https://github.com/thecooltechguy/ComfyUI-ComfyWorkflows)
- [ComfyUI-ComfyRun](https://github.com/thecooltechguy/ComfyUI-ComfyRun)
- [comfyui-workspace-manager Issue #229](https://github.com/11cafe/comfyui-workspace-manager/issues/229)

### Official Resources
- [ComfyUI Examples Repository](https://github.com/comfyanonymous/ComfyUI_examples)
- [Comfy-Org Workflow Templates](https://github.com/Comfy-Org/workflow_templates)
- [ComfyUI Documentation - Templates](https://docs.comfy.org/interface/features/template)

### Community Resources
- [25 ComfyUI Pro Tips & Tricks 2025](https://apatero.com/blog/25-comfyui-tips-tricks-pro-users-dont-share-2025)
- [Guide to ComfyUI Workflow Examples and Community 2025](https://wiki.shakker.ai/en/comfyui-workflow)
- [Fix Messy ComfyUI Workflows 2025](https://apatero.com/blog/fix-messy-comfyui-workflows-reroute-nodes-organization-guide-2025)
- [Troubleshooting ComfyUI Workflows (September 2025)](https://learn.rundiffusion.com/troubleshooting-workflows-in-comfyui-updated/)
- [The Ultimate ComfyUI Workflow Guide for Beginners (2025)](https://aideskers.com/blog/comfyui-workflow-guide/)
- [Fix ComfyUI Workflow Loading Errors 2025](https://apatero.com/blog/comfyui-workflow-not-loading-8-common-errors-2025)
- [Where to Get ComfyUI Workflows](https://medium.com/@promptingpixels/where-to-get-comfyui-workflows-1602a4921535)
- [Comfy Workflows](https://comfyworkflows.com/)
- [OpenArt ComfyUI Workflows](https://openart.ai/workflows/home)
- [Scaling ComfyUI Workflows for High-Throughput Generative Media](https://simplismart.ai/blog/scaling-comfyui-workflows-for-high-throughput-generative-media)

---

**End of Report**
