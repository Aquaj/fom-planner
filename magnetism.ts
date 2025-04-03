import createjs from 'createjs-module';

interface Point {
  x: number;
  y: number;
}
interface Draggable {
  x: number;
  y: number;
  onDrag: (callback: () => void) => void;
  setPosition: (x: number, y: number) => void;
}

var snapped : Map<Draggable, Point> = new Map();

function magnetize(draggable: Draggable, points: Point[], snapDistance: number = 20, unsnapDistance: number = snapDistance + 10) {
  draggable.onDrag((event: createjs.Event) => {
    let neighbour: Point | null = null; // what we want to snap to
    let dist: number | null = null; // The current distance to our snap partner
    const cornerPos = { // Shape pos if it was centered on cursor
      x: event.stageX - draggable.width / 2,
      y: event.stageY - draggable.height / 2
    };

    for (let i = 0, l = points.length; i < l; i++) {
      const p = points[i];

      // Determine the distance from the mouse position to the point
      const diffX = Math.abs(cornerPos.x - p.x);
      const diffY = Math.abs(cornerPos.y - p.y);
      const d = Math.sqrt(diffX * diffX + diffY * diffY);

      // If the current point is closeEnough and the closest (so far)
      // Then choose it to snap to.
      const closest = d < snapDistance && (dist == null || d < dist);
      if (closest) {
        neighbour = p;
        dist = d;
      }
    }

    // If there is a close neighbour, snap to it.
    if (neighbour) {
      draggable.setPosition(neighbour.x, neighbour.y);
      return true;
    }
    const snapTarget = snapped.get(draggable);
    if (!snapTarget) {
      // We are not snapping to anything, so just return false
      return false;
    }

    const distToSnap = Math.sqrt(
      Math.pow(cornerPos.x - snapTarget.x, 2) +
      Math.pow(cornerPos.y - snapTarget.y, 2)
    );

    if (distToSnap < unsnapDistance) {
      // We are still within the unsnap distance, so don't do anything
      return true;
    }

    // We are outside the unsnap distance, so remove the snap, let regular drag-handling
    // take over
    snapped.delete(draggable);
    return false;
  });
}

export default magnetize;
