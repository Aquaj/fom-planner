import createjs from 'createjs-module';

const magnetism: Magnetism = new Map();

function magnetize(
  draggable: Draggable,
  slots: any[],
  snapDistance: number = 20,
  unsnapDistance: number = snapDistance + 10,
  callback = null,
) {
  const config = magnetism.get(draggable) || { snaps: [], snappedTo: null };
  if (!magnetism.has(draggable)) {
    magnetism.set(draggable, config);
    draggable.onDrag(callback);
  }

  config.snaps = config.snaps.filter((s1) => {
    return !slots.some((s2) => s1.id === s2.rootElement.id);
  })
  config.snaps.push(...slots.map((slot) => {
    return {
      element: slot.rootElement,
      id: slot.rootElement.id,
      snapDistance: snapDistance,
      unsnapDistance: unsnapDistance,
    }
  }));

  if (config.snappedTo && !config.snaps.some((p) => p.id === config.snappedTo.id)) {
    config.snappedTo = null;
  }
}

function snapToClosest(draggable: Draggable, cursor: createjs.Event) {
  const config = magnetism.get(draggable);
  if (!config) return false;

  let neighbour: Point | null = null; // what we want to snap to
  let dist: number | null = null; // The current distance to our snap partner

  const snaps = config.snaps;
  for (let i = 0; i < snaps.length; i++) {
    const snap = snaps[i];

    const globalSlotPos = snap.element.localToGlobal(0, 0);

    // Determine the distance from the mouse position to the slot
    const diffX = Math.abs(cursor.x - globalSlotPos.x);
    const diffY = Math.abs(cursor.y - globalSlotPos.y);
    const d = Math.sqrt(diffX * diffX + diffY * diffY);
    debugger;

    // If the current snap is closeEnough and the closest (so far)
    // Then choose it to snap to.
    const closest = d < snap.snapDistance && (dist == null || d < dist);
    if (closest) {
      neighbour = snap;
      dist = d;
    }
  }

  // If there is a close neighbour, snap to it.
  if (neighbour && config.snappedTo !== neighbour) {
    config.snappedTo = neighbour;
    return true;
  }
  const snapTarget = config.snappedTo;
  if (!snapTarget) {
    // We are not snapping to anything, let regular drag-handling take over
    return false;
  }

  const globalSlotPos = snapTarget.element.localToGlobal(0, 0);
  const distToSnap = Math.sqrt(
    Math.pow(cursor.x - globalSlotPos.x, 2) +
      Math.pow(cursor.y - globalSlotPos.y, 2)
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
  magnetize(
    tile,
    slots,
    tileWidth * 0.4,
    tileWidth * 0.5,
    (event) => {
      return tileSnap(
        tile,
        {
          x: event.stageX - tileWidth / 2,
          y: event.stageY - tileWidth / 2
        },
        stage)
    });
}

function tileSnap(tile, point, stage) {
  const didSnap = snapToClosest(tile, point);
  const config = magnetism.get(tile);

  if (config.snappedTo) {
    const slot = config.snappedTo.element;

    if (slot.children.includes(tile.rootElement)) return didSnap;

    const prevParent = tile.rootElement.parent;
    if (prevParent) { prevParent.removeChild(tile.rootElement); }

    tile.setPosition(0, 0);
    slot.addChild(tile.rootElement);
  } else {
    if (!stage.children.includes(tile.rootElement)) {
      tile.setPosition(tile.rootElement.localToLocal(0, 0, stage));
      const prevParent = tile.rootElement.parent;
      if (prevParent) { prevParent.removeChild(tile.rootElement); }
      stage.addChild(tile.rootElement);
    }
  }

  return didSnap;
}

export { magnetizeTile, magnetize, demagnetize, tileSnap };
