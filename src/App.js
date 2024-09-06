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
import React, { useEffect, useRef, useState } from "react";
import ConnectingLine from "./components/ConnectingLine";

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

  const [positions, setPositions] = useState({});
  const [line, setLine] = useState({ x1: 50, y1: 50, x2: 90, y2: 90 });

  const handleLayout = (event, id) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setPositions((prevPositions) => ({
      ...prevPositions,
      [id]: { x, y, width, height },
    }));
  };

  useEffect(() => {
    console.log(positions);
  }, [positions]);

  useEffect(() => {
    if (positions.circleGreen) {
      const { x, y, width, height } = positions.circleGreen;
      const x1 = x + width / 2;
      const y1 = y + height / 2;
      setLine((prevLine) => ({ ...prevLine, x1, y1 }));
    }
    if (positions.circleRed) {
      const { x, y, width, height } = positions.circleRed;
      const x2 = x + width / 2;
      const y2 = y + height / 2;
      setLine((prevLine) => ({ ...prevLine, x2, y2 }));
    }
  }, [positions]);

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
          //onLayout={(event) => handleLayout(event, "container")}
        >
          <ConnectingLine line={line} />

          <CircleComponent
            fillColor="green"
            onLayout={(event) => handleLayout(event, "circleGreen")}
          />

          <CircleComponent
            fillColor="red"
            onLayout={(event) => handleLayout(event, "circleRed")}
          />

          <StatusBar style="auto" />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
});
