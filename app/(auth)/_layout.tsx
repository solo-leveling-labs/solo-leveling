import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up-step-1" />
      <Stack.Screen name="sign-up-step-2" />
      <Stack.Screen name="sign-up-step-3" />
    </Stack>
  );
}
