import { Image } from "expo-image";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

const SplashScreenView = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }, 2000); // Duration of the splash screen

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/workflow_splash.gif")}
        contentFit="contain"
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
    width: 200,
    height: 200,
  },
});

export default SplashScreenView;
