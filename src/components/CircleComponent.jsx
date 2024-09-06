import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function CircleComponent({ fillColor, onLayout }) {
  return (
    <View onLayout={onLayout}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="30"
          stroke="black"
          strokeWidth="1"
          fill={fillColor}
        />
      </Svg>
    </View>
  );
}

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}); */
