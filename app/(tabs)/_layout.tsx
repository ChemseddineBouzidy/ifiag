import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StatusBar, View } from "react-native";

export default function RootLayout() {

  return (
    <>
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="white"
      />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
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
