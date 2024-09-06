import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import CircleComponent from "./components/CircleComponent";

export default function App() {
  return (
    <View style={styles.container}>
      <CircleComponent fillColor="green" />
      <CircleComponent fillColor="red" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
