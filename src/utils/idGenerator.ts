/**
 * ID Generation Utilities
 *
 * Simple utilities for generating unique IDs for entities.
 */

import type { EntityId } from '../types';

let counter = 0;

/**
 * Generate a unique ID
 *
 * Format: "{prefix}_{timestamp}_{counter}"
 * Example: "tile_1699564321123_42"
 */
export function generateId(prefix: string = 'entity'): EntityId {
  counter++;
  return `${prefix}_${Date.now()}_${counter}`;
}

/**
 * Reset the counter (useful for testing)
 */
export function resetIdCounter(): void {
  counter = 0;
}
