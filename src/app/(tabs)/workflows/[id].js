import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const WorkflowPage = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Workflow Page - {id}</Text>
    </View>
  );
};

export default WorkflowPage;
