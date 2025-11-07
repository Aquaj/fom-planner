/**
 * Common TypeScript interfaces and types for the FoM-Planner project
 */

import createjs from 'createjs-module';

/**
 * An element that can be rendered on the stage
 */
export interface Renderable {
  rootElement: createjs.DisplayObject;
  draw(): void;
}

/**
 * An element that has dimensions
 */
export interface Dimensional {
  width: number;
  height: number;
}

/**
 * An element that can be positioned
 */
export interface Positionable {
  x: number;
  y: number;
  setPosition(x: number, y: number): void;
}

/**
 * An element that can be panned
 */
export interface Pannable extends Renderable {
  x: number;
  y: number;
}

/**
 * An element that can be scrolled
 */
export interface Scrollable extends Renderable, Dimensional {
  scrollCallbacks?: Array<() => void>;
  onScroll?: (callback: () => void) => void;
}

/**
 * Container element with dimensions
 */
export interface Container extends Renderable, Dimensional {
  // Container-specific properties can be added here
}

/**
 * Point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Rectangle defined by position and dimensions
 */
export interface Rectangle extends Point, Dimensional {}

/**
 * Mouse event data
 */
export interface MouseEventData {
  stageX: number;
  stageY: number;
}
