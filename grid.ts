import * as createjs from "createjs-module";
import TileSlot from "./tile_slot";

class Grid {
  rootElement: createjs.Container;
  rows: number;
  cols: number;
  height: number;
  width: number;
  selectedRectangleId: string | null;
  slots: TileSlot[];

  constructor(rows: number, cols: number, width?: number = null, height?: number = null) {
    this.rows = rows;
    this.cols = cols;
    this.height = height;
    this.width = width;
    this.rootElement = new createjs.Container();
    this.selectedRectangleId = null;
    this.slots = [];
  }

  draw() : void {
    this.rootElement.removeAllChildren();

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const rectangle = new createjs.Shape();
        const width = this.width / this.cols;
        const height = this.height / this.rows;

        var tileSlot = new TileSlot(x + "_" + y, width, height);
        tileSlot.setPosition(x * width, y * height);
        this.rootElement.setChildIndex(tileSlot.rootElement, 1);
        tileSlot.onSelect((slot) => {
          // Bump to max z-index so border shows
          this.rootElement.setChildIndex(slot.rootElement, 2);
        });
        this.slots.push(tileSlot);

        this.rootElement.addChild(tileSlot.rootElement);
      }
    }
  }

  corners() : { x: number, y: number }[] {
    return this.slots.map((slot) => {
      return {
        x: slot.rootElement.x + this.rootElement.x,
        y: slot.rootElement.y + this.rootElement.y
      };
    });
  }
}

export default Grid;
