import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Nhớ import thư viện icon này

import HomeScreen from "../screen/HomeScreen";
import SearchScreen from "../screen/SearchScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: "#000", borderTopColor: "#333" },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#888",
          // THÊM PHẦN GẮN ICON TỰ ĐỘNG Ở ĐÂY
          tabBarIcon: ({ focused, color, size }) => { 
            let iconName;

            if (route.name === "Home") {
              // Icon ngôi nhà cho Trang chủ
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Search") {
              // Icon kính lúp cho Tìm kiếm
              iconName = focused ? "search" : "search-outline";
            }

            return <Ionicons name={iconName} size={size || 24} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: "Trang chủ" }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{ tabBarLabel: "Tìm kiếm" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}