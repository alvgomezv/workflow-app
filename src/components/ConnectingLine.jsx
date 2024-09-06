import React from "react";
import Svg, { Line } from "react-native-svg";
import { StyleSheet } from "react-native";

const ConnectingLine = ({ line }) => {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        stroke="black"
        strokeWidth="2"
      />
    </Svg>
  );
};

export default ConnectingLine;
