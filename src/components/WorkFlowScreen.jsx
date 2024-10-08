import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTapHandler } from "../app/utils/useTapHandler";
import { useLongTapHandler } from "../app/utils/useLongTapHandler";
import { WorkflowGraph } from "../app/utils/WorkflowGraph";
import calculateCoordinates from "../app/utils/calculateCoordinates";
import WorkflowCanvas from "./WorkflowCanvas";
import CustomModal from "./ModalForm";
import AddNodeSimpleForm from "./AddNodeSimpeForm";
import EditTextForm from "./EditTextForm";
import { useFocusEffect } from "expo-router";
import { START_MARGIN_TOP, SCREEN_WIDTH } from "../config/constants";
import initializeWorkflow from "../app/utils/utils";
import { loadWorkflow, saveWorkflow } from "../app/utils/stateManagement";

import { Image } from "expo-image";
import { debounce } from "lodash";

const WorkFlowScreen = ({ workflowId, setIsLoading, isLoading }) => {
  const [workflow, setWorkflow] = useState(initializeWorkflow);
  const [coordinates, setCoordinates] = useState(
    calculateCoordinates(workflow)
  );
  const [lines, setLines] = useState({});
  const [margins, setMargins] = useState({ marginTop: 0, marginLeft: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLongTapModalVisible, setIsLongTapModalVisible] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [longTapSelectedShape, setLongTapSelectedShape] = useState(null);
  const [EditNodeName, setEditNodeName] = useState(null);

  // ----- LOAD AND SAVE WORKFLOW DATA -----

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        await loadWorkflow(
          workflowId,
          setWorkflow,
          setCoordinates,
          setIsLoading
        );
      };

      load();
      resetView();
    }, [workflowId])
  );

  useEffect(() => {
    loadWorkflow(workflowId, setWorkflow, setCoordinates, setIsLoading);
  }, [workflowId]);

  useEffect(() => {
    saveWorkflow(workflowId, workflow);
  }, [workflow, workflowId]);

  // -------------------------------------

  useEffect(() => {
    // Calculate the margins for the canvas to center it
    const initNode = Object.entries(coordinates.coord).find(
      ([nodeId, { x, y }]) => workflow.adjacencyList[nodeId].type === "Init"
    );
    const initX = initNode ? initNode[1].x : 0;
    const initY = initNode ? initNode[1].y : 0;

    const marginLeft = SCREEN_WIDTH / 2 - initX;
    const marginTop = START_MARGIN_TOP - initY;

    setMargins({ marginTop, marginLeft });
  }, [workflow]);

  // When selected edge changes, open the Add Node modal if is not null
  useEffect(() => {
    if (selectedEdge) {
      openTapModal();
    }
  }, [selectedEdge]);

  // When selected shape changes, open the Edit Node Name modal
  useEffect(() => {
    if (longTapSelectedShape) {
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
        { translateX: withSpring(translateX.value) },
        { translateY: withSpring(translateY.value) },
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

  // Function to update the workflow graph
  const updateWorkflow = (updateFn) => {
    setWorkflow((prevWorkflow) => {
      const newWorkflow = new WorkflowGraph();
      Object.assign(newWorkflow, prevWorkflow);
      updateFn(newWorkflow);

      // Recalculate coordinates after updating the workflow
      const newCoordinates = calculateCoordinates(newWorkflow);
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require("../assets/loader.gif")}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" backgroundColor="black" />
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[animatedStyles]}>
            <SafeAreaView style={styles.container}>
              <View style={[styles.container]}>
                <WorkflowCanvas
                  workflow={workflow}
                  coordinates={coordinates}
                  setLines={setLines}
                />

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
      <TouchableOpacity style={styles.resetButton} onPress={resetView}>
        <Text style={styles.resetButtonText}>Reset View</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addNode: {
    margin: 10,
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    borderColor: "tomato",
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 5,
    alignItems: "center",
  },
  resetButtonText: {
    color: "tomato",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkFlowScreen;
