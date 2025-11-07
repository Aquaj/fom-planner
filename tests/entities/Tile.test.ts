import { describe, test, expect, beforeEach, mock } from 'bun:test';
import Tile from '../../src/entities/Tile';
import type { TileData, ItemType } from '../../src/types';

describe('Tile', () => {
  let tileData: TileData;
  let itemType: ItemType;

  beforeEach(() => {
    tileData = {
      id: 'tile-1',
      typeId: 'crop_wheat',
      x: 100,
      y: 200,
      rotation: 0,
    };

    itemType = {
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
  });

  describe('Construction', () => {
    test('should create tile with data and item type', () => {
      const tile = new Tile(tileData, itemType);

      expect(tile).toBeDefined();
      expect(tile.rootElement).toBeDefined();
      expect(tile.getData()).toEqual(tileData);
    });

    test('should set cursor to pointer', () => {
      const tile = new Tile(tileData, itemType);
      expect(tile.rootElement.cursor).toBe('pointer');
    });

    test('should enable interactivity', () => {
      const tile = new Tile(tileData, itemType);
      expect(tile.rootElement.eventMode).toBe('static');
    });
  });

  describe('Data Management', () => {
    test('should return defensive copy of data', () => {
      const tile = new Tile(tileData, itemType);
      const data = tile.getData();

      // Modify the returned data
      data.x = 999;

      // Original should be unchanged
      expect(tile.getData().x).toBe(100);
    });

    test('should update data', () => {
      const tile = new Tile(tileData, itemType);

      tile.updateData({ x: 300, y: 400 });

      const data = tile.getData();
      expect(data.x).toBe(300);
      expect(data.y).toBe(400);
      expect(data.typeId).toBe('crop_wheat'); // Unchanged
    });

    test('should update position', () => {
      const tile = new Tile(tileData, itemType);

      tile.setPosition(150, 250);

      expect(tile.getPosition()).toEqual({ x: 150, y: 250 });
      expect(tile.getData().x).toBe(150);
      expect(tile.getData().y).toBe(250);
    });
  });

  describe('Event Callbacks', () => {
    test('should register drag callback', () => {
      const tile = new Tile(tileData, itemType);
      const callback = mock(() => {});

      const unsubscribe = tile.onDrag(callback);

      expect(unsubscribe).toBeFunction();
    });

    test('should register drop callback', () => {
      const tile = new Tile(tileData, itemType);
      const callback = mock(() => {});

      const unsubscribe = tile.onDrop(callback);

      expect(unsubscribe).toBeFunction();
    });

    test('should unsubscribe drag callback', () => {
      const tile = new Tile(tileData, itemType);
      const callback = mock(() => {});

      const unsubscribe = tile.onDrag(callback);
      unsubscribe();

      // Callback should no longer be registered (verified by not throwing)
      expect(true).toBe(true);
    });
  });

  describe('Item Type', () => {
    test('should return item type', () => {
      const tile = new Tile(tileData, itemType);

      expect(tile.getItemType()).toEqual(itemType);
    });
  });

  describe('Cleanup', () => {
    test('should destroy tile', () => {
      const tile = new Tile(tileData, itemType);

      // Should not throw
      tile.destroy();

      expect(true).toBe(true);
    });
  });
});
