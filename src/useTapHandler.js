import { Gesture } from "react-native-gesture-handler";

const distanceToLine = (x, y, x1, y1, x2, y2, margins) => {
  const { marginTop, marginLeft } = margins;

  // Adjust coordinates adding the margins (negative values)
  x1 += marginLeft;
  y1 += marginTop;
  x2 += marginLeft;
  y2 += marginTop;

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

export const useTapHandler = (lines, threshold = 10, margins) => {
  const gesture = Gesture.Tap()
    .onEnd((event) => {
      const { x, y } = event;
      Object.entries(lines).forEach(([nodes, { x1, y1, x2, y2 }]) => {
        const [node1, node2] = nodes.split(",");
        /* if (node1 === "I" && node2 === "C1a") {
          console.log(
            `Touch: (${x}, ${y}), Line from ${node1} to ${node2}: (${x1}, ${y1}) to (${x2}, ${y2})`
          );
          console.log("--------------------");
        } */
        const distance = distanceToLine(x, y, x1, y1, x2, y2, margins);
        if (distance < threshold) {
          console.log(`Tapped on line between ${node1} and ${node2}`);
        }
      });
    })
    .runOnJS(true);

  return gesture;
};
