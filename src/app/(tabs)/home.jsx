import React from "react";
import { View, StyleSheet, Image } from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/Instructions.jpg")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Home;
