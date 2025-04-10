import Tile from './tile';

class TileTemplate extends Tile {
  active: boolean = false;
  newTile: Tile | null = null;
  onTileCreatedCallbacks: ((tile: Tile) => void)[] = [];

  constructor(x: number, y: number, width: number, height: number, fillColor: string = "lightblue") {
    super(x, y, width, height, fillColor);
    this.active = false;
    this.newTile = null;
    this.rootElement.cursor = "pointer";
  }

  draw() {
    this.defaultLook();
  }

  handleDrag(event: createjs.Event) {
    if (this.active) {
      this.newTile?.handleDrag(event);
      return;
    }
    // Create a new tile to drag instead
    this.active = true;
    this.newTile = this.createNewTile();

    this.newTile.setPosition(
      event.stageX - this.width / 2,
      event.stageY - this.height / 2
    );
    this.newTile.handleDrag(event);
  }

  onTileCreated(callback: (tile: Tile) => void) {
    this.onTileCreatedCallbacks.push(callback);
  }

  handleDrop(event: createjs.Event) {
    this.active = false;
    this.newTile?.handleDrop(event);
    this.newTile = null;
  }

  createNewTile() {
    const newTile = new Tile(0, 0, this.width, this.height, this.fillColor);
    newTile.rootElement.graphics = this.rootElement.graphics;
    this.onTileCreatedCallbacks.forEach(callback => callback(newTile));
    return newTile;
  }
}

export default TileTemplate;
