import * as createjs from 'createjs-module';

class Viewport {
  content: any;

  constructor(content: any, width: number, height: number, x: number = 0, y: number = 0){
    this.content = content;
    this.width = width;
    this.height = height;
    this.rootElement = new createjs.Container();
    this.rootElement.addChild(this.content.rootElement);
    this.setPosition(x, y);
    this.border = new createjs.Shape();
    this.rootElement.addChild(this.border);
  }

  draw() {
    const mask = new createjs.Shape();
    mask.graphics
      .beginFill("black")
      .drawRect(0, 0, this.width, this.height);
    this.content.rootElement.mask = mask;
    this.rootElement.setBounds(0, 0, this.width, this.height);
    this.content.rootElement.setBounds(0, 0, this.width, this.height);
    this.border.graphics
      .setStrokeStyle(2)
      .beginStroke("black")
      .drawRect(0, 0, this.width, this.height);
    this.content.draw();
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.rootElement.x = x;
    this.rootElement.y = y;
  }
}

export default Viewport;
