# Asset & Output Organization Solutions

*Addresses Problems: #5 Output Organization, #6 Multi-Drive Storage, #9 Metadata Loss*

---

## Current Pain Points Summary

### From User Research
- Flat output folder with thousands of files
- Generic names like `ComfyUI_0001_.png`
- No project-based organization
- No date-based sorting by default
- Can't find specific outputs
- No connection between output and workflow that created it
- Multi-drive storage requires YAML editing
- No UI for path configuration

### User Quotes
> "Output folder becomes unusable after a week."
> "Spending hours searching for specific generations."
> "Symbolic links break when ComfyUI updates."

---

## Proposed Solution: Smart Asset System

### 1. Intelligent Output Organization

#### Auto-Organization Structure
```
output/
├── 2024-12-16/                    # Date-based
│   ├── portraits/                  # Project-based
│   │   ├── portrait_001.png
│   │   └── portrait_002.png
│   └── landscapes/
│       └── sunset_001.png
├── 2024-12-15/
│   └── ...
└── unsorted/                       # Fallback
    └── ComfyUI_0001_.png
```

#### Organization Rules Engine
```
+------------------------------------------+
|  Output Organization Rules               |
+------------------------------------------+
|  Rule 1: Organize by Date                |
|  Pattern: {year}-{month}-{day}/          |
|  [x] Enabled                             |
|                                          |
|  Rule 2: Organize by Project             |
|  Pattern: {project}/                     |
|  [x] Enabled                             |
|                                          |
|  Rule 3: Smart Filename                  |
|  Pattern: {workflow}_{seed}_{index}.png  |
|  [x] Enabled                             |
|                                          |
|  [+ Add Rule]                            |
|                                          |
|  Preview: 2024-12-16/portraits/          |
|           portrait_12345_001.png         |
+------------------------------------------+
```

#### Available Placeholders
| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{date}` | 2024-12-16 | Full date |
| `{year}` | 2024 | Year |
| `{month}` | 12 | Month |
| `{day}` | 16 | Day |
| `{time}` | 14-30-22 | Time |
| `{workflow}` | portrait | Workflow name |
| `{project}` | client_work | Project name |
| `{seed}` | 123456 | Generation seed |
| `{model}` | sdxl_base | Checkpoint name |
| `{sampler}` | dpmpp_2m | Sampler used |
| `{index}` | 001 | Auto-increment |
| `{prompt}` | a_girl... | First 20 chars |

### 2. Output Gallery

#### Gallery UI
```
+------------------------------------------+
|  Gallery  [Filter v] [Sort v] [=][#]     |
+------------------------------------------+
|  [Search...] [Date Range: This Week v]   |
+------------------------------------------+
|  FOLDERS              |  IMAGES          |
|  ----------------     |  +----+ +----+   |
|  > All Outputs        |  |    | |    |   |
|  > Today (24)         |  |img | |img |   |
|  > This Week (156)    |  |    | |    |   |
|  > This Month (892)   |  +----+ +----+   |
|  ----------------     |  +----+ +----+   |
|  > portraits (234)    |  |    | |    |   |
|  > landscapes (89)    |  |img | |img |   |
|  > experiments (567)  |  |    | |    |   |
|  ----------------     |  +----+ +----+   |
|  > Favorites          |                  |
|  > Trash (12)         |                  |
+------------------------------------------+
```

#### Image Card (on hover)
```
+------------------+
|                  |
|   Image Preview  |
|                  |
+------------------+
| 2024-12-16 14:30 |
| Seed: 123456     |
| [Workflow] [Del] |
+------------------+
```

#### Image Detail View
```
+------------------------------------------+
|  [<]  Image Viewer  [>]                  |
+------------------------------------------+
|                                          |
|           [Full Image]                   |
|                                          |
+------------------------------------------+
|  METADATA             |  ACTIONS         |
|  Workflow: portrait   |  [Open Workflow] |
|  Generated: 2:30 PM   |  [Regenerate]    |
|  Size: 1024x1024      |  [Upscale]       |
|  Seed: 123456789      |  [Send to...]    |
|  Steps: 30            |  [Delete]        |
|  CFG: 7.5             |  [Favorite]      |
|  Sampler: DPM++ 2M    |                  |
|  Model: SDXL Base     |                  |
|  LoRAs: anime_v2      |                  |
+------------------------------------------+
|  Prompt: A beautiful portrait of...      |
|  Negative: ugly, blurry, ...             |
+------------------------------------------+
```

### 3. Workflow-Output Linking

#### Automatic Linking
```typescript
interface OutputMetadata {
  id: string;
  filename: string;
  path: string;
  created: Date;

  // Link to workflow
  workflowId: string;
  workflowName: string;
  workflowVersion: number;

  // Generation parameters
  seed: number;
  steps: number;
  cfg: number;
  sampler: string;
  prompt: string;
  negativePrompt: string;

  // Models used
  checkpoint: string;
  loras: string[];
  vae?: string;

  // Image info
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'webp';

  // User data
  favorite: boolean;
  tags: string[];
  notes?: string;
}
```

#### Quick Actions from Output
- **Open Workflow**: Load exact workflow version
- **Regenerate**: Run with same parameters
- **Vary Seed**: Run with new seed
- **Upscale**: Send to upscaler
- **Send to Input**: Use as input for another workflow

### 4. Multi-Location Storage

#### Storage Configuration UI
```
+------------------------------------------+
|  Storage Locations                       |
+------------------------------------------+
|  Models                                  |
|  +---------------------------------------+
|  | /Users/me/ComfyUI/models  [Primary]  |
|  | /Volumes/External/models  [Secondary]|
|  | [+ Add Location]                     |
|  +---------------------------------------+
|                                          |
|  Outputs                                 |
|  +---------------------------------------+
|  | /Users/me/ComfyUI/output  [Primary]  |
|  | [+ Add Location]                     |
|  +---------------------------------------+
|                                          |
|  Inputs                                  |
|  +---------------------------------------+
|  | /Users/me/ComfyUI/input   [Primary]  |
|  | [+ Add Location]                     |
|  +---------------------------------------+
|                                          |
|  [Validate Paths] [Import from A1111]    |
+------------------------------------------+
```

#### Path Validation
```
+------------------------------------------+
|  Path Validation Results                 |
+------------------------------------------+
|  ✓ /Users/me/ComfyUI/models              |
|    Status: Accessible                    |
|    Models found: 234                     |
|                                          |
|  ⚠ /Volumes/External/models              |
|    Status: Drive not mounted             |
|    [Mount Drive] [Remove] [Ignore]       |
|                                          |
|  ✗ /invalid/path/models                  |
|    Status: Path does not exist           |
|    [Create Directory] [Remove]           |
+------------------------------------------+
```

### 5. Input Asset Management

#### Input Browser
```
+------------------------------------------+
|  Inputs  [Upload] [Organize]             |
+------------------------------------------+
|  CATEGORIES           |  ASSETS          |
|  ----------------     |  +----+ +----+   |
|  > All Inputs         |  |    | |    |   |
|  > Reference Images   |  |img | |img |   |
|  > Masks              |  |    | |    |   |
|  > ControlNet         |  +----+ +----+   |
|    > Poses            |                  |
|    > Depth Maps       |                  |
|    > Canny Edges      |                  |
|  > Textures           |                  |
+------------------------------------------+
```

#### Drag-Drop Upload
- Drag image to input browser: Auto-categorize
- Drag to workflow: Create Load Image node
- Drag to canvas: Place as reference

### 6. Metadata Preservation

#### Embedded Metadata (PNG)
```
PNG Chunks:
- tEXt: prompt
- tEXt: negative_prompt
- tEXt: parameters (A1111 compatible)
- tEXt: workflow (ComfyUI JSON)
- tEXt: vibe_metadata (our extended format)
```

#### Sidecar Files Option
```
output/
├── image_001.png
├── image_001.json          # Full metadata
└── image_001.workflow.json # Workflow snapshot
```

#### Civitai-Compatible Export
```
Parameters: masterpiece, best quality, 1girl, portrait
Negative prompt: ugly, blurry, bad anatomy
Steps: 30, Sampler: DPM++ 2M Karras, CFG scale: 7.5
Seed: 123456789, Size: 1024x1024
Model: realisticVisionV51_v51VAE
Lora: anime_style_v2 (0.7)
```

---

## Technical Implementation

### Database Schema

```sql
CREATE TABLE outputs (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at DATETIME NOT NULL,

  -- Workflow link
  workflow_id TEXT,
  workflow_name TEXT,
  workflow_version INTEGER,

  -- Generation params
  seed INTEGER,
  steps INTEGER,
  cfg REAL,
  sampler TEXT,
  prompt TEXT,
  negative_prompt TEXT,

  -- Models
  checkpoint TEXT,
  loras TEXT,  -- JSON array
  vae TEXT,

  -- Image
  width INTEGER,
  height INTEGER,
  format TEXT,
  file_size INTEGER,

  -- User data
  favorite BOOLEAN DEFAULT FALSE,
  tags TEXT,  -- JSON array
  notes TEXT,
  deleted_at DATETIME
);

CREATE INDEX idx_outputs_date ON outputs(created_at);
CREATE INDEX idx_outputs_workflow ON outputs(workflow_id);
CREATE INDEX idx_outputs_favorite ON outputs(favorite);
```

### File Watcher

```typescript
class OutputWatcher {
  private watcher: FSWatcher;

  watch(outputPaths: string[]) {
    this.watcher = chokidar.watch(outputPaths, {
      ignoreInitial: false,
      awaitWriteFinish: true
    });

    this.watcher.on('add', (path) => {
      this.processNewOutput(path);
    });
  }

  private async processNewOutput(path: string) {
    // 1. Extract metadata from image
    const metadata = await this.extractMetadata(path);

    // 2. Link to current workflow
    metadata.workflowId = currentWorkflow.id;

    // 3. Apply organization rules
    const newPath = this.applyOrganizationRules(path, metadata);

    // 4. Move file if needed
    if (newPath !== path) {
      await this.moveFile(path, newPath);
    }

    // 5. Index in database
    await this.indexOutput(metadata);

    // 6. Update gallery
    this.emitNewOutput(metadata);
  }
}
```

### Storage Manager

```typescript
class StorageManager {
  private locations: StorageLocation[] = [];

  addLocation(path: string, type: 'models' | 'outputs' | 'inputs') {
    // Validate path exists
    if (!fs.existsSync(path)) {
      throw new Error(`Path does not exist: ${path}`);
    }

    // Check write permissions
    if (!this.hasWriteAccess(path)) {
      throw new Error(`No write access to: ${path}`);
    }

    this.locations.push({ path, type, priority: this.locations.length });
    this.saveConfig();
  }

  getLocationsForType(type: string): string[] {
    return this.locations
      .filter(l => l.type === type)
      .sort((a, b) => a.priority - b.priority)
      .map(l => l.path);
  }

  findModel(filename: string): string | null {
    for (const location of this.getLocationsForType('models')) {
      const fullPath = path.join(location, filename);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    return null;
  }
}
```

---

## UI/UX Specifications

### Gallery Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Arrow keys | Navigate images |
| Enter | Open detail view |
| F | Toggle favorite |
| Delete | Move to trash |
| Ctrl+C | Copy image |
| O | Open workflow |
| R | Regenerate |

### Drag-Drop Behaviors
| From | To | Action |
|------|-----|--------|
| Gallery image | Canvas | Create Load Image node |
| Gallery image | Folder | Move image |
| External image | Input browser | Import |
| External image | Canvas | Create Load Image + import |

### Context Menu (Right-click on image)
```
+----------------------+
| Open Workflow        |
| Regenerate           |
| Vary Seed            |
| Send to Upscaler     |
+----------------------+
| Copy                 |
| Copy Path            |
| Open in Finder       |
+----------------------+
| Add to Favorites     |
| Add Tags...          |
| Add Notes...         |
+----------------------+
| Move to...           |
| Delete               |
+----------------------+
```

---

## Migration Path

### Existing Outputs
1. Scan existing output folder
2. Extract metadata from PNG chunks
3. Index in database
4. Optionally reorganize (with user consent)

### Import from Other Apps
- Detect A1111 outputs
- Parse A1111 metadata format
- Convert to our format
- Preserve original files

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Time to find output | Minutes | Seconds |
| Storage configuration | YAML editing | UI clicks |
| Workflow recovery from output | Manual | One click |
| Output organization | Manual | Automatic |
