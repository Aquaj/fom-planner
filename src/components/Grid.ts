import * as PIXI from 'pixi.js';
import TileSlot from "../entities/TileSlot";
import type { Renderable, Dimensional, Pannable } from '../types';

class Grid implements Renderable, Dimensional, Pannable {
  rootElement: PIXI.Container;
  border: PIXI.Graphics;
  background?: PIXI.Sprite;
  rows: number;
  cols: number;
  height: number;
  width: number;
  x: number;
  y: number;
  selectedRectangleId: string | null;
  slots: TileSlot[];
  panner: (event: PIXI.FederatedPointerEvent) => void;
  backgroundImage: string | null;

  constructor(rows: number, cols: number, width: number = 0, height: number = 0, backgroundImage: HTMLImageElement | null = null) {
    this.rows = rows;
    this.cols = cols;
    this.height = height;
    this.width = width;
    this.x = 0;
    this.y = 0;
    this.rootElement = new PIXI.Container();
    this.border = new PIXI.Graphics();
    this.selectedRectangleId = null;
    this.backgroundImage = backgroundImage as any; // Image element stored for background
    this.slots = [];
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

  draw() : void {
    this.rootElement.removeChildren();

    // Add background image if provided
    if (this.backgroundImage) {
      // Create texture from image source
      const texture = PIXI.Texture.from(this.backgroundImage);
      this.background = new PIXI.Sprite(texture);
      this.background.width = this.width;
      this.background.height = this.height;
      this.rootElement.addChild(this.background);
    }

    // Add border
    this.border.clear();
    this.border.rect(0, 0, this.width, this.height);
    this.border.stroke({ color: 0x000000, width: 1 });
    this.rootElement.addChild(this.border);

    // Add tile slots
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const slotWidth = this.width / this.cols;
        const slotHeight = this.height / this.rows;

        const tileSlot = new TileSlot(`${row}_${col}`, slotWidth, slotHeight, row, col);
        tileSlot.setPosition(col * slotWidth, row * slotHeight);
        this.slots.push(tileSlot);

        this.rootElement.addChild(tileSlot.rootElement);
      }
    }
  }

  corners() : { x: number, y: number, slot: TileSlot }[] {
    return this.slots.map((slot) => {
      return {
        x: slot.rootElement.x + this.rootElement.x,
        y: slot.rootElement.y + this.rootElement.y,
        slot: slot
      };
    });
  }
}

export default Grid;
