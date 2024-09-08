import { Dimensions } from "react-native";

const calculateCoordinates = (workflow) => {
  const levels = {};
  const coordinates = {};
  const nodeWidth = 120;
  const nodeHeight = 120;
  const verticalSpacing = 40;
  const horizontalSpacing = 50;
  const topMargin = 80; // Margin from the top of the screen

  // Get the actual screen width
  const screenWidth = Dimensions.get("window").width;

  const visited = new Set();

  const calculateLevel = (nodeId, level) => {
    if (!levels[level]) {
      levels[level] = [];
    }
    if (!levels[level].includes(nodeId)) {
      levels[level].push(nodeId);
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
      calculateLevel(neighborId, neighborLevel);
    });
  };

  // Start from the Init node
  calculateLevel("I", 0);
  console.log(levels);

  // Ensure each node is at the maximum level it can be based on its parents
  const maxLevels = {};
  Object.keys(levels).forEach((level) => {
    levels[level].forEach((nodeId) => {
      const node = workflow.adjacencyList[nodeId];
      node.neighbors.forEach((neighborId) => {
        const neighborLevel = parseInt(level) + 1;
        if (!maxLevels[neighborId] || maxLevels[neighborId] < neighborLevel) {
          maxLevels[neighborId] = neighborLevel;
        }
      });
    });
  });

  Object.keys(maxLevels).forEach((nodeId) => {
    const level = maxLevels[nodeId];
    if (!levels[level]) {
      levels[level] = [];
    }
    if (!levels[level].includes(nodeId)) {
      levels[level].push(nodeId);
    }
    Object.keys(levels).forEach((lvl) => {
      const index = levels[lvl].indexOf(nodeId);
      if (index !== -1 && parseInt(lvl) !== level) {
        levels[lvl].splice(index, 1);
      }
    });
  });

  Object.keys(levels).forEach((level) => {
    const nodesInLevel = levels[level].length;
    const totalWidth =
      nodesInLevel * (nodeWidth + horizontalSpacing) - horizontalSpacing;
    const startX = (screenWidth - totalWidth) / 2;

    levels[level].forEach((nodeId, index) => {
      const parentNode = workflow.adjacencyList[nodeId].parent;
      const parentX = parentNode
        ? coordinates[parentNode].x
        : startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
      const x =
        workflow.adjacencyList[nodeId].type === "Action"
          ? parentX
          : startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
      const y =
        topMargin + level * (nodeHeight + verticalSpacing) + nodeHeight / 2;
      coordinates[nodeId] = { x, y };
    });
  });

  return coordinates;
};

export default calculateCoordinates;
