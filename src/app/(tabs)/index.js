import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Button,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { usePanHandler } from "../utils/usePanHandler";
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
import ConnectingLine from "../../components/ConnectingLine";
import {
  Canvas,
  Path,
  Circle,
  Rect,
  Text as Tx,
  listFontFamilies,
  matchFont,
  Offset,
} from "@shopify/react-native-skia";
import { Use } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTapHandler } from "../utils/useTapHandler";
import { useLongTapHandler } from "../utils/useLongTapHandler";
import { WorkflowGraph } from "../utils/WorkflowGraph";
import calculateCoordinates from "../utils/calculateCoordinates";
import WorkflowCanvas from "../../components/WorkflowCanvas";
import CustomModal from "../../components/ModalForm";
import AddNodeForm from "../../components/AddNodeForm";
import AddNodeSimpleForm from "../../components/AddNodeSimpeForm";
import EditTextForm from "../../components/EditTextForm";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

//make constants for the sizes of shapes
const actionWidth = 130;
const actionHeight = 70;
const conditionWidth = 140;
const conditionHeight = 100;
const circleRadius = 50;
const arrowSize = 20;
const arrowWidth = 12;
const startMarginTop = 100;
const STORAGE_KEY = "workflow_data";

export default function App() {
  const [workflow, setWorkflow] = useState(initializeWorkflow);
  const [coordinates, setCoordinates] = useState(
    calculateCoordinates(
      workflow,
      actionWidth,
      conditionWidth,
      actionHeight,
      conditionHeight
    )
  );
  const [lines, setLines] = useState({});
  const [margins, setMargins] = useState({ marginTop: 0, marginLeft: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLongTapModalVisible, setIsLongTapModalVisible] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [longTapSelectedShape, setLongTapSelectedShape] = useState(null);
  const [EditNodeName, setEditNodeName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ----- LOAD AND SAVE WORKFLOW DATA -----

  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        const savedWorkflow = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedWorkflow) {
          const parsedWorkflow = WorkflowGraph.fromJSON(
            JSON.parse(savedWorkflow)
          );
          setWorkflow(parsedWorkflow);
          console.log("New Workflow: ", parsedWorkflow);
          // Calculate the coordinates in another useEffect that depends on the workflow

          console.log("Loaded workflow data");
          setCoordinates(
            calculateCoordinates(
              parsedWorkflow,
              actionWidth,
              conditionWidth,
              actionHeight,
              conditionHeight
            )
          );
          console.log("New Coordinates: ", coordinates);

          // Set loading to false after coordinates are calculated
          setIsLoading(false);
          console.log("Loading: ", isLoading);
        }
      } catch (error) {
        console.error("Failed to load workflow data:", error);
      }
    };

    loadWorkflow();
  }, []);

  useEffect(() => {
    const saveWorkflow = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
        console.log("Saved workflow data");
      } catch (error) {
        console.error("Failed to save workflow data:", error);
      }
    };

    saveWorkflow();
  }, [workflow]);

  // -------------------------------------

  useEffect(() => {
    /* // Calculate the coordinates of the nodes and the size of the adjusted canvas
    setCoordinates(
      calculateCoordinates(
        workflow,
        actionWidth,
        conditionWidth,
        actionHeight,
        conditionHeight
      )
    ); */

    // Calculate the margins for the canvas
    const initNode = Object.entries(coordinates.coord).find(
      ([nodeId, { x, y }]) => workflow.adjacencyList[nodeId].type === "Init"
    );
    const initX = initNode ? initNode[1].x : 0;
    const initY = initNode ? initNode[1].y : 0;

    const screenWidth = Dimensions.get("window").width;
    const marginLeft = screenWidth / 2 - initX;
    const marginTop = startMarginTop - initY;

    setMargins({ marginTop, marginLeft });
  }, [workflow]);

  //When selected edge changes, open the modal
  useEffect(() => {
    if (selectedEdge) {
      console.log("Selected Edge: ", selectedEdge);
      openTapModal();
    }
  }, [selectedEdge]);

  useEffect(() => {
    if (longTapSelectedShape) {
      console.log("Long Tap Selected Shape: ", longTapSelectedShape);
      setEditNodeName(workflow.adjacencyList[longTapSelectedShape].name);
      openLongTapModal();
    }
  }, [longTapSelectedShape]);

  const openTapModal = () => setIsModalVisible(true);
  const closeTapModal = () => {
    setIsModalVisible(false);
    setSelectedEdge(null);
  };
  const openLongTapModal = () => setIsLongTapModalVisible(true);
  const closeLongTapModal = () => {
    setIsLongTapModalVisible(false);
    setLongTapSelectedShape(null);
  };

  //------- NEW PINCH-TO-ZOOM, PAN GESTURES, TAP AND LONG TAP --------------

  // Shared values for gestures
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const start = useSharedValue({ x: 0, y: 0 });
  const tapOffset = useSharedValue({ x: 0, y: 0 });

  // Animated styles for gestures
  const animatedStyles = useAnimatedStyle(() => {
    return {
      // Coordinates for the canvas that change with the size of the workflow
      width: coordinates.canvasWidth,
      height: coordinates.canvasHeight,
      // To center the canvas in the screen
      position: "absolute",
      left: margins.marginLeft,
      top: margins.marginTop,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Pan Gesture Handler for moving the canvas
  const panGesture = Gesture.Pan()
    .onStart(() => {
      start.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((e) => {
      translateX.value = e.translationX + start.value.x;
      translateY.value = e.translationY + start.value.y;
    })
    .runOnJS(true);

  // Pinch Gesture Handler for zooming in and out
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .runOnJS(true);

  // Tap Gesture Handler
  const tapGesture = useTapHandler(
    lines,
    40,
    margins,
    setSelectedEdge,
    tapOffset
  );

  // Long Tap Gesture Handler
  const longTapGesture = useLongTapHandler(
    coordinates,
    margins,
    setLongTapSelectedShape,
    tapOffset
  );

  // Combine gestures
  const composedGesture = Gesture.Race(
    tapGesture,
    longTapGesture,
    Gesture.Simultaneous(panGesture, pinchGesture)
  );

  // Function to reset the view to the start position
  const resetView = () => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  //--------------------------------------------------------

  // OLS GESTURES FOR TAP AND LONG TAP
  /* // Gesture handler for detecting tap on the line
  const tapGesture = useTapHandler(lines, 40, margins, setSelectedEdge);

  // Long Tap Gesture Handler
  const longTapGesture = useLongTapHandler(
    coordinates,
    margins,
    setLongTapSelectedShape
  ); */

  // Function to update the workflow graph
  const updateWorkflow = (updateFn) => {
    setWorkflow((prevWorkflow) => {
      const newWorkflow = new WorkflowGraph();
      Object.assign(newWorkflow, prevWorkflow);
      updateFn(newWorkflow);

      // Recalculate coordinates after updating the workflow
      const newCoordinates = calculateCoordinates(
        newWorkflow,
        actionWidth,
        conditionWidth,
        actionHeight,
        conditionHeight
      );
      setCoordinates(newCoordinates);

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
    closeTapModal();
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
    closeTapModal();
  };

  //Edit the text of a shape
  const handleSaveNodeName = (newName) => {
    updateWorkflow((workflow) => {
      workflow.updateNodeName(longTapSelectedShape, newName);
    });
    setIsLongTapModalVisible(false);
  };

  /* // Print graph whenever it changes
  useEffect(() => {
    workflow.printGraph();
  }, [workflow]);

  // print coordinates whenever they change
  useEffect(() => {
    console.log("Coordinates: ", coordinates);
  }, [coordinates]);

  useEffect(() => {
    console.log("---------------------- ");
  }, []); */

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" backgroundColor="black" />
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[animatedStyles]}>
            <SafeAreaView style={styles.container}>
              <View style={[styles.container]}>
                {isLoading ? (
                  <Text>Loading...</Text>
                ) : (
                  <WorkflowCanvas
                    workflow={workflow}
                    coordinates={coordinates}
                    setLines={setLines}
                  />
                )}
                <CustomModal isVisible={isModalVisible} onClose={closeTapModal}>
                  <AddNodeSimpleForm
                    style={styles.AddNodeForm}
                    addAction={addAction}
                    addCondition={addCondition}
                    selectedEdge={selectedEdge}
                  />
                </CustomModal>
                <CustomModal
                  isVisible={isLongTapModalVisible}
                  onClose={closeLongTapModal}
                >
                  <EditTextForm
                    nodeName={EditNodeName}
                    onSave={handleSaveNodeName}
                  />
                </CustomModal>
              </View>
            </SafeAreaView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
      {/* <Button title="Add Node" onPress={openModal} /> */}
      <Button title="Reset View" onPress={resetView} />
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
  AddNodeForm: {
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
