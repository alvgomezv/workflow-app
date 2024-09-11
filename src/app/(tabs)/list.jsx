import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { deleteWorkflow } from "../utils/stateManagement";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { STORAGE_KEY } from "../../config/constants";
import LottieView from "lottie-react-native";
import FastImage from "react-native-fast-image";
import { Image } from "expo-image";

const List = () => {
  const [workflows, setWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear all data
    /* c 
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
    console.log("workflow length", workflows.length);
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
        <Image
          style={{ width: 200, height: 200 }}
          source={require("../../assets/loader.gif")}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Workflows</Text>
      <View style={styles.workflowList}>
        {workflows.map((name) => (
          <View key={name} style={styles.workflowContainer}>
            <Link href={`/workflows/${name}`} style={styles.link}>
              {name}
            </Link>
            <TouchableOpacity
              onPress={() => deleteData(name)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter workflow name"
            value={workflowName}
            onChangeText={setWorkflowName}
            maxLength={20}
          />
          <TouchableOpacity
            title="Add Workflow"
            onPress={addWorkflow}
            style={[
              workflows.length >= 9 ? styles.disabledButton : styles.addButton,
            ]}
            disabled={workflows.length >= 9}
          >
            <Text style={styles.addButtonText}>Add Workflow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28, // Increased font size
    fontWeight: "bold",
    marginBottom: 50,
  },
  workflowList: {
    marginBottom: 20, // Gap between the list of workflows and the input text
  },
  workflowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  link: {
    fontSize: 18,
    color: "blue",
  },
  deleteButton: {
    backgroundColor: "tomato",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "tomato",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "grey",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default List;
