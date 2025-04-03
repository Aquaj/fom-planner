import * as createjs from 'createjs-module';
import Grid from './grid';
import Tile from './tile';
import magnetize from './magnetism';


var stage = new createjs.Stage("canvas");
createjs.Ticker.on("tick", tick);
function tick(event) {
  stage.update(event);
}

const numRows = 10;
const numCols = 10;

const tileWidth = stage.canvas.width / numCols;
const tileHeight = stage.canvas.height / numRows;

const grid = new Grid(stage, numRows, numCols);
var tiles = [];
for(let i = 0; i < 10; i++) {
  const initialPos = grid.corners()[Math.floor(Math.random() * grid.corners().length)];
  const color = createjs.Graphics.getHSL(Math.random() * 360, 80, 80);
  const tile = new Tile(initialPos.x, initialPos.y, tileWidth, tileHeight, color);
  stage.addChild(tile.shape);
  stage.setChildIndex(tile.shape, stage.getNumChildren() + 1);

  magnetize(tile, grid.corners(), tileWidth * 0.4);

  tiles.push(tile);
}
