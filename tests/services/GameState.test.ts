import { describe, test, expect, beforeEach } from 'bun:test';
import { GameState } from '../../src/services/GameState';
import type { TileData } from '../../src/types';

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('Tile Management', () => {
    test('should add a tile', () => {
      const tile: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
      };

      gameState.addTile(tile);
      const retrieved = gameState.getTile('test-tile-1');

      expect(retrieved).toEqual(tile);
    });

    test('should remove a tile', () => {
      const tile: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
      };

      gameState.addTile(tile);
      const removed = gameState.removeTile('test-tile-1');

      expect(removed).toEqual(tile);
      expect(gameState.getTile('test-tile-1')).toBeUndefined();
    });

    test('should update a tile', () => {
      const tile: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
      };

      gameState.addTile(tile);
      gameState.updateTile('test-tile-1', { x: 150, y: 250 });

      const updated = gameState.getTile('test-tile-1');
      expect(updated?.x).toBe(150);
      expect(updated?.y).toBe(250);
      expect(updated?.typeId).toBe('crop_wheat'); // Unchanged
    });

    test('should get all tiles', () => {
      const tile1: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
      };

      const tile2: TileData = {
        id: 'test-tile-2',
        typeId: 'building_barn',
        x: 300,
        y: 400,
        rotation: 90,
      };

      gameState.addTile(tile1);
      gameState.addTile(tile2);

      const allTiles = gameState.getAllTiles();
      expect(allTiles).toHaveLength(2);
      expect(allTiles).toContainEqual(tile1);
      expect(allTiles).toContainEqual(tile2);
    });
  });

  describe('Serialization', () => {
    test('should serialize to JSON', () => {
      const tile: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
      };

      gameState.addTile(tile);
      const json = gameState.toJSON();

      expect(json.tiles).toHaveLength(1);
      expect(json.tiles[0]).toEqual(tile);
    });

    test('should deserialize from JSON', () => {
      const data = {
        tiles: [
          { id: 'test-tile-1', typeId: 'crop_wheat', x: 100, y: 200, rotation: 0 },
          { id: 'test-tile-2', typeId: 'building_barn', x: 300, y: 400, rotation: 90 },
        ],
      };

      const loaded = GameState.fromJSON(data);
      const tiles = loaded.getAllTiles();

      expect(tiles).toHaveLength(2);
      expect(tiles[0]).toEqual(data.tiles[0]);
      expect(tiles[1]).toEqual(data.tiles[1]);
    });

    test('should serialize to string and back', () => {
      const tile: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
        metadata: { planted: true },
      };

      gameState.addTile(tile);
      const jsonString = gameState.toString();
      const loaded = GameState.fromString(jsonString);

      const loadedTile = loaded.getTile('test-tile-1');
      expect(loadedTile).toEqual(tile);
    });
  });

  describe('Cloning', () => {
    test('should create independent clone', () => {
      const tile: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
      };

      gameState.addTile(tile);
      const cloned = gameState.clone();

      // Modify original
      gameState.updateTile('test-tile-1', { x: 999 });

      // Clone should be unchanged
      const clonedTile = cloned.getTile('test-tile-1');
      expect(clonedTile?.x).toBe(100);
    });
  });

  describe('Edge Cases', () => {
    test('should handle non-existent tile gracefully', () => {
      expect(gameState.getTile('non-existent')).toBeUndefined();
      expect(gameState.removeTile('non-existent')).toBeUndefined();
    });

    test('should handle empty state', () => {
      expect(gameState.getAllTiles()).toHaveLength(0);
      const json = gameState.toJSON();
      expect(json.tiles).toHaveLength(0);
    });

    test('should overwrite tile with same ID', () => {
      const tile1: TileData = {
        id: 'test-tile-1',
        typeId: 'crop_wheat',
        x: 100,
        y: 200,
        rotation: 0,
      };

      const tile2: TileData = {
        id: 'test-tile-1',
        typeId: 'building_barn',
        x: 300,
        y: 400,
        rotation: 90,
      };

      gameState.addTile(tile1);
      gameState.addTile(tile2);

      const tiles = gameState.getAllTiles();
      expect(tiles).toHaveLength(1);
      expect(tiles[0]).toEqual(tile2);
    });
  });
});
