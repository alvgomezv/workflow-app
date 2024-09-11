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

          return <Icon name={iconName} size={size} color={"white"} />;
        },
        tabBarStyle: {
          backgroundColor: "tomato", // Background color of the tab bar
        },
        tabBarActiveTintColor: "white", // Color of the active tab
        tabBarInactiveTintColor: "white", // Color of the inactive tabs
        headerStyle: {
          backgroundColor: "tomato", // Background color of the header
        },
        headerTintColor: "white", // Color of the header text and icons
        headerTitleStyle: {
          fontWeight: "bold", // Font style of the header title
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Instructions",
          title: "Instructions",
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
