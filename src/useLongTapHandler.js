import { Gesture } from "react-native-gesture-handler";

// Utility function to check if a point is inside a circle
const isPointInCircle = (px, py, cx, cy, radius) => {
  const distance = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
  return distance <= radius;
};

// Utility function to check if a point is inside a rectangle
const isPointInRectangle = (px, py, x1, y1, x2, y2) => {
  return px >= x1 && px <= x2 && py >= y1 && py <= y2;
};

// Utility function to check if a point is inside a rhombus
const isPointInRhombus = (px, py, cx, cy, width, height) => {
  const dx = Math.abs(px - cx);
  const dy = Math.abs(py - cy);
  return dx / width + dy / height <= 1;
};

// Function to check if the tapped point is inside the shape
const isPointInShape = (nodeId, px, py, x, y) => {
  if (nodeId.startsWith("I") || nodeId.startsWith("E")) {
    // Circle
    const radius = 50; // ------------------------PONER EN GLOBALESSSS!!
    return isPointInCircle(px, py, x, y, radius);
  } else if (nodeId.startsWith("A")) {
    // Rectangle
    const x1 = x - 130 / 2;
    const y1 = y - 70 / 2;
    const x2 = x + 130 / 2;
    const y2 = y + 70 / 2;
    return isPointInRectangle(px, py, x1, y1, x2, y2);
  } else if (nodeId.startsWith("C")) {
    // Rhombus
    return isPointInRhombus(px, py, x, y, 140, 100);
  }
  return false;
};

export const useLongTapHandler = (
  coordinates,
  margins,
  setLongTapSelectedShape
) => {
  const gesture = Gesture.LongPress()
    .onEnd((event) => {
      //extract the coordinates of the tap and subtract the margins
      let { x, y } = event;
      x -= margins.marginLeft;
      y -= margins.marginTop;
      Object.entries(coordinates.coord).forEach(
        ([nodeId, { x: nodeX, y: nodeY }]) => {
          if (isPointInShape(nodeId, x, y, nodeX, nodeY)) {
            setLongTapSelectedShape(nodeId);
          }
        }
      );
    })
    .runOnJS(true);

  return gesture;
};
