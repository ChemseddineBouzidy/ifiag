import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useUserStore } from "../store/userStore";
import LogoIcon from "./LogoIcon";

const SplashScreen = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const setUserAndStudent = useUserStore((state) => state.setUserAndStudent);
  const progress = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: progress.value }],
    };
  });

  const navigateTo = (path: any) => {
    router.replace(path);
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        return navigateTo("/OnboardingScreen");
      }

      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserAndStudent({
          user: data.data.user,
          student: data.data.student,
        });
        navigateTo("/home");
      } else {
        await AsyncStorage.removeItem("access_token");
        navigateTo("/OnboardingScreen");
      }
    } catch (error) {
      await AsyncStorage.removeItem("access_token");
      navigateTo("/auth/login");
    }
  };

  useEffect(() => {
    const run = async () => {
      progress.value = withTiming(2, { duration: 500 });
      await new Promise((resolve) => setTimeout(resolve, 800));
      progress.value = withTiming(999, { duration: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 300));
      await checkAuth();
    };

    run();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E2C46" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View style={[animatedStyle]}>
          <LogoIcon />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
