import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkflowGraph } from "../utils/WorkflowGraph";
import calculateCoordinates from "./calculateCoordinates";
import { STORAGE_KEY } from "../../config/constants";
import initializeWorkflow from "./utils";

const loadWorkflow = async (
  workflowId,
  setWorkflow,
  setCoordinates,
  setIsLoading
) => {
  try {
    const savedWorkflow = await AsyncStorage.getItem(
      `${STORAGE_KEY}${workflowId}`
    );
    if (savedWorkflow) {
      const parsedWorkflow = WorkflowGraph.fromJSON(JSON.parse(savedWorkflow));
      setWorkflow(parsedWorkflow);

      console.log("Loaded workflow data: ", workflowId);
      setCoordinates(calculateCoordinates(parsedWorkflow));
    } else {
      // If there is no saved workflow, initialize a new one
      const initialWorkflow = initializeWorkflow();
      console.log("Initialized workflow data: ", workflowId);
      setWorkflow(initialWorkflow);
      setCoordinates(calculateCoordinates(initialWorkflow));
    }
  } catch (error) {
    console.error("Failed to load workflow data:", error);
  } finally {
    // Set loading to false after coordinates are calculated
    setIsLoading(false);
  }
};

const saveWorkflow = async (workflowId, workflow) => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEY}${workflowId}`,
      JSON.stringify(workflow)
    );
    console.log("Saved workflow data: ", workflowId);
  } catch (error) {
    console.error("Failed to save workflow data:", error);
  }
};

const deleteWorkflow = async (workflowId) => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY}${workflowId}`);
    console.log("Deleted workflow data: ", workflowId);
  } catch (error) {
    console.error("Failed to delete workflow data:", error);
  }
};

export { loadWorkflow, saveWorkflow, deleteWorkflow };
