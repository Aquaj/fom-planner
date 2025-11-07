import * as PIXI from 'pixi.js';
import type { SlotPosition } from '../types';

/**
 * TileSlot (Container + Position Marker)
 *
 * Represents a grid cell that can contain tiles.
 * Acts as both a position reference and a visual container.
 */
class TileSlot {
  /** Unique identifier (format: "row_col", e.g., "3_5") */
  id: string;

  /** Container for tiles placed in this slot */
  rootElement: PIXI.Container;

  /** Visual border */
  private border: PIXI.Graphics;

  /** Slot dimensions */
  width: number;
  height: number;

  /** Grid position */
  row: number;
  col: number;

  /**
   * Create a new TileSlot
   *
   * @param id - Unique identifier
   * @param width - Slot width in pixels
   * @param height - Slot height in pixels
   * @param row - Row index in grid
   * @param col - Column index in grid
   */
  constructor(id: string, width: number, height: number, row: number = 0, col: number = 0) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.row = row;
    this.col = col;

    // Create container
    this.rootElement = new PIXI.Container();

    // Create border
    this.border = new PIXI.Graphics();
    this.rootElement.addChild(this.border);

    this.render();
  }

  /**
   * Render the slot border
   */
  private render(): void {
    this.border.clear();
    this.border.rect(0, 0, this.width, this.height);
    this.border.stroke({ color: 0x000000, width: 1, alpha: 0.1 });
  }

  /**
   * Draw (for interface compatibility)
   */
  draw(): void {
    // Border is already rendered in constructor
  }

  /**
   * Set the slot's position
   */
  setPosition(x: number, y: number): void {
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

  /**
   * Get position data
   */
  getPosition(): SlotPosition {
    return {
      id: this.id,
      row: this.row,
      col: this.col,
      x: this.rootElement.x,
      y: this.rootElement.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Check if this slot contains a tile
   * (checks if there are children besides the border)
   */
  isOccupied(): boolean {
    return this.rootElement.children.length > 1;
  }

  /**
   * Get the global position of this slot
   */
  getGlobalPosition(): { x: number; y: number } {
    const pos = this.rootElement.toGlobal({ x: 0, y: 0 });
    return { x: pos.x, y: pos.y };
  }
}

export default TileSlot;
