import {
  ACTION_WIDTH,
  ACTION_HEIGHT,
  CONDITION_WIDTH,
  CONDITION_HEIGHT,
  SCREEN_WIDTH,
} from "../../config/constants";

// Function to calculate the maximum width and height of the coordinates
const calculateCanvasSize = (
  coordinates,
  canvasMargin,
  maxWidthOfShapes,
  maxHeightOfShapes
) => {
  let maxX = 0;
  let maxY = 0;
  let minX = Infinity;
  let minY = Infinity;

  Object.values(coordinates).forEach(({ x, y }) => {
    if (x + maxWidthOfShapes / 2 > maxX) {
      maxX = x + maxWidthOfShapes / 2;
    }
    if (y + maxHeightOfShapes / 2 > maxY) {
      maxY = y + maxHeightOfShapes / 2;
    }
    if (x - maxWidthOfShapes / 2 < minX) {
      minX = x - maxWidthOfShapes / 2;
    }
    if (y - maxHeightOfShapes / 2 < minY) {
      minY = y - maxHeightOfShapes / 2;
    }
  });

  const maxWidth = maxX - minX + maxWidthOfShapes;
  const maxHeight = maxY - minY + maxHeightOfShapes;

  return {
    canvasWidth: maxWidth + canvasMargin,
    canvasHeight: maxHeight + canvasMargin,
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
const calculateCoordinates = (workflow) => {
  const levels = {};
  const coordinates = {};
  const adjustedCoordinates = {};
  const parents = {};
  const nodeWidth = 120;
  const nodeHeight = 120;
  const verticalSpacing = 60;
  const horizontalSpacing = 80;
  const topMargin = 80;

  // Function to remove repeated nodes from all levels except the last one they are in
  const removeRepeatedNodesExceptLast = () => {
    const levelKeys = Object.keys(levels).map(Number);
    const nodeLevels = {};

    // Track the levels where each node appears
    levelKeys.forEach((level) => {
      levels[level].forEach((nodeId) => {
        if (!nodeLevels[nodeId]) {
          nodeLevels[nodeId] = [];
        }
        nodeLevels[nodeId].push(level);
      });
    });

    // Find the furthest level down for each node
    const furthestLevels = {};
    Object.keys(nodeLevels).forEach((nodeId) => {
      furthestLevels[nodeId] = Math.max(...nodeLevels[nodeId]);
    });

    // Remove all repeated nodes from levels except the furthest one
    levelKeys.forEach((level) => {
      levels[level] = levels[level].filter((nodeId) => {
        return furthestLevels[nodeId] === level;
      });
    });
  };

  const calculateLevel = (nodeId, level, parentId = null) => {
    if (!levels[level]) {
      levels[level] = [];
    }
    if (!levels[level].includes(nodeId)) {
      levels[level].push(nodeId);
    }

    if (parentId) {
      parents[nodeId] = parentId;
    }

    const node = workflow.adjacencyList[nodeId];

    node.neighbors.forEach((neighborId) => {
      const neighborLevel = level + 1;
      calculateLevel(neighborId, neighborLevel, nodeId);
    });

    // Remove "E" nodes from all levels except the last one
    removeRepeatedNodesExceptLast();
  };

  // Start from the Init node
  calculateLevel("I", 0);

  let previousLevelNodeCount = null;
  let isNodeCountLower = false;

  //-------------------------------------------------------------------------------------------------------------------------

  //TREE FUNCTION

  Object.keys(levels).forEach((level) => {
    const nodesInLevel = levels[level].length;
    const totalWidth =
      nodesInLevel * (nodeWidth + horizontalSpacing) - horizontalSpacing;
    const startX = (SCREEN_WIDTH - totalWidth) / 2;

    // Check if there is any conditional node in the current level
    const hasConditionalNode = levels[level].some(
      (nodeId) => workflow.adjacencyList[nodeId].type === "Condition"
    );

    // Compare the number of nodes in the current level with the previous level
    if (previousLevelNodeCount !== null) {
      isNodeCountLower = nodesInLevel < previousLevelNodeCount;
    }

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

    // Update the previous level node count
    previousLevelNodeCount = nodesInLevel;
  });

  //-------------------------------------------------------------------------------------------------------------------------

  // Calculate new canvas size to fit all the shapes inside
  const { canvasWidth, canvasHeight } = calculateCanvasSize(
    coordinates,
    50,
    ACTION_WIDTH > CONDITION_WIDTH ? ACTION_WIDTH : CONDITION_WIDTH,
    ACTION_HEIGHT > CONDITION_HEIGHT ? ACTION_HEIGHT : CONDITION_HEIGHT
  );
  // Recalculate the coordinates to center them in the canvas, only in the X axis
  adjustedCoordinates.coord = recalculateCoordinates(
    coordinates,
    canvasWidth,
    canvasHeight
  );
  //add the canvasWidth and canvasHeight to the return object
  adjustedCoordinates.canvasWidth = canvasWidth;
  adjustedCoordinates.canvasHeight = canvasHeight;
  return adjustedCoordinates;
};

export default calculateCoordinates;
