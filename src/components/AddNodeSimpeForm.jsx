// AddNodeForm.js
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import WarningIcon from "../assets/warning.png"; // Adjust the path as needed
import { BlendMode } from "@shopify/react-native-skia";

const AddNodeSimpleForm = ({ addAction, addCondition, selectedEdge }) => {
  const [nodeType, setNodeType] = useState("Action");
  const [nodeName, setNodeName] = useState("");
  const [condition1, setCondition1] = useState("");
  const [condition2, setCondition2] = useState("");

  const handleSubmit = () => {
    if (nodeType === "Action") {
      addAction(
        nodeName,
        (fromNode = selectedEdge[0]),
        (toNode = selectedEdge[1])
      );
    } else if (nodeType === "Condition") {
      addCondition(
        (fromNode = selectedEdge[0]),
        (toNode = selectedEdge[1]),
        condition1,
        condition2
      );
    }
  };

  const isConditionalEdge = selectedEdge && selectedEdge[1].startsWith("C");

  return (
    <View style={styles.container}>
      {isConditionalEdge && (
        <View style={styles.warningBox}>
          <Image source={WarningIcon} style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Before Conditional nodes you can't create another condition
          </Text>
        </View>
      )}
      <Text style={styles.text}>Node Type:</Text>
      <Picker
        selectedValue={nodeType}
        style={styles.picker}
        onValueChange={(itemValue) => setNodeType(itemValue)}
      >
        <Picker.Item label="Action" value="Action" />
        {!isConditionalEdge && (
          <Picker.Item label="Condition" value="Condition" />
        )}
      </Picker>
      {nodeType === "Action" && (
        <>
          <Text style={styles.text}>Node Name:</Text>
          <TextInput
            style={styles.input}
            value={nodeName}
            onChangeText={setNodeName}
            maxLength={14}
          />
        </>
      )}
      {nodeType === "Condition" && !isConditionalEdge && (
        <>
          <Text style={styles.text}>Condition 1:</Text>
          <TextInput
            style={styles.input}
            value={condition1}
            onChangeText={setCondition1}
            maxLength={14}
          />
          <Text style={styles.text}>Condition 2:</Text>
          <TextInput
            style={styles.input}
            value={condition2}
            onChangeText={setCondition2}
            maxLength={14}
          />
        </>
      )}
      <TouchableOpacity
        style={styles.button}
        title="Add Node"
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Add Node</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  picker: {
    height: 40,
    width: 200,
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 20,
    marginTop: 5,
  },
  button: {
    backgroundColor: "tomato",

    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 5,
    backgroundColor: "white",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    borderRadius: 5,
    padding: 10,
    paddingRight: 30,
    paddingLeft: 20,
    marginBottom: 20,
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  warningText: {
    color: "#856404",
  },
  buttonText: {
    color: "white", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,

    marginBottom: 5,
  },
});

export default AddNodeSimpleForm;
