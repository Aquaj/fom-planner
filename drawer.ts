import createjs from "createjs-module";
import Grid from "./grid";

import scrollable from "./scrollable";

class Drawer {
  rootElement: createjs.Container;
  background: createjs.Shape;
  grid: Grid;
  width: number;
  height: number;
  scroller: (event: WheelEvent) => void;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
    this.rootElement = new createjs.Container();
    this.background = new createjs.Shape();
    this.grid = new Grid(20, 10, this.width - 10, this.height * 2);

    scrollable.makeScrollable(this, this.grid, 0, this.height);
  }

  draw() {
    this.addBackground();
    this.addGrid();
  }

  addBackground() {
    this.background.graphics
      .setStrokeStyle(1)
      .beginStroke("black")
      .beginFill("brown")
      .drawRect(0, 0, this.width - 10, this.height);
    this.rootElement.addChild(this.background);
    this.rootElement.setChildIndex(this.background, 0);
  }

  addGrid() {
    this.grid.draw();
    this.rootElement.addChild(this.grid.rootElement);
    this.rootElement.setChildIndex(this.grid.rootElement, 1);
  }

  setPosition(x: number, y: number) {
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

  corners() : { x: number, y: number }[] {
    return this.grid.corners().map((slot) => {
      return {
        x: slot.x + this.rootElement.x,
        y: slot.y + this.rootElement.y,
        slot: slot.slot
      }
    })
  }
}

export default Drawer;
