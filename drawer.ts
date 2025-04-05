import createjs from "createjs-module";
import Grid from "./grid";

class Drawer {
  background: createjs.Shape;
  grid: Grid;
  rootElement: createjs.Container;
  width: number;
  height: number;
  scroller: (event: WheelEvent) => void;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
    this.rootElement = new createjs.Container();
    this.rootElement.on("mouseover", (event: createjs.Event) => {
      this.scroller = (event: WheelEvent) => { this.scroll(event) };
      document.addEventListener("wheel", this.scroller);
    })
    this.rootElement.on("mouseout", (event: createjs.Event) => {
      document.removeEventListener("wheel", this.scroller);
    })
  }

  scroll(event: WheelEvent) {
    const grid_top = this.grid.rootElement.y;
    const grid_bottom = this.grid.rootElement.y + this.grid.height;
    if (grid_top >= 0 && event.deltaY > 0) {
      this.grid.rootElement.y = 0;
      return
    }
    if (grid_bottom <= this.height && event.deltaY < 0) {
      this.grid.rootElement.y = this.height - this.grid.height;
      return
    }
    if (grid_top <= 0 && grid_bottom >= this.height) {
      this.grid.rootElement.y += event.deltaY;
    }
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
    this.grid = new Grid(20, 10, this.width - 10, this.height * 2);
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
