# FoM-Planner Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Layer Architecture](#layer-architecture)
4. [Component Breakdown](#component-breakdown)
5. [Data Flow](#data-flow)
6. [Design Patterns](#design-patterns)
7. [Technology Stack](#technology-stack)
8. [Strengths](#strengths)
9. [Areas for Improvement](#areas-for-improvement)
10. [Future Recommendations](#future-recommendations)

---

## Overview

**FoM-Planner** is a web-based farm layout planning tool for Fields of Mistria, built with TypeScript and CreateJS for 2D canvas rendering. The application allows users to drag-and-drop farm items onto a grid, with automatic snapping to grid slots.

### Core Functionality
- **Grid-based Layout**: 54×124 grid representing the farm map
- **Drag & Drop**: Interactive tile placement with magnetic snapping
- **Tile Palette**: Scrollable drawer with tile templates
- **Viewport Management**: Pannable map view with proper clipping
- **Real-time Rendering**: CreateJS-powered canvas rendering at 40 FPS

---

## Directory Structure

```
fom-planner/
├── src/
│   ├── core/              # Application bootstrapping
│   │   └── app.ts         # Main application entry point
│   ├── components/        # UI Components
│   │   ├── Grid.ts        # Farm grid layout
│   │   ├── Drawer.ts      # Tile palette panel
│   │   ├── Viewport.ts    # Viewport with clipping
│   │   └── index.ts       # Barrel exports
│   ├── entities/          # Game Entities
│   │   ├── Tile.ts        # Draggable tile
│   │   ├── TileSlot.ts    # Grid cell
│   │   ├── TileTemplate.ts# Tile factory/stamp
│   │   └── index.ts       # Barrel exports
│   ├── systems/           # Game Systems
│   │   ├── MagnetismSystem.ts  # Snapping behavior
│   │   ├── Pannable.ts    # Pan/drag viewport
│   │   ├── Scrollable.ts  # Mouse wheel scrolling
│   │   └── index.ts       # Barrel exports
│   ├── types/             # TypeScript Definitions
│   │   └── index.ts       # Common interfaces
│   └── config/            # Configuration
│       └── index.ts       # App configuration
├── assets/                # Static assets
│   ├── layout.png         # Farm background image
│   └── layout.webp
├── index.ts               # Server entry point
├── home.html              # HTML template
├── package.json
├── tsconfig.json
├── ROADMAP.md            # Development roadmap
├── PLANNING.md           # High-level plan
└── PHASE1_SUMMARY.md     # Phase 1 completion summary
```

### Rationale for Structure

**src/core/** - Application initialization and bootstrapping
- Keeps entry point logic separate from components
- Future: Could house Stage management, Game loop, etc.

**src/components/** - Reusable UI components
- Self-contained visual elements
- Implement Renderable interface
- Can be composed together

**src/entities/** - Game domain objects
- Represent "things" in the game world
- Contain state and behavior
- Independent of UI concerns

**src/systems/** - Cross-cutting concerns
- Manage behavior across entities
- Stateless utilities or singleton services
- Examples: magnetism, panning, scrolling

**src/types/** - Shared type definitions
- Central source of truth for interfaces
- Prevents circular dependencies
- Improves IDE support

---

## Layer Architecture

The application follows a **layered architecture**:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│      (HTML, Canvas Rendering)       │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│       Application Layer (Core)       │
│    (app.ts - orchestration)         │
└────┬──────────────────────┬─────────┘
     │                      │
┌────▼──────┐         ┌────▼──────────┐
│Components │         │   Systems     │
│(UI Logic) │◄────────┤(Behaviors)    │
└────┬──────┘         └───────────────┘
     │
┌────▼──────┐
│ Entities  │
│(Domain)   │
└───────────┘
     │
┌────▼──────┐
│  Types    │
│(Contracts)│
└───────────┘
```

### Layer Responsibilities

**Presentation** (HTML/Canvas)
- Renders visual output
- Captures user input
- Delegates to Application layer

**Application** (Core)
- Orchestrates components and systems
- Initializes the application
- Manages global state (stage, config)

**Components** (UI Logic)
- Self-contained visual elements
- Manage their own rendering
- Expose clean interfaces

**Systems** (Behaviors)
- Cross-cutting concerns (magnetism, panning)
- Stateless utilities or services
- Operate on entities

**Entities** (Domain)
- Core game objects (Tiles, TileSlots)
- Encapsulate state and behavior
- Independent of rendering

**Types** (Contracts)
- Interface definitions
- Type safety
- Documentation

---

## Component Breakdown

### Core Layer

#### **app.ts**
**Purpose**: Application entry point and orchestration

**Responsibilities**:
- Initialize CreateJS stage
- Create and register components (Grid, Drawer, Viewport)
- Set up game loop (Ticker)
- Handle tile template instantiation
- Manage global references (stage, map, tiles)

**Key Functions**:
- `register()` - Add components to stage with Z-indexing
- `sizeUp()` - Configure canvas dimensions

**Dependencies**: Everything (imports from all layers)

**Coupling**: High (orchestrator role)

---

### Components Layer

#### **Grid.ts**
**Purpose**: Represents the farm grid layout

**Implements**: `Renderable`, `Dimensional`, `Pannable`

**Key Properties**:
- `rows`, `cols` - Grid dimensions (54×124)
- `slots` - Array of TileSlot instances
- `backgroundImage` - Farm layout image
- `width`, `height` - Pixel dimensions

**Key Methods**:
- `draw()` - Renders grid, background, and slots
- `corners()` - Returns slot positions
- `setPosition()` - Move grid container

**Responsibilities**:
- Create grid of TileSlots
- Render grid borders
- Display background image
- Track all slots for magnetism

**Dependencies**: TileSlot, types

**Notes**:
- Creates 6,696 slots (54 rows × 124 cols)
- Caches background image for performance

---

#### **Drawer.ts**
**Purpose**: Side panel with tile palette

**Implements**: `Renderable`, `Dimensional`, `Container`

**Key Properties**:
- `grid` - Nested Grid for tile templates
- `background` - Brown panel background
- `width`, `height` - Panel dimensions

**Key Methods**:
- `draw()` - Renders background and grid
- `addBackground()` - Draws panel background
- `addGrid()` - Adds tile grid
- `setPosition()` - Position drawer on screen

**Responsibilities**:
- Display tile palette
- Enable scrolling of tiles
- Provide interface for tile selection

**Dependencies**: Grid, Scrollable, types

**Notes**:
- Creates a scrollable grid (50 cols × auto rows)
- Height is 2× canvas height for scrolling

---

#### **Viewport.ts**
**Purpose**: Clipped view of content (creates window effect)

**Key Properties**:
- `content` - Content to display (Grid)
- `rootElement` - Container with masking

**Key Methods**:
- `draw()` - Delegates to content's draw()
- Constructor sets up mask and border

**Responsibilities**:
- Clip content to viewport bounds
- Apply visual border
- Prevent content overflow

**Dependencies**: types

**Notes**:
- Uses CreateJS mask for clipping
- Scales content to fit viewport

---

### Entities Layer

#### **Tile.ts**
**Purpose**: Draggable, placeable game object

**Key Properties**:
- `x`, `y` - Position
- `width`, `height` - Dimensions
- `fillColor` - Visual color
- `rootElement` - CreateJS Shape
- `onDragCallbacks`, `onDropCallbacks` - Event handlers

**Key Methods**:
- `draw()` - Caches the shape for performance
- `handleDrag()` - Manages drag behavior
- `handleDrop()` - Handles drop events
- `onDrag()`, `onDrop()` - Register callbacks
- `setPosition()` - Update position

**Responsibilities**:
- Render itself
- Handle drag/drop events
- Notify observers of interactions
- Manage visual state

**Dependencies**: None (CreateJS only)

**Event Flow**:
1. User presses and drags → `handleDrag()` called
2. Callbacks can override position by returning `true`
3. User releases → `handleDrop()` called
4. All drop callbacks executed

---

#### **TileTemplate.ts**
**Purpose**: Factory for creating new Tiles (Stamp pattern)

**Extends**: Tile

**Key Methods**:
- `handleDrag()` - Creates new Tile instead of moving self
- `createNewTile()` - Instantiates Tile with same graphics
- `onTileCreated()` - Register creation callbacks

**Responsibilities**:
- Act as reusable stamp
- Create Tile instances on demand
- Notify observers of new tiles

**Dependencies**: Tile

**Pattern**: **Factory Method** - Creates objects without specifying exact class

**Usage**:
```typescript
const template = new TileTemplate(0, 0, 32, 32, "red");
template.onTileCreated((newTile) => {
  // Register the new tile with systems
  magnetizeTile(newTile, slots, 32, stage);
});
```

---

#### **TileSlot.ts**
**Purpose**: Individual grid cell that can contain tiles

**Key Properties**:
- `id` - Unique identifier ("x_y" format)
- `width`, `height` - Cell dimensions
- `rootElement` - CreateJS Container
- `border` - Visual border

**Key Methods**:
- `draw()` - Renders border with low alpha
- `setPosition()` - Position in grid

**Responsibilities**:
- Represent grid position
- Provide snap target for magnetism
- Contain placed tiles (as parent)

**Dependencies**: None (CreateJS only)

**Notes**:
- Very low alpha (0.1) for subtle appearance
- Can contain multiple children (tiles)

---

### Systems Layer

#### **MagnetismSystem.ts**
**Purpose**: Manages snapping behavior for draggable objects

**Architecture**: Singleton class-based system

**Key Interfaces**:
- `Draggable` - Objects that can snap
- `SnapTarget` - Targets to snap to
- `MagnetismConfig` - Per-draggable configuration
- `Point` - 2D coordinates

**Key Methods**:
- `magnetize()` - Register draggable with targets
- `snapToClosest()` - Find and snap to nearest target
- `getSnappedTarget()` - Get current snap state
- `demagnetize()` - Unregister draggable
- `findClosestSnapTarget()` - Calculate nearest target
- `calculateDistance()` - Euclidean distance

**Responsibilities**:
- Track snappable objects and targets
- Calculate distances during drag
- Determine when to snap/unsnap
- Maintain snap state

**Data Structure**:
```typescript
Map<Draggable, MagnetismConfig>
// Where MagnetismConfig:
{
  snaps: SnapTarget[],      // Available targets
  snappedTo: SnapTarget | null  // Current snap
}
```

**Algorithm**:
1. During drag, check distance to all targets
2. If within `snapDistance`, snap to closest
3. While snapped, allow movement within `unsnapDistance`
4. If exceeds `unsnapDistance`, release snap

**Helper Functions**:
- `magnetizeTile()` - Convenience wrapper for tiles
- `tileSnap()` - Handle reparenting between stage/slot
- `demagnetize()` - Clean up magnetism state

**Dependencies**: types

**Pattern**: **Singleton** service, **Observer** for callbacks

---

#### **Pannable.ts**
**Purpose**: Make containers draggable to pan viewport

**Key Methods**:
- `makePannable()` - Attach pan behavior to container
- `pan()` - Handle pan movement

**Responsibilities**:
- Capture mousedown and calculate original position
- Track mouse movement and update container position
- Calculate delta from original position

**Usage**:
```typescript
pannable.makePannable(map);
// Now user can drag map to pan
```

**Dependencies**: types

**Pattern**: **Decorator** - Adds behavior to objects

---

#### **Scrollable.ts**
**Purpose**: Enable mouse wheel scrolling within bounds

**Key Methods**:
- `makeScrollable()` - Attach scroll behavior
- `scroll()` - Handle wheel events

**Responsibilities**:
- Listen for mouse wheel events
- Clamp scrolling to upper/lower bounds
- Fire scroll callbacks

**Usage**:
```typescript
scrollable.makeScrollable(drawer, drawer.grid, 0, drawerHeight);
// Now wheel scrolls drawer.grid within bounds
```

**Dependencies**: types

**Pattern**: **Decorator** - Adds behavior to objects

---

### Types Layer

#### **types/index.ts**
**Purpose**: Central type definitions

**Key Interfaces**:
- `Renderable` - Has rootElement and draw()
- `Dimensional` - Has width and height
- `Positionable` - Has x, y, setPosition()
- `Pannable` - Can be panned
- `Scrollable` - Can be scrolled
- `Container` - Container element
- `Point` - 2D coordinates
- `Rectangle` - Position + dimensions

**Purpose**:
- Provide contracts for components
- Enable interface-based programming
- Prevent circular dependencies
- Improve type safety

**Usage**: Import types for interface implementations
```typescript
import type { Renderable, Dimensional } from '../types';

class Grid implements Renderable, Dimensional {
  // TypeScript ensures we implement the interface
}
```

---

## Data Flow

### Initialization Flow

```
index.ts (server)
  │
  └─> home.html (loads in browser)
       │
       └─> src/core/app.ts (executes)
            │
            ├─> Creates CreateJS Stage
            ├─> Creates Grid (map)
            ├─> Creates Viewport (mapView)
            ├─> Creates Drawer (palette)
            ├─> Creates TileTemplates (25 stamps)
            │    │
            │    └─> Adds to Drawer slots
            │
            └─> Starts Ticker (game loop)
```

### Tile Creation Flow

```
User drags TileTemplate
  │
  └─> TileTemplate.handleDrag()
       │
       ├─> Creates new Tile
       ├─> Copies graphics
       └─> Fires onTileCreated callbacks
            │
            └─> app.ts callback:
                 ├─> Adds tile to stage
                 ├─> Registers drag/drop handlers (alpha feedback)
                 └─> magnetizeTile(tile, slots, ...)
                      │
                      └─> MagnetismSystem.magnetize()
                           └─> Stores config in Map
```

### Drag & Snap Flow

```
User drags Tile
  │
  ├─> Tile.handleDrag(event)
  │    │
  │    └─> Calls onDrag callbacks
  │         │
  │         └─> MagnetismSystem callback (via magnetizeTile)
  │              │
  │              └─> tileSnap(tile, cursorPos, stage)
  │                   │
  │                   ├─> MagnetismSystem.snapToClosest()
  │                   │    │
  │                   │    ├─> Calculates distances to all slots
  │                   │    ├─> Finds closest within snapDistance
  │                   │    └─> Updates snappedTo state
  │                   │
  │                   └─> If snapped:
  │                        ├─> Reparent tile from stage to slot
  │                        └─> Set position (0, 0) relative to slot
  │                       Else if unsnapped:
  │                        ├─> Reparent tile from slot to stage
  │                        └─> Convert position to stage coords
  │
  └─> CreateJS re-renders canvas
```

### Rendering Flow

```
CreateJS Ticker (40 FPS)
  │
  └─> tick event
       │
       ├─> Updates FPS counter
       └─> stage.update()
            │
            └─> Re-renders all display objects
                 ├─> Viewport
                 │    └─> Grid (map)
                 │         └─> TileSlots + placed Tiles
                 ├─> Drawer
                 │    └─> Grid (palette)
                 │         └─> TileTemplates
                 └─> FPS Label
```

---

## Design Patterns

### Creational Patterns

**1. Singleton**
- **Where**: MagnetismSystem
- **Why**: Single source of truth for snapping state
- **Implementation**: Module-level instance exported

**2. Factory Method**
- **Where**: TileTemplate
- **Why**: Create new Tiles without knowing concrete class
- **Implementation**: `createNewTile()` method

### Structural Patterns

**3. Decorator**
- **Where**: Pannable, Scrollable
- **Why**: Add behavior to objects without subclassing
- **Implementation**: `makePannable()`, `makeScrollable()`

**4. Composite**
- **Where**: CreateJS display list (implicit)
- **Why**: Treat individual objects and compositions uniformly
- **Implementation**: Container hierarchy (stage → viewports → grids → slots → tiles)

### Behavioral Patterns

**5. Observer**
- **Where**: Event callbacks (onDrag, onDrop, onTileCreated)
- **Why**: Notify observers of state changes
- **Implementation**: Callback arrays + event handlers

**6. Command** (Planned)
- **Where**: Future undo/redo system (ROADMAP.md #11)
- **Why**: Encapsulate actions as objects
- **Implementation**: Not yet implemented

---

## Technology Stack

### Core Technologies

**Runtime**: Bun v1.2.8+
- Modern JavaScript runtime
- Fast package management
- Built-in TypeScript support
- Development server

**Language**: TypeScript 5.x
- Static type checking
- Modern ES6+ features
- Interface-based programming

**Graphics**: CreateJS (createjs-module 0.8.3)
- 2D canvas rendering library
- Display list management
- Event handling
- Animation support

### Development

**Build**: None (Bun handles TS compilation)

**Testing**: Not yet configured (ROADMAP.md #7)

**Linting/Formatting**: Not configured

---

## Strengths

### ✅ Strong Architecture

1. **Clear Separation of Concerns**
   - Core, Components, Entities, Systems cleanly separated
   - Each module has single responsibility
   - Low coupling between modules

2. **Type Safety**
   - Strong TypeScript typing throughout
   - Interfaces define contracts
   - Compile-time error catching

3. **Extensible Design**
   - Interface-based programming
   - Easy to add new entity types
   - Systems are decoupled from entities

4. **Well-Documented**
   - Comprehensive JSDoc comments
   - Clear interface definitions
   - ROADMAP and planning docs

### ✅ Good Code Quality

1. **Refactored Magnetism**
   - Clean class-based implementation
   - Well-documented algorithm
   - Proper TypeScript types

2. **Consistent Patterns**
   - Barrel exports for clean imports
   - Standard component structure
   - Uniform error handling approach

3. **Performance Considerations**
   - Sprite caching (`tile.draw()`)
   - Background image caching
   - Efficient distance calculations

---

## Areas for Improvement

### 🔄 Missing Features

1. **No Persistence** (ROADMAP #13)
   - Cannot save/load layouts
   - No URL-based sharing
   - State lost on refresh

2. **No Undo/Redo** (ROADMAP #11)
   - Cannot reverse actions
   - Makes mistakes costly
   - Poor UX for experimentation

3. **No Collision Detection** (ROADMAP #10)
   - Tiles can overlap
   - Invalid placements allowed
   - No validation

4. **No Tile Removal** (ROADMAP #9)
   - Cannot delete placed tiles
   - No way to fix mistakes

### 🔧 Technical Debt

1. **Minimal Error Handling**
   - No try-catch blocks
   - Asset load failures unhandled
   - No user error messages

2. **No Testing**
   - No unit tests
   - No integration tests
   - Manual testing only

3. **Type Safety Gaps**
   - Some `any` types remain (e.g., `backgroundImage as any`)
   - Event types from CreateJS loosely typed

4. **Hard-coded Values**
   - Grid dimensions (54×124) hardcoded in multiple places
   - Magic numbers (snap distances 0.4, 0.5)
   - Should use constants or config

### 📐 Design Issues

1. **Tight Coupling in app.ts**
   - Orchestrator knows about all modules
   - Difficult to test in isolation
   - Could use dependency injection

2. **Mixed Responsibilities**
   - TileSlot is both Entity and UI Component
   - Grid manages both layout and rendering
   - Could separate concerns further

3. **No Service Layer**
   - Systems directly manipulated in app.ts
   - Could use mediator/service layer

---

## Future Recommendations

### Phase 2 Priorities (from ROADMAP.md)

**High Priority**:
1. Implement tile removal (#9)
2. Add collision detection (#10)
3. Implement undo/redo (#11)
4. Create tool system (#12)
5. Implement save/load (#13)

**Medium Priority**:
6. Add asset loading system (#14)
7. Create item/building type system (#15)
8. Implement rotation (#16)

### Architectural Improvements

**1. Extract Configuration**
```typescript
// config/constants.ts
export const GRID = {
  ROWS: 54,
  COLS: 124,
  WIDTH: 3968,
  HEIGHT: 1728
};

export const MAGNETISM = {
  SNAP_RATIO: 0.4,
  UNSNAP_RATIO: 0.5
};
```

**2. Dependency Injection**
```typescript
// Instead of:
const stage = new createjs.Stage("canvas");

// Use:
class App {
  constructor(
    private stage: createjs.Stage,
    private config: Config
  ) {}
}
```

**3. Service Layer**
```typescript
// services/GameService.ts
export class GameService {
  constructor(
    private magnetism: MagnetismSystem,
    private collisions: CollisionSystem,
    private history: HistoryService
  ) {}

  placeTile(tile: Tile, slot: TileSlot) {
    if (this.collisions.isOccupied(slot)) {
      throw new Error("Slot occupied");
    }

    this.magnetism.snapTo(tile, slot);
    this.history.record(new PlaceTileCommand(tile, slot));
  }
}
```

**4. Event Bus**
```typescript
// core/EventBus.ts
export class EventBus {
  on(event: string, handler: Function) {}
  emit(event: string, data: any) {}
}

// Usage:
eventBus.on('tile:placed', (tile) => {
  // Update UI, save state, etc.
});
```

**5. State Management**
```typescript
// state/GameState.ts
export class GameState {
  tiles: Tile[] = [];
  selectedTool: Tool = Tools.SELECT;

  addTile(tile: Tile) {
    this.tiles.push(tile);
    this.notify('tiles:changed');
  }
}
```

### Testing Strategy

**Unit Tests**:
```typescript
describe('MagnetismSystem', () => {
  it('should snap when within snap distance', () => {
    const system = new MagnetismSystem();
    const tile = createMockTile();
    const slot = createMockSlot();

    const didSnap = system.snapToClosest(tile, {
      x: slot.x + 5,  // Within snap distance
      y: slot.y + 5
    });

    expect(didSnap).toBe(true);
  });
});
```

**Integration Tests**:
```typescript
describe('Tile Placement', () => {
  it('should place tile on grid and snap', () => {
    const app = new App(mockStage, mockConfig);
    const tile = new Tile(0, 0, 32, 32);

    app.placeTile(tile, { x: 100, y: 100 });

    expect(tile.rootElement.parent).toBe(grid.slots[3][3]);
  });
});
```

---

## Conclusion

The FoM-Planner architecture is **solid and well-structured** after Phase 1 cleanup. The codebase demonstrates:

✅ Clear separation of concerns
✅ Strong TypeScript typing
✅ Extensible design
✅ Good documentation

The main gaps are **missing features** (undo, save/load, collision) and **technical debt** (testing, error handling) which are planned for Phase 2.

The architecture is **ready for Phase 2** feature development. The modular design will make adding new features straightforward.

**Overall Grade**: B+ (Excellent foundation, needs feature completion)

---

## Quick Reference

### Adding a New Component
1. Create file in `src/components/ComponentName.ts`
2. Implement `Renderable`, `Dimensional` interfaces
3. Add to `src/components/index.ts`
4. Import in `app.ts` and register

### Adding a New System
1. Create file in `src/systems/SystemName.ts`
2. Define clear interface/API
3. Export from `src/systems/index.ts`
4. Use in components as needed

### Adding a New Entity
1. Create file in `src/entities/EntityName.ts`
2. Define properties and methods
3. Export from `src/entities/index.ts`
4. Instantiate in app or factory

### Adding a New Type
1. Add interface to `src/types/index.ts`
2. Export type
3. Import where needed: `import type { TypeName } from '../types'`
