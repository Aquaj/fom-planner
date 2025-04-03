import * as createjs from "createjs-module";

class Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: createjs.Shape;
  fillColor: string;
  onDragCallbacks: (() => void)[];

  constructor(x: number, y: number, width: number, height: number, fillColor: string = "lightblue") {
    this.x = 0;
    this.y = 0;

    this.width = width;
    this.height = height;

    this.shape = new createjs.Shape();
    this.fillColor = fillColor;

    this.shape.cursor = "pointer";
    this.onDragCallbacks = [];
    this.shape.on("pressmove", (event: createjs.Event) => this.handleDrag(event));

    this.drawTile();

    this.setPosition(x, y);
  }

  drawTile() {
    this.shape.graphics
      .clear()
      .beginFill(this.fillColor)
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(this.x, this.y, this.width, this.height);
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
    event.target.parent.update();
  }

  onDrag(callback: () => void) {
    this.onDragCallbacks.push(callback);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.shape.x = x;
    this.shape.y = y;
  }
}

export default Tile;
