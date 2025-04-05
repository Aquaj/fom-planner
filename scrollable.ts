const scrollable = {
  makeScrollable: function (container: any, content: any, upperBound: number = 0, lowerBound: number = container.height) {

    const containerElement = container.rootElement;
    const scroller = (event: WheelEvent) => {
      this.scroll(event, content, upperBound, lowerBound)
    };
    containerElement.on("mouseover", (event: createjs.Event) => {
      document.addEventListener("wheel", scroller);
    })
    containerElement.on("mouseout", (event: createjs.Event) => {
      document.removeEventListener("wheel", scroller);
    })
  },

  scroll: function (event: WheelEvent, target: any, upperBound: number, lowerBound: number) {
    const elementTop = target.rootElement.y;
    const elementBottom = target.rootElement.y + target.height;
    if (elementTop >= upperBound && event.deltaY > 0) {
      target.rootElement.y = 0;
      return
    }
    if (elementBottom <= lowerBound && event.deltaY < 0) {
      target.rootElement.y = lowerBound - target.height;
      return
    }

    target.rootElement.y += event.deltaY;
  }
}

export default scrollable;
