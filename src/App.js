import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Button,
  SafeAreaView,
} from "react-native";
import { usePanHandler } from "./usePanHandler";
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTapHandler } from "./useTapHandler";
import { WorkflowGraph } from "./WorkflowGraph";
import calculateCoordinates from "./calculateCoordinates";
import WorkflowCanvas from "./components/WorkflowCanvas";
import CustomModal from "./components/ModalForm";
import AddNodeForm from "./components/AddNodeForm";
import AddNodeSimpleForm from "./components/AddNodeSimpeForm";

const initializeWorkflow = () => {
  // Initialize the workflow graph
  const initialWorkflow = new WorkflowGraph();

  // Add nodes
  initialWorkflow.addNode("I", "Init", "InitNode");
  initialWorkflow.addNode("C1a", "Condition", "Condition 1");
  initialWorkflow.addNode("C1b", "Condition", "Condition 2");
  initialWorkflow.addNode("A1", "Action", "Action 1");
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
  const [workflow, setWorkflow] = useState(initializeWorkflow);
  const [lines, setLines] = useState({});
  const [margins, setMargins] = useState({ marginTop: 0, marginLeft: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);

  //When selected edge changes, open the modal
  useEffect(() => {
    if (selectedEdge) {
      openModal();
    }
  }, [selectedEdge]);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  // uses the old version of gestures for panning
  /* //Pan Gesture Handler for moving the canvas
  const { translateX, translateY, handlePan, handlePanStateChange } =
    usePanHandler(); */

  //------- NEW PINCH-TO-ZOOM AND PAN GESTURES --------------

  // Shared values for pinch-to-zoom and pan
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const start = useSharedValue({ x: 0, y: 0 });

  // Animated styles for pinch-to-zoom and pan
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // Pinch Gesture Handler for zooming in and out
  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    console.log("pinch");
    scale.value = e.scale;
  });

  // Pan Gesture Handler for moving the canvas
  const panGesture = Gesture.Pan()
    .onStart(() => {
      start.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((e) => {
      translateX.value = e.translationX + start.value.x;
      translateY.value = e.translationY + start.value.y;
    });

  // Combine pinch and pan gestures using Gesture.Race
  const composedGesture = Gesture.Race(pinchGesture, panGesture);

  //--------------------------------------------------------

  // Gesture handler for detecting tap on the line
  const tapGesture = useTapHandler(lines, 10, margins, setSelectedEdge);

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
    closeModal();
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
    closeModal();
  };

  // Print graph whenever it changes
  useEffect(() => {
    workflow.printGraph();
  }, [workflow]);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <PanGestureHandler
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
          > */}
        {/* <View style={styles.topBar} /> */}
        <StatusBar style="light" backgroundColor="black" />
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.container, animatedStyles]}>
            <GestureDetector gesture={tapGesture}>
              <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                  <WorkflowCanvas
                    workflow={workflow}
                    setLines={setLines}
                    setMargins={setMargins}
                  />
                  <CustomModal isVisible={isModalVisible} onClose={closeModal}>
                    <AddNodeSimpleForm
                      style={styles.nodeForm}
                      addAction={addAction}
                      addCondition={addCondition}
                      selectedEdge={selectedEdge}
                    />
                  </CustomModal>
                </View>
              </SafeAreaView>
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
        {/* </Animated.View>
        </PanGestureHandler> */}
      </GestureHandlerRootView>
      {/* <Button title="Add Node" onPress={openModal} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    //delete for drawing on canvas

    /* alignItems: "center",
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
  nodeForm: {
    flex: 1,
    marginTop: 100,
  },
  topBar: {
    height: 50,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
  },
});
