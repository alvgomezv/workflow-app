import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          title: "Home",
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="workflows/[id]"
        options={{
          headerTitle: "Workflow",
          title: "Workflow",
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
