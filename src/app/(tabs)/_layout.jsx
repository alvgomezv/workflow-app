import { Tabs, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "list") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
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
          headerTitle: "Workflows",
          title: "Workflows",
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
