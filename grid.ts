import * as createjs from "createjs-module";
import TileSlot from "./tile_slot";

class Grid {
  stage: createjs.Stage;
  rows: number;
  cols: number;
  height: number;
  width: number;
  gridArray: any[];
  rectangleArray: any[];
  selectedRectangleId: string | null;
  slots: TileSlot[];

  constructor(stage: createjs.Stage, rows: number, cols: number, height: number | null = null, width: number | null = null) {
    this.rows = rows;
    this.cols = cols;
    this.height = height || stage.canvas.height;
    this.width = width || stage.canvas.width;
    this.stage = stage;
    this.gridArray = [];
    this.rectangleArray = [];
    this.selectedRectangleId = null;
    this.slots = [];

    this.drawGrid();
  }

  drawGrid() : void {
    this.stage.enableMouseOver();
    this.stage.removeAllChildren();
    this.stage.clear();
    this.stage.update();

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const rectangle = new createjs.Shape();
        const width = this.stage.canvas.width / this.cols;
        const height = this.stage.canvas.height / this.rows;

        var tileSlot = new TileSlot(x + "_" + y, width, height);
        tileSlot.setPosition(x * width, y * height);
        this.stage.setChildIndex(tileSlot.shape, 1);
        tileSlot.onSelect((slot) => {
          // Bump to max z-index so border shows
          this.stage.setChildIndex(slot.shape, 2);
        });
        this.slots.push(tileSlot);

        this.stage.addChild(tileSlot.shape);
        this.rectangleArray[rectangle.id] = rectangle;
      }
    }
    this.stage.update();
  }

  corners() : { x: number, y: number }[] {
    return this.slots.map((slot) => {
      return {
        x: slot.shape.x,
        y: slot.shape.y
      };
    });
  }
}

export default Grid;
