import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      {/*   <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          title: "Home",
          headerTitleAlign: "center",
        }}
      /> */}
      <Tabs.Screen
        name="workflows/[id]"
        options={{
          headerTitle: "Workflow",
          title: "Workflow",
          headerTitleAlign: "center",
        }}
      />
      {/* Create a link back, to the home page */}
    </Tabs>
  );
};

export default TabsLayout;
