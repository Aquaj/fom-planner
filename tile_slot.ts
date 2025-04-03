import * as createjs from "createjs-module";

class TileSlot {
  id: string;
  width: number;
  height: number;
  shape: createjs.Shape;
  selected: boolean;
  selectCallbacks: (() => void)[];

  constructor(id: string, width: number, height: number) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.selected = false;
    this.selectCallbacks = [];

    this.shape = new createjs.Shape();
    this.defaultLook();

    this.shape.cursor = "pointer";

    this.shape.addEventListener("mouseover", () => {
      if (!this.selected) {
        this.hover();
      }
    });
    this.shape.addEventListener("mouseout", () => {
      if (!this.selected) {
        this.defaultLook();
      }
    });
    this.shape.addEventListener("click", () => {
      this.toggleSelect();
    });
  }

  setPosition(x: number, y: number) {
    this.shape.x = x;
    this.shape.y = y;
  }

  hover() {
    this.shape.graphics.clear()
      .beginFill("lightgray")
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
  }

  toggleSelect() {
    if (this.selected) {
      this.unselect();
    } else {
      this.select();
    }
  }

  select() {
    this.selectCallbacks.forEach(callback => callback(this));
    this.selected = true;
    this.shape.graphics.clear()
      .beginFill("lightgray")
      .setStrokeStyle(3)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
  }

  unselect() {
    this.selected = false;
    this.defaultLook();
  }

  defaultLook() {
    this.shape.graphics.clear()
      .beginFill("white")
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
  }

  onSelect(callback: () => void) {
    this.selectCallbacks.push(callback);
  }
}

export default TileSlot;
