import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function CircleComponent({ fillColor }) {
  return (
    <View style={styles.container}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="black"
          strokeWidth="1"
          fill={fillColor}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
