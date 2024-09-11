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
  const parents = {}; // To track parent-child relationships
  const nodeWidth = 120;
  const nodeHeight = 120;
  const verticalSpacing = 60;
  const horizontalSpacing = 80;
  const topMargin = 80; // Margin from the top of the screen

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

    node.neighbors.forEach((neighborId) => {
      const neighborLevel = level + 1;
      calculateLevel(neighborId, neighborLevel, nodeId);
    });

    // Remove "E" nodes from all levels except the last one
    removeENodesExceptLast();
  };

  // Start from the Init node
  calculateLevel("I", 0);
  /*  console.log(levels, parents); */

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

  // ORDERED DOWN FUNCTION

  // Function to check if shapes in a level are closer than the margin
  /*   const areShapesTooCloseInLevel = (levelNodes) => {
    console.log("Checking level:", levelNodes);
    for (let i = 0; i < levelNodes.length; i++) {
      for (let j = i + 1; j < levelNodes.length; j++) {
        const nodeA = coordinates[levelNodes[i]];
        const nodeB = coordinates[levelNodes[j]];
          console.log(
          "Nodes - ",
          levelNodes[i],
          ":",
          nodeA,
          levelNodes[j],
          ":",
          nodeB
        ); 
        const shapeWidthA = levelNodes[i].startsWith("A")
          ? ACTION_WIDTH
          : CONDITION_WIDTH;
        const shapeWidthB = levelNodes[j].startsWith("A")
          ? ACTION_WIDTH
          : CONDITION_WIDTH;
        const distance = Math.abs(nodeA.x - nodeB.x);
          console.log(
          "Distance between",
          levelNodes[i],
          "and",
          levelNodes[j],
          ": ",
          distance
        );
        console.log(
          "Margin:",
          (shapeWidthA + shapeWidthB) / 2 + marginBeetweenShapes
        ); 
        if (distance < (shapeWidthA + shapeWidthB) / 2 + marginBeetweenShapes) {
          return [levelNodes[i], levelNodes[j]];
        }
      }
    }
    return null;
  };

  // Function to adjust conditional parent nodes and recalculate the level
  const adjustAndRecalculateLevel = (levelNodes, level) => {
    let tooClose;
    let counter = 0;
    while (
      (tooClose = areShapesTooCloseInLevel(levelNodes)) !== null &&
      counter < 5
    ) {
      console.log("Too close:", tooClose);
      if (counter === 5) {
        console.log("Counter reached 5");
      }
      const [nodeA, nodeB] = tooClose;
      const parentNodeA = parents[nodeA];
      const parentNodeB = parents[nodeB];

      if (
        parentNodeA &&
        workflow.adjacencyList[parentNodeA].type === "Condition"
      ) {
        coordinates[parentNodeA].x -= marginBeetweenShapes / 2;
      }

      if (
        parentNodeB &&
        workflow.adjacencyList[parentNodeB].type === "Condition"
      ) {
        coordinates[parentNodeB].x += marginBeetweenShapes / 2;
      }

      // Recalculate the coordinates of the level
      levelNodes.forEach((nodeId, index) => {
        const parentNode = parents[nodeId];
        let x, y;

        if (parentNode) {
          const parentX = coordinates[parentNode].x;
          const parentY = coordinates[parentNode].y;

          if (workflow.adjacencyList[nodeId].type === "Condition") {
            // Position conditional nodes slightly to the left and right
            if (nodeId.includes("a")) {
              x = parentX - nodeWidth / 2 - horizontalSpacing / 2;
            } else {
              x = parentX + nodeWidth / 2 + horizontalSpacing / 2;
            }
            y = parentY + nodeHeight + verticalSpacing;
          } else if (workflow.adjacencyList[nodeId].type === "End") {
            // Position End nodes at the x coordinate of the Init node
            x =
              startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
            console.log("level:", level);
            y = (verticalSpacing + nodeHeight) * level + nodeHeight;
          } else {
            x = parentX;
            y = parentY + nodeHeight + verticalSpacing;
          }
        } else {
          x = startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
          y =
            topMargin + level * (nodeHeight + verticalSpacing) + nodeHeight / 2;
        }

        coordinates[nodeId] = { x, y };
      });
    }
  };

  Object.keys(levels).forEach((level) => {
    const nodesInLevel = levels[level].length;
    const totalWidth =
      nodesInLevel * (nodeWidth + horizontalSpacing) - horizontalSpacing;
    const startX = (SCREEN_WIDTH - totalWidth) / 2;

    levels[level].forEach((nodeId, index) => {
      const parentNode = parents[nodeId];
      let x, y;

      if (parentNode) {
        console.log("Parent node:", parentNode);
        const parentX = coordinates[parentNode].x;
        const parentY = coordinates[parentNode].y;

        if (workflow.adjacencyList[nodeId].type === "Condition") {
          // Position conditional nodes slightly to the left and right
          if (nodeId.includes("a")) {
            x = parentX - nodeWidth / 2 - horizontalSpacing / 2;
          } else {
            x = parentX + nodeWidth / 2 + horizontalSpacing / 2;
          }
          y = parentY + nodeHeight + verticalSpacing;
        } else if (workflow.adjacencyList[nodeId].type === "End") {
          // Position End nodes at the x coordinate of the Init node
          x = startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
          console.log("level:", level);
          y = (verticalSpacing + nodeHeight) * level + nodeHeight;
        } else {
          x = parentX;
          y = parentY + nodeHeight + verticalSpacing;
        }
      } else {
        x = startX + index * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
        y = topMargin + level * (nodeHeight + verticalSpacing) + nodeHeight / 2;
      }

      coordinates[nodeId] = { x, y };
    });
     console.log("Level:", level, "coordinates of level:", coordinates); 

    // Adjust conditional parent nodes and recalculate the level if necessary
    adjustAndRecalculateLevel(levels[level], level);
  }); 
  */

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
  /*  console.log("Before - Width:", SCREEN_WIDTH, "Height:", SCREEN_HEIGHT);
  console.log("Adjusted - Width:", canvasWidth, "Height:", canvasHeight);
 */
  return adjustedCoordinates;
};

export default calculateCoordinates;
