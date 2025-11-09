import { describe, test, expect, beforeEach } from 'bun:test';
import { ItemTypeRegistry } from '../../src/services/ItemTypeRegistry';
import type { ItemType } from '../../src/types';

describe('ItemTypeRegistry', () => {
  let registry: ItemTypeRegistry;

  beforeEach(() => {
    registry = new ItemTypeRegistry();
  });

  describe('Registration', () => {
    test('should register an item type', () => {
      const itemType: ItemType = {
        id: 'crop_wheat',
        name: 'Wheat',
        category: 'crop',
        width: 32,
        height: 32,
        sprite: 'wheat.png',
        rotatable: false,
        collidable: true,
      };

      registry.register(itemType);
      const retrieved = registry.get('crop_wheat');

      expect(retrieved).toEqual(itemType);
    });

    test('should count registered items', () => {
      expect(registry.count).toBe(0);

      registry.register({
        id: 'crop_wheat',
        name: 'Wheat',
        category: 'crop',
        width: 32,
        height: 32,
        sprite: 'wheat.png',
        rotatable: false,
        collidable: true,
      });

      expect(registry.count).toBe(1);
    });

    test('should overwrite existing item with same ID', () => {
      const item1: ItemType = {
        id: 'crop_wheat',
        name: 'Wheat v1',
        category: 'crop',
        width: 32,
        height: 32,
        sprite: 'wheat_v1.png',
        rotatable: false,
        collidable: true,
      };

      const item2: ItemType = {
        id: 'crop_wheat',
        name: 'Wheat v2',
        category: 'crop',
        width: 64,
        height: 64,
        sprite: 'wheat_v2.png',
        rotatable: true,
        collidable: true,
      };

      registry.register(item1);
      registry.register(item2);

      const retrieved = registry.get('crop_wheat');
      expect(retrieved).toEqual(item2);
      expect(registry.count).toBe(1);
    });
  });

  describe('Retrieval', () => {
    test('should get all items', () => {
      const items: ItemType[] = [
        {
          id: 'crop_wheat',
          name: 'Wheat',
          category: 'crop',
          width: 32,
          height: 32,
          sprite: 'wheat.png',
          rotatable: false,
          collidable: true,
        },
        {
          id: 'building_barn',
          name: 'Barn',
          category: 'building',
          width: 96,
          height: 96,
          sprite: 'barn.png',
          rotatable: false,
          collidable: true,
        },
      ];

      items.forEach(item => registry.register(item));
      const all = registry.getAll();

      expect(all).toHaveLength(2);
      expect(all).toContainEqual(items[0]);
      expect(all).toContainEqual(items[1]);
    });

    test('should get items by category', () => {
      const crops: ItemType[] = [
        {
          id: 'crop_wheat',
          name: 'Wheat',
          category: 'crop',
          width: 32,
          height: 32,
          sprite: 'wheat.png',
          rotatable: false,
          collidable: true,
        },
        {
          id: 'crop_corn',
          name: 'Corn',
          category: 'crop',
          width: 32,
          height: 32,
          sprite: 'corn.png',
          rotatable: false,
          collidable: true,
        },
      ];

      const buildings: ItemType[] = [
        {
          id: 'building_barn',
          name: 'Barn',
          category: 'building',
          width: 96,
          height: 96,
          sprite: 'barn.png',
          rotatable: false,
          collidable: true,
        },
      ];

      [...crops, ...buildings].forEach(item => registry.register(item));

      const retrievedCrops = registry.getByCategory('crop');
      expect(retrievedCrops).toHaveLength(2);
      expect(retrievedCrops).toContainEqual(crops[0]);
      expect(retrievedCrops).toContainEqual(crops[1]);

      const retrievedBuildings = registry.getByCategory('building');
      expect(retrievedBuildings).toHaveLength(1);
      expect(retrievedBuildings).toContainEqual(buildings[0]);
    });

    test('should return empty array for unknown category', () => {
      const items = registry.getByCategory('misc'); // Use a valid category
      expect(items).toHaveLength(0);
    });

    test('should return undefined for unknown ID', () => {
      const item = registry.get('non-existent');
      expect(item).toBeUndefined();
    });
  });

  describe('JSON Loading', () => {
    test('should load items from JSON', () => {
      const json = {
        items: [
          {
            id: 'crop_wheat',
            name: 'Wheat',
            category: 'crop' as const,
            width: 32,
            height: 32,
            sprite: 'wheat.png',
            rotatable: false,
            collidable: true,
          },
          {
            id: 'building_barn',
            name: 'Barn',
            category: 'building' as const,
            width: 96,
            height: 96,
            sprite: 'barn.png',
            rotatable: false,
            collidable: true,
          },
        ] as ItemType[],
      };

      registry.loadFromJSON(json);

      expect(registry.count).toBe(2);
      expect(registry.get('crop_wheat')).toBeDefined();
      expect(registry.get('building_barn')).toBeDefined();
    });

    test('should handle empty JSON', () => {
      registry.loadFromJSON({});
      expect(registry.count).toBe(0);
    });

    test('should handle JSON with no items', () => {
      registry.loadFromJSON({ items: [] });
      expect(registry.count).toBe(0);
    });
  });
});
