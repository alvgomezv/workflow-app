import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkflowGraph } from "../utils/WorkflowGraph";
import calculateCoordinates from "./calculateCoordinates";
import { STORAGE_KEY } from "../../config/constants";

const loadWorkflow = async (setWorkflow, setCoordinates, setIsLoading) => {
  try {
    const savedWorkflow = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedWorkflow) {
      const parsedWorkflow = WorkflowGraph.fromJSON(JSON.parse(savedWorkflow));
      setWorkflow(parsedWorkflow);

      console.log("Loaded workflow data");
      setCoordinates(calculateCoordinates(parsedWorkflow));

      // Set loading to false after coordinates are calculated
      setIsLoading(false);
    }
  } catch (error) {
    console.error("Failed to load workflow data:", error);
  }
};

const saveWorkflow = async (workflow) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
    console.log("Saved workflow data");
  } catch (error) {
    console.error("Failed to save workflow data:", error);
  }
};

export { loadWorkflow, saveWorkflow };
