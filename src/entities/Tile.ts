import * as PIXI from 'pixi.js';
import type { TileData, ItemType } from '../types';
import { cssColorToHex } from '../rendering/ShapeRenderer';

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
  /** PixiJS display container */
  rootElement: PIXI.Container;

  /** Graphics object for rendering the tile */
  private graphics: PIXI.Graphics;

  /** Drag event callbacks */
  private onDragCallbacks: ((event: PIXI.FederatedPointerEvent) => boolean | void)[] = [];

  /** Drop event callbacks */
  private onDropCallbacks: ((event: PIXI.FederatedPointerEvent) => void)[] = [];

  /** Drag state */
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };

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
    this.rootElement = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.rootElement.addChild(this.graphics);

    // Enable interactivity
    this.rootElement.eventMode = 'static';
    this.rootElement.cursor = 'pointer';

    // Attach event handlers
    this.rootElement.on('pointerdown', (event: PIXI.FederatedPointerEvent) => this.handlePointerDown(event));
    this.rootElement.on('pointermove', (event: PIXI.FederatedPointerEvent) => this.handlePointerMove(event));
    this.rootElement.on('pointerup', (event: PIXI.FederatedPointerEvent) => this.handlePointerUp(event));
    this.rootElement.on('pointerupoutside', (event: PIXI.FederatedPointerEvent) => this.handlePointerUp(event));

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
    const colorHex = typeof color === 'string' ? cssColorToHex(color) : color;

    this.graphics.clear();
    this.graphics.rect(0, 0, width, height);
    this.graphics.fill({ color: colorHex, alpha: 1 });
    this.graphics.stroke({ color: 0x000000, width: 1 });

    // Update position
    this.rootElement.x = this.data.x;
    this.rootElement.y = this.data.y;

    // Apply rotation if needed
    // TODO: Implement rotation rendering when rotation system is added
  }

  /**
   * Cache the graphics for better performance (no-op in PixiJS, kept for API compatibility)
   */
  draw(): void {
    // PixiJS handles caching automatically with its WebGL renderer
    // This method is kept for backward compatibility
  }

  /**
   * Handle pointer down event (start of drag)
   */
  private handlePointerDown(event: PIXI.FederatedPointerEvent): void {
    this.isDragging = true;

    // Store the offset from the tile's position to where we clicked
    this.dragOffset.x = event.global.x - this.rootElement.x;
    this.dragOffset.y = event.global.y - this.rootElement.y;

    event.stopPropagation();
  }

  /**
   * Handle pointer move event (during drag)
   */
  private handlePointerMove(event: PIXI.FederatedPointerEvent): void {
    if (!this.isDragging) return;

    let hasSetPosition = false;

    // Call all drag callbacks
    // Callbacks can return true to indicate they've handled positioning
    this.onDragCallbacks.forEach((callback) => {
      const handled = callback(event);
      hasSetPosition = hasSetPosition || !!handled;
    });

    // Default drag behavior if no callback handled it
    if (!hasSetPosition) {
      // Convert global coordinates to parent's local coordinates
      if (this.rootElement.parent) {
        const localPos = this.rootElement.parent.toLocal(event.global);
        this.setPosition(
          localPos.x - this.itemType.width / 2,
          localPos.y - this.itemType.height / 2
        );
      }
    }

    event.stopPropagation();
  }

  /**
   * Handle pointer up event (end of drag)
   */
  private handlePointerUp(event: PIXI.FederatedPointerEvent): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.onDropCallbacks.forEach((callback) => callback(event));

    event.stopPropagation();
  }

  /**
   * Register a drag callback
   * Returns an unsubscribe function
   */
  onDrag(callback: (event: PIXI.FederatedPointerEvent) => boolean | void): () => void {
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
  onDrop(callback: (event: PIXI.FederatedPointerEvent) => void): () => void {
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
    this.rootElement.removeAllListeners();
    this.graphics.destroy();
    this.onDragCallbacks = [];
    this.onDropCallbacks = [];
  }
}

export default Tile;
