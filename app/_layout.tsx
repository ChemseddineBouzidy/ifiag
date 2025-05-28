import { useUserStore } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const setUserAndStudent = useUserStore(state => state.setUserAndStudent);
  const user = useUserStore(state => state.user); 
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("access_token");

    if (token) {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUserAndStudent({
            user: data.data.user,
            student: data.data.student,
          });
        } else {
          await AsyncStorage.removeItem("access_token");
        }
      } catch (e) {
        await AsyncStorage.removeItem("access_token");
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    // Montre un écran de chargement ou rien
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack>

      <Stack.Screen name="index" options={{ headerShown: false }} />

      {user && (
        <Stack.Screen name="home" options={{ headerShown: false }} />
      )}

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Student/[id]" options={{ headerShown: false }} />


      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/SignUp" options={{ headerShown: false }} />

   
      <Stack.Screen
        name="OnboardingScreen"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
    </Stack>
  );
}
