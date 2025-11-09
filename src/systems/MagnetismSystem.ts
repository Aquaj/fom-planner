import * as PIXI from 'pixi.js';

/**
 * Represents an object that can be dragged and snapped to targets
 */
interface Draggable {
  rootElement: PIXI.Container;
  setPosition(x: number, y: number): void;
  onDrag(callback: (event: PIXI.FederatedPointerEvent) => boolean): void;
}

/**
 * Represents a target that draggable objects can snap to
 */
interface SnapTarget {
  element: PIXI.Container;
  id: string;
  snapDistance: number;
  unsnapDistance: number;
}

/**
 * Configuration for a draggable object's magnetism behavior
 */
interface MagnetismConfig {
  snaps: SnapTarget[];
  snappedTo: SnapTarget | null;
}

/**
 * Point in 2D space
 */
interface Point {
  x: number;
  y: number;
}

/**
 * MagnetismSystem manages snapping behavior for draggable objects
 *
 * This system allows objects to "snap" to designated targets when dragged
 * near them, creating a magnetic effect. It handles:
 * - Tracking which objects can snap to which targets
 * - Calculating distances and determining when to snap/unsnap
 * - Managing the currently snapped state for each object
 */
class MagnetismSystem {
  private magnetismConfigs: Map<Draggable, MagnetismConfig> = new Map();

  /**
   * Register a draggable object with snap targets
   *
   * @param draggable - The object that should snap to targets
   * @param slots - Array of objects with rootElement property that can be snap targets
   * @param snapDistance - Distance at which snapping occurs (default: 20)
   * @param unsnapDistance - Distance at which unsnapping occurs (default: snapDistance + 10)
   * @param dragCallback - Optional callback to invoke on drag
   */
  magnetize(
    draggable: Draggable,
    slots: any[],
    snapDistance: number = 20,
    unsnapDistance: number = snapDistance + 10,
    dragCallback: ((event: PIXI.FederatedPointerEvent) => boolean) | null = null,
  ): void {
    const config = this.getOrCreateConfig(draggable);

    // Register drag callback only once
    if (!this.magnetismConfigs.has(draggable)) {
      this.magnetismConfigs.set(draggable, config);
      if (dragCallback) {
        draggable.onDrag(dragCallback);
      }
    }

    // Update snap targets: remove old ones that match slot IDs, add new ones
    config.snaps = config.snaps.filter((existingSnap) => {
      return !slots.some((slot) => existingSnap.id === slot.rootElement.id);
    });

    config.snaps.push(...slots.map((slot) => ({
      element: slot.rootElement,
      id: slot.rootElement.id,
      snapDistance,
      unsnapDistance,
    })));

    // Clear snapped state if target no longer exists
    if (config.snappedTo && !config.snaps.some((snap) => snap.id === config.snappedTo!.id)) {
      config.snappedTo = null;
    }
  }

  /**
   * Attempt to snap draggable to closest target
   *
   * @param draggable - The object being dragged
   * @param cursorPosition - Current cursor position
   * @returns true if snapped or maintaining snap, false if free-dragging
   */
  snapToClosest(draggable: Draggable, cursorPosition: Point): boolean {
    const config = this.magnetismConfigs.get(draggable);
    if (!config) return false;

    // Find closest snap target within range
    const closestSnap = this.findClosestSnapTarget(config.snaps, cursorPosition);

    // If we found a new snap target, snap to it
    if (closestSnap && config.snappedTo !== closestSnap) {
      config.snappedTo = closestSnap;
      return true;
    }

    // If not currently snapped to anything, allow free dragging
    if (!config.snappedTo) {
      return false;
    }

    // Check if we should unsnap from current target
    const targetGlobal = config.snappedTo.element.toGlobal({ x: 0, y: 0 });
    const distanceToSnappedTarget = this.calculateDistance(
      cursorPosition,
      { x: targetGlobal.x, y: targetGlobal.y }
    );

    if (distanceToSnappedTarget < config.snappedTo.unsnapDistance) {
      // Still within unsnap range, maintain snap
      return true;
    }

    // Outside unsnap range, release the snap
    config.snappedTo = null;
    return false;
  }

  /**
   * Get the current snap target for a draggable object
   */
  getSnappedTarget(draggable: Draggable): SnapTarget | null {
    const config = this.magnetismConfigs.get(draggable);
    return config?.snappedTo ?? null;
  }

  /**
   * Clear all magnetism data for a draggable object
   */
  demagnetize(draggable: Draggable): void {
    this.magnetismConfigs.delete(draggable);
  }

  /**
   * Get or create config for a draggable object
   */
  private getOrCreateConfig(draggable: Draggable): MagnetismConfig {
    return this.magnetismConfigs.get(draggable) || { snaps: [], snappedTo: null };
  }

  /**
   * Find the closest snap target within range
   */
  private findClosestSnapTarget(
    targets: SnapTarget[],
    cursorPosition: Point
  ): SnapTarget | null {
    let closestTarget: SnapTarget | null = null;
    let closestDistance: number | null = null;

    for (const target of targets) {
      const targetGlobal = target.element.toGlobal({ x: 0, y: 0 });
      const targetPosition = { x: targetGlobal.x, y: targetGlobal.y };
      const distance = this.calculateDistance(cursorPosition, targetPosition);

      const isInRange = distance < target.snapDistance;
      const isCloser = closestDistance === null || distance < closestDistance;

      if (isInRange && isCloser) {
        closestTarget = target;
        closestDistance = distance;
      }
    }

    return closestTarget;
  }

  /**
   * Calculate Euclidean distance between two points
   */
  private calculateDistance(point1: Point, point2: Point): number {
    const dx = Math.abs(point1.x - point2.x);
    const dy = Math.abs(point1.y - point2.y);
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// Singleton instance
const magnetismSystem = new MagnetismSystem();

/**
 * Handle tile snapping behavior with reparenting
 *
 * @param tile - The tile being dragged
 * @param point - Current cursor position
 * @param stage - The stage container
 * @returns true if snap occurred, false otherwise
 */
function tileSnap(tile: any, point: Point, stage: PIXI.Container): boolean {
  const didSnap = magnetismSystem.snapToClosest(tile, point);
  const snappedTarget = magnetismSystem.getSnappedTarget(tile);

  if (snappedTarget) {
    const slot = snappedTarget.element;

    // Already in the correct parent, no need to reparent
    if (slot.children.includes(tile.rootElement)) {
      return didSnap;
    }

    // Reparent tile to slot
    const prevParent = tile.rootElement.parent;
    if (prevParent) {
      prevParent.removeChild(tile.rootElement);
    }

    tile.setPosition(0, 0);
    slot.addChild(tile.rootElement);
  } else {
    // Not snapped, should be on stage
    if (!stage.children.includes(tile.rootElement)) {
      // Convert position to stage coordinates
      const stagePosition = tile.rootElement.toLocal({ x: 0, y: 0 }, stage);
      tile.setPosition(stagePosition.x, stagePosition.y);

      const prevParent = tile.rootElement.parent;
      if (prevParent) {
        prevParent.removeChild(tile.rootElement);
      }

      stage.addChild(tile.rootElement);
    }
  }

  return didSnap;
}

/**
 * Convenience function to set up magnetism for a tile
 *
 * @param tile - The tile to magnetize
 * @param slots - Available snap targets
 * @param tileWidth - Width of the tile (used to calculate snap distances)
 * @param stage - The stage container
 */
function magnetizeTile(tile: any, slots: any[], tileWidth: number, stage: PIXI.Container): void {
  magnetismSystem.magnetize(
    tile,
    slots,
    tileWidth * 0.4,  // Snap when within 40% of tile width
    tileWidth * 0.5,  // Unsnap when beyond 50% of tile width
    (event: PIXI.FederatedPointerEvent) => {
      return tileSnap(
        tile,
        {
          x: event.global.x - tileWidth / 2,
          y: event.global.y - tileWidth / 2
        },
        stage
      );
    }
  );
}

/**
 * Demagnetize a draggable object
 */
function demagnetize(draggable: Draggable): void {
  magnetismSystem.demagnetize(draggable);
}

export { magnetizeTile, tileSnap, demagnetize, magnetismSystem, MagnetismSystem };
export type { Draggable, SnapTarget, MagnetismConfig, Point };
