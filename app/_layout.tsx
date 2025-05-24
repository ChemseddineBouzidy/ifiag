import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="OnboardingScreen" options={{ headerShown: false , animation: 'slide_from_right'}} />
    <Stack.Screen name="home" options={{ headerShown: false }} />
    <Stack.Screen name="auth/SignUp" options={{ headerShown: false }} />
    <Stack.Screen name="auth/tets" options={{ headerShown: false }} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="auth/login" options={{ headerShown: false }} />

    
  </Stack>
    );
}
