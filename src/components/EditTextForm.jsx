import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const EditTextForm = ({ nodeName, onSave }) => {
  const [name, setName] = useState(nodeName);

  const handleSave = () => {
    onSave(name);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter node name"
      />
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EditTextForm;
