# FoM-Planner Development Plan

## Overview

This document provides a high-level summary of the development roadmap for FoM-Planner.

## Development Philosophy

The project will be built in **3 phases** with a clear separation of concerns:

1. **Phase 1: Cleanup & Best Practices** - Fix critical bugs and establish solid foundations
2. **Phase 2: Feature Scaffolding** - Build game-agnostic systems and architecture
3. **Phase 3: FoM-Specific Content** - Add Fields of Mistria content **dynamically through configuration**

### Key Principle: Configuration-Driven Content

All game-specific content (buildings, crops, items) will be loaded from **JSON configuration files**, not hardcoded. This makes the planner:
- Easier to maintain
- Extensible to other games
- Easy to update when FoM adds new content
- Moddable by the community

## Phase Breakdown

### Phase 1: Cleanup & Best Practices (8 issues)

**Goal**: Clean up technical debt and establish best practices

**Priority Issues**:
- 🐛 Remove debugger statement (CRITICAL)
- 🐛 Fix undefined Grid.onScroll() call
- ♻️ Refactor magnetism system
- 📝 Improve TypeScript type safety
- 🏗️ Improve project structure

**Why This Matters**:
- Fix blocking bugs before building on top of them
- Proper architecture makes Phase 2 easier
- Type safety catches bugs early
- Clean code = faster development

**Estimated Time**: 1-2 weeks

---

### Phase 2: Feature Scaffolding (16 issues)

**Goal**: Build robust, game-agnostic systems

**Core Systems** (Priority: High):
- 🗑️ Tile removal
- 💥 Collision detection
- ↩️ Undo/redo
- 🛠️ Tool system (select, erase, place, etc.)
- 💾 Save/load
- 🎨 Asset loading
- 🏛️ Generic item/building type system

**Enhancement Systems** (Priority: Medium):
- 📐 Rotation
- 🎯 Range overlays
- 🔍 Selection (multi-select)
- 📋 Copy/paste
- 🔎 Zoom controls
- 🗺️ Minimap
- 🔠 Keyboard shortcuts
- 📦 Export

**Polish** (Priority: Low):
- ✅ Validation system

**Why This Order**:
1. Start with core gameplay (removal, collision, undo)
2. Add essential UI (tools, save/load)
3. Build infrastructure (asset loading, item types)
4. Enhance UX (rotation, overlays, selection)
5. Add convenience features (copy/paste, zoom, etc.)

**Key Principle**: Everything in Phase 2 should be **game-agnostic**. No hardcoding of FoM-specific items!

**Estimated Time**: 4-6 weeks

---

### Phase 3: FoM-Specific Content (7 issues)

**Goal**: Make it a Fields of Mistria planner through configuration

**Content Implementation**:
- 🎮 Configuration system for FoM items
- 🖼️ FoM asset pipeline
- 🗺️ FoM farm maps
- 🌱 FoM-specific features

**User Experience**:
- 📊 Statistics panel
- 🔍 Search/filter in palette
- 🎨 Theme system

**How Content Works**:

Instead of hardcoding:
```typescript
// ❌ BAD - Hardcoded
const barn = new Building("Barn", 4, 3, "barn.png");
```

Use configuration:
```typescript
// ✅ GOOD - Configuration-driven
// config/buildings.json
{
  "buildings": [
    {
      "id": "barn_basic",
      "name": "Basic Barn",
      "width": 4,
      "height": 3,
      "sprite": "buildings/barn_basic.png",
      "category": "animal_housing"
    }
  ]
}
```

**Benefits**:
- Easy to add new items (just edit JSON)
- Community can create mods/extensions
- Can support multiple games with different configs
- No code changes needed for content updates

**Estimated Time**: 2-4 weeks (depends on asset availability)

---

## Total Timeline

**Estimated Total**: 7-12 weeks (depending on scope and availability)

- Phase 1: 1-2 weeks
- Phase 2: 4-6 weeks
- Phase 3: 2-4 weeks

## How to Create Issues

Two options:

### Option 1: Use the script
```bash
./create-issues.sh
```

This will create all 31 issues in your GitHub repository.

### Option 2: Manual creation
Refer to `ROADMAP.md` for detailed issue descriptions and create them manually in GitHub.

## Recommended Labels

Create these labels in your GitHub repository:

**Priority**:
- `priority:critical` - Must fix immediately
- `priority:high` - Important for core functionality
- `priority:medium` - Nice to have
- `priority:low` - Future enhancement

**Type**:
- `bug` - Something broken
- `feature` - New functionality
- `enhancement` - Improvement to existing feature
- `refactor` - Code cleanup
- `documentation` - Docs
- `testing` - Tests

**Phase**:
- `phase:1` - Cleanup & Best Practices
- `phase:2` - Feature Scaffolding
- `phase:3` - FoM-Specific Content

**Category**:
- `architecture` - System design
- `ui` - User interface
- `game-content` - Game-specific content
- `assets` - Graphics and assets
- `typescript` - TypeScript improvements

## Project Structure (Post Phase 1)

```
fom-planner/
├── src/
│   ├── core/              # Core rendering & scene management
│   ├── components/        # UI components (Grid, Viewport, Drawer)
│   ├── entities/          # Game entities (Tile, TileSlot, etc.)
│   ├── systems/           # Game systems (Magnetism, Collision, etc.)
│   ├── services/          # App services (SaveLoad, AssetLoader, etc.)
│   ├── types/             # TypeScript interfaces & types
│   ├── utils/             # Utility functions
│   └── index.ts           # Entry point
├── config/                # Game configuration (JSON files)
│   ├── buildings.json
│   ├── crops.json
│   ├── decorations.json
│   └── maps.json
├── assets/                # Game assets
│   ├── sprites/
│   │   ├── buildings/
│   │   ├── crops/
│   │   └── decorations/
│   └── maps/
├── tests/                 # Test files
├── docs/                  # Documentation
├── ROADMAP.md            # Detailed roadmap (this was just created)
├── PLANNING.md           # This file
└── create-issues.sh      # Script to create GitHub issues
```

## Development Workflow

1. **Start with Phase 1**
   - Fix critical bugs first
   - Refactor magnetism
   - Improve types and structure

2. **Build Phase 2 iteratively**
   - Implement one feature at a time
   - Test thoroughly
   - Document as you go

3. **Add FoM content in Phase 3**
   - Gather/create assets
   - Write configuration files
   - Test with real FoM data

4. **Continuous improvement**
   - Gather user feedback
   - Fix bugs as they're found
   - Add features based on demand

## Success Metrics

**Phase 1 Complete** when:
- ✅ No critical bugs
- ✅ Clean, well-organized codebase
- ✅ Strong TypeScript typing
- ✅ Test infrastructure in place

**Phase 2 Complete** when:
- ✅ Can place, move, rotate, and remove items
- ✅ Undo/redo works
- ✅ Can save and load layouts
- ✅ All tools implemented
- ✅ Generic item system works

**Phase 3 Complete** when:
- ✅ All FoM buildings/items available
- ✅ All FoM maps supported
- ✅ FoM-specific features work
- ✅ Looks and feels like a FoM planner

## Next Steps

1. **Create GitHub Issues**
   - Run `./create-issues.sh` OR
   - Manually create issues from ROADMAP.md

2. **Set up GitHub Project Board** (optional)
   - Create columns: Backlog, In Progress, In Review, Done
   - Organize issues by phase
   - Track progress

3. **Start with Phase 1, Issue #1**
   - Fix the debugger statement
   - Then move to Issue #2
   - Continue sequentially

4. **Commit to the branch**
   - All work goes to: `claude/analyze-remaining-tasks-011CUuE8qi2x9DWd9rZbEoHp`
   - Push regularly

Good luck! 🚀
