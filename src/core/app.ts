import * as createjs from 'createjs-module';
import Config from '../config';
import Grid from '../components/Grid';
import Viewport from '../components/Viewport';
import Tile from '../entities/Tile';
import TileTemplate from '../entities/TileTemplate';
import Drawer from '../components/Drawer';
import { magnetizeTile, demagnetize } from '../systems/MagnetismSystem';
import pannable from "../systems/Pannable";

function register(element: { rootElement: createjs.DisplayObject, draw: () => void }, options: { zIndex?: number } = {}) {
  stage.addChild(element.rootElement);
  element.draw();
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
register(mapView, { zIndex: -1 });

const drawer = new Drawer(canvas.width / 2 - 5, canvas.height);
drawer.setPosition(canvas.width / 2 + 10, 0);
register(drawer, { zIndex: 1 });

const tiles = [];
const tileWidth = 32
const tileHeight = 32

for(let i = 0; i < 25; i++) {
  const color = createjs.Graphics.getHSL(Math.random() * 360, 80, 80);
  const initialSlot = drawer.grid.slots[i];
  const tile = new TileTemplate(0, 0, tileWidth, tileHeight, color);

  initialSlot.rootElement.addChild(tile.rootElement);
  tile.setPosition(0, 0);
  tile.draw();
  initialSlot.rootElement.setChildIndex(tile.rootElement, 1);

  tile.onTileCreated((newTile) => {
    tiles.push(newTile);
    stage.addChild(newTile.rootElement);
    // Maybe move into Tile?
    newTile.onDrag((event) => {
      newTile.rootElement.alpha = 0.5;
    });
    newTile.onDrop((event) => {
      newTile.rootElement.alpha = 1;
    });
    magnetizeTile(newTile, map.slots, tileWidth, stage);
  });

}
const fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#444");
stage.addChild(fpsLabel);
fpsLabel.x = 10;
fpsLabel.y = 20;

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.addEventListener("tick", () => {
  fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
  // draw the updates to stage:
  stage.update(event);
});
stage.framerate = 40;
stage.enableMouseOver();

console.log('stage', stage);
console.log('map', map);

// TODO:
// - Tile removal
// - Collision detection
// - Add FoM-specific features (see ROADMAP.md for full plan)
