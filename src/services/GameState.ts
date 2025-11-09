/**
 * Game State Management
 *
 * Manages the complete state of the farm planner.
 * Provides serialization/deserialization for save/load functionality.
 */

import type { GameStateData, TileData, EntityId } from '../types';

/**
 * Manages the entire game state
 *
 * This class is the single source of truth for the farm layout.
 * It stores all tiles as pure data (no view components).
 */
export class GameState {
  private static readonly CURRENT_VERSION = '1.0.0';

  /** Farm map type */
  farmType: string = 'standard';

  /** All placed tiles (pure data) */
  private tiles: Map<EntityId, TileData> = new Map();

  /** Custom metadata */
  metadata: Record<string, any> = {};

  /**
   * Add a tile to the game state
   */
  addTile(tile: TileData): void {
    if (this.tiles.has(tile.id)) {
      console.warn(`Tile with ID "${tile.id}" already exists. Replacing.`);
    }
    this.tiles.set(tile.id, { ...tile }); // Store a copy
  }

  /**
   * Remove a tile by ID
   */
  removeTile(id: EntityId): TileData | undefined {
    const tile = this.tiles.get(id);
    this.tiles.delete(id);
    return tile;
  }

  /**
   * Get a tile by ID
   */
  getTile(id: EntityId): TileData | undefined {
    const tile = this.tiles.get(id);
    return tile ? { ...tile } : undefined; // Return a copy
  }

  /**
   * Get all tiles as an array
   */
  getAllTiles(): TileData[] {
    return Array.from(this.tiles.values()).map(tile => ({ ...tile }));
  }

  /**
   * Update a tile
   */
  updateTile(id: EntityId, updates: Partial<TileData>): void {
    const tile = this.tiles.get(id);
    if (!tile) {
      return; // Silently ignore updates to non-existent tiles
    }
    this.tiles.set(id, { ...tile, ...updates });
  }

  /**
   * Get tiles by type
   */
  getTilesByType(typeId: string): TileData[] {
    return this.getAllTiles().filter(tile => tile.typeId === typeId);
  }

  /**
   * Get tile at position (assumes no overlap)
   */
  getTileAtPosition(x: number, y: number): TileData | undefined {
    return this.getAllTiles().find(tile => tile.x === x && tile.y === y);
  }

  /**
   * Clear all tiles
   */
  clear(): void {
    this.tiles.clear();
  }

  /**
   * Get tile count
   */
  get tileCount(): number {
    return this.tiles.size;
  }

  /**
   * Serialize to JSON (for save/load)
   */
  toJSON(): GameStateData {
    return {
      version: GameState.CURRENT_VERSION,
      farmType: this.farmType,
      tiles: this.getAllTiles(),
      metadata: { ...this.metadata }
    };
  }

  /**
   * Serialize to JSON string
   */
  toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  /**
   * Deserialize from JSON data
   */
  static fromJSON(data: GameStateData): GameState {
    const state = new GameState();
    state.farmType = data.farmType;
    state.metadata = data.metadata || {};

    // Validate version (for future migration logic)
    if (data.version !== GameState.CURRENT_VERSION) {
      console.warn(`Loading older save version ${data.version}. Current version is ${GameState.CURRENT_VERSION}`);
      // Future: Add migration logic here
    }

    // Load all tiles
    data.tiles.forEach(tile => state.addTile(tile));

    return state;
  }

  /**
   * Deserialize from JSON string
   */
  static fromString(json: string): GameState {
    const data = JSON.parse(json) as GameStateData;
    return GameState.fromJSON(data);
  }

  /**
   * Create a deep clone of the current state
   * Useful for undo/redo snapshots
   */
  clone(): GameState {
    return GameState.fromJSON(this.toJSON());
  }
}

// Singleton instance (but can create multiple for testing)
export const gameState = new GameState();
