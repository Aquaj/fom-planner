import * as createjs from "createjs-module";

class Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  rootElement: createjs.Shape;
  fillColor: string;
  onDragCallbacks: (() => void)[];
  onDropCallbacks: (() => void)[];

  constructor(x: number, y: number, width: number, height: number, fillColor: string = "lightblue") {
    this.rootElement = new createjs.Shape();

    this.width = width;
    this.height = height;

    this.setPosition(x, y);
    this.fillColor = fillColor;

    this.rootElement.cursor = "pointer";
    this.onDragCallbacks = [];
    this.onDropCallbacks = [];
    this.rootElement.on("pressmove", (event: createjs.Event) => this.handleDrag(event));
    this.rootElement.on("pressup", (event: createjs.Event) => this.handleDrop(event));
  }

  draw() {
    this.defaultLook();
  }

  defaultLook() {
    this.rootElement.graphics.clear()
      .beginFill(this.fillColor)
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
    this.setPosition(this.x, this.y);
  }

  handleDrag(event: createjs.Event) {
    var hasSetPosition = false;
    this.onDragCallbacks.forEach((callback) => {
      if (hasSetPosition) return;
      hasSetPosition = callback(event);
    });

    if (!hasSetPosition) {
      this.setPosition(
        event.stageX - this.width / 2,
        event.stageY - this.height / 2
      )
    }
    event.stopPropagation();
  }

  handleDrop(event: createjs.Event) {
    this.onDropCallbacks.forEach((callback) => {
      callback(event);
    });
  }

  onDrop(callback: () => void) {
    this.onDropCallbacks.push(callback);
  }

  onDrag(callback: () => void) {
    this.onDragCallbacks.push(callback);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.rootElement.x = x;
    this.rootElement.y = y;
  }
}

export default Tile;
