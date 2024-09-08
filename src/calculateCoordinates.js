import { Dimensions } from "react-native";

// Function to calculate the maximum width and height of the coordinates
const calculateCanvasSize = (coordinates, margin) => {
  let maxWidth = 0;
  let maxHeight = 0;

  Object.values(coordinates).forEach(({ x, y }) => {
    if (x > maxWidth) maxWidth = x;
    if (y > maxHeight) maxHeight = y;
  });

  return {
    canvasWidth: maxWidth + margin,
    canvasHeight: maxHeight + margin,
  };
};

// Function to recalculate coordinates to center them in the canvas
const recalculateCoordinates = (coordinates, canvasWidth) => {
  const minX = Math.min(...Object.values(coordinates).map((coord) => coord.x));
  const maxX = Math.max(...Object.values(coordinates).map((coord) => coord.x));

  const totalWidth = maxX - minX;
  const offsetX = (canvasWidth - totalWidth) / 2 - minX;

  Object.keys(coordinates).forEach((nodeId) => {
    coordinates[nodeId].x += offsetX;
  });

  return coordinates;
};

///-------------------------------------------------------------------------------------------------------------------------
const calculateCoordinates = (
  workflow,
  actionWidth,
  conditionWidth,
  margin = 10
) => {
  const levels = {};
  const coordinates = {};
  const adjustedCoordinates = {};
  const parents = {}; // To track parent-child relationships
  const nodeWidth = 120;
  const nodeHeight = 120;
  const verticalSpacing = 40;
  const horizontalSpacing = 50;
  const topMargin = 80; // Margin from the top of the screen

  // Get the actual screen width
  const screenWidth = Dimensions.get("window").width;

  const calculateLevel = (nodeId, level, parentId = null) => {
    if (!levels[level]) {
      levels[level] = [];
    }
    if (!levels[level].includes(nodeId)) {
      levels[level].push(nodeId);
    }

    if (parentId) {
      parents[nodeId] = parentId; // Track the parent of the current node
    }

    const node = workflow.adjacencyList[nodeId];
    if (!node) {
      console.error(
        `Node with ID ${nodeId} does not exist in the adjacency list.`
      );
      return;
    }

    node.neighbors.forEach((neighborId) => {
      const neighborLevel = level + 1;
      calculateLevel(neighborId, neighborLevel, nodeId);
    });
  };

  // Start from the Init node
  calculateLevel("I", 0);
  console.log(levels, parents);

  // Function to remove "E" nodes from all levels except the last one
  const removeENodesExceptLast = () => {
    const levelKeys = Object.keys(levels).map(Number);
    const maxLevel = Math.max(...levelKeys);

    levelKeys.forEach((level) => {
      if (level !== maxLevel) {
        levels[level] = levels[level].filter((nodeId) => nodeId !== "E");
      }
    });
  };

  // Remove "E" nodes from all levels except the last one
  removeENodesExceptLast();

  Object.keys(levels).forEach((level) => {
    const nodesInLevel = levels[level].length;
    const totalWidth =
      nodesInLevel * (nodeWidth + horizontalSpacing) - horizontalSpacing;
    const startX = (screenWidth - totalWidth) / 2;

    // Check if there is any conditional node in the current level
    const hasConditionalNode = levels[level].some(
      (nodeId) => workflow.adjacencyList[nodeId].type === "Condition"
    );

    levels[level].forEach((nodeId, index) => {
      const parentNode = parents[nodeId];
      const parentX = parentNode
        ? coordinates[parentNode].x
        : startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
      const x =
        !hasConditionalNode && workflow.adjacencyList[nodeId].type === "Action"
          ? parentX
          : startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
      const y =
        topMargin + level * (nodeHeight + verticalSpacing) + nodeHeight / 2;
      coordinates[nodeId] = { x, y };
    });
  });

  const { canvasWidth, canvasHeight } = calculateCanvasSize(coordinates, 200);
  adjustedCoordinates.coord = recalculateCoordinates(
    coordinates,
    canvasWidth,
    canvasHeight
  );
  //add the canvasWidth and canvasHeight to the return object
  adjustedCoordinates.canvasWidth = canvasWidth;
  adjustedCoordinates.canvasHeight = canvasHeight;

  /* // Function to check if shapes are closer than the margin
  const areShapesTooClose = () => {
    const nodes = Object.keys(coordinates);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = coordinates[nodes[i]];
        const nodeB = coordinates[nodes[j]];
        const shapeWidthA = nodes[i].startsWith("A")
          ? actionWidth
          : conditionWidth;
        const shapeWidthB = nodes[j].startsWith("A")
          ? actionWidth
          : conditionWidth;
        const distance = Math.sqrt(
          Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
        );
        if (distance < (shapeWidthA + shapeWidthB) / 2 + margin) {
          console.log(
            `Nodes ${nodes[i]} and ${nodes[j]} are too close to each other.`
          );
          return true;
        }
      }
    }
    return false;
  };

  const tooClose = areShapesTooClose();
  console.log("Are any shapes too close?", tooClose); */

  return adjustedCoordinates;
};

export default calculateCoordinates;
