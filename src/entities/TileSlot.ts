import * as createjs from "createjs-module";

const defaultStyle = new createjs.Graphics()
defaultStyle.clear()
  .setStrokeStyle(1)
  .beginStroke("black")
  .drawRect(0, 0, 32, 32)
class TileSlot {
  id: string;
  width: number;
  height: number;
  rootElement: createjs.Shape;
  selected: boolean;
  hovered: boolean;
  selectCallbacks: (() => void)[];

  constructor(id: string, width: number, height: number) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.selected = false;
    this.selectCallbacks = [];

    this.rootElement = new createjs.Container();
    this.border = new createjs.Shape(defaultStyle);
    this.rootElement.addChild(this.border);
    this.draw();
    this.border.cache(0, 0, this.width, this.height);

  }

  draw() {
      this.defaultLook();
  }

  defaultLook() {
    this.border.alpha = 0.1;
    this.border.graphics = defaultStyle;
  }

  setPosition(x: number, y: number) {
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

}

export default TileSlot;
