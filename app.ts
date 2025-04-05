import * as createjs from 'createjs-module';
import Config from './config';
import Grid from './grid';
import Tile from './tile';
import Drawer from './drawer';
import { magnetizeTile, demagnetize } from './magnetism';
import pannable from "./pannable";

function register(element: { rootElement: createjs.DisplayObject, draw: () => void }, options: { zIndex?: number } = {}) {
  stage.addChild(element.rootElement);
  element.draw();
  stage.update();
  if (options.zIndex) {
    stage.setChildIndex(element.rootElement, options.zIndex);
  }
}

const sizeUp = function() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = Config.width;
  canvas.height = Config.height;
}
sizeUp();

var stage = new createjs.Stage("canvas");
createjs.Ticker.on("tick", () => stage.update())
stage.framerate = 60;
stage.enableMouseOver();
stage.clear();

const map = new Grid(Config.map.rows, Config.map.cols, canvas.width / 2 - 5, canvas.height);
pannable.makePannable(map);
map.onPan((event) => {
  tiles.forEach((tile) => {
    demagnetize(tile);
    magnetizeTile(tile, [...map.corners(), ...drawer.corners()], tileWidth, stage);
    stage.update()
  });
});
register(map, { zIndex: 0 });

const drawer = new Drawer(canvas.width / 2 - 5, canvas.height);
drawer.setPosition(map.width + 10, 0);
drawer.onScroll((event) => {
  tiles.forEach((tile) => {
    demagnetize(tile);
    magnetizeTile(tile, [...map.corners(), ...drawer.corners()], tileWidth, stage);
    stage.update()
  });
});
register(drawer, { zIndex: 1 });

const tiles = [];
const tileWidth = drawer.grid.width / drawer.grid.cols;
const tileHeight = drawer.grid.height / drawer.grid.rows;

for(let i = 0; i < 16; i++) {
  const color = createjs.Graphics.getHSL(Math.random() * 360, 80, 80);
  const initialPos = drawer.corners()[i];
  const tile = new Tile(initialPos.x, initialPos.y, tileWidth, tileHeight, color);
  register(tile, { zIndex: 2 });

  tile.onDrag((event) => stage.update());

  magnetizeTile(tile, map.corners(), tileWidth, stage);
  magnetizeTile(tile, drawer.corners(), tileWidth, stage);

  tiles.push(tile);
}

// TODO:
// - Absolute positioning system?
// - TileSet drawer
// - Background image
// - Tile removal
// - Collision
// - See the actual features from Stardew Valley farm planner
