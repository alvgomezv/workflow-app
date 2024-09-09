// AddNodeForm.js
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const AddNodeForm = ({ addAction, addCondition }) => {
  const [nodeType, setNodeType] = useState("Action");
  const [nodeName, setNodeName] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [condition1, setCondition1] = useState("");
  /* const [condition1ToNode, setCondition1ToNode] = useState(""); */
  const [condition2, setCondition2] = useState("");
  /*  const [condition2ToNode, setCondition2ToNode] = useState(""); */

  const handleSubmit = () => {
    if (nodeType === "Action") {
      console.log({
        type: nodeType,
        name: nodeName,
        fromNode,
        toNode,
      });
      addAction(nodeName, fromNode, toNode);
    } else if (nodeType === "Condition") {
      console.log({
        type: nodeType,
        fromNode,
        toNode,
        conditions: {
          //[condition1]: condition1ToNode,
          //[condition2]: condition2ToNode,
          [condition1]: toNode,
          [condition2]: toNode,
        },
      });
      addCondition(
        fromNode,
        toNode,
        condition1,
        //condition1ToNode,
        condition2
        //condition2ToNode
      );
    }
    //clean the form
    /* setNodeType("Action");
    setNodeName("");
    setFromNode("");
    setToNode(""); */
  };

  return (
    <View style={styles.container}>
      <Text>Node Type:</Text>
      <Picker
        selectedValue={nodeType}
        style={styles.picker}
        onValueChange={(itemValue) => setNodeType(itemValue)}
      >
        <Picker.Item label="Action" value="Action" />
        <Picker.Item label="Condition" value="Condition" />
      </Picker>
      {nodeType === "Action" && (
        <>
          <Text>Node Name:</Text>
          <TextInput
            style={styles.input}
            value={nodeName}
            onChangeText={setNodeName}
          />
          <Text>From Node:</Text>
          <TextInput
            style={styles.input}
            value={fromNode}
            onChangeText={setFromNode}
          />
          <Text>To Node:</Text>
          <TextInput
            style={styles.input}
            value={toNode}
            onChangeText={setToNode}
          />
        </>
      )}
      {nodeType === "Condition" && (
        <>
          <Text>From Node:</Text>
          <TextInput
            style={styles.input}
            value={fromNode}
            onChangeText={setFromNode}
          />
          <Text>To Node:</Text>
          <TextInput
            style={styles.input}
            value={toNode}
            onChangeText={setToNode}
          />
          <Text>Condition 1:</Text>
          <TextInput
            style={styles.input}
            value={condition1}
            onChangeText={setCondition1}
          />
          {/*<Text>Condition 1 To Node:</Text>
          <TextInput
            style={styles.input}
            value={condition1ToNode}
            onChangeText={setCondition1ToNode}
          />*/}
          <Text>Condition 2:</Text>
          <TextInput
            style={styles.input}
            value={condition2}
            onChangeText={setCondition2}
          />
          {/*<Text>Condition 2 To Node:</Text>
          <TextInput
            style={styles.input}
            value={condition2ToNode}
            onChangeText={setCondition2ToNode}
          />*/}
        </>
      )}
      <Button title="Add Node" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  picker: {
    height: 50,
    width: 150,
    borderColor: "gray",
    borderWidth: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default AddNodeForm;
