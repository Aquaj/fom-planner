import * as createjs from "createjs-module";

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
    this.border = new createjs.Shape();
    this.rootElement.addChild(this.border);
    this.draw();

    let hitbox = new createjs.Shape();
    hitbox.graphics
      .beginFill("black")
      .drawRect(0, 0, this.width, this.height);
    hitbox.cursor = "pointer";
    this.border.hitArea = hitbox;

    this.border.addEventListener("mouseover", () => {
      this.hovered = true;
      this.draw();
    });
    this.border.addEventListener("mouseout", () => {
      this.hovered = false;
      this.draw();
    });
    this.border.addEventListener("click", (e) => {
      this.toggleSelect();
      this.draw();
    });
  }

  draw() {
    if (this.selected) {
      this.selectedLook();
    } else if (this.hovered) {
      this.hoveredLook();
    } else {
      this.defaultLook();
    }
  }

  selectedLook() {
    this.border.graphics.clear()
      .setStrokeStyle(3)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
  }

  defaultLook() {
    this.border.graphics.clear()
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
  }

  hoveredLook() {
    this.border.graphics.clear()
      .beginFill(createjs.Graphics.getRGB(255, 255, 0, 0.2))
      .setStrokeStyle(1)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
  }

  setPosition(x: number, y: number) {
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

  toggleSelect() {
    if (this.selected) {
      this.selected = false;
    } else {
      this.selected = true;
      this.selectCallbacks.forEach(callback => callback(this));
    }
  }

  onSelect(callback: () => void) {
    this.selectCallbacks.push(callback);
  }
}

export default TileSlot;
