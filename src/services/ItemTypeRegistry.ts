/**
 * Item Type Registry
 *
 * Manages all available item types (buildings, decorations, crops, etc.)
 * Acts as a central registry for item definitions that tiles reference.
 */

import type { ItemType, ItemCategory } from '../types';

/**
 * Registry for managing item type definitions
 *
 * This is a singleton service that stores all available item types.
 * Items can be registered programmatically or loaded from JSON config files.
 */
export class ItemTypeRegistry {
  private items = new Map<string, ItemType>();

  /**
   * Register a single item type
   */
  register(item: ItemType): void {
    if (this.items.has(item.id)) {
      console.warn(`ItemType "${item.id}" already registered. Overwriting.`);
    }
    this.items.set(item.id, item);
  }

  /**
   * Register multiple item types at once
   */
  registerMany(items: ItemType[]): void {
    items.forEach(item => this.register(item));
  }

  /**
   * Get an item type by ID
   */
  get(id: string): ItemType | undefined {
    return this.items.get(id);
  }

  /**
   * Get an item type by ID, throwing if not found
   */
  getOrThrow(id: string): ItemType {
    const item = this.items.get(id);
    if (!item) {
      throw new Error(`ItemType "${id}" not found in registry`);
    }
    return item;
  }

  /**
   * Check if an item type exists
   */
  has(id: string): boolean {
    return this.items.has(id);
  }

  /**
   * Get all registered item types
   */
  getAll(): ItemType[] {
    return Array.from(this.items.values());
  }

  /**
   * Get all item types in a specific category
   */
  getByCategory(category: ItemCategory): ItemType[] {
    return this.getAll().filter(item => item.category === category);
  }

  /**
   * Clear all registered items
   */
  clear(): void {
    this.items.clear();
  }

  /**
   * Load items from a JSON object
   * Useful for loading from config files
   */
  loadFromJSON(json: { items?: ItemType[] }): void {
    if (json.items) {
      this.registerMany(json.items);
    }
  }

  /**
   * Get count of registered items
   */
  get count(): number {
    return this.items.size;
  }
}

// Singleton instance
export const itemTypeRegistry = new ItemTypeRegistry();
