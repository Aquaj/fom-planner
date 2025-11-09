import * as PIXI from 'pixi.js';
import Tile from './Tile';
import type { ItemType, TileData } from '../types';
import { generateId } from '../utils';
import { cssColorToHex } from '../rendering/ShapeRenderer';

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
  rootElement: PIXI.Container;

  /** Graphics for rendering */
  private graphics: PIXI.Graphics;

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
    this.rootElement = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.rootElement.addChild(this.graphics);

    // Enable interactivity
    this.rootElement.eventMode = 'static';
    this.rootElement.cursor = 'pointer';
    this.rootElement.x = x;
    this.rootElement.y = y;

    // Render the template
    this.render();

    // Attach event handlers
    this.rootElement.on('pointerdown', (event: PIXI.FederatedPointerEvent) => this.handlePointerDown(event));
    this.rootElement.on('pointermove', (event: PIXI.FederatedPointerEvent) => this.handlePointerMove(event));
    this.rootElement.on('pointerup', (event: PIXI.FederatedPointerEvent) => this.handlePointerUp(event));
    this.rootElement.on('pointerupoutside', (event: PIXI.FederatedPointerEvent) => this.handlePointerUp(event));
  }

  /**
   * Render the template visual
   */
  private render(): void {
    const { width, height, color = "lightblue" } = this.itemType;
    const colorHex = typeof color === 'string' ? cssColorToHex(color) : color;

    this.graphics.clear();
    this.graphics.rect(0, 0, width, height);
    this.graphics.fill({ color: colorHex, alpha: 1 });
    this.graphics.stroke({ color: 0x000000, width: 1 });
  }

  /**
   * Draw (cache for performance - no-op in PixiJS)
   */
  draw(): void {
    // PixiJS handles caching automatically
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
   * Handle pointer down event
   */
  private handlePointerDown(event: PIXI.FederatedPointerEvent): void {
    // Create a new tile at the cursor position
    const tile = this.createTile(
      event.global.x - this.itemType.width / 2,
      event.global.y - this.itemType.height / 2
    );

    this.activeTile = tile;
    this.isDragging = true;

    // Notify observers
    this.onTileCreatedCallbacks.forEach(callback => callback(tile));

    event.stopPropagation();
  }

  /**
   * Handle pointer move event
   */
  private handlePointerMove(event: PIXI.FederatedPointerEvent): void {
    if (!this.isDragging || !this.activeTile) return;

    // Update the tile's position as we drag
    // The tile itself will handle the drag logic through its callbacks
    if (this.activeTile.rootElement.parent) {
      const localPos = this.activeTile.rootElement.parent.toLocal(event.global);
      this.activeTile.setPosition(
        localPos.x - this.itemType.width / 2,
        localPos.y - this.itemType.height / 2
      );
    }

    event.stopPropagation();
  }

  /**
   * Handle pointer up event
   */
  private handlePointerUp(event: PIXI.FederatedPointerEvent): void {
    if (!this.isDragging) return;

    // Reset state
    this.isDragging = false;
    this.activeTile = null;

    event.stopPropagation();
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
    this.rootElement.removeAllListeners();
    this.graphics.destroy();
    this.onTileCreatedCallbacks = [];
    this.activeTile = null;
  }
}

export default TileTemplate;
