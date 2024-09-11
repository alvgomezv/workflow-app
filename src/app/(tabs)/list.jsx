import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { deleteWorkflow } from "../utils/stateManagement";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { STORAGE_KEY } from "../../config/constants";

const List = () => {
  const [workflows, setWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* clearAll = async () => {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        // clear error
      }

      console.log("Done.");
    };
    clearAll(); */
    const loadWorkflows = async () => {
      try {
        const savedWorkflows = await AsyncStorage.getItem(`${STORAGE_KEY}`);
        if (savedWorkflows) {
          setWorkflows(JSON.parse(savedWorkflows));
        }
      } catch (error) {
        console.error("Failed to load workflows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflows();
  }, []);

  const saveWorkflows = async (newWorkflows) => {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEY}`,
        JSON.stringify(newWorkflows)
      );
    } catch (error) {
      console.error("Failed to save workflows:", error);
    }
  };

  const addWorkflow = () => {
    if (workflowName && !workflows.includes(workflowName)) {
      const newWorkflows = [...workflows, workflowName];
      setWorkflows(newWorkflows);
      saveWorkflows(newWorkflows);
      setWorkflowName("");
    } else {
      alert("Workflow name must be unique and not empty");
    }
  };

  const deleteData = (name) => {
    const newWorkflows = workflows.filter(
      (workflowName) => workflowName !== name
    );
    setWorkflows(newWorkflows);
    deleteWorkflow(name);
    saveWorkflows(newWorkflows);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Workflows</Text>
      {workflows.map((name) => (
        <View key={name} style={styles.workflowContainer}>
          <Link href={`/workflows/${name}`} style={styles.link}>
            {name}
          </Link>
          <Button title="Delete" onPress={() => deleteData(name)} />
        </View>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Enter workflow name"
        value={workflowName}
        onChangeText={setWorkflowName}
        maxLength={20}
      />
      <Button
        title="Add Workflow"
        onPress={addWorkflow}
        disabled={workflows.length >= 4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  workflowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  link: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default List;
