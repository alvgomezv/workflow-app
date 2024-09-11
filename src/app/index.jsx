import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";
import SplashScreenView from "../components/SplashScreenView";
import { useState } from "react";

const startPage = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const handleAnimationEnd = () => {
    setIsSplashVisible(false);
  };

  return (
    <View style={styles.container}>
      {isSplashVisible ? (
        <SplashScreenView onAnimationEnd={handleAnimationEnd} />
      ) : (
        <Redirect href="/home" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default startPage;
