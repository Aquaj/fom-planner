import createjs from "createjs-module";
import Grid from "./grid";

class Drawer {
  background: createjs.Shape;
  grid: Grid;
  rootElement: createjs.Container;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
    this.rootElement = new createjs.Container();
  }

  draw() {
    this.addBackground();
    this.addGrid();
  }

  addBackground() {
    this.background = new createjs.Shape();
    this.background.graphics
      .setStrokeStyle(1)
      .beginStroke("black")
      .beginFill("brown")
      .drawRect(0, 0, this.width - 10, this.height);
    this.rootElement.addChild(this.background);
    this.rootElement.setChildIndex(this.background, 0);
  }

  addGrid() {
    this.grid = new Grid(10, 10, this.width - 10, this.height);
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
        y: slot.y + this.rootElement.y
      }
    })
  }
}

export default Drawer;
