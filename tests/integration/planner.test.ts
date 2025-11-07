import { describe, test, expect, beforeEach } from 'bun:test';
import { GameState } from '../../src/services/GameState';
import { ItemTypeRegistry } from '../../src/services/ItemTypeRegistry';
import TileTemplate from '../../src/entities/TileTemplate';
import type { ItemType } from '../../src/types';

describe('Farm Planner Integration', () => {
  let gameState: GameState;
  let itemTypeRegistry: ItemTypeRegistry;

  beforeEach(() => {
    gameState = new GameState();
    itemTypeRegistry = new ItemTypeRegistry();
  });

  describe('Complete Workflow', () => {
    test('should support full tile placement workflow', () => {
      // 1. Setup: Register item types
      const wheatType: ItemType = {
        id: 'crop_wheat',
        name: 'Wheat',
        category: 'crops',
        width: 32,
        height: 32,
        sprite: 'wheat.png',
        color: 0xffff00,
        rotatable: false,
        collidable: true,
      };

      itemTypeRegistry.register(wheatType);
      expect(itemTypeRegistry.count).toBe(1);

      // 2. Create template
      const template = new TileTemplate(wheatType, 0, 0);
      expect(template.getItemType()).toEqual(wheatType);

      // 3. Create tiles from template
      const tile1 = template.createTile(100, 100);
      const tile2 = template.createTile(200, 200);

      // 4. Add tiles to game state
      gameState.addTile(tile1.getData());
      gameState.addTile(tile2.getData());

      expect(gameState.getAllTiles()).toHaveLength(2);

      // 5. Move a tile
      const tile1Data = tile1.getData();
      tile1.setPosition(150, 150);
      gameState.updateTile(tile1Data.id, { x: 150, y: 150 });

      const updated = gameState.getTile(tile1Data.id);
      expect(updated?.x).toBe(150);
      expect(updated?.y).toBe(150);

      // 6. Remove a tile
      const tile2Data = tile2.getData();
      gameState.removeTile(tile2Data.id);
      expect(gameState.getAllTiles()).toHaveLength(1);
    });

    test('should support save and load', () => {
      // 1. Register item types
      const items: ItemType[] = [
        {
          id: 'crop_wheat',
          name: 'Wheat',
          category: 'crops',
          width: 32,
          height: 32,
          sprite: 'wheat.png',
          color: 0xffff00,
          rotatable: false,
          collidable: true,
        },
        {
          id: 'building_barn',
          name: 'Barn',
          category: 'buildings',
          width: 96,
          height: 96,
          sprite: 'barn.png',
          color: 0x8b4513,
          rotatable: false,
          collidable: true,
        },
      ];

      items.forEach(item => itemTypeRegistry.register(item));

      // 2. Create and place tiles
      const wheatTemplate = new TileTemplate(items[0]);
      const barnTemplate = new TileTemplate(items[1]);

      const wheat1 = wheatTemplate.createTile(100, 100);
      const wheat2 = wheatTemplate.createTile(132, 100);
      const barn = barnTemplate.createTile(200, 200);

      gameState.addTile(wheat1.getData());
      gameState.addTile(wheat2.getData());
      gameState.addTile(barn.getData());

      // 3. Save state
      const savedState = gameState.toString();
      expect(savedState).toBeString();

      // 4. Load state into new game state
      const loadedState = GameState.fromString(savedState);
      const loadedTiles = loadedState.getAllTiles();

      expect(loadedTiles).toHaveLength(3);
      expect(loadedTiles[0].typeId).toBe('crop_wheat');
      expect(loadedTiles[2].typeId).toBe('building_barn');
    });

    test('should support undo/redo with cloning', () => {
      // 1. Create initial state
      const itemType: ItemType = {
        id: 'crop_wheat',
        name: 'Wheat',
        category: 'crops',
        width: 32,
        height: 32,
        sprite: 'wheat.png',
        color: 0xffff00,
        rotatable: false,
        collidable: true,
      };

      itemTypeRegistry.register(itemType);
      const template = new TileTemplate(itemType);

      const tile = template.createTile(100, 100);
      gameState.addTile(tile.getData());

      // 2. Save state (undo snapshot)
      const snapshot = gameState.clone();

      // 3. Make changes
      const tile2 = template.createTile(200, 200);
      gameState.addTile(tile2.getData());
      expect(gameState.getAllTiles()).toHaveLength(2);

      // 4. Restore snapshot (undo)
      gameState = snapshot;
      expect(gameState.getAllTiles()).toHaveLength(1);
    });

    test('should support dynamic content loading', () => {
      // 1. Load item types from JSON (simulating config file)
      const config = {
        items: [
          {
            id: 'crop_wheat',
            name: 'Wheat',
            category: 'crops',
            width: 32,
            height: 32,
            sprite: 'wheat.png',
            color: 0xffff00,
            rotatable: false,
            collidable: true,
          },
          {
            id: 'crop_corn',
            name: 'Corn',
            category: 'crops',
            width: 32,
            height: 32,
            sprite: 'corn.png',
            color: 0xffd700,
            rotatable: false,
            collidable: true,
          },
          {
            id: 'building_barn',
            name: 'Barn',
            category: 'buildings',
            width: 96,
            height: 96,
            sprite: 'barn.png',
            color: 0x8b4513,
            rotatable: false,
            collidable: true,
          },
        ],
      };

      itemTypeRegistry.loadFromJSON(config);
      expect(itemTypeRegistry.count).toBe(3);

      // 2. Verify categories work
      const crops = itemTypeRegistry.getByCategory('crops');
      expect(crops).toHaveLength(2);

      const buildings = itemTypeRegistry.getByCategory('buildings');
      expect(buildings).toHaveLength(1);

      // 3. Create tiles using loaded types
      const wheatType = itemTypeRegistry.get('crop_wheat');
      expect(wheatType).toBeDefined();

      if (wheatType) {
        const template = new TileTemplate(wheatType);
        const tile = template.createTile(100, 100);
        gameState.addTile(tile.getData());

        expect(gameState.getAllTiles()).toHaveLength(1);
      }
    });
  });

  describe('Multi-Tile Scenarios', () => {
    test('should handle placing many tiles', () => {
      const itemType: ItemType = {
        id: 'crop_wheat',
        name: 'Wheat',
        category: 'crops',
        width: 32,
        height: 32,
        sprite: 'wheat.png',
        color: 0xffff00,
        rotatable: false,
        collidable: true,
      };

      itemTypeRegistry.register(itemType);
      const template = new TileTemplate(itemType);

      // Create a 10x10 grid of wheat
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const tile = template.createTile(col * 32, row * 32);
          gameState.addTile(tile.getData());
        }
      }

      expect(gameState.getAllTiles()).toHaveLength(100);
    });

    test('should handle mixed tile types', () => {
      const types: ItemType[] = [
        {
          id: 'crop_wheat',
          name: 'Wheat',
          category: 'crops',
          width: 32,
          height: 32,
          sprite: 'wheat.png',
          color: 0xffff00,
          rotatable: false,
          collidable: true,
        },
        {
          id: 'crop_corn',
          name: 'Corn',
          category: 'crops',
          width: 32,
          height: 32,
          sprite: 'corn.png',
          color: 0xffd700,
          rotatable: false,
          collidable: true,
        },
        {
          id: 'deco_sprinkler',
          name: 'Sprinkler',
          category: 'decorations',
          width: 16,
          height: 16,
          sprite: 'sprinkler.png',
          color: 0x4169e1,
          rotatable: true,
          collidable: false,
        },
      ];

      types.forEach(type => itemTypeRegistry.register(type));

      const wheatTemplate = new TileTemplate(types[0]);
      const cornTemplate = new TileTemplate(types[1]);
      const sprinklerTemplate = new TileTemplate(types[2]);

      gameState.addTile(wheatTemplate.createTile(0, 0).getData());
      gameState.addTile(cornTemplate.createTile(32, 0).getData());
      gameState.addTile(sprinklerTemplate.createTile(16, 16).getData());

      const allTiles = gameState.getAllTiles();
      expect(allTiles).toHaveLength(3);

      // Verify different types
      const typeIds = allTiles.map(t => t.typeId);
      expect(typeIds).toContain('crop_wheat');
      expect(typeIds).toContain('crop_corn');
      expect(typeIds).toContain('deco_sprinkler');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing item type gracefully', () => {
      const missingType = itemTypeRegistry.get('non-existent');
      expect(missingType).toBeUndefined();
    });

    test('should handle updating non-existent tile', () => {
      // Should not throw
      gameState.updateTile('non-existent', { x: 100 });
      expect(true).toBe(true);
    });

    test('should handle empty state serialization', () => {
      const json = gameState.toString();
      const loaded = GameState.fromString(json);

      expect(loaded.getAllTiles()).toHaveLength(0);
    });
  });
});
