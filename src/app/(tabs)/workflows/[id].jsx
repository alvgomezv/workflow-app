import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { View } from "react-native";
import WorkFlowScreen from "../../../components/WorkFlowScreen";
import React, { useEffect, useState } from "react";

const WorkflowPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Workflow: ${id}`,
    });
  }, [id, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      // When the screen is focused, set isLoading to true
      setIsLoading(true);
      setIsFocused(true);

      return () => {
        // When the screen is unfocused, set isLoading to true
        setIsLoading(true);
        setIsFocused(false);
      };
    }, [])
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <WorkFlowScreen
          workflowId={id}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          isFocused={isFocused}
        />
      </View>
    </>
  );
};

export default WorkflowPage;
