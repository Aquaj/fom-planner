import * as PIXI from 'pixi.js';
import type { Pannable as IPannable, Point } from '../types';

const pannable = {
  /**
   * Make a container pannable (draggable to move viewport)
   */
  makePannable: function (container: IPannable): void {
    container.rootElement.eventMode = 'static';

    container.rootElement.on("pointerdown", (event: PIXI.FederatedPointerEvent) => {
      const originalPos = { x: container.rootElement.x, y: container.rootElement.y };
      const mousedownPos = { x: event.global.x, y: event.global.y };

      let isDragging = true;

      const mousemove = (event: PIXI.FederatedPointerEvent) => {
        if (!isDragging) return;
        this.pan(event, container, originalPos, mousedownPos);
      };

      const mouseup = () => {
        isDragging = false;
        container.rootElement.off("pointermove", mousemove);
        container.rootElement.off("pointerup", mouseup);
        container.rootElement.off("pointerupoutside", mouseup);
      };

      container.rootElement.on("pointermove", mousemove);
      container.rootElement.on("pointerup", mouseup);
      container.rootElement.on("pointerupoutside", mouseup);
    });
  },

  /**
   * Handle pan movement
   */
  pan: function (
    event: PIXI.FederatedPointerEvent,
    element: IPannable,
    originalPos: Point,
    mousedownPos: Point
  ): void {
    const deltaX = event.global.x - mousedownPos.x;
    const deltaY = event.global.y - mousedownPos.y;

    element.rootElement.x = originalPos.x + deltaX;
    element.rootElement.y = originalPos.y + deltaY;
  }
}

export default pannable;
