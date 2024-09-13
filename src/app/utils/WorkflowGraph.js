import { debounce } from "lodash";

class WorkflowGraph {
  constructor() {
    this.adjacencyList = {};
  }

  // Add a general node (Init, Action, Condition, End)
  addNode(id, type, name) {
    if (this.adjacencyList[id]) {
      return false;
    }

    this.adjacencyList[id] = {
      id,
      type,
      name,
      neighbors: [],
    };
    return true;
  }

  // Add an edge from one node to another
  addEdge(fromId, toId) {
    const fromNode = this.adjacencyList[fromId];
    const toNode = this.adjacencyList[toId];

    if (!fromNode || !toNode) {
      console.error(`Failed to add Edge: FromId: ${fromId}, toId ${toId}`);
      return false;
    }

    fromNode.neighbors.push(toId);
    return true;
  }

  deleteEdge(fromId, toId) {
    const fromNode = this.adjacencyList[fromId];

    if (!fromNode) {
      console.error(`Failed to delete Edge: FromId: ${fromId}, toId ${toId}`);
      return false;
    }

    fromNode.neighbors = fromNode.neighbors.filter(
      (neighbor) => neighbor !== toId
    );
    return true;
  }

  updateNodeName(id, newName) {
    if (this.adjacencyList[id]) {
      this.adjacencyList[id].name = newName;
    } else {
      console.error(`Node with id ${id} does not exist.`);
    }
  }

  printGraph() {
    let endNode = null;
    for (let nodeId in this.adjacencyList) {
      const node = this.adjacencyList[nodeId];
      if (node.type === "End") {
        endNode = node;
      } else {
        console.log(`${node.id} (${node.name}) -> [${node.neighbors}]`);
      }
    }
    if (endNode) {
      console.log(`${endNode.id} (${endNode.name}) -> [${endNode.neighbors}]`);
    }
    console.log("----");
  }

  // Serialize the graph to JSON for saving it
  static fromJSON(json) {
    const workflow = new WorkflowGraph();
    Object.assign(workflow, json);
    return workflow;
  }
}

export { WorkflowGraph };
