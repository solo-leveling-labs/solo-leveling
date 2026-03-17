import { Stack } from "expo-router";

export default function ChildSecretObjectSetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="child-welcome" />
    </Stack>
  );
}
