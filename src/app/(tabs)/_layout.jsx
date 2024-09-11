import { Tabs, useLocalSearchParams } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Home",
          title: "Home",
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          headerTitle: "workflows",
          title: "workflows",
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="workflows/[id]"
        options={{
          href: null,
          headerTitle: "workflows",
          title: "workflows",
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
