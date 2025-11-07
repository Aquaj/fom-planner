# FoM-Planner Development Roadmap

This document outlines all planned work organized into three phases:
1. **Phase 1**: Cleanup & Best Practices
2. **Phase 2**: Feature Scaffolding
3. **Phase 3**: FoM-Specific Content (Dynamic)

---

## Phase 1: Cleanup & Best Practices

### 🐛 #1 - Remove debugger statement in magnetism.ts
**Priority**: Critical
**Labels**: `bug`, `priority:critical`, `phase:1`

**Description**
Critical bug: There's a `debugger;` statement on line 52 of `magnetism.ts` that pauses execution during tile snapping.

**Location**: `magnetism.ts:52`

**Action**: Remove the debugger statement

---

### 🐛 #2 - Fix undefined Grid.onScroll() call
**Priority**: High
**Labels**: `bug`, `priority:high`, `phase:1`

**Description**
`drawer.ts` calls `grid.onScroll()` but the Grid class doesn't have this method.

**Location**: `drawer.ts`

**Action**: Either implement the method or remove the call

---

### ♻️ #3 - Refactor magnetism system
**Priority**: High
**Labels**: `refactor`, `priority:high`, `phase:1`

**Description**
Current magnetism implementation is acknowledged as 'spaghetti code' in TODO comments. Needs architectural cleanup.

**Current Issues**:
- Complex state management with Map
- Tight coupling between magnetism logic and tile/stage
- Unclear separation of concerns
- Hard to extend or modify

**Suggested Approach**:
- Extract magnetism into a proper service/manager class
- Clear interface for snappable objects
- Decouple from CreateJS specifics where possible
- Add proper TypeScript types (remove `any`)
- Document the snapping algorithm

---

### 📝 #4 - Improve TypeScript type safety
**Priority**: Medium
**Labels**: `enhancement`, `typescript`, `phase:1`

**Description**
Replace `any` types throughout the codebase with proper types and interfaces.

**Tasks**:
- [ ] Define interfaces for all major entities (Tile, Grid, TileSlot, etc.)
- [ ] Type the magnetism Map properly
- [ ] Add types for callback functions
- [ ] Remove all `any` types
- [ ] Enable stricter TypeScript compiler options
- [ ] Add JSDoc comments for public APIs

**Benefits**:
- Better IDE support
- Catch errors at compile time
- Self-documenting code

---

### 🏗️ #5 - Improve project structure
**Priority**: Medium
**Labels**: `enhancement`, `architecture`, `phase:1`

**Description**
Organize codebase into a more maintainable structure following best practices.

**Suggested Structure**:
```
src/
├── core/           # Core rendering & scene management
│   ├── stage.ts
│   └── renderer.ts
├── components/     # UI components
│   ├── Grid.ts
│   ├── Viewport.ts
│   └── Drawer.ts
├── entities/       # Game entities
│   ├── Tile.ts
│   ├── TileSlot.ts
│   └── TileTemplate.ts
├── systems/        # Game systems
│   ├── MagnetismSystem.ts
│   ├── CollisionSystem.ts
│   └── SelectionSystem.ts
├── services/       # Application services
│   ├── SaveLoadService.ts
│   ├── AssetLoader.ts
│   └── HistoryService.ts (undo/redo)
├── types/          # TypeScript interfaces & types
│   ├── entities.ts
│   ├── events.ts
│   └── config.ts
├── utils/          # Utility functions
│   ├── math.ts
│   └── geometry.ts
├── config/         # Configuration files
│   ├── items.json
│   └── buildings.json
├── assets/         # Static assets
│   ├── sprites/
│   └── maps/
└── index.ts        # Entry point
```

**Tasks**:
- [ ] Create directory structure
- [ ] Move files to appropriate directories
- [ ] Update import paths
- [ ] Add barrel exports (index.ts files)
- [ ] Update build configuration

---

### 🛡️ #6 - Add error handling
**Priority**: Medium
**Labels**: `enhancement`, `reliability`, `phase:1`

**Description**
Add proper error handling throughout the application.

**Tasks**:
- [ ] Handle missing/failed asset loads gracefully
- [ ] Add try-catch blocks for critical operations
- [ ] Implement error boundaries for rendering
- [ ] Add validation for user inputs
- [ ] Log errors appropriately
- [ ] Show user-friendly error messages

**Examples**:
- Image loading failures
- Invalid tile placements
- Save/load errors
- Network errors (if applicable)

---

### 🧪 #7 - Set up testing infrastructure
**Priority**: Medium
**Labels**: `enhancement`, `testing`, `phase:1`

**Description**
Add testing framework and initial tests for core functionality.

**Tasks**:
- [ ] Choose and configure test framework (Jest/Vitest recommended for Bun)
- [ ] Add test scripts to package.json
- [ ] Create test directory structure
- [ ] Add unit tests for utility functions
- [ ] Add integration tests for core systems
- [ ] Set up CI/CD for running tests
- [ ] Add code coverage reporting

---

### 📚 #8 - Add documentation
**Priority**: Low
**Labels**: `documentation`, `phase:1`

**Description**
Document the codebase and architecture.

**Tasks**:
- [ ] Add README with architecture overview
- [ ] Document all public APIs with JSDoc
- [ ] Create CONTRIBUTING.md
- [ ] Add inline comments for complex logic
- [ ] Create architecture diagrams
- [ ] Document build/development process

---

## Phase 2: Feature Scaffolding

### 🗑️ #9 - Implement tile removal system
**Priority**: High
**Labels**: `feature`, `priority:high`, `phase:2`

**Description**
Add ability to remove/delete placed tiles (from TODO list).

**Tasks**:
- [ ] Add delete/remove method to Tile
- [ ] Implement eraser tool
- [ ] Add keyboard shortcut (Delete/Backspace)
- [ ] Add right-click delete option
- [ ] Handle cleanup (demagnetize, remove from stage)
- [ ] Add visual feedback for delete action

**Acceptance Criteria**:
- User can select and delete individual tiles
- User can use eraser tool to delete by clicking
- Deleted tiles are properly cleaned up from all systems

---

### 💥 #10 - Implement collision detection system
**Priority**: High
**Labels**: `feature`, `priority:high`, `phase:2`

**Description**
Prevent tiles from overlapping (from TODO list).

**Tasks**:
- [ ] Create CollisionSystem service
- [ ] Implement bounding box collision detection
- [ ] Check collisions before allowing tile placement
- [ ] Visual feedback for invalid placements (red tint/outline)
- [ ] Handle collision checks during drag
- [ ] Optimize with spatial partitioning if needed

**Acceptance Criteria**:
- Tiles cannot be placed on occupied slots
- Clear visual feedback for collision state
- Performance remains smooth with many tiles

---

### ↩️ #11 - Implement undo/redo system
**Priority**: High
**Labels**: `feature`, `priority:high`, `phase:2`

**Description**
Add undo/redo functionality for all user actions.

**Tasks**:
- [ ] Create HistoryService with command pattern
- [ ] Define commands for: place tile, remove tile, move tile
- [ ] Implement undo/redo stacks
- [ ] Add keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- [ ] Add UI buttons for undo/redo
- [ ] Show undo/redo availability state
- [ ] Set reasonable history limit

**Technical Approach**:
- Use Command pattern for all reversible actions
- Maintain undo and redo stacks
- Each command has `execute()` and `undo()` methods

---

### 🛠️ #12 - Implement tool system
**Priority**: High
**Labels**: `feature`, `architecture`, `phase:2`

**Description**
Create a unified tool system for different interaction modes.

**Tools to Implement**:
- Select tool (default) - select and move tiles
- Place tool - place new items from palette
- Eraser tool - delete tiles
- Pan tool - move viewport
- Fill tool - fill area with pattern (future)
- Eyedropper tool - copy tile type (future)

**Tasks**:
- [ ] Create Tool base class/interface
- [ ] Implement ToolManager service
- [ ] Create individual tool implementations
- [ ] Add tool switching UI
- [ ] Add keyboard shortcuts (T for tools, 1-9 for specific tools)
- [ ] Show active tool cursor
- [ ] Handle tool-specific mouse events

---

### 💾 #13 - Implement save/load system
**Priority**: High
**Labels**: `feature`, `priority:high`, `phase:2`

**Description**
Add ability to save and load farm layouts.

**Tasks**:
- [ ] Create SaveLoadService
- [ ] Define save format (JSON)
- [ ] Implement serialization of farm state
- [ ] Implement deserialization
- [ ] Add localStorage persistence
- [ ] Add URL-based sharing (encode state in URL)
- [ ] Add save/load UI
- [ ] Handle versioning for backward compatibility

**Save Format**:
```json
{
  "version": "1.0",
  "farmType": "standard",
  "tiles": [
    {
      "type": "barn",
      "x": 10,
      "y": 20,
      "rotation": 0,
      "metadata": {}
    }
  ]
}
```

---

### 🎨 #14 - Implement asset loading system
**Priority**: High
**Labels**: `feature`, `architecture`, `phase:2`

**Description**
Create a robust system for loading and managing sprites/assets.

**Tasks**:
- [ ] Create AssetLoader service
- [ ] Implement asset manifest/registry
- [ ] Add preloading with progress
- [ ] Add sprite caching
- [ ] Handle missing assets gracefully
- [ ] Support multiple asset formats (PNG, SVG, etc.)
- [ ] Add loading screen/progress bar

**Asset Manifest Example**:
```json
{
  "sprites": {
    "barn": {
      "src": "assets/buildings/barn.png",
      "width": 64,
      "height": 96
    }
  }
}
```

---

### 🏛️ #15 - Create item/building type system (generic)
**Priority**: High
**Labels**: `feature`, `architecture`, `phase:2`

**Description**
Create a flexible, data-driven system for defining placeable items (game-agnostic).

**Tasks**:
- [ ] Define ItemType/BuildingType interfaces
- [ ] Create ItemRegistry/BuildingRegistry
- [ ] Support properties: size, collision, sprite, metadata
- [ ] Support categories/tags
- [ ] Support rotation (0°, 90°, 180°, 270°)
- [ ] Load from JSON configuration
- [ ] Support custom properties per item

**ItemType Interface**:
```typescript
interface ItemType {
  id: string;
  name: string;
  category: string;
  sprite: string;
  width: number;  // in grid cells
  height: number; // in grid cells
  rotatable: boolean;
  stackable: boolean;
  metadata: Record<string, any>;
}
```

---

### 📐 #16 - Implement rotation system
**Priority**: Medium
**Labels**: `feature`, `phase:2`

**Description**
Allow rotating tiles/buildings before and after placement.

**Tasks**:
- [ ] Add rotation property to Tile
- [ ] Implement rotation during placement (R key or mouse wheel)
- [ ] Implement rotation of placed tiles (right-click menu)
- [ ] Update collision detection for rotated tiles
- [ ] Update rendering for rotated sprites
- [ ] Visual indicator for rotation angle

---

### 🎯 #17 - Implement range overlay system
**Priority**: Medium
**Labels**: `feature`, `phase:2`

**Description**
Visual overlays for showing area-of-effect (sprinklers, scarecrows, etc.).

**Tasks**:
- [ ] Create RangeOverlaySystem
- [ ] Support different shapes (circle, square, custom)
- [ ] Toggle visibility of overlays
- [ ] Color-code different overlay types
- [ ] Show overlays on hover
- [ ] Show all overlays with toggle button

**Use Cases**:
- Sprinkler coverage
- Scarecrow range
- Building footprint preview

---

### 🔍 #18 - Implement selection system
**Priority**: Medium
**Labels**: `feature`, `phase:2`

**Description**
Select single or multiple tiles for bulk operations.

**Tasks**:
- [ ] Create SelectionManager
- [ ] Single selection (click)
- [ ] Multi-selection (Shift+click or drag box)
- [ ] Visual selection indicator (highlight/outline)
- [ ] Select all (Ctrl+A)
- [ ] Deselect all (Escape)
- [ ] Bulk operations on selection (delete, move, rotate)

---

### 📋 #19 - Implement copy/paste system
**Priority**: Low
**Labels**: `feature`, `phase:2`

**Description**
Copy and paste tiles or groups of tiles.

**Tasks**:
- [ ] Copy selected tile(s) (Ctrl+C)
- [ ] Cut selected tile(s) (Ctrl+X)
- [ ] Paste clipboard (Ctrl+V)
- [ ] Duplicate with modifier (Ctrl+drag)
- [ ] Store clipboard state
- [ ] Visual feedback during paste

---

### 🔎 #20 - Add zoom controls
**Priority**: Medium
**Labels**: `feature`, `ui`, `phase:2`

**Description**
Allow zooming in/out of the farm view.

**Tasks**:
- [ ] Implement zoom with mouse wheel
- [ ] Add zoom buttons (+/-)
- [ ] Add keyboard shortcuts (Ctrl+Plus, Ctrl+Minus)
- [ ] Zoom centered on mouse position
- [ ] Add zoom limits (min/max)
- [ ] Reset zoom (Ctrl+0)
- [ ] Update rendering for different zoom levels

---

### 🗺️ #21 - Add minimap
**Priority**: Low
**Labels**: `feature`, `ui`, `phase:2`

**Description**
Small overview map showing entire farm layout.

**Tasks**:
- [ ] Create Minimap component
- [ ] Render simplified view of entire farm
- [ ] Show viewport indicator
- [ ] Click minimap to jump to location
- [ ] Toggle minimap visibility
- [ ] Position in corner of screen

---

### 🔠 #22 - Add keyboard shortcuts system
**Priority**: Medium
**Labels**: `feature`, `ui`, `phase:2`

**Description**
Comprehensive keyboard shortcut system.

**Tasks**:
- [ ] Create KeyboardShortcutManager
- [ ] Define all shortcuts
- [ ] Handle key combinations (Ctrl, Shift, Alt)
- [ ] Show shortcuts in UI (tooltips, help menu)
- [ ] Allow customization (future)
- [ ] Prevent conflicts

**Common Shortcuts**:
- Delete/Backspace: Remove tile
- Ctrl+Z: Undo
- Ctrl+Shift+Z: Redo
- Ctrl+C/V/X: Copy/paste/cut
- R: Rotate
- Escape: Deselect
- Space: Pan mode
- 1-9: Select tools

---

### 📦 #23 - Implement export system
**Priority**: Medium
**Labels**: `feature`, `phase:2`

**Description**
Export farm layout as image or data file.

**Tasks**:
- [ ] Export as PNG image
- [ ] Export as JSON data
- [ ] Export with/without grid
- [ ] Export current view or entire farm
- [ ] Copy to clipboard
- [ ] Download file

---

### ✅ #24 - Add validation system
**Priority**: Low
**Labels**: `feature`, `phase:2`

**Description**
Validate farm layouts for common issues.

**Tasks**:
- [ ] Check for unreachable tiles
- [ ] Check for invalid placements
- [ ] Warn about efficiency issues
- [ ] Show validation errors in UI
- [ ] Optional strict mode

---

## Phase 3: FoM-Specific Content (Dynamic)

### 🎮 #25 - Create Fields of Mistria configuration system
**Priority**: High
**Labels**: `feature`, `game-content`, `phase:3`

**Description**
Configuration-driven system for FoM-specific content (no hardcoding).

**Tasks**:
- [ ] Create JSON schema for items/buildings
- [ ] Define all FoM building types in config
- [ ] Define all FoM crop types in config
- [ ] Define all FoM decoration types in config
- [ ] Define all FoM utility items in config
- [ ] Load configurations at startup
- [ ] Validate configuration files

**Example**: `config/items/buildings.json`
```json
{
  "buildings": [
    {
      "id": "barn_basic",
      "name": "Basic Barn",
      "category": "buildings",
      "width": 4,
      "height": 3,
      "sprite": "buildings/barn_basic.png",
      "description": "Houses animals",
      "cost": 1000,
      "rotatable": true
    }
  ]
}
```

---

### 🖼️ #26 - Create FoM asset pipeline
**Priority**: High
**Labels**: `assets`, `game-content`, `phase:3`

**Description**
Gather, organize, and prepare all FoM sprites and assets.

**Tasks**:
- [ ] Extract/create building sprites
- [ ] Extract/create crop sprites
- [ ] Extract/create decoration sprites
- [ ] Extract/create terrain tiles (paths, floors)
- [ ] Create sprite atlases for performance
- [ ] Organize asset directory structure
- [ ] Document asset requirements/formats

**Asset Structure**:
```
assets/
├── buildings/
│   ├── barn_basic.png
│   ├── coop.png
│   └── ...
├── crops/
│   ├── wheat.png
│   ├── tomato.png
│   └── ...
├── decorations/
├── terrain/
└── ui/
```

---

### 🗺️ #27 - Add FoM farm maps
**Priority**: High
**Labels**: `feature`, `game-content`, `phase:3`

**Description**
Support different farm layouts from Fields of Mistria.

**Tasks**:
- [ ] Research available farm types in FoM
- [ ] Create map configurations for each type
- [ ] Create map background images
- [ ] Define valid/invalid placement zones per map
- [ ] Add map selector UI
- [ ] Support switching maps (with warning about losing work)

---

### 🌱 #28 - Add FoM-specific features
**Priority**: Medium
**Labels**: `feature`, `game-content`, `phase:3`

**Description**
Features unique to Fields of Mistria gameplay.

**Tasks**:
- [ ] Research FoM-specific mechanics
- [ ] Seasonal crop indicators
- [ ] Town NPC buildings/locations
- [ ] Mining/dungeon entrance
- [ ] Festival areas
- [ ] Quest-specific items
- [ ] Any other FoM-unique features

---

### 📊 #29 - Add statistics panel
**Priority**: Low
**Labels**: `feature`, `ui`, `phase:3`

**Description**
Show statistics about the current farm layout.

**Tasks**:
- [ ] Count buildings by type
- [ ] Calculate estimated costs
- [ ] Calculate crop yields
- [ ] Show space utilization
- [ ] Show efficiency metrics
- [ ] Export statistics

---

### 🔍 #30 - Add search/filter in palette
**Priority**: Low
**Labels**: `feature`, `ui`, `phase:3`

**Description**
Search and filter items in the tile palette.

**Tasks**:
- [ ] Add search input
- [ ] Filter by category
- [ ] Filter by name/description
- [ ] Filter by tags
- [ ] Show filtered results
- [ ] Clear filters

---

### 🎨 #31 - Add theme system
**Priority**: Low
**Labels**: `enhancement`, `ui`, `phase:3`

**Description**
Support different visual themes (light/dark mode).

**Tasks**:
- [ ] Create theme system
- [ ] Define light theme colors
- [ ] Define dark theme colors
- [ ] Add theme switcher
- [ ] Persist theme preference
- [ ] Update all UI components for themes

---

## Summary

**Phase 1**: 8 issues - Foundation cleanup and best practices
**Phase 2**: 16 issues - Core feature scaffolding (game-agnostic)
**Phase 3**: 7 issues - FoM-specific content and polish

**Total**: 31 issues

---

## Next Steps

1. Create these issues in GitHub
2. Add appropriate labels, milestones, and assignees
3. Prioritize Phase 1 issues first
4. Start with critical bugs (#1, #2)
5. Then tackle architectural improvements (#3, #4, #5)
