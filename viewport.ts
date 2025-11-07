import createjs from "createjs-module";
import type { Renderable, Dimensional } from './types';

class Viewport {
  content: Renderable & Dimensional;
  rootElement: createjs.Container;

  constructor(content: Renderable & Dimensional, width: number, height: number, x: number = 0, y: number = 0){
    this.content = content;
    this.rootElement = new createjs.Container();
    this.rootElement.x = x;
    this.rootElement.y = y;

    const mask = new createjs.Shape();
    mask.graphics.beginFill("black").drawRect(0, 0, width, height);
    this.rootElement.addChild(this.content.rootElement);
    this.rootElement.mask = mask;

    // Add border for visual clarity
    const border = new createjs.Shape();
    border.graphics.setStrokeStyle(2).beginStroke("black").drawRect(0, 0, width, height);
    this.rootElement.addChild(border);

    this.content.rootElement.setBounds(0, 0, this.content.width, this.content.height);
    this.rootElement.scale = this.content.width / width;
  }

  draw(): void {
    this.content.draw();
  }
}

export default Viewport;
