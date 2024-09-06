import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Animated } from "react-native";
import CircleComponent from "./components/CircleComponent";
import SquareComponent from "./components/SquareComponent";
import DiamondComponent from "./components/DiamondComponent";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import React, { useRef } from "react";

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
          <CircleComponent fillColor="green" />
          <SquareComponent fillColor="yellow" />
          <DiamondComponent fillColor="blue" />
          <CircleComponent fillColor="red" />
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
    alignItems: "center",
    justifyContent: "center",
  },
});
