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

  const [workflow, setWorkflow] = useState(new WorkflowGraph());

  useEffect(() => {
    // Initialize the workflow graph
    const initialWorkflow = new WorkflowGraph();

    // Add nodes
    initialWorkflow.addNode("I", "Init", "InitNode");
    initialWorkflow.addConditionalNode("C1", {
      Yes: "E",
      No: "A1",
    });
    initialWorkflow.addNode("A1", "Action", "Action1");
    initialWorkflow.addNode("E", "End", "EndNode");

    // Add edges for non-conditional nodes
    initialWorkflow.addEdge("I", "C1"); // Init -> Action1
    initialWorkflow.addEdge("A1", "E"); // Action1 -> End

    // Set the initial workflow state
    setWorkflow(initialWorkflow);
  }, []);

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
    const id = getNextId("A");
    updateWorkflow((wf) => {
      const nodeAdded = wf.addNode(id, "Action", name);
      if (nodeAdded) {
        wf.deleteEdge(fromNode, toNode);
        wf.addEdge(fromNode, id);
        wf.addEdge(id, toNode);
      }
    });
  };

  const addCondition = (
    fromNode,
    toNode,
    condition1,
    //condition1ToNode,
    condition2
    //condition2ToNode
  ) => {
    const id = getNextId("C");
    updateWorkflow((wf) => {
      const nodeAdded = wf.addConditionalNode(id, {
        //[condition1]: condition1ToNode,
        //[condition2]: condition2ToNode,
        [condition1]: toNode,
        [condition2]: toNode,
      });
      if (nodeAdded) {
        wf.deleteEdge(fromNode, toNode);
        wf.addEdge(fromNode, id);
      }
    });
  };

  // Print graph whenever it changes
  useEffect(() => {
    workflow.printGraph();
  }, [workflow]);

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
              <Circle
                cx={translationX.value}
                cy={translationY.value}
                r={greenCircleRadius}
                color="green"
              />

              <Circle cx={200} cy={500} r={60} color="red" />

              <Tx text="Hello World" y={250} x={160} font={null} />

              <Path
                path="M 200 310 L 200 440"
                color="black"
                style="stroke"
                strokeWidth={3}
              />
            </Canvas>
          </GestureDetector>

          <StatusBar style="auto" />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView> */
    <View style={styles.container}>
      {/*  <Text onPress={addAction}>Action</Text>
      <Text onPress={addCondition}>Condition</Text> */}
      <NodeForm addAction={addAction} addCondition={addCondition} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    //delete for drawing on canvas
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
