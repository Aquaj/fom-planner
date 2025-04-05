import createjs from 'createjs-module';

interface Point {
  x: number;
  y: number;
  snapDistance?: number;
  unsnapDistance?: number;
}
interface Draggable {
  x: number;
  y: number;
  onDrag: (callback: () => void) => void;
  setPosition: (x: number, y: number) => void;
}
type DraggableConfig = {
  snaps: Point[];
  snappedTo: Point;
}
type Magnetism = Map<Draggable, DraggableConfig>;

const magnetism: Magnetism = new Map();

function demagnetize(draggable: Draggable, points?: Point[]) {
  const config = magnetism.get(draggable);
  if (!config) return;

  if (points) {
    config.snaps = config.snaps.filter((p) => {
      return !points.some((p2) => p.x === p2.x && p.y === p2.y);
    });
  } else {
    config.snaps = [];
  }

  if (config.snappedTo && points && points.includes(config.snappedTo)) {
    config.snappedTo = null;
  }
}

function magnetize(
  draggable: Draggable,
  points: Point[],
  snapDistance: number = 20,
  unsnapDistance: number = snapDistance + 10,
  callback: () => void = (event) => drag(draggable, event)
) {
  const config = magnetism.get(draggable) || { snaps: [], snappedTo: null };
  if (!magnetism.has(draggable)) { magnetism.set(draggable, config) }

  config.snaps = config.snaps.filter((p) => {
    return !points.some((p2) => p.x === p2.x && p.y === p2.y);
  })
  points.forEach((p) => {
    if (p.snapDistance == null) p.snapDistance = snapDistance;
    if (p.unsnapDistance == null) p.unsnapDistance = unsnapDistance;
  });
  config.snaps.push(...points);

  if (config.snappedTo && !points.includes(config.snappedTo)) {
    config.snappedTo = null;
  }

  draggable.onDrag(callback);
}

function drag(draggable: Draggable, event: createjs.Event) {
  const config = magnetism.get(draggable);
  if (!config) return false;

  let neighbour: Point | null = null; // what we want to snap to
  let dist: number | null = null; // The current distance to our snap partner
  const cornerPos = { // Shape pos if it was centered on cursor
    x: event.stageX - draggable.width / 2,
    y: event.stageY - draggable.height / 2
  };

  const snaps = config.snaps;
  for (let i = 0; i < snaps.length; i++) {
    const p = snaps[i];

    // Determine the distance from the mouse position to the point
    const diffX = Math.abs(cornerPos.x - p.x);
    const diffY = Math.abs(cornerPos.y - p.y);
    const d = Math.sqrt(diffX * diffX + diffY * diffY);

    // If the current point is closeEnough and the closest (so far)
    // Then choose it to snap to.
    const closest = d < p.snapDistance && (dist == null || d < dist);
    if (closest) {
      neighbour = p;
      dist = d;
    }
  }

  // If there is a close neighbour, snap to it.
  if (neighbour && config.snappedTo !== neighbour) {
    config.snappedTo = neighbour;
    draggable.setPosition(neighbour.x, neighbour.y);
    return true;
  }
  const snapTarget = config.snappedTo;
  if (!snapTarget) {
    // We are not snapping to anything, so just return false
    return false;
  }

  const distToSnap = Math.sqrt(
    Math.pow(cornerPos.x - snapTarget.x, 2) +
      Math.pow(cornerPos.y - snapTarget.y, 2)
  );

  if (distToSnap < config.snappedTo.unsnapDistance) {
    // We are still within the unsnap distance, so don't do anything
    return true;
  }

  // We are outside the unsnap distance, so remove the snap, let regular drag-handling
  // take over
  config.snappedTo = null;
  return false;
}

function magnetizeTile(tile, slots, tileWidth, stage) {
  const tileSnap = (event) => {
    const didSnap = drag(tile, event);
    const config = magnetism.get(tile);

    if (config.snappedTo) {
      const slot = config.snappedTo.slot;

      if (slot.rootElement.children.includes(tile.rootElement)) return didSnap;

      const newPos = tile.rootElement.localToLocal(0, 0, slot.rootElement);

      tile.setPosition(newPos.x, newPos.y);
      slot.rootElement.addChild(tile.rootElement);
    } else {
      if (!stage.children.includes(tile.rootElement)) {
        tile.setPosition(tile.rootElement.localToLocal(0, 0, stage));
        stage.addChild(tile.rootElement);
      }
    }

    return didSnap;
  }
  magnetize(tile, slots, tileWidth * 0.4, tileWidth * 0.4, tileSnap);
}

export { magnetizeTile, magnetize, demagnetize };
