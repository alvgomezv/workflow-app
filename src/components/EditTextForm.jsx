import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const EditTextForm = ({ nodeName, onSave }) => {
  const [name, setName] = useState(nodeName);

  const handleSave = () => {
    onSave(name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Node name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        maxLength={14}
      />

      <TouchableOpacity style={styles.button} title="Save" onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,

    marginBottom: 5,
  },
});

export default EditTextForm;
