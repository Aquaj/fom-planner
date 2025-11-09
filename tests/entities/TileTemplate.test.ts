import { describe, test, expect, beforeEach, mock } from 'bun:test';
import TileTemplate from '../../src/entities/TileTemplate';
import type { ItemType } from '../../src/types';

describe('TileTemplate', () => {
  let itemType: ItemType;

  beforeEach(() => {
    itemType = {
      id: 'crop_wheat',
      name: 'Wheat',
      category: 'crop',
      width: 32,
      height: 32,
      sprite: 'wheat.png',
      color: '#ffff00',
      rotatable: false,
      collidable: true,
    };
  });

  describe('Construction', () => {
    test('should create template with item type', () => {
      const template = new TileTemplate(itemType);

      expect(template).toBeDefined();
      expect(template.rootElement).toBeDefined();
    });

    test('should create template at specified position', () => {
      const template = new TileTemplate(itemType, 100, 200);

      expect(template.rootElement.x).toBe(100);
      expect(template.rootElement.y).toBe(200);
    });

    test('should enable interactivity', () => {
      const template = new TileTemplate(itemType);

      expect(template.rootElement.eventMode).toBe('static');
      expect(template.rootElement.cursor).toBe('pointer');
    });
  });

  describe('Tile Creation', () => {
    test('should create tile from template', () => {
      const template = new TileTemplate(itemType);

      const tile = template.createTile(150, 250);

      expect(tile).toBeDefined();
      const data = tile.getData();
      expect(data.typeId).toBe('crop_wheat');
      expect(data.x).toBe(150);
      expect(data.y).toBe(250);
      expect(data.id).toBeDefined();
    });

    test('should create tiles with unique IDs', () => {
      const template = new TileTemplate(itemType);

      const tile1 = template.createTile();
      const tile2 = template.createTile();

      expect(tile1.getData().id).not.toBe(tile2.getData().id);
    });

    test('should create tile at default position', () => {
      const template = new TileTemplate(itemType);

      const tile = template.createTile();
      const data = tile.getData();

      expect(data.x).toBe(0);
      expect(data.y).toBe(0);
    });
  });

  describe('Callbacks', () => {
    test('should register tile created callback', () => {
      const template = new TileTemplate(itemType);
      const callback = mock(() => {});

      const unsubscribe = template.onTileCreated(callback);

      expect(unsubscribe).toBeFunction();
    });

    test('should unsubscribe callback', () => {
      const template = new TileTemplate(itemType);
      const callback = mock(() => {});

      const unsubscribe = template.onTileCreated(callback);
      unsubscribe();

      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('Item Type', () => {
    test('should return item type', () => {
      const template = new TileTemplate(itemType);

      expect(template.getItemType()).toEqual(itemType);
    });
  });

  describe('Cleanup', () => {
    test('should destroy template', () => {
      const template = new TileTemplate(itemType);

      // Should not throw
      template.destroy();

      expect(true).toBe(true);
    });
  });
});
