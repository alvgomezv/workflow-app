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

  const calculateLevel = (nodeId, level) => {
    if (!levels[level]) {
      levels[level] = [];
    }
    if (!levels[level].includes(nodeId)) {
      levels[level].push(nodeId);
    }

    const node = workflow.adjacencyList[nodeId];
    // Maybe not needed
    if (!node) {
      console.error(
        `Node with ID ${nodeId} does not exist in the adjacency list.`
      );
      return;
    }

    node.neighbors.forEach((neighborId) => {
      calculateLevel(neighborId, level + 1);
    });
  };

  // Start from the Init node
  calculateLevel("I", 0);

  Object.keys(levels).forEach((level) => {
    const nodesInLevel = levels[level].length;
    const totalWidth =
      nodesInLevel * (nodeWidth + horizontalSpacing) - horizontalSpacing;
    const startX = (screenWidth - totalWidth) / 2;

    levels[level].forEach((nodeId, index) => {
      const x =
        startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
      const y =
        topMargin + level * (nodeHeight + verticalSpacing) + nodeHeight / 2;
      coordinates[nodeId] = { x, y };
    });
  });

  return coordinates;
};

export default calculateCoordinates;
