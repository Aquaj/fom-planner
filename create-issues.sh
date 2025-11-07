#!/bin/bash

# FoM-Planner Issue Creation Script
# This script creates all planned issues in GitHub

echo "Creating Phase 1 issues..."

# Issue #1
gh issue create \
  --title "🐛 Remove debugger statement in magnetism.ts" \
  --label "bug,priority:critical,phase:1" \
  --body "## Description
Critical bug: There's a \`debugger;\` statement on line 52 of \`magnetism.ts\` that pauses execution during tile snapping.

## Location
\`magnetism.ts:52\`

## Action
Remove the debugger statement

## Phase
Phase 1: Cleanup & Best Practices"

# Issue #2
gh issue create \
  --title "🐛 Fix undefined Grid.onScroll() call" \
  --label "bug,priority:high,phase:1" \
  --body "## Description
\`drawer.ts\` calls \`grid.onScroll()\` but the Grid class doesn't have this method.

## Location
\`drawer.ts\`

## Action
Either implement the method or remove the call

## Phase
Phase 1: Cleanup & Best Practices"

# Issue #3
gh issue create \
  --title "♻️ Refactor magnetism system" \
  --label "refactor,priority:high,phase:1" \
  --body "## Description
Current magnetism implementation is acknowledged as 'spaghetti code' in TODO comments. Needs architectural cleanup.

## Current Issues
- Complex state management with Map
- Tight coupling between magnetism logic and tile/stage
- Unclear separation of concerns
- Hard to extend or modify

## Suggested Approach
- Extract magnetism into a proper service/manager class
- Clear interface for snappable objects
- Decouple from CreateJS specifics where possible
- Add proper TypeScript types (remove \`any\`)
- Document the snapping algorithm

## Phase
Phase 1: Cleanup & Best Practices"

# Issue #4
gh issue create \
  --title "📝 Improve TypeScript type safety" \
  --label "enhancement,typescript,phase:1" \
  --body "## Description
Replace \`any\` types throughout the codebase with proper types and interfaces.

## Tasks
- [ ] Define interfaces for all major entities (Tile, Grid, TileSlot, etc.)
- [ ] Type the magnetism Map properly
- [ ] Add types for callback functions
- [ ] Remove all \`any\` types
- [ ] Enable stricter TypeScript compiler options
- [ ] Add JSDoc comments for public APIs

## Benefits
- Better IDE support
- Catch errors at compile time
- Self-documenting code

## Phase
Phase 1: Cleanup & Best Practices"

# Issue #5
gh issue create \
  --title "🏗️ Improve project structure" \
  --label "enhancement,architecture,phase:1" \
  --body "## Description
Organize codebase into a more maintainable structure following best practices.

## Suggested Structure
\`\`\`
src/
├── core/           # Core rendering & scene management
├── components/     # UI components (Grid, Viewport, Drawer)
├── entities/       # Game entities (Tile, TileSlot, TileTemplate)
├── systems/        # Systems (Magnetism, Collision, etc.)
├── services/       # Services (SaveLoad, AssetLoader)
├── types/          # TypeScript interfaces & types
├── utils/          # Utility functions
├── config/         # Configuration files
└── assets/         # Static assets
\`\`\`

## Tasks
- [ ] Create directory structure
- [ ] Move files to appropriate directories
- [ ] Update import paths
- [ ] Add barrel exports (index.ts files)
- [ ] Update build configuration

## Phase
Phase 1: Cleanup & Best Practices"

# Issue #6
gh issue create \
  --title "🛡️ Add error handling" \
  --label "enhancement,reliability,phase:1" \
  --body "## Description
Add proper error handling throughout the application.

## Tasks
- [ ] Handle missing/failed asset loads gracefully
- [ ] Add try-catch blocks for critical operations
- [ ] Implement error boundaries for rendering
- [ ] Add validation for user inputs
- [ ] Log errors appropriately
- [ ] Show user-friendly error messages

## Examples
- Image loading failures
- Invalid tile placements
- Save/load errors

## Phase
Phase 1: Cleanup & Best Practices"

# Issue #7
gh issue create \
  --title "🧪 Set up testing infrastructure" \
  --label "enhancement,testing,phase:1" \
  --body "## Description
Add testing framework and initial tests for core functionality.

## Tasks
- [ ] Choose and configure test framework (Jest/Vitest recommended for Bun)
- [ ] Add test scripts to package.json
- [ ] Create test directory structure
- [ ] Add unit tests for utility functions
- [ ] Add integration tests for core systems
- [ ] Set up CI/CD for running tests
- [ ] Add code coverage reporting

## Phase
Phase 1: Cleanup & Best Practices"

# Issue #8
gh issue create \
  --title "📚 Add documentation" \
  --label "documentation,phase:1" \
  --body "## Description
Document the codebase and architecture.

## Tasks
- [ ] Add README with architecture overview
- [ ] Document all public APIs with JSDoc
- [ ] Create CONTRIBUTING.md
- [ ] Add inline comments for complex logic
- [ ] Create architecture diagrams
- [ ] Document build/development process

## Phase
Phase 1: Cleanup & Best Practices"

echo "Creating Phase 2 issues..."

# Issue #9
gh issue create \
  --title "🗑️ Implement tile removal system" \
  --label "feature,priority:high,phase:2" \
  --body "## Description
Add ability to remove/delete placed tiles (from TODO list).

## Tasks
- [ ] Add delete/remove method to Tile
- [ ] Implement eraser tool
- [ ] Add keyboard shortcut (Delete/Backspace)
- [ ] Add right-click delete option
- [ ] Handle cleanup (demagnetize, remove from stage)
- [ ] Add visual feedback for delete action

## Acceptance Criteria
- User can select and delete individual tiles
- User can use eraser tool to delete by clicking
- Deleted tiles are properly cleaned up from all systems

## Phase
Phase 2: Feature Scaffolding"

# Issue #10
gh issue create \
  --title "💥 Implement collision detection system" \
  --label "feature,priority:high,phase:2" \
  --body "## Description
Prevent tiles from overlapping (from TODO list).

## Tasks
- [ ] Create CollisionSystem service
- [ ] Implement bounding box collision detection
- [ ] Check collisions before allowing tile placement
- [ ] Visual feedback for invalid placements (red tint/outline)
- [ ] Handle collision checks during drag
- [ ] Optimize with spatial partitioning if needed

## Acceptance Criteria
- Tiles cannot be placed on occupied slots
- Clear visual feedback for collision state
- Performance remains smooth with many tiles

## Phase
Phase 2: Feature Scaffolding"

# Issue #11
gh issue create \
  --title "↩️ Implement undo/redo system" \
  --label "feature,priority:high,phase:2" \
  --body "## Description
Add undo/redo functionality for all user actions.

## Tasks
- [ ] Create HistoryService with command pattern
- [ ] Define commands for: place tile, remove tile, move tile
- [ ] Implement undo/redo stacks
- [ ] Add keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- [ ] Add UI buttons for undo/redo
- [ ] Show undo/redo availability state
- [ ] Set reasonable history limit

## Technical Approach
Use Command pattern for all reversible actions. Maintain undo and redo stacks. Each command has \`execute()\` and \`undo()\` methods.

## Phase
Phase 2: Feature Scaffolding"

# Issue #12
gh issue create \
  --title "🛠️ Implement tool system" \
  --label "feature,architecture,phase:2" \
  --body "## Description
Create a unified tool system for different interaction modes.

## Tools to Implement
- Select tool (default)
- Place tool
- Eraser tool
- Pan tool
- Fill tool (future)

## Tasks
- [ ] Create Tool base class/interface
- [ ] Implement ToolManager service
- [ ] Create individual tool implementations
- [ ] Add tool switching UI
- [ ] Add keyboard shortcuts
- [ ] Show active tool cursor
- [ ] Handle tool-specific mouse events

## Phase
Phase 2: Feature Scaffolding"

# Issue #13
gh issue create \
  --title "💾 Implement save/load system" \
  --label "feature,priority:high,phase:2" \
  --body "## Description
Add ability to save and load farm layouts.

## Tasks
- [ ] Create SaveLoadService
- [ ] Define save format (JSON)
- [ ] Implement serialization of farm state
- [ ] Implement deserialization
- [ ] Add localStorage persistence
- [ ] Add URL-based sharing
- [ ] Add save/load UI
- [ ] Handle versioning for backward compatibility

## Phase
Phase 2: Feature Scaffolding"

# Issue #14
gh issue create \
  --title "🎨 Implement asset loading system" \
  --label "feature,architecture,phase:2" \
  --body "## Description
Create a robust system for loading and managing sprites/assets.

## Tasks
- [ ] Create AssetLoader service
- [ ] Implement asset manifest/registry
- [ ] Add preloading with progress
- [ ] Add sprite caching
- [ ] Handle missing assets gracefully
- [ ] Support multiple asset formats
- [ ] Add loading screen/progress bar

## Phase
Phase 2: Feature Scaffolding"

# Issue #15
gh issue create \
  --title "🏛️ Create item/building type system (generic)" \
  --label "feature,architecture,phase:2" \
  --body "## Description
Create a flexible, data-driven system for defining placeable items (game-agnostic).

## Tasks
- [ ] Define ItemType/BuildingType interfaces
- [ ] Create ItemRegistry/BuildingRegistry
- [ ] Support properties: size, collision, sprite, metadata
- [ ] Support categories/tags
- [ ] Support rotation
- [ ] Load from JSON configuration
- [ ] Support custom properties per item

## Phase
Phase 2: Feature Scaffolding"

# Issue #16
gh issue create \
  --title "📐 Implement rotation system" \
  --label "feature,phase:2" \
  --body "## Description
Allow rotating tiles/buildings before and after placement.

## Tasks
- [ ] Add rotation property to Tile
- [ ] Implement rotation during placement (R key)
- [ ] Implement rotation of placed tiles (right-click)
- [ ] Update collision detection for rotated tiles
- [ ] Update rendering for rotated sprites
- [ ] Visual indicator for rotation angle

## Phase
Phase 2: Feature Scaffolding"

# Issue #17
gh issue create \
  --title "🎯 Implement range overlay system" \
  --label "feature,phase:2" \
  --body "## Description
Visual overlays for showing area-of-effect (sprinklers, scarecrows, etc.).

## Tasks
- [ ] Create RangeOverlaySystem
- [ ] Support different shapes (circle, square, custom)
- [ ] Toggle visibility of overlays
- [ ] Color-code different overlay types
- [ ] Show overlays on hover
- [ ] Show all overlays with toggle button

## Phase
Phase 2: Feature Scaffolding"

# Issue #18
gh issue create \
  --title "🔍 Implement selection system" \
  --label "feature,phase:2" \
  --body "## Description
Select single or multiple tiles for bulk operations.

## Tasks
- [ ] Create SelectionManager
- [ ] Single selection (click)
- [ ] Multi-selection (Shift+click or drag box)
- [ ] Visual selection indicator
- [ ] Select all (Ctrl+A)
- [ ] Deselect all (Escape)
- [ ] Bulk operations on selection

## Phase
Phase 2: Feature Scaffolding"

# Issue #19
gh issue create \
  --title "📋 Implement copy/paste system" \
  --label "feature,phase:2" \
  --body "## Description
Copy and paste tiles or groups of tiles.

## Tasks
- [ ] Copy selected tile(s) (Ctrl+C)
- [ ] Cut selected tile(s) (Ctrl+X)
- [ ] Paste clipboard (Ctrl+V)
- [ ] Duplicate with modifier (Ctrl+drag)
- [ ] Store clipboard state
- [ ] Visual feedback during paste

## Phase
Phase 2: Feature Scaffolding"

# Issue #20
gh issue create \
  --title "🔎 Add zoom controls" \
  --label "feature,ui,phase:2" \
  --body "## Description
Allow zooming in/out of the farm view.

## Tasks
- [ ] Implement zoom with mouse wheel
- [ ] Add zoom buttons (+/-)
- [ ] Add keyboard shortcuts
- [ ] Zoom centered on mouse position
- [ ] Add zoom limits
- [ ] Reset zoom (Ctrl+0)

## Phase
Phase 2: Feature Scaffolding"

# Issue #21
gh issue create \
  --title "🗺️ Add minimap" \
  --label "feature,ui,phase:2" \
  --body "## Description
Small overview map showing entire farm layout.

## Tasks
- [ ] Create Minimap component
- [ ] Render simplified view of entire farm
- [ ] Show viewport indicator
- [ ] Click minimap to jump to location
- [ ] Toggle minimap visibility

## Phase
Phase 2: Feature Scaffolding"

# Issue #22
gh issue create \
  --title "🔠 Add keyboard shortcuts system" \
  --label "feature,ui,phase:2" \
  --body "## Description
Comprehensive keyboard shortcut system.

## Tasks
- [ ] Create KeyboardShortcutManager
- [ ] Define all shortcuts
- [ ] Handle key combinations
- [ ] Show shortcuts in UI
- [ ] Prevent conflicts

## Phase
Phase 2: Feature Scaffolding"

# Issue #23
gh issue create \
  --title "📦 Implement export system" \
  --label "feature,phase:2" \
  --body "## Description
Export farm layout as image or data file.

## Tasks
- [ ] Export as PNG image
- [ ] Export as JSON data
- [ ] Export with/without grid
- [ ] Export current view or entire farm
- [ ] Copy to clipboard
- [ ] Download file

## Phase
Phase 2: Feature Scaffolding"

# Issue #24
gh issue create \
  --title "✅ Add validation system" \
  --label "feature,phase:2" \
  --body "## Description
Validate farm layouts for common issues.

## Tasks
- [ ] Check for unreachable tiles
- [ ] Check for invalid placements
- [ ] Warn about efficiency issues
- [ ] Show validation errors in UI

## Phase
Phase 2: Feature Scaffolding"

echo "Creating Phase 3 issues..."

# Issue #25
gh issue create \
  --title "🎮 Create Fields of Mistria configuration system" \
  --label "feature,game-content,phase:3" \
  --body "## Description
Configuration-driven system for FoM-specific content (no hardcoding).

## Tasks
- [ ] Create JSON schema for items/buildings
- [ ] Define all FoM building types in config
- [ ] Define all FoM crop types in config
- [ ] Define all FoM decoration types in config
- [ ] Define all FoM utility items in config
- [ ] Load configurations at startup
- [ ] Validate configuration files

## Phase
Phase 3: FoM-Specific Content"

# Issue #26
gh issue create \
  --title "🖼️ Create FoM asset pipeline" \
  --label "assets,game-content,phase:3" \
  --body "## Description
Gather, organize, and prepare all FoM sprites and assets.

## Tasks
- [ ] Extract/create building sprites
- [ ] Extract/create crop sprites
- [ ] Extract/create decoration sprites
- [ ] Extract/create terrain tiles
- [ ] Create sprite atlases
- [ ] Organize asset directory structure
- [ ] Document asset requirements/formats

## Phase
Phase 3: FoM-Specific Content"

# Issue #27
gh issue create \
  --title "🗺️ Add FoM farm maps" \
  --label "feature,game-content,phase:3" \
  --body "## Description
Support different farm layouts from Fields of Mistria.

## Tasks
- [ ] Research available farm types in FoM
- [ ] Create map configurations for each type
- [ ] Create map background images
- [ ] Define valid/invalid placement zones per map
- [ ] Add map selector UI

## Phase
Phase 3: FoM-Specific Content"

# Issue #28
gh issue create \
  --title "🌱 Add FoM-specific features" \
  --label "feature,game-content,phase:3" \
  --body "## Description
Features unique to Fields of Mistria gameplay.

## Tasks
- [ ] Research FoM-specific mechanics
- [ ] Seasonal crop indicators
- [ ] Town NPC buildings/locations
- [ ] Mining/dungeon entrance
- [ ] Festival areas
- [ ] Quest-specific items

## Phase
Phase 3: FoM-Specific Content"

# Issue #29
gh issue create \
  --title "📊 Add statistics panel" \
  --label "feature,ui,phase:3" \
  --body "## Description
Show statistics about the current farm layout.

## Tasks
- [ ] Count buildings by type
- [ ] Calculate estimated costs
- [ ] Calculate crop yields
- [ ] Show space utilization
- [ ] Export statistics

## Phase
Phase 3: FoM-Specific Content"

# Issue #30
gh issue create \
  --title "🔍 Add search/filter in palette" \
  --label "feature,ui,phase:3" \
  --body "## Description
Search and filter items in the tile palette.

## Tasks
- [ ] Add search input
- [ ] Filter by category
- [ ] Filter by name/description
- [ ] Show filtered results

## Phase
Phase 3: FoM-Specific Content"

# Issue #31
gh issue create \
  --title "🎨 Add theme system" \
  --label "enhancement,ui,phase:3" \
  --body "## Description
Support different visual themes (light/dark mode).

## Tasks
- [ ] Create theme system
- [ ] Define light theme colors
- [ ] Define dark theme colors
- [ ] Add theme switcher
- [ ] Persist theme preference

## Phase
Phase 3: FoM-Specific Content"

echo "Done! Created 31 issues across 3 phases."
