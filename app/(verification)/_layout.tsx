import { Stack } from "expo-router";

export default function VerificationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="camera-verification-step-1" />
      <Stack.Screen name="camera-verification-step-2" />
      <Stack.Screen name="camera-verification-step-3" />
    </Stack>
  );
}
