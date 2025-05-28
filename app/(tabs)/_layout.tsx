import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StatusBar, useColorScheme, View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#121212" : "#F5F5F5"}
      />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDarkMode ? "#6366F1" : "#6366F1",
          tabBarInactiveTintColor: isDarkMode ? "#94A3B8" : "#94A3B8",
          tabBarStyle: {
            backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
            borderTopWidth: 0,
            elevation: 8,
            height: 65,
            paddingBottom: 18,
            paddingTop: 8,
            
            position: "absolute",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginTop: 4,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                padding: 8,
                borderRadius: 12,
              }}>
                <Ionicons 
                  name={focused ? "home" : "home-outline"} 
                  size={size} 
                  color={color} 
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="ListStudnets"
          options={{
            title: "Étudiants",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                padding: 8,
                borderRadius: 12,
              }}>
                <Ionicons 
                  name={focused ? "people" : "people-outline"} 
                  size={size} 
                  color={color} 
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
