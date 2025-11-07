import * as createjs from "createjs-module";
import type { TileData, ItemType } from '../types';

/**
 * Tile (View Component)
 *
 * Represents a placed tile on the farm. This class handles rendering
 * and user interaction, while the actual data is stored in TileData.
 *
 * Responsibilities:
 * - Render the tile based on data and item type
 * - Handle drag/drop events
 * - Notify observers of interactions
 * - Sync visual state with data
 */
class Tile {
  /** CreateJS display object */
  rootElement: createjs.Shape;

  /** Drag event callbacks */
  private onDragCallbacks: ((event: createjs.Event) => boolean | void)[] = [];

  /** Drop event callbacks */
  private onDropCallbacks: ((event: createjs.Event) => void)[] = [];

  /**
   * Create a new Tile view
   *
   * @param data - The tile's data (position, type reference, etc.)
   * @param itemType - The item type definition (dimensions, sprite, etc.)
   */
  constructor(
    private data: TileData,
    private itemType: ItemType
  ) {
    this.rootElement = new createjs.Shape();
    this.rootElement.cursor = "pointer";

    // Attach event handlers
    this.rootElement.on("pressmove", (event: createjs.Event) => this.handleDrag(event));
    this.rootElement.on("pressup", (event: createjs.Event) => this.handleDrop(event));

    // Initial render
    this.render();
  }

  /**
   * Get the tile's data
   * Returns a copy to prevent external modification
   */
  getData(): TileData {
    return { ...this.data };
  }

  /**
   * Update the tile's data
   * Triggers a re-render
   */
  updateData(updates: Partial<TileData>): void {
    this.data = { ...this.data, ...updates };
    this.render();
  }

  /**
   * Get the item type
   */
  getItemType(): ItemType {
    return this.itemType;
  }

  /**
   * Set the tile's position
   * Updates both data and visual position
   */
  setPosition(x: number, y: number): void {
    this.data.x = x;
    this.data.y = y;
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

  /**
   * Get current position
   */
  getPosition(): { x: number; y: number } {
    return { x: this.data.x, y: this.data.y };
  }

  /**
   * Render the tile based on current data and item type
   */
  private render(): void {
    const { width, height } = this.itemType;
    const color = this.itemType.color || "lightblue";

    this.rootElement.graphics.clear()
      .beginFill(color)
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, width, height);

    // Update position
    this.rootElement.x = this.data.x;
    this.rootElement.y = this.data.y;

    // Apply rotation if needed
    // TODO: Implement rotation rendering when rotation system is added
  }

  /**
   * Cache the graphics for better performance
   */
  draw(): void {
    const { width, height } = this.itemType;
    this.rootElement.cache(0, 0, width, height);
  }

  /**
   * Handle drag event
   */
  private handleDrag(event: createjs.Event): void {
    let hasSetPosition = false;

    // Call all drag callbacks
    // Callbacks can return true to indicate they've handled positioning
    this.onDragCallbacks.forEach((callback) => {
      const handled = callback(event);
      hasSetPosition = hasSetPosition || !!handled;
    });

    // Default drag behavior if no callback handled it
    if (!hasSetPosition) {
      const newPos = this.rootElement.parent.globalToLocal(event.stageX, event.stageY);
      this.setPosition(
        newPos.x - this.itemType.width / 2,
        newPos.y - this.itemType.height / 2
      );
    }

    event.stopPropagation();
  }

  /**
   * Handle drop event
   */
  private handleDrop(event: createjs.Event): void {
    this.onDropCallbacks.forEach((callback) => callback(event));
  }

  /**
   * Register a drag callback
   * Returns an unsubscribe function
   */
  onDrag(callback: (event: createjs.Event) => boolean | void): () => void {
    this.onDragCallbacks.push(callback);
    return () => {
      const index = this.onDragCallbacks.indexOf(callback);
      if (index > -1) {
        this.onDragCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Register a drop callback
   * Returns an unsubscribe function
   */
  onDrop(callback: (event: createjs.Event) => void): () => void {
    this.onDropCallbacks.push(callback);
    return () => {
      const index = this.onDropCallbacks.indexOf(callback);
      if (index > -1) {
        this.onDropCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Clean up (remove event listeners, etc.)
   */
  destroy(): void {
    this.rootElement.removeAllEventListeners();
    this.onDragCallbacks = [];
    this.onDropCallbacks = [];
  }
}

export default Tile;
