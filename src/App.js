import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Animated, Platform } from "react-native";
import CircleComponent from "./components/CircleComponent";
import SquareComponent from "./components/SquareComponent";
import DiamondComponent from "./components/DiamondComponent";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import ConnectingLine from "./components/ConnectingLine";
import {
  Canvas,
  Path,
  Circle,
  Rect,
  Text,
  listFontFamilies,
  matchFont,
} from "@shopify/react-native-skia";
import { Use } from "react-native-svg";
import { useSharedValue } from "react-native-reanimated";

export default function App() {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePan = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handlePanStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      translateX.extractOffset();
      translateY.extractOffset();
    }
  };

  /* //Pinch Gesture Handler for zooming in and out
  
  const scale = useRef(new Animated.Value(1)).current;
  const handlePinch = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });

  //Animation to go back to the original scale 
    
    const handlePinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }; */

  //All this to display the text, because a font is needed
  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
  const fontStyle = {
    fontFamily,
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  };
  const font = matchFont(fontStyle);

  const translationX = useSharedValue(200); // Circle's X position
  const translaionY = useSharedValue(250); // Circle's Y position
  const greenCircleRadius = 60;

  // Gesture handler for detecting tap on the green circle
  const gesture = Gesture.Tap().onEnd((event) => {
    if (
      Math.sqrt(
        Math.pow(event.x - translationX.value, 2) +
          Math.pow(event.y - translaionY.value, 2)
      ) <= greenCircleRadius
    )
      console.log("Green circle touched!");
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={handlePan}
        onHandlerStateChange={handlePanStateChange}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateX }, { translateY }],
            },
          ]}
        >
          <GestureDetector gesture={gesture}>
            <Canvas style={{ flex: 1 }}>
              <Circle
                cx={translationX.value}
                cy={translaionY.value}
                r={greenCircleRadius}
                color="green"
              />

              <Circle cx={200} cy={500} r={60} color="red" />

              <Text text="Hello World" y={250} x={160} font={null} />

              <Path
                path="M 200 310 L 200 440"
                color="black"
                style="stroke"
                strokeWidth={3}
              />
            </Canvas>
          </GestureDetector>

          <StatusBar style="auto" />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
