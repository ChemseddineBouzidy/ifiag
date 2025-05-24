import { Ionicons } from "@expo/vector-icons";

import { Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";


export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            height: 60,
            elevation: 5,
            position: 'absolute',
            marginHorizontal: 50,
            marginBottom: 40,
            borderRadius: 100,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'black',
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass" color={color} size={24}  />
            ),
          }}
        />
       
      
    

      </Tabs>
      </>
  );
}