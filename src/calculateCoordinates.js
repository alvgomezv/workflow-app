const calculateCoordinates = (workflow) => {
  const levels = {};
  const coordinates = {};
  const nodeWidth = 60;
  const nodeHeight = 60;
  const verticalSpacing = 100;
  const horizontalSpacing = 100;

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
      calculateLevel(neighborId, level + 1);
    });
  };

  // Start from the Init node
  calculateLevel("I", 0);

  Object.keys(levels).forEach((level) => {
    levels[level].forEach((nodeId, index) => {
      const x = index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
      const y = level * (nodeHeight + verticalSpacing) + nodeHeight / 2;
      coordinates[nodeId] = { x, y };
    });
  });

  return coordinates;
};

export default calculateCoordinates;
