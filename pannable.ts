const pannable = {
  makePannable: function (container: any) {
    container.panCallbacks = [];
    container.onPan = (callback: (delta: { x: number, y: number }) => void) => {
      container.panCallbacks.push(callback);
    }

    container.rootElement.addEventListener("mousedown", (event) => {
      const originalPos = { x: container.rootElement.x, y: container.rootElement.y };
      const mousedownPos0 = {'x': event.stageX, 'y': event.stageY};

      container.panner = (ev) => this.pan(ev, container, originalPos, mousedownPos0);
      container.rootElement.addEventListener('pressmove', container.panner);
    });
    container.rootElement.addEventListener("pressup", (event) => {
      if (container.panner) {
        container.rootElement.removeEventListener('pressmove', this.panner);
        container.panner = null;
      }
    });
  },

  pan: function (event: createjs.Event, element: any, originalPos: { x: number, y: number }, mousedownPos0: { x: number, y: number }) {
    const panDelta = {
      x: event.stageX - mousedownPos0.x,
      y: event.stageY - mousedownPos0.y
    };

    element.rootElement.x = originalPos.x + panDelta.x;
    element.rootElement.y = originalPos.y + panDelta.y;

    element.panCallbacks.forEach((callback) => callback(panDelta));
  }
}

export default pannable;
