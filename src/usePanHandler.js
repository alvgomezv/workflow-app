import { useRef } from "react";
import { Animated } from "react-native";
import { State } from "react-native-gesture-handler";

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

export const usePanHandler = () => {
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

  return {
    translateX,
    translateY,
    handlePan,
    handlePanStateChange,
  };
};
