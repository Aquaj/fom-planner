# Tests

This directory contains comprehensive tests for the FoM Planner application.

## Running Tests

```bash
# Run all tests
bun test

# Watch mode (re-run on file changes)
bun test --watch

# With coverage report
bun test --coverage

# Run specific test file
bun test tests/services/GameState.test.ts
```

## Test Structure

### Unit Tests

#### `services/GameState.test.ts`
Tests the core game state management:
- Adding, removing, and updating tiles
- Serialization to/from JSON
- State cloning for undo/redo
- Edge cases and error handling

#### `services/ItemTypeRegistry.test.ts`
Tests the item type registry:
- Registering item types
- Retrieving by ID and category
- Loading from JSON configuration
- Handling duplicates and missing items

#### `entities/Tile.test.ts`
Tests individual tile instances:
- Construction with data and item type
- Data management (get, update, position)
- Event callback registration
- Cleanup and destruction

#### `entities/TileTemplate.test.ts`
Tests the factory pattern for tile creation:
- Template construction
- Creating tiles with unique IDs
- Callback system for tile creation events
- Item type association

### Integration Tests

#### `integration/planner.test.ts`
Tests complete workflows:
- **Full Tile Placement Workflow**: Register types → Create templates → Place tiles → Update state
- **Save and Load**: Complete save/load cycle with multiple tile types
- **Undo/Redo**: State snapshots and restoration
- **Dynamic Content Loading**: Loading item types from JSON
- **Multi-Tile Scenarios**: Placing many tiles, mixed types
- **Error Handling**: Graceful handling of edge cases

## What's Tested

### ✅ Data Layer
- GameState serialization/deserialization
- ItemTypeRegistry management
- Data integrity and immutability

### ✅ Entity Layer
- Tile construction and lifecycle
- TileTemplate factory pattern
- Event callback systems

### ✅ Integration
- End-to-end workflows
- Save/load functionality
- Undo/redo capability
- Dynamic content loading
- Multi-tile scenarios

### ❌ Not Yet Tested (Future)
- PixiJS rendering (requires canvas/WebGL mock)
- Drag and drop interactions
- Magnetism/snapping system
- Pannable/Scrollable systems
- UI components (Grid, Drawer, Viewport)

## Coverage Goals

- **Services**: 100% coverage
- **Entities (Data Logic)**: 100% coverage
- **Integration Workflows**: Key scenarios covered

## Adding New Tests

When adding new features:

1. **Unit tests**: Test individual functions/methods in isolation
2. **Integration tests**: Test how components work together
3. **Follow naming convention**: `*.test.ts`
4. **Use descriptive test names**: `should [expected behavior] when [condition]`

Example:
```typescript
import { describe, test, expect } from 'bun:test';

describe('MyFeature', () => {
  test('should do something when condition is met', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## CI/CD

Tests run automatically on:
- Every commit (pre-commit hook - future)
- Pull requests
- Main branch merges

## Debugging Tests

```bash
# Run with verbose output
bun test --verbose

# Run single test
bun test -t "should add a tile"

# Debug with breakpoints (VSCode)
# Add breakpoint in test file, then F5 to debug
```
