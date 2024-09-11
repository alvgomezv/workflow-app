import React, { useEffect, useState } from "react";
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
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import {
  ACTION_WIDTH,
  ACTION_HEIGHT,
  CONDITION_WIDTH,
  CONDITION_HEIGHT,
  CIRCLE_RADIUS,
  ARROW_SIZE,
  ARROW_WIDTH,
  START_MARGIN_TOP,
} from "../config/constants";

let marginLeft = 0;
let marginTop = 0;

//All this to display the text, because a font is needed
const fontFamily = Platform.select({
  android: "Helvetica",
  default: "sans-serif",
});
const fontStyle = {
  fontFamily,
  fontSize: 15,
};
const font = matchFont(fontStyle);

const getNodeHeight = (nodeId) => {
  if (nodeId.startsWith("A")) {
    return ACTION_HEIGHT;
  } else if (nodeId.startsWith("C")) {
    return CONDITION_HEIGHT;
  } else {
    return CIRCLE_RADIUS * 2;
  }
};

const WorkflowCanvas = ({ workflow, setLines, coordinates }) => {
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
      {/* // Paint the lines between shapes */}
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
            nx - ARROW_SIZE * Math.cos(angle - Math.PI / ARROW_WIDTH);
          const arrowY1 =
            ny -
            neighborHeight / 2 -
            ARROW_SIZE * Math.sin(angle - Math.PI / ARROW_WIDTH);
          const arrowX2 =
            nx - ARROW_SIZE * Math.cos(angle + Math.PI / ARROW_WIDTH);
          const arrowY2 =
            ny -
            neighborHeight / 2 -
            ARROW_SIZE * Math.sin(angle + Math.PI / ARROW_WIDTH);

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
      {/* // Paint the shapes */}
      {Object.entries(coordinates.coord).map(([nodeId, { x, y }]) => {
        const node = workflow.adjacencyList[nodeId];
        switch (node.type) {
          case "Init":
            return (
              <React.Fragment key={nodeId}>
                <Circle cx={x} cy={y} r={CIRCLE_RADIUS} color="lightgreen">
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Circle>
                <Tx
                  text="Init"
                  x={x - font.measureText("Init").width / 2}
                  y={y + font.measureText("Init").height / 2}
                  font={font}
                />
              </React.Fragment>
            );
          case "Condition":
            return (
              <React.Fragment key={nodeId}>
                <Path
                  path={`M ${x} ${y - CONDITION_HEIGHT / 2} L ${x + CONDITION_WIDTH / 2} ${y} L ${x} ${y + CONDITION_HEIGHT / 2} L ${x - CONDITION_WIDTH / 2} ${y} Z`}
                  color="#58D4FA"
                >
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Path>
                <Tx
                  text={node.name}
                  x={x - font.measureText(node.name).width / 2}
                  y={y + font.measureText(node.name).height / 2}
                  font={font}
                />
              </React.Fragment>
            );
          case "Action":
            return (
              <React.Fragment key={nodeId}>
                <Rect
                  x={x - ACTION_WIDTH / 2}
                  y={y - ACTION_HEIGHT / 2}
                  width={ACTION_WIDTH}
                  height={ACTION_HEIGHT}
                  color="#FAFA58"
                >
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Rect>
                <Tx
                  text={node.name}
                  x={x - font.measureText(node.name).width / 2}
                  y={y + font.measureText(node.name).height / 2}
                  font={font}
                />
              </React.Fragment>
            );
          case "End":
            return (
              <React.Fragment key={nodeId}>
                <Circle cx={x} cy={y} r={CIRCLE_RADIUS} color="lightcoral">
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Circle>
                <Tx
                  text="End"
                  x={x - font.measureText("End").width / 2}
                  y={y + font.measureText("End").height / 2}
                  font={font}
                />
              </React.Fragment>
            );
          default:
            return null;
        }
      })}
    </Canvas>
  );
};

export default WorkflowCanvas;
