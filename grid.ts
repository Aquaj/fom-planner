import * as createjs from "createjs-module";
import TileSlot from "./tile_slot";

class Grid {
  rootElement: createjs.Container;
  border: createjs.Shape;
  rows: number;
  cols: number;
  height: number;
  width: number;
  selectedRectangleId: string | null;
  slots: TileSlot[];
  panner: (event: createjs.Event) => void;
  backgroundImage: string | null;

  constructor(rows: number, cols: number, width?: number = null, height?: number = null, backgroundImage?: string = null) {
    this.rows = rows;
    this.cols = cols;
    this.height = height;
    this.width = width;
    this.rootElement = new createjs.Container();
    this.selectedRectangleId = null;
    this.backgroundImage = backgroundImage;
    this.slots = [];
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

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const width = this.width / this.cols;
        const height = this.height / this.rows;

        var tileSlot = new TileSlot(x + "_" + y, width, height);
        tileSlot.setPosition(x * width, y * height);
        this.rootElement.setChildIndex(tileSlot.rootElement, 1);
        this.slots.push(tileSlot);

        this.rootElement.addChild(tileSlot.rootElement);
      }
    }
  }

  corners() : { x: number, y: number }[] {
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
