import * as createjs from 'createjs-module';
import Config from './config';
import Grid from './grid';
import Viewport from './viewport';
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

var img = new Image();
const map = new Grid(
  Config.map.rows,
  Config.map.cols,
  Config.map.width,
  Config.map.height,
  img
);
img.src = Config.map.backgroundImage;

const mapView = new Viewport(map, canvas.width / 2 - 5, canvas.height, 0, 0);
pannable.makePannable(map);
map.onPan((event) => {
  tiles.forEach((tile) => {
    demagnetize(tile);
    magnetizeTile(tile, [...map.corners(), ...drawer.corners()], tileWidth, stage);
    stage.update()
  });
});
register(mapView, { zIndex: -1 });

const drawer = new Drawer(canvas.width / 2 - 5, canvas.height);
drawer.setPosition(canvas.width / 2 + 10, 0);
drawer.onScroll((event) => {
  tiles.forEach((tile) => {
    demagnetize(tile);
    magnetizeTile(tile, [...map.corners(), ...drawer.corners()], tileWidth, stage);
    stage.update()
  });
});
register(drawer, { zIndex: 1 });

const tiles = [];
const tileWidth = 32
const tileHeight = 32

for(let i = 0; i < 16; i++) {
  const color = createjs.Graphics.getHSL(Math.random() * 360, 80, 80);
  const initialSlot = drawer.grid.slots[i];
  const tile = new Tile(0, 0, tileWidth, tileHeight, color);

  initialSlot.rootElement.addChild(tile.rootElement);
  tile.setPosition(0, 0);
  tile.draw();
  initialSlot.rootElement.setChildIndex(tile.rootElement, 1);

  magnetizeTile(tile, map.corners(), tileWidth, stage);
  magnetizeTile(tile, drawer.corners(), tileWidth, stage);

  tile.onDrag((event) => stage.update());

  tiles.push(tile);
}

// TODO:
// - Absolute positioning system?
// - TileSet drawer
// - Background image
// - Tile removal
// - Collision
// - See the actual features from Stardew Valley farm planner
