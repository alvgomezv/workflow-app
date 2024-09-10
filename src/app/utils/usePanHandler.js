import { useRef } from "react";
import { Animated } from "react-native";
import { State } from "react-native-gesture-handler";

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
