import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LogoIcon from "./LogoIcon";

type Props = { navigation: any };

const SplashScreen: React.FC<Props> = ({ navigation }) => {
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
      init();
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
