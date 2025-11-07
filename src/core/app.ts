import * as createjs from 'createjs-module';
import Config from '../config';
import Grid from '../components/Grid';
import Viewport from '../components/Viewport';
import Tile from '../entities/Tile';
import TileTemplate from '../entities/TileTemplate';
import Drawer from '../components/Drawer';
import { magnetizeTile, demagnetize } from '../systems/MagnetismSystem';
import pannable from "../systems/Pannable";
import { itemTypeRegistry, gameState, GameState } from '../services';
import type { ItemType } from '../types';

// ============================================================================
// Initialization
// ============================================================================

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

// ============================================================================
// Setup Item Types (Prototype - will load from JSON in Phase 3)
// ============================================================================

// Create 25 different colored tile types for the prototype
const prototypeItemTypes: ItemType[] = [];
for (let i = 0; i < 25; i++) {
  const hue = (i / 25) * 360; // Distribute colors across hue spectrum
  const color = createjs.Graphics.getHSL(hue, 80, 80);

  const itemType: ItemType = {
    id: `prototype_tile_${i}`,
    name: `Prototype Tile ${i}`,
    category: 'misc',
    width: 32,
    height: 32,
    sprite: '', // No sprite for prototype
    color: color,
    rotatable: false,
    collidable: true,
    description: `Colored test tile #${i}`
  };

  prototypeItemTypes.push(itemType);
  itemTypeRegistry.register(itemType);
}

console.log(`Registered ${itemTypeRegistry.count} item types`);

// ============================================================================
// Setup Stage and Components
// ============================================================================

const stage = new createjs.Stage("canvas");
stage.clear();

// Create farm map grid
const img = new Image();
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

// Create tile palette drawer
const drawer = new Drawer(canvas.width / 2 - 5, canvas.height);
drawer.setPosition(canvas.width / 2 + 10, 0);
register(drawer, { zIndex: 1 });

// ============================================================================
// Create Tile Templates in Drawer
// ============================================================================

const tiles: Tile[] = [];

prototypeItemTypes.forEach((itemType, i) => {
  const initialSlot = drawer.grid.slots[i];
  if (!initialSlot) return; // Safety check

  // Create template from item type
  const template = new TileTemplate(itemType);

  // Add template to drawer slot
  initialSlot.rootElement.addChild(template.rootElement);
  template.setPosition(0, 0);
  template.draw();
  initialSlot.rootElement.setChildIndex(template.rootElement, 1);

  // When template creates a new tile
  template.onTileCreated((newTile) => {
    // Track tile
    tiles.push(newTile);

    // Add tile data to game state
    gameState.addTile(newTile.getData());

    // Add to stage
    stage.addChild(newTile.rootElement);

    // Visual feedback during drag/drop
    newTile.onDrag((event) => {
      newTile.rootElement.alpha = 0.5;
      // Return false to use default drag behavior
      return false;
    });

    newTile.onDrop((event) => {
      newTile.rootElement.alpha = 1;

      // Update game state with final position
      gameState.updateTile(newTile.getData().id, {
        x: newTile.getData().x,
        y: newTile.getData().y
      });
    });

    // Setup magnetism for snapping to grid
    magnetizeTile(newTile, map.slots, itemType.width, stage);

    console.log(`Created tile:`, newTile.getData());
  });
});

// ============================================================================
// FPS Counter
// ============================================================================

const fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#444");
stage.addChild(fpsLabel);
fpsLabel.x = 10;
fpsLabel.y = 20;

// ============================================================================
// Game Loop
// ============================================================================

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.addEventListener("tick", (event) => {
  fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
  stage.update(event);
});
stage.framerate = 40;
stage.enableMouseOver();

// ============================================================================
// Debug Logging
// ============================================================================

console.log('stage', stage);
console.log('map', map);
console.log('gameState', gameState);

// Expose to window for debugging
(window as any).stage = stage;
(window as any).map = map;
(window as any).gameState = gameState;
(window as any).itemTypeRegistry = itemTypeRegistry;

// ============================================================================
// Save/Load Testing (for development)
// ============================================================================

// Example: Save state to console
(window as any).saveState = () => {
  const json = gameState.toString();
  console.log('Game State JSON:', json);
  return json;
};

// Example: Load state from JSON
(window as any).loadState = (json: string) => {
  try {
    const loaded = GameState.fromString(json);
    console.log('Loaded state:', loaded);
    return loaded;
  } catch (e) {
    console.error('Failed to load state:', e);
  }
};

console.log('💾 Save/Load functions available: window.saveState(), window.loadState(json)');
