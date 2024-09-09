import React, { useEffect } from "react";
import {
  Canvas,
  Path,
  Circle,
  Rect,
  Text as Tx,
  listFontFamilies,
  matchFont,
  Paint,
} from "@shopify/react-native-skia";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import calculateCoordinates from "./../calculateCoordinates";

//make constants for the sizes of shapes
const actionWidth = 100;
const actionHeight = 70;
const conditionWidth = 140;
const conditionHeight = 100;
const circleRadius = 50;
const arrowSize = 20;
const arrowWidth = 12;

let marginLeft = 0;
let marginTop = 0;

const getNodeHeight = (nodeId) => {
  if (nodeId.startsWith("A")) {
    return actionHeight;
  } else if (nodeId.startsWith("C")) {
    return conditionHeight;
  } else {
    return circleRadius * 2;
  }
};

const WorkflowCanvas = ({ workflow, setLines, setMargins }) => {
  // Calculate the coordinates of the nodes and the size of the adjusted canvas
  const coordinates = calculateCoordinates(
    workflow,
    actionWidth,
    conditionWidth,
    actionHeight,
    conditionHeight
  );

  // Use effect
  useEffect(() => {
    // Record the lines (paths) between shapes, to paint on the canvas
    const newLines = {};
    Object.entries(coordinates.coord).forEach(([nodeId, { x, y }]) => {
      const node = workflow.adjacencyList[nodeId];
      const nodeHeight = getNodeHeight(nodeId);
      node.neighbors.map((neighborId) => {
        const { x: nx, y: ny } = coordinates.coord[neighborId];
        const neighborHeight = getNodeHeight(neighborId);
        newLines[[nodeId, neighborId]] = {
          x1: x,
          y1: y + nodeHeight / 2,
          x2: nx,
          y2: ny - neighborHeight / 2,
        };
      });
    });
    setLines(newLines);

    // Center the canvas with the Init node at the center horizontally and 100 from the top
    const initNode = Object.entries(coordinates.coord).find(
      ([nodeId, { x, y }]) => workflow.adjacencyList[nodeId].type === "Init"
    );
    const initX = initNode ? initNode[1].x : 0;
    const initY = initNode ? initNode[1].y : 0;

    const screenWidth = Dimensions.get("window").width;
    marginLeft = screenWidth / 2 - initX;
    marginTop = 100 - initY;

    setMargins({ marginTop, marginLeft });
  }, [workflow]);

  return (
    <Canvas
      style={{
        width: coordinates.canvasWidth,
        height: coordinates.canvasHeight,
        marginLeft,
        marginTop,
      }}
    >
      {Object.entries(coordinates.coord).map(([nodeId, { x, y }]) => {
        const node = workflow.adjacencyList[nodeId];
        switch (node.type) {
          case "Init":
            return (
              <React.Fragment key={nodeId}>
                <Circle cx={x} cy={y} r={circleRadius} color="lightgreen">
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Circle>
                <Tx text="I" y={y + 5} x={x - 5} font={null} />
              </React.Fragment>
            );
          case "Condition":
            return (
              <React.Fragment key={nodeId}>
                <Path
                  path={`M ${x} ${y - conditionHeight / 2} L ${x + conditionWidth / 2} ${y} L ${x} ${y + conditionHeight / 2} L ${x - conditionWidth / 2} ${y} Z`}
                  color="#58D4FA"
                >
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Path>
                <Tx text={node.name} y={y} x={x - 20} font={null} />
              </React.Fragment>
            );
          case "Action":
            return (
              <React.Fragment key={nodeId}>
                <Rect
                  x={x - actionWidth / 2}
                  y={y - actionHeight / 2}
                  width={actionWidth}
                  height={actionHeight}
                  color="#FAFA58"
                >
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Rect>
                <Tx
                  text={node.name}
                  y={y}
                  x={x - actionWidth / 2}
                  font={null}
                />
              </React.Fragment>
            );
          case "End":
            return (
              <React.Fragment key={nodeId}>
                <Circle cx={x} cy={y} r={circleRadius} color="lightcoral">
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Circle>
                <Tx text="E" y={y + 5} x={x - 5} font={null} />
              </React.Fragment>
            );
          default:
            return null;
        }
      })}
      {Object.entries(coordinates.coord).map(([nodeId, { x, y }]) => {
        const node = workflow.adjacencyList[nodeId];
        const nodeHeight = getNodeHeight(nodeId);
        return node.neighbors.map((neighborId) => {
          const { x: nx, y: ny } = coordinates.coord[neighborId];
          const neighborHeight = getNodeHeight(neighborId);

          // Calculate the direction of the line
          const angle = Math.atan2(
            ny - neighborHeight / 2 - (y + nodeHeight / 2),
            nx - x
          );

          // Calculate the points for the arrowhead
          const arrowX1 =
            nx - arrowSize * Math.cos(angle - Math.PI / arrowWidth);
          const arrowY1 =
            ny -
            neighborHeight / 2 -
            arrowSize * Math.sin(angle - Math.PI / arrowWidth);
          const arrowX2 =
            nx - arrowSize * Math.cos(angle + Math.PI / arrowWidth);
          const arrowY2 =
            ny -
            neighborHeight / 2 -
            arrowSize * Math.sin(angle + Math.PI / arrowWidth);

          return (
            <React.Fragment key={`${nodeId}-${neighborId}`}>
              <Path
                path={`M ${x} ${y + nodeHeight / 2} L ${nx} ${ny - neighborHeight / 2}`}
                color="black"
                style="stroke"
                strokeWidth={2}
              />
              <Path
                path={`M ${nx} ${ny - neighborHeight / 2} L ${arrowX1} ${arrowY1} L ${arrowX2} ${arrowY2} Z`}
                color="black"
                style="fill"
              />
            </React.Fragment>
          );
        });
      })}
    </Canvas>
  );
};

export default WorkflowCanvas;
