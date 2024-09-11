import { WorkflowGraph } from "../utils/WorkflowGraph";

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

export default initializeWorkflow;
