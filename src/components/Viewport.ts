import * as PIXI from 'pixi.js';
import type { Renderable, Dimensional } from '../types';

class Viewport {
  content: Renderable & Dimensional;
  rootElement: PIXI.Container;

  constructor(content: Renderable & Dimensional, width: number, height: number, x: number = 0, y: number = 0){
    this.content = content;
    this.rootElement = new PIXI.Container();
    this.rootElement.x = x;
    this.rootElement.y = y;

    // Create mask
    const mask = new PIXI.Graphics();
    mask.rect(0, 0, width, height);
    mask.fill({ color: 0x000000 });

    // Add content and apply mask
    this.rootElement.addChild(this.content.rootElement);
    this.rootElement.mask = mask;
    this.rootElement.addChild(mask); // Mask must be in display tree

    // Add border for visual clarity
    const border = new PIXI.Graphics();
    border.rect(0, 0, width, height);
    border.stroke({ color: 0x000000, width: 2 });
    this.rootElement.addChild(border);

    // Set scale
    this.rootElement.scale.set(this.content.width / width);
  }

  draw(): void {
    this.content.draw();
  }
}

export default Viewport;
