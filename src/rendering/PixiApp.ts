/**
 * PixiJS Application Wrapper
 *
 * Manages the PixiJS application lifecycle and provides a clean rendering context.
 */

import * as PIXI from 'pixi.js';
import type { RenderContext, RenderView } from './types';
import type { EntityId } from '../types';

export class PixiApp implements RenderContext {
  public app: PIXI.Application;
  public stage: PIXI.Container;
  public renderer: PIXI.Renderer;

  private views = new Map<EntityId, RenderView>();
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    // Create PixiJS application
    this.app = new PIXI.Application();

    // Initialize asynchronously
    this.app.init({
      canvas,
      width,
      height,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    }).then(() => {
      console.log('PixiJS initialized');
    });

    this.stage = this.app.stage;
    this.renderer = this.app.renderer;
  }

  /**
   * Add a view to the rendering system
   */
  addView(view: RenderView): void {
    this.views.set(view.id, view);
    this.stage.addChild(view.displayObject);
  }

  /**
   * Remove a view from the rendering system
   */
  removeView(id: EntityId): void {
    const view = this.views.get(id);
    if (view) {
      this.stage.removeChild(view.displayObject);
      view.destroy();
      this.views.delete(id);
    }
  }

  /**
   * Get a view by ID
   */
  getView(id: EntityId): RenderView | undefined {
    return this.views.get(id);
  }

  /**
   * Render a single frame
   */
  render(): void {
    // PixiJS handles rendering automatically through ticker
    // This method is here for API compatibility
  }

  /**
   * Start the render loop (PixiJS handles this automatically)
   */
  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.app.ticker.start();
    }
  }

  /**
   * Stop the render loop
   */
  stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      this.app.ticker.stop();
    }
  }

  /**
   * Add a ticker callback
   */
  onTick(callback: (delta: number) => void): void {
    this.app.ticker.add(callback);
  }

  /**
   * Remove a ticker callback
   */
  offTick(callback: (delta: number) => void): void {
    this.app.ticker.remove(callback);
  }

  /**
   * Resize the application
   */
  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
  }

  /**
   * Destroy the application and cleanup
   */
  destroy(): void {
    this.views.forEach(view => view.destroy());
    this.views.clear();
    this.app.destroy(true, { children: true, texture: true, textureSource: true });
  }
}
