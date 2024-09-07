import React from "react";
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
import calculateCoordinates from "./../calculateCoordinates";

const WorkflowCanvas = ({ workflow }) => {
  const coordinates = calculateCoordinates(workflow);
  console.log(coordinates);
  console.log(workflow);

  return (
    <Canvas style={{ flex: 1 }}>
      {Object.entries(coordinates).map(([nodeId, { x, y }]) => {
        const node = workflow.adjacencyList[nodeId];
        switch (node.type) {
          case "Init":
            return (
              <React.Fragment key={nodeId}>
                <Circle cx={x} cy={y} r={50} color="green">
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Circle>
                <Tx text="I" y={y + 5} x={x - 5} font={null} />
              </React.Fragment>
            );
          case "Condition":
            return (
              <React.Fragment key={nodeId}>
                <Path
                  path={`M ${x} ${y - 50} L ${x + 70} ${y} L ${x} ${y + 50} L ${x - 70} ${y} Z`}
                  color="blue"
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
                  x={x - 40}
                  y={y - 40}
                  width={80}
                  height={80}
                  color="yellow"
                >
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Rect>
                <Tx text={node.name} y={y} x={x - 20} font={null} />
              </React.Fragment>
            );
          case "End":
            return (
              <React.Fragment key={nodeId}>
                <Circle cx={x} cy={y} r={50} color="red">
                  <Paint color="#black" style="stroke" strokeWidth={2} />
                </Circle>
                <Tx text="E" y={y + 5} x={x - 5} font={null} />
              </React.Fragment>
            );
          default:
            return null;
        }
      })}
      {Object.entries(coordinates).map(([nodeId, { x, y }]) => {
        const node = workflow.adjacencyList[nodeId];
        return node.neighbors.map((neighborId) => {
          const { x: nx, y: ny } = coordinates[neighborId];
          return (
            <Path
              key={`${nodeId}-${neighborId}`}
              path={`M ${x} ${y} L ${nx} ${ny}`}
              color="black"
              style="stroke"
              strokeWidth={2}
            />
          );
        });
      })}
    </Canvas>
  );
};

export default WorkflowCanvas;
