/**
 * Rendering Layer Types
 *
 * Abstractions for the rendering system, independent of specific renderer implementation.
 */

import type { EntityId } from '../types';
import type * as PIXI from 'pixi.js';

/**
 * Base interface for all renderable views
 */
export interface RenderView {
  /** Unique identifier for this view */
  id: EntityId;

  /** The underlying display object (PIXI.Container, etc.) */
  displayObject: PIXI.Container;

  /** Update the visual representation */
  update(): void;

  /** Clean up resources */
  destroy(): void;
}

/**
 * Rendering context that manages the renderer lifecycle
 */
export interface RenderContext {
  /** The root stage/container */
  stage: PIXI.Container;

  /** The renderer instance */
  renderer: PIXI.Renderer | PIXI.WebGLRenderer;

  /** Register a view for rendering */
  addView(view: RenderView): void;

  /** Unregister a view */
  removeView(id: EntityId): void;

  /** Render a single frame */
  render(): void;

  /** Start the render loop */
  start(): void;

  /** Stop the render loop */
  stop(): void;
}

/**
 * Configuration for rendering shapes
 */
export interface ShapeStyle {
  fillColor?: number;
  fillAlpha?: number;
  strokeColor?: number;
  strokeWidth?: number;
  strokeAlpha?: number;
}

/**
 * Position in 2D space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Dimensions in 2D space
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Rectangle with position and dimensions
 */
export interface Rectangle extends Position, Dimensions {}
