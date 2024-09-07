class Condition {
  constructor(condition, neighborId) {
    this.condition = condition;
    this.neighborId = neighborId;
  }
}

class WorkflowGraph {
  constructor() {
    this.adjacencyList = {};
  }

  // Add a general node (Init, Action, End)
  addNode(id, type, name) {
    if (this.adjacencyList[id]) {
      console.error(`Node with ID ${id} already exists.`);
      return false; // Return false if the node already exists
    }

    this.adjacencyList[id] = {
      id,
      type,
      name,
      neighbors: [],
    };
    return true; // Return true if the node was successfully added
  }

  // Add a conditional node
  addConditionalNode(id, conditions) {
    if (this.adjacencyList[id]) {
      console.error(`Node with ID ${id} already exists.`);
      return false; // Return false if the node already exists
    }

    const conditionObjects = Object.entries(conditions).map(
      ([condition, neighborId]) => new Condition(condition, neighborId)
    );

    const conditionsMap = {};
    conditionObjects.forEach((cond) => {
      conditionsMap[cond.condition] = cond.neighborId;
    });

    this.adjacencyList[id] = {
      id,
      type: "Conditional",
      neighbors: Object.values(conditionsMap),
      conditions: conditionsMap,
    };
    return true; // Return true if the node was successfully added
  }

  // Add an edge from one node to another (for other types of nodes)
  addEdge(fromId, toId) {
    const fromNode = this.adjacencyList[fromId];
    const toNode = this.adjacencyList[toId];

    if (!fromNode || !toNode) {
      console.error(`Failed to add Edge: FromId: ${fromId}, toId ${toId}`);
      return false; // Return false if one or both nodes do not exist
    }

    fromNode.neighbors.push(toId);
    return true; // Return true if the edge was successfully added
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

  printGraph() {
    let endNode = null;
    for (let nodeId in this.adjacencyList) {
      const node = this.adjacencyList[nodeId];
      if (node.type === "End") {
        endNode = node;
      } else {
        console.log(
          `${node.id} (${node.type}) -> [${node.neighbors.join(", ")}]`
        );
      }
    }
    if (endNode) {
      console.log(
        `${endNode.id} (${endNode.type}) -> [${endNode.neighbors.join(", ")}]`
      );
    }
    console.log("----");
  }
}

export { WorkflowGraph };
