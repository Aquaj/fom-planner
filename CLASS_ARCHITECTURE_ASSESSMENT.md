# Class Architecture Assessment

## Executive Summary

**Overall Assessment**: 🟡 **Needs Refactoring**

The current class architecture has several **significant design issues** that will hinder Phase 2 and Phase 3 development. While the code works for the current prototype, the mixing of concerns, tight coupling to CreateJS, and lack of data/view separation will make it difficult to:

- Implement save/load functionality
- Add undo/redo
- Write tests
- Add collision detection
- Support different building types dynamically

**Recommendation**: Refactor to a **Model-View architecture** before proceeding with Phase 2 features.

---

## Critical Issues Identified

### 🔴 Issue #1: Mixed Responsibilities (SRP Violation)

**Problem**: Classes mix domain logic, rendering, and event handling.

#### **Tile.ts** - Does Too Much

```typescript
class Tile {
  // Domain data
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;

  // View/Rendering
  rootElement: createjs.Shape;

  // Controller/Events
  onDragCallbacks: (() => void)[];
  onDropCallbacks: (() => void)[];
  handleDrag(event) { ... }
  handleDrop(event) { ... }
}
```

**What's wrong**:
- **Domain Entity** (position, size, color)
- **View Component** (creates/manages CreateJS.Shape)
- **Event Handler** (drag/drop logic)

**Why it matters**:
- Can't save state without saving CreateJS objects (impossible)
- Can't test logic without creating canvas elements
- Can't swap rendering engine
- Violates Single Responsibility Principle

**Analogy**: It's like a Person class that also knows how to draw itself on a canvas and handle mouse clicks. A person should just BE a person.

---

### 🔴 Issue #2: Tight Coupling to CreateJS

**Problem**: All entities directly depend on CreateJS primitives.

```typescript
// Every entity creates CreateJS objects
this.rootElement = new createjs.Shape();
this.rootElement = new createjs.Container();
```

**Why it matters**:
- Can't unit test without mocking CreateJS
- Can't serialize/deserialize entities
- Can't switch rendering engines
- Makes dependency injection impossible

**Example of the problem**:
```typescript
// Try to save a tile
const savedTile = JSON.stringify(tile);
// ❌ Error: Can't serialize CreateJS objects!
```

---

### 🔴 Issue #3: No Data Model

**Problem**: No clear separation between data and presentation.

**What's missing**:
```typescript
// Should exist but doesn't:
interface TileData {
  id: string;
  type: string;  // "barn", "coop", etc.
  x: number;
  y: number;
  rotation: number;
  metadata: Record<string, any>;
}
```

**Current approach**:
- Data is embedded in view classes
- Can't save/load layouts
- Can't implement undo/redo
- Can't sync state across systems

**Why it matters for Phase 2**:
- Save/load requires serializable data (#13)
- Undo/redo requires state snapshots (#11)
- Collision detection needs efficient data queries (#10)

---

### 🟡 Issue #4: Inheritance Misuse

**Problem**: TileTemplate extends Tile, but they're different concepts.

```typescript
class TileTemplate extends Tile {
  // A template IS-NOT-A tile
  // A template CREATES tiles
}
```

**Why it's wrong**:
- **IS-A vs HAS-A**: Template is not a type of Tile
- **Liskov Substitution**: Can't use TileTemplate everywhere Tile is expected
- **Conceptual confusion**: Templates and instances are different

**Better approach**: Composition over inheritance
```typescript
class TileTemplate {
  private templateData: TileData;  // HAS-A tile definition

  createTile(): Tile {
    return new Tile(this.templateData);
  }
}
```

---

### 🟡 Issue #5: TileSlot Type Inconsistency

**Problem**: TileSlot claims to be a Shape but is actually a Container.

```typescript
class TileSlot {
  rootElement: createjs.Shape;  // ❌ Says Shape
  // But in constructor:
  this.rootElement = new createjs.Container();  // ✅ Actually Container
}
```

**Why it matters**:
- TypeScript can't catch errors
- Misleading for developers
- Runtime bugs possible

**Also unused features**:
```typescript
selected: boolean;  // Never used
hovered: boolean;   // Never used
selectCallbacks: (() => void)[];  // Never used
```

---

### 🟡 Issue #6: Fragile State Management

**Problem**: TileTemplate uses flags to track state.

```typescript
class TileTemplate {
  active: boolean = false;  // State flag
  newTile: Tile | null = null;  // Holds reference during drag

  handleDrag(event) {
    if (this.active) { ... }  // Fragile!
    this.active = true;
  }

  handleDrop(event) {
    this.active = false;  // Easy to forget
    this.newTile = null;
  }
}
```

**Why it's fragile**:
- State flags can get out of sync
- No state machine or clear transitions
- Memory leaks if cleanup is missed
- Hard to debug state issues

---

### 🟡 Issue #7: Event Handling Issues

**Problem**: Callback arrays with unclear contracts.

```typescript
onDragCallbacks: (() => void)[];  // What should callbacks return?

// In usage:
const hasCallbackSet = !!callback(event);  // Boolean? Void?
```

**Issues**:
- Type says `() => void` but expects boolean
- No clear event contract
- Callbacks can't be removed
- No priority or ordering
- Hard to trace event flow

---

## Class-by-Class Analysis

### Tile.ts

**Current Responsibilities**:
1. ✅ Store position, size, color (Domain)
2. ❌ Create and manage CreateJS.Shape (View)
3. ❌ Handle drag/drop events (Controller)
4. ❌ Manage event callbacks (Event bus)

**Grade**: 🔴 **D** - Too many responsibilities

**Issues**:
- Violates Single Responsibility Principle
- Tightly coupled to CreateJS
- Can't serialize
- Hard to test

**Unused Method**:
- `defaultLook()` - Never called except in TileTemplate

---

### TileSlot.ts

**Current Responsibilities**:
1. ✅ Mark a grid position (Domain)
2. ❌ Render border visual (View)
3. ⚠️ Act as Container for tiles (Hybrid role)

**Grade**: 🟡 **C** - Confusing dual role

**Issues**:
- Type inconsistency (says Shape, is Container)
- Unused properties (selected, hovered, selectCallbacks)
- Mixes placeholder and container concepts
- Global defaultStyle is anti-pattern

**Questions**:
- Is it a position marker or a container?
- Why does it render if it's just infrastructure?
- Should tiles be children of slots, or positioned over them?

---

### TileTemplate.ts

**Current Responsibilities**:
1. ✅ Create new Tile instances (Factory)
2. ❌ Extend Tile unnecessarily (Inheritance misuse)
3. ❌ Manage active state (State management)

**Grade**: 🟡 **C+** - Wrong pattern choice

**Issues**:
- Should use composition, not inheritance
- Fragile state management with flags
- Doesn't call `onTileCreatedCallbacks` in constructor like Tile does

**Better approach**:
- Don't extend Tile
- Use factory pattern cleanly
- No state flags

---

### Grid.ts

**Current Responsibilities**:
1. ✅ Create grid layout (Domain)
2. ✅ Manage TileSlots (Composition)
3. ❌ Render background and borders (View)
4. ⚠️ Act as pannable container (Hybrid)

**Grade**: 🟡 **B-** - Mostly good, some mixing

**Issues**:
- Mixes data (slots) with rendering (background, borders)
- Constructor has complex type for backgroundImage (HTMLImageElement | null cast to any)
- `x`, `y` properties added late (not in original design)

**Strengths**:
- Good composition (creates and manages slots)
- Clear interface (rows, cols, slots)
- Implements proper interfaces

---

### Drawer.ts

**Current Responsibilities**:
1. ✅ Create tile palette UI (Component)
2. ✅ Manage nested Grid (Composition)
3. ✅ Setup scrolling (Integration)

**Grade**: 🟢 **B+** - Well designed

**Strengths**:
- Clear responsibility
- Good composition
- Clean interface

**Minor issues**:
- `scroller` property exists but never used
- Could be more generic (not tile-specific)

---

### Viewport.ts

**Current Responsibilities**:
1. ✅ Clip content to bounds (View wrapper)
2. ✅ Apply masking (Presentation)

**Grade**: 🟢 **A-** - Good design

**Strengths**:
- Single responsibility
- Generic (works with any content)
- Clean interface

**Minor issues**:
- Some implementation in constructor (could be in draw())

---

## Missing Abstractions

### 1. No Item/Building Type System

**What's missing**:
```typescript
interface ItemType {
  id: string;
  name: string;
  category: 'building' | 'decoration' | 'crop';
  width: number;  // in grid cells
  height: number;
  sprite: string;
  rotatable: boolean;
  metadata: Record<string, any>;
}

class ItemTypeRegistry {
  private items = new Map<string, ItemType>();

  register(item: ItemType): void { ... }
  get(id: string): ItemType | undefined { ... }
}
```

**Why it matters**:
- Can't dynamically load buildings from config
- Hard-coded tile creation in app.ts
- No way to define FoM-specific items

---

### 2. No Separation of Model and View

**What's missing**:
```typescript
// MODEL - Pure data
class TileModel {
  id: string;
  typeId: string;  // References ItemType
  x: number;
  y: number;
  rotation: number;

  toJSON(): object { ... }
  static fromJSON(json): TileModel { ... }
}

// VIEW - Rendering
class TileView {
  constructor(
    private model: TileModel,
    private itemType: ItemType
  ) { ... }

  render(stage: createjs.Stage): void { ... }
  update(): void { ... }
}
```

**Benefits**:
- Can save/load (serialize models)
- Can implement undo/redo (model snapshots)
- Can test logic without graphics
- Can swap rendering engines

---

### 3. No Event Bus / Mediator

**What's missing**:
```typescript
class EventBus {
  private listeners = new Map<string, Function[]>();

  on(event: string, handler: Function): void { ... }
  off(event: string, handler: Function): void { ... }
  emit(event: string, data: any): void { ... }
}

// Usage:
eventBus.on('tile:placed', (tile) => {
  collisionSystem.check(tile);
  historyService.record(new PlaceTileCommand(tile));
  saveService.markDirty();
});
```

**Benefits**:
- Decoupled components
- Easy to add new features
- Clear event flow
- Easier debugging

---

## Recommended Architecture

### Option A: Model-View-Controller (MVC)

```
┌─────────────┐
│    Model    │  Pure data, business logic
│  (TileData) │  Serializable, testable
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    View     │  Rendering only
│  (TileView) │  CreateJS integration
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  Event handling, coordination
│ (TileCtrl)  │  Connects model ↔ view
└─────────────┘
```

**Pros**:
- Clear separation of concerns
- Easy to test each layer
- Can serialize models
- Can swap views

**Cons**:
- More files/classes
- More boilerplate
- Learning curve

---

### Option B: Entity-Component-System (ECS)

```
Entity (ID)
  ├─ PositionComponent { x, y }
  ├─ SizeComponent { width, height }
  ├─ RenderComponent { sprite, color }
  └─ DraggableComponent { }

Systems:
  - RenderSystem (draws all RenderComponents)
  - DragSystem (handles all DraggableComponents)
  - CollisionSystem (checks all PositionComponents)
```

**Pros**:
- Very flexible
- Great for complex games
- Data-oriented design
- High performance

**Cons**:
- More complex architecture
- Steeper learning curve
- Might be overkill

---

### Option C: Hybrid (Recommended)

Keep current architecture but separate data from views:

```typescript
// 1. Pure data models
interface TileData {
  id: string;
  typeId: string;
  x: number;
  y: number;
  rotation: number;
}

// 2. Keep current classes but make them views
class Tile {
  constructor(
    private data: TileData,
    private itemType: ItemType
  ) {
    this.rootElement = new createjs.Shape();
    this.renderFromData();
  }

  private renderFromData() {
    // Create graphics from this.data and this.itemType
  }

  getData(): TileData {
    return { ...this.data };
  }

  setPosition(x: number, y: number) {
    this.data.x = x;
    this.data.y = y;
    this.renderFromData();
  }
}

// 3. Add services layer
class GameState {
  tiles: TileData[] = [];

  addTile(data: TileData) { ... }
  removeTile(id: string) { ... }
  toJSON() { ... }
  static fromJSON(json) { ... }
}
```

**Pros**:
- Minimal disruption to current code
- Gets us data separation
- Enables save/load, undo/redo
- Easier migration path

**Cons**:
- Still some coupling to CreateJS
- Not as clean as full MVC

---

## Specific Recommendations

### 1. Extract Data Models (Priority: HIGH)

**Before**:
```typescript
class Tile {
  x: number;
  y: number;
  rootElement: createjs.Shape;
  // Mixed together
}
```

**After**:
```typescript
// Pure data
interface TileData {
  id: string;
  typeId: string;
  x: number;
  y: number;
  rotation: number;
}

// View that uses data
class Tile {
  private rootElement: createjs.Shape;

  constructor(private data: TileData) {
    this.rootElement = new createjs.Shape();
    this.render();
  }

  getData(): TileData {
    return { ...this.data };
  }

  updateData(partial: Partial<TileData>) {
    this.data = { ...this.data, ...partial };
    this.render();
  }

  private render() {
    // Render from this.data
  }
}
```

---

### 2. Fix TileSlot Confusion (Priority: MEDIUM)

**Option A**: Make it pure data
```typescript
// Just a position reference
interface SlotPosition {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
}
```

**Option B**: Make it a proper container
```typescript
class TileSlot {
  id: string;
  position: { x: number, y: number };
  container: createjs.Container;
  occupiedBy: Tile | null = null;

  isOccupied(): boolean {
    return this.occupiedBy !== null;
  }

  placeTile(tile: Tile): void { ... }
  removeTile(): void { ... }
}
```

---

### 3. Replace TileTemplate Inheritance (Priority: MEDIUM)

**Before**:
```typescript
class TileTemplate extends Tile { ... }
```

**After**:
```typescript
class TileFactory {
  constructor(private templateData: Partial<TileData>) {}

  create(): Tile {
    const data: TileData = {
      id: generateId(),
      ...this.templateData
    };
    return new Tile(data);
  }
}

// Or even simpler:
class TileTemplate {
  constructor(private itemType: ItemType) {}

  createTile(x: number, y: number): Tile {
    const data: TileData = {
      id: generateId(),
      typeId: this.itemType.id,
      x, y,
      rotation: 0
    };
    return new Tile(data, this.itemType);
  }
}
```

---

### 4. Add ItemType System (Priority: HIGH for Phase 3)

```typescript
// config/items/buildings.json
{
  "buildings": [
    {
      "id": "barn_basic",
      "name": "Basic Barn",
      "category": "buildings",
      "width": 4,
      "height": 3,
      "sprite": "assets/buildings/barn.png",
      "rotatable": true,
      "cost": 1000
    }
  ]
}

// Code
class ItemTypeRegistry {
  private items = new Map<string, ItemType>();

  async loadFromConfig(path: string) {
    const config = await fetch(path).then(r => r.json());
    config.buildings.forEach(item => this.register(item));
  }

  register(item: ItemType) {
    this.items.set(item.id, item);
  }

  get(id: string): ItemType | undefined {
    return this.items.get(id);
  }
}
```

---

### 5. Improve Event System (Priority: MEDIUM)

**Option A**: Proper event bus
```typescript
class EventBus {
  private listeners = new Map<string, Set<Function>>();

  on(event: string, handler: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off(event: string, handler: Function): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, data?: any): void {
    this.listeners.get(event)?.forEach(handler => handler(data));
  }
}
```

**Option B**: Keep callbacks but fix types
```typescript
type DragHandler = (event: createjs.Event) => boolean | void;
type DropHandler = (event: createjs.Event) => void;

class Tile {
  private dragHandlers: DragHandler[] = [];
  private dropHandlers: DropHandler[] = [];

  onDrag(handler: DragHandler): () => void {
    this.dragHandlers.push(handler);
    return () => {
      const index = this.dragHandlers.indexOf(handler);
      if (index > -1) this.dragHandlers.splice(index, 1);
    };
  }
}
```

---

## Migration Strategy

### Phase 1: Data Extraction (1-2 days)

1. Create data interfaces
2. Add data properties to existing classes
3. Add getData() methods
4. Test that nothing breaks

### Phase 2: Refactor Tile (2-3 days)

1. Make Tile accept TileData in constructor
2. Add ItemType support
3. Update all Tile creation sites
4. Test thoroughly

### Phase 3: Fix TileTemplate (1 day)

1. Remove extends Tile
2. Convert to factory or factory method
3. Update usage in app.ts

### Phase 4: Add GameState (2 days)

1. Create GameState class
2. Track all tiles as data
3. Add serialization
4. Test save/load

### Phase 5: Systems Integration (2-3 days)

1. Update magnetism to work with data
2. Update collision to work with data
3. Update undo/redo to work with data

**Total estimated time**: 1-2 weeks

---

## Testing Impact

### Current Architecture

```typescript
// Hard to test
describe('Tile', () => {
  it('should drag', () => {
    // ❌ Need to mock CreateJS
    // ❌ Need canvas element
    // ❌ Can't test in Node.js
    const tile = new Tile(0, 0, 32, 32);
    // ???
  });
});
```

### With Refactoring

```typescript
// Easy to test
describe('TileData', () => {
  it('should serialize', () => {
    // ✅ Pure data, easy to test
    const data: TileData = {
      id: '1',
      typeId: 'barn',
      x: 10,
      y: 20,
      rotation: 0
    };
    const json = JSON.stringify(data);
    const restored = JSON.parse(json);
    expect(restored).toEqual(data);
  });
});

describe('CollisionSystem', () => {
  it('should detect overlaps', () => {
    // ✅ No graphics needed
    const tile1: TileData = { id: '1', x: 0, y: 0, ... };
    const tile2: TileData = { id: '2', x: 1, y: 1, ... };
    expect(collisionSystem.overlaps(tile1, tile2)).toBe(true);
  });
});
```

---

## Comparison: Current vs Recommended

### Current Architecture

```
Tile (Entity + View + Controller)
  ├─ x, y (data)
  ├─ rootElement (view)
  ├─ handleDrag (controller)
  └─ onDragCallbacks (events)

Problems:
❌ Can't save/load
❌ Can't test
❌ Hard to extend
❌ Tight coupling
```

### Recommended Architecture

```
TileData (Model)
  ├─ id
  ├─ typeId
  ├─ x, y
  └─ rotation

ItemType (Definition)
  ├─ id
  ├─ sprite
  ├─ width, height
  └─ metadata

Tile (View)
  ├─ data: TileData
  ├─ itemType: ItemType
  └─ rootElement (view only)

GameState (State Management)
  ├─ tiles: TileData[]
  ├─ addTile()
  ├─ removeTile()
  └─ toJSON()

Benefits:
✅ Can save/load
✅ Can test
✅ Easy to extend
✅ Loose coupling
```

---

## Conclusion

### Current Architecture Grade: 🟡 C+

**Strengths**:
- ✅ Works for current features
- ✅ Some good separation (systems, components)
- ✅ TypeScript types mostly good

**Critical Issues**:
- 🔴 Mixed responsibilities (SRP violations)
- 🔴 No data/view separation
- 🔴 Tight coupling to CreateJS
- 🔴 Can't serialize (blocks save/load)
- 🟡 Inheritance misuse
- 🟡 Fragile state management

### Recommendation: **Refactor Before Phase 2**

**Why**:
1. Phase 2 features (save/load, undo/redo) **require** data separation
2. Easier to refactor now than later
3. Will make Phase 2 development faster
4. Establishes patterns for Phase 3

**Priority Order**:
1. **Critical**: Extract data models (enables save/load)
2. **High**: Add ItemType system (enables dynamic content)
3. **Medium**: Fix TileTemplate inheritance
4. **Medium**: Improve event system
5. **Low**: Full MVC (can defer)

**Estimated Effort**: 1-2 weeks

**ROI**: Very high - unlocks all Phase 2 features

---

## Next Steps

### Option 1: Refactor Now (Recommended)
- Spend 1-2 weeks on architecture improvements
- Then Phase 2 features will be much easier
- Follows "do it right" philosophy

### Option 2: Hybrid Approach
- Extract just TileData (2-3 days)
- Build save/load on top
- Refactor other parts incrementally

### Option 3: Continue As-Is
- Build Phase 2 features with current architecture
- Will hit roadblocks on save/load and undo/redo
- Tech debt will compound

**My strong recommendation**: Option 1 or Option 2.

The current architecture works for a prototype, but needs refactoring for a production application. The time invested now will pay dividends throughout Phase 2 and 3.
