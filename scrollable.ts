import createjs from "createjs-module";
import type { Scrollable as IScrollable, Container } from './types';

const scrollable = {
  /**
   * Make content scrollable within a container
   */
  makeScrollable: function (
    container: Container,
    content: IScrollable,
    upperBound: number = 0,
    lowerBound: number = container.height
  ): void {
    // Initialize scroll callbacks if not present
    content.scrollCallbacks = [];
    content.onScroll = (callback: () => void) => {
      content.scrollCallbacks!.push(callback);
    };

    const containerElement = container.rootElement;
    const scroller = (event: WheelEvent) => {
      this.scroll(event, content, upperBound, lowerBound);
    };

    containerElement.on("mouseover", (event: createjs.Event) => {
      document.addEventListener("wheel", scroller);
    });

    containerElement.on("mouseout", (event: createjs.Event) => {
      document.removeEventListener("wheel", scroller);
    });
  },

  /**
   * Handle scroll event
   */
  scroll: function (
    event: WheelEvent,
    target: IScrollable,
    upperBound: number,
    lowerBound: number
  ): void {
    const elementTop = target.rootElement.y;
    const elementBottom = target.rootElement.y + target.height;

    if (elementTop >= upperBound && event.deltaY > 0) {
      target.rootElement.y = 0;
      target.scrollCallbacks?.forEach((callback) => callback());
      return;
    }

    if (elementBottom <= lowerBound && event.deltaY < 0) {
      target.rootElement.y = lowerBound - target.height;
      target.scrollCallbacks?.forEach((callback) => callback());
      return;
    }

    target.rootElement.y += event.deltaY;
    target.scrollCallbacks?.forEach((callback) => callback());
  }
};

export default scrollable;
