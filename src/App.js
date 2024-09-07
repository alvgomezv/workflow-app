import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Animated, Platform } from "react-native";
import { usePanHandler } from "./usePanHandler";
import CircleComponent from "./components/CircleComponent";
import SquareComponent from "./components/SquareComponent";
import DiamondComponent from "./components/DiamondComponent";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import ConnectingLine from "./components/ConnectingLine";
import {
  Canvas,
  Path,
  Circle,
  Rect,
  Text as Tx,
  listFontFamilies,
  matchFont,
} from "@shopify/react-native-skia";
import { Use } from "react-native-svg";
import { useSharedValue } from "react-native-reanimated";
import { useTapHandler } from "./useTapHandler";
import { WorkflowGraph } from "./WorkflowGraph";
import NodeForm from "./components/NodeForm";
import calculateCoordinates from "./calculateCoordinates";
import WorkflowCanvas from "./components/WorkflowCanvas";

const initializeWorkflow = () => {
  // Initialize the workflow graph
  const initialWorkflow = new WorkflowGraph();

  // Add nodes
  initialWorkflow.addNode("I", "Init", "InitNode");
  initialWorkflow.addNode("C1a", "Condition", "Condition1");
  initialWorkflow.addNode("C1b", "Condition", "Condition2");
  initialWorkflow.addNode("A1", "Action", "Action1");
  initialWorkflow.addNode("E", "End", "EndNode");

  // Add edges
  initialWorkflow.addEdge("I", "C1a");
  initialWorkflow.addEdge("I", "C1b");
  initialWorkflow.addEdge("C1a", "E");
  initialWorkflow.addEdge("C1b", "A1");
  initialWorkflow.addEdge("A1", "E");

  return initialWorkflow;
};

export default function App() {
  /* //Pan Gesture Handler for moving the canvas
  const { translateX, translateY, handlePan, handlePanStateChange } =
    usePanHandler();

  //All this to display the text, because a font is needed
  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
  const fontStyle = {
    fontFamily,
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  };
  const font = matchFont(fontStyle);

  const translationX = useSharedValue(200); // Circle's X position
  const translationY = useSharedValue(250); // Circle's Y position
  const pathX1 = useSharedValue(200); // Line's X1 position
  const pathY1 = useSharedValue(310); // Line's Y1 position
  const pathX2 = useSharedValue(200); // Line's X2 position
  const pathY2 = useSharedValue(440); // Line's Y2 position
  const greenCircleRadius = 60;

  const circle = {
    cx: 200,
    cy: 250,
    radius: 60,
  };
  const line = {
    x1: 200,
    y1: 310,
    x2: 200,
    y2: 440,
  };

  const [circles, setCircles] = useState([
    { id: 1, color: "green", cx: 200, cy: 250 },
    { id: 2, color: "red", cx: 200, cy: 350 },
  ]);

  const handleLineTouch = () => {
    setCircles((prevCircles) => {
      const distance = 100;
      const lastCircle = prevCircles[prevCircles.length - 1];
      const newId = lastCircle.id + 1;
      const newCy = lastCircle.cy + distance;

      return [...prevCircles, { id: newId, color: "blue", cx: 200, cy: newCy }];
    });
  };

  // Gesture handler for detecting tap on the line
  const tapGesture = useTapHandler(line, circle, handleLineTouch);

  useEffect(() => {
    circles.forEach((circle) => {
      console.log(circle);
    });
    console.log("----");
  }, [circles]); */

  const [workflow, setWorkflow] = useState(initializeWorkflow);
  const [showNodeForm, setShowNodeForm] = useState(false);

  // Function to update the workflow graph
  const updateWorkflow = (updateFn) => {
    setWorkflow((prevWorkflow) => {
      const newWorkflow = new WorkflowGraph();
      Object.assign(newWorkflow, prevWorkflow);
      updateFn(newWorkflow);
      return newWorkflow;
    });
  };

  const getNextId = (prefix) => {
    const ids = Object.keys(workflow.adjacencyList)
      .filter((id) => id.startsWith(prefix))
      .map((id) => parseInt(id.slice(1), 10))
      .sort((a, b) => a - b);

    const nextNumber = ids.length > 0 ? ids[ids.length - 1] + 1 : 1;
    return `${prefix}${nextNumber}`;
  };

  const addAction = (name, fromNode, toNode) => {
    const newId = getNextId("A");
    updateWorkflow((wf) => {
      const nodeAdded = wf.addNode(newId, "Action", name);
      if (nodeAdded) {
        if (wf.adjacencyList[toNode].type === "Condition") {
          // If toNode is a condition, delete the 2 edges from fromNode to toNode
          const fromNodeNeighbor1 = wf.adjacencyList[fromNode].neighbors[0];
          const fromNodeNeighbor2 = wf.adjacencyList[fromNode].neighbors[1];
          wf.deleteEdge(fromNode, fromNodeNeighbor2);
          wf.deleteEdge(fromNode, fromNodeNeighbor1);

          // Add 2 edges from newId to each of the conditional nodes
          wf.addEdge(newId, fromNodeNeighbor1);
          wf.addEdge(newId, fromNodeNeighbor2);

          // Add 1 edge from fromNode to newId
          wf.addEdge(fromNode, newId);
        } else {
          // If toNode is not a condition, handle as usual
          wf.deleteEdge(fromNode, toNode);
          wf.addEdge(fromNode, newId);
          wf.addEdge(newId, toNode);
        }
      }
    });
    setShowNodeForm(false);
  };

  const addCondition = (fromNode, toNode, condition1, condition2) => {
    const newId = getNextId("C");
    updateWorkflow((wf) => {
      if (wf.adjacencyList[toNode].type === "Condition") {
        console.error(
          "Cannot create a condition node before another condition node"
        );
      } else {
        const FirstNodeAdded = wf.addNode(newId + "a", "Condition", condition1);
        const SecondNodeAdded = wf.addNode(
          newId + "b",
          "Condition",
          condition2
        );
        if (FirstNodeAdded && SecondNodeAdded) {
          wf.deleteEdge(fromNode, toNode);
          wf.addEdge(fromNode, newId + "a");
          wf.addEdge(fromNode, newId + "b");
          wf.addEdge(newId + "a", toNode);
          wf.addEdge(newId + "b", toNode);
        }
      }
    });
    setShowNodeForm(false);
  };

  // Print graph whenever it changes
  useEffect(() => {
    workflow.printGraph();
  }, [workflow]);

  const handleAddNodePress = () => {
    setShowNodeForm(true);
  };

  return (
    /*  <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={handlePan}
        onHandlerStateChange={handlePanStateChange}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateX }, { translateY }],
            },
          ]}
        >
          <GestureDetector gesture={tapGesture}>
            <Canvas style={{ flex: 1 }}>
            </Canvas>
          </GestureDetector>
          <StatusBar style="auto" />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView> */
    <View style={styles.container}>
      {showNodeForm ? (
        <NodeForm addAction={addAction} addCondition={addCondition} />
      ) : (
        <>
          <WorkflowCanvas workflow={workflow} />
          <View style={styles.bottomContainer}>
            <Text style={styles.addNode} onPress={handleAddNodePress}>
              Add Node
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    //delete for drawing on canvas
    /*  backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center", */
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20, // Adjust the bottom margin as needed
    left: 0,
    right: 0,
    alignItems: "center", // Center the content horizontally
  },
  addNode: {
    margin: 10, // Adjust the margin as needed
    textAlign: "center",
    fontWeight: "bold",
  },
});
