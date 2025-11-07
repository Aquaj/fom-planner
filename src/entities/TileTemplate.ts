import * as createjs from "createjs-module";
import Tile from './Tile';
import type { ItemType, TileData } from '../types';
import { generateId } from '../utils';

/**
 * TileTemplate (Factory)
 *
 * Acts as a "stamp" or template for creating new tiles.
 * When dragged, it creates a new Tile instance instead of moving itself.
 *
 * This is a factory pattern implementation, not inheritance.
 */
class TileTemplate {
  /** Visual representation of the template */
  rootElement: createjs.Shape;

  /** The item type this template creates */
  private itemType: ItemType;

  /** Callbacks to invoke when a new tile is created */
  private onTileCreatedCallbacks: ((tile: Tile) => void)[] = [];

  /** Currently active tile being dragged (if any) */
  private activeTile: Tile | null = null;

  /** Whether we're currently dragging */
  private isDragging: boolean = false;

  /**
   * Create a new TileTemplate
   *
   * @param itemType - The type of item this template creates
   * @param x - Template position X
   * @param y - Template position Y
   */
  constructor(itemType: ItemType, x: number = 0, y: number = 0) {
    this.itemType = itemType;
    this.rootElement = new createjs.Shape();
    this.rootElement.cursor = "pointer";
    this.rootElement.x = x;
    this.rootElement.y = y;

    // Render the template
    this.render();

    // Attach event handlers
    this.rootElement.on("pressmove", (event: createjs.Event) => this.handleDrag(event));
    this.rootElement.on("pressup", (event: createjs.Event) => this.handleDrop(event));
  }

  /**
   * Render the template visual
   */
  private render(): void {
    const { width, height, color = "lightblue" } = this.itemType;

    this.rootElement.graphics.clear()
      .beginFill(color)
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, width, height);
  }

  /**
   * Draw (cache for performance)
   */
  draw(): void {
    const { width, height } = this.itemType;
    this.rootElement.cache(0, 0, width, height);
  }

  /**
   * Set position of the template
   */
  setPosition(x: number, y: number): void {
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

  /**
   * Create a new tile from this template
   */
  createTile(x: number = 0, y: number = 0): Tile {
    const data: TileData = {
      id: generateId('tile'),
      typeId: this.itemType.id,
      x,
      y,
      rotation: 0,
      metadata: {}
    };

    const tile = new Tile(data, this.itemType);
    return tile;
  }

  /**
   * Handle drag event
   * Creates a new tile and drags it instead of the template
   */
  private handleDrag(event: createjs.Event): void {
    if (!this.isDragging) {
      // First drag event - create new tile
      this.isDragging = true;

      const tile = this.createTile(
        event.stageX - this.itemType.width / 2,
        event.stageY - this.itemType.height / 2
      );

      this.activeTile = tile;

      // Notify observers
      this.onTileCreatedCallbacks.forEach(callback => callback(tile));
    }

    // Delegate drag to the active tile
    if (this.activeTile) {
      this.activeTile['handleDrag'](event); // Access private method
    }
  }

  /**
   * Handle drop event
   */
  private handleDrop(event: createjs.Event): void {
    if (this.activeTile) {
      // Delegate drop to the active tile
      this.activeTile['handleDrop'](event); // Access private method
    }

    // Reset state
    this.isDragging = false;
    this.activeTile = null;
  }

  /**
   * Register a callback for when a tile is created
   * Returns an unsubscribe function
   */
  onTileCreated(callback: (tile: Tile) => void): () => void {
    this.onTileCreatedCallbacks.push(callback);
    return () => {
      const index = this.onTileCreatedCallbacks.indexOf(callback);
      if (index > -1) {
        this.onTileCreatedCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get the item type
   */
  getItemType(): ItemType {
    return this.itemType;
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.rootElement.removeAllEventListeners();
    this.onTileCreatedCallbacks = [];
    this.activeTile = null;
  }
}

export default TileTemplate;
