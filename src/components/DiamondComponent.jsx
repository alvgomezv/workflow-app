import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";

export default function DiamondComponent({ fillColor }) {
  return (
    <View style={styles.container}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Polygon
          //x1,y1 x2,y2 x3,y3 x4,y4
          points="50,20 100,50 50,80 0,50"
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
