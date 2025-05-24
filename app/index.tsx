import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useUserStore } from '../store/userStore';
import LogoIcon from "./LogoIcon";



const SplashScreen= () => {
  // const {user, setUser} = useUserStore();
  // const user = useUserStore(state => state.user);
  // const setUser = useUserStore(state => state.setUser);
  const setUserAndStudent = useUserStore(state => state.setUserAndStudent);
  const progress = useSharedValue(3);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: progress.value }],
    };
  });

  const init = async () => {
    await new Promise((resolve) => setTimeout(() => resolve(true), 800));
    router.replace("/OnboardingScreen");
  };

  const animationLogic = async () => {
    progress.value = withTiming(2, { duration: 500 });
    await new Promise((resolve) => setTimeout(() => resolve(true), 300));
    progress.value = withTiming(999, { duration: 1000 });
  };

  useEffect(() => {
    setTimeout(() => {

      animationLogic();
      async function getUser() {
      
        try {
          const token = await AsyncStorage.getItem('access_token');
          if (!token) {
            router.replace('/OnboardingScreen');
            return;
          }
          const response = await fetch('https://ifiag.pidefood.com/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            init();
            return;
          }
          const data = await response.json();
          console.log(data)
          // setUser(data);
          // router.replace('/home');
          if (data.success) {
            setUserAndStudent({
              user: data.data.user,
              student: data.data.student,
            });
            router.replace('/home');
          } else {
            init();
          }
        } catch (error) {
          await AsyncStorage.removeItem('access_token'); 
          router.replace('/auth/login');
          init();
        }
      }
      getUser();
     
    

    }, 1500);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
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
