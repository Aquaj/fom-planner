import * as createjs from "createjs-module";
import TileSlot from "../entities/TileSlot";
import type { Renderable, Dimensional, Pannable } from '../types';

class Grid implements Renderable, Dimensional, Pannable {
  rootElement: createjs.Container;
  border: createjs.Shape;
  rows: number;
  cols: number;
  height: number;
  width: number;
  x: number;
  y: number;
  selectedRectangleId: string | null;
  slots: TileSlot[];
  panner: (event: createjs.Event) => void;
  backgroundImage: string | null;

  constructor(rows: number, cols: number, width: number = 0, height: number = 0, backgroundImage: HTMLImageElement | null = null) {
    this.rows = rows;
    this.cols = cols;
    this.height = height;
    this.width = width;
    this.x = 0;
    this.y = 0;
    this.rootElement = new createjs.Container();
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
    this.rootElement.removeAllChildren();

    if (this.backgroundImage) {
      this.backgroundImage.onload = () => {
        this.background = new createjs.Shape();
        this.rootElement.addChild(this.background);
        this.background.graphics.
          beginBitmapFill(this.backgroundImage, "no-repeat").
          drawRect(0, 0, this.width, this.height);
        this.rootElement.setChildIndex(this.background, 0);
        this.background.cache(0, 0, this.width, this.height);
      }
    }

    this.border = new createjs.Shape();
    this.rootElement.addChild(this.border);
    this.border.graphics.clear()
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height)

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const slotWidth = this.width / this.cols;
        const slotHeight = this.height / this.rows;

        const tileSlot = new TileSlot(`${row}_${col}`, slotWidth, slotHeight, row, col);
        tileSlot.setPosition(col * slotWidth, row * slotHeight);
        this.rootElement.setChildIndex(tileSlot.rootElement, 1);
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
