/**
 * Data Models
 *
 * Pure data structures that can be serialized/deserialized.
 * These represent the game state independent of rendering.
 */

/**
 * Unique identifier for entities
 */
export type EntityId = string;

/**
 * Position in 2D space (in grid cells or pixels)
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size in 2D space (in grid cells or pixels)
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Rectangle (position + size)
 */
export interface Bounds extends Position, Size {}

/**
 * Rotation angle (0, 90, 180, 270)
 */
export type Rotation = 0 | 90 | 180 | 270;

/**
 * Pure data representing a placed tile/item on the farm
 */
export interface TileData {
  /** Unique identifier */
  id: EntityId;

  /** Reference to the item type (e.g., "barn_basic", "crop_wheat") */
  typeId: string;

  /** Position in grid coordinates */
  x: number;
  y: number;

  /** Rotation angle */
  rotation: Rotation;

  /** Custom metadata (for game-specific data) */
  metadata?: Record<string, any>;
}

/**
 * Item category
 */
export type ItemCategory =
  | 'building'
  | 'decoration'
  | 'crop'
  | 'tree'
  | 'path'
  | 'furniture'
  | 'utility'
  | 'misc';

/**
 * Definition of an item/building type
 * This is the "blueprint" that tiles are created from
 */
export interface ItemType {
  /** Unique identifier (e.g., "barn_basic") */
  id: string;

  /** Display name (e.g., "Basic Barn") */
  name: string;

  /** Category for organization */
  category: ItemCategory;

  /** Size in grid cells */
  width: number;
  height: number;

  /** Sprite/image path */
  sprite: string;

  /** Color (for simple colored rectangles in prototype) */
  color?: string;

  /** Can this item be rotated? */
  rotatable: boolean;

  /** Does this item block other items? */
  collidable: boolean;

  /** Description */
  description?: string;

  /** Cost (for future use) */
  cost?: number;

  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Complete game state (serializable)
 */
export interface GameStateData {
  /** Schema version for backward compatibility */
  version: string;

  /** Farm map type (e.g., "standard", "riverland") */
  farmType: string;

  /** All placed tiles */
  tiles: TileData[];

  /** Metadata (creation date, author, etc.) */
  metadata?: Record<string, any>;
}

/**
 * Grid slot position reference
 */
export interface SlotPosition {
  /** Slot identifier (e.g., "3_5" for row 3, col 5) */
  id: string;

  /** Row index */
  row: number;

  /** Column index */
  col: number;

  /** Pixel position */
  x: number;
  y: number;

  /** Pixel dimensions */
  width: number;
  height: number;
}
