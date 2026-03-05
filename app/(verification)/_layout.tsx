import { Stack } from "expo-router";

export default function VerificationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="step-1" />
      <Stack.Screen name="step-2" />
      <Stack.Screen name="step-3" />
      <Stack.Screen name="verification-loading" />
      <Stack.Screen name="verification-success" />
      <Stack.Screen name="verification-error" />
    </Stack>
  );
}
