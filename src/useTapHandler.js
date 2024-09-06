import { Gesture } from "react-native-gesture-handler";

export const useTapHandler = (line, circle, threshold = 10) => {
  const distanceToLine = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const gesture = Gesture.Tap()
    .onEnd((event) => {
      const { x, y } = event;
      const { x1, y1, x2, y2 } = line;
      const { cx, cy, radius } = circle;

      if (Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2)) <= radius) {
        console.log("Circle touched!");
      } else if (distanceToLine(x, y, x1, y1, x2, y2) <= threshold) {
        console.log("Line touched!");
      }
    })
    .runOnJS(true);

  return gesture;
};
