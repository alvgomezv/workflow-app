import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

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
    width: "80%", // Make the image take up the full width of the screen
    height: "80%", // Make the image take up the full height of the screen
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Home;
