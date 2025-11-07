import createjs from "createjs-module";
import type { Pannable as IPannable, Point } from './types';

const pannable = {
  /**
   * Make a container pannable (draggable to move viewport)
   */
  makePannable: function (container: IPannable): void {
    container.rootElement.on("mousedown", (event: createjs.Event) => {
      const originalPos = { x: container.rootElement.x, y: container.rootElement.y };
      const mousedownPos = { x: event.stageX, y: event.stageY };

      const mousemove = (event: createjs.Event) => {
        this.pan(event, container, originalPos, mousedownPos);
      };

      container.rootElement.on("pressmove", mousemove);

      container.rootElement.on("pressup", () => {
        container.rootElement.off("pressmove", mousemove);
      });
    });
  },

  /**
   * Handle pan movement
   */
  pan: function (
    event: createjs.Event,
    element: IPannable,
    originalPos: Point,
    mousedownPos: Point
  ): void {
    const deltaX = event.stageX - mousedownPos.x;
    const deltaY = event.stageY - mousedownPos.y;

    element.rootElement.x = originalPos.x + deltaX;
    element.rootElement.y = originalPos.y + deltaY;
  }
}

export default pannable;
