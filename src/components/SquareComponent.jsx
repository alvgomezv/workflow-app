import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

export default function SquareComponent({ fillColor }) {
  return (
    <View style={styles.container}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Rect
          x="25"
          y="25"
          width="50"
          height="50"
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
