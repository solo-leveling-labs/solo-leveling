import { Stack } from "expo-router";

export default function FirstProfileSetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-profile" />
      <Stack.Screen name="configure-alerts" />
    </Stack>
  );
}
