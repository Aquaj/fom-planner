import * as PIXI from 'pixi.js';
import Grid from "./Grid";
import scrollable from "../systems/Scrollable";
import type { Renderable, Dimensional, Container as IContainer } from '../types';
import { cssColorToHex } from '../rendering/ShapeRenderer';

class Drawer implements Renderable, Dimensional, IContainer {
  rootElement: PIXI.Container;
  background: PIXI.Graphics;
  grid: Grid;
  width: number;
  height: number;
  scroller: (event: WheelEvent) => void;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
    this.rootElement = new PIXI.Container();
    this.background = new PIXI.Graphics();
    this.grid = new Grid(this.height * 2 / 32, this.width / 32, this.width, this.height * 2);

    scrollable.makeScrollable(this, this.grid, 0, this.height);
  }

  draw() {
    this.addBackground();
    this.addGrid();
  }

  addBackground() {
    const brownColor = cssColorToHex("brown");

    this.background.clear();
    this.background.rect(0, 0, this.width, this.height);
    this.background.fill({ color: brownColor, alpha: 1 });
    this.background.stroke({ color: 0x000000, width: 1 });

    this.rootElement.addChild(this.background);
    this.rootElement.setChildIndex(this.background, 0);
  }

  addGrid() {
    this.grid.draw();
    this.rootElement.addChild(this.grid.rootElement);
    this.rootElement.setChildIndex(this.grid.rootElement, 1);
  }

  setPosition(x: number, y: number) {
    this.rootElement.x = x;
    this.rootElement.y = y;
  }

  corners() {
    return this.grid.corners().map((slot) => {
      return {
        x: slot.x + this.rootElement.x,
        y: slot.y + this.rootElement.y,
        slot: slot.slot
      }
    })
  }
}

export default Drawer;
