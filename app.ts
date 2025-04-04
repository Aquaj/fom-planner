import * as createjs from 'createjs-module';
import Grid from './grid';
import Tile from './tile';
import magnetize from './magnetism';

function register(element: { rootElement: createjs.DisplayObject, draw: () => void }, options: { zIndex?: number } = {}) {
  stage.addChild(element.rootElement);
  element.draw();
  stage.update();
  stage.setChildIndex(element.rootElement, options.zIndex);
}

var stage = new createjs.Stage("canvas");
createjs.Ticker.on("tick", tick);
function tick(event) {
  stage.update(event);
}
stage.enableMouseOver();
stage.clear();

const numRows = 10;
const numCols = 10;

const tileWidth = stage.canvas.width / numCols;
const tileHeight = stage.canvas.height / numRows;

const grid = new Grid(numRows, numCols, stage.canvas.width, stage.canvas.height);
register(grid);
stage.update();

var tiles = [];
for(let i = 0; i < 10; i++) {
  const randomSlotIndex = Math.floor(Math.random() * grid.slots.length);
  const initialPos = grid.corners()[randomSlotIndex];

  const color = createjs.Graphics.getHSL(Math.random() * 360, 80, 80);

  const tile = new Tile(initialPos.x, initialPos.y, tileWidth, tileHeight, color);
  register(tile, { zIndex: 2 });

  magnetize(tile, grid.corners(), tileWidth * 0.4);

  tiles.push(tile);
}

// TODO:
// - TileSet drawer
// - Background image
// - Tile removal
// - Collision
// - See the actual features from Stardew Valley farm planner
