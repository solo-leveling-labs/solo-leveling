import { Stack } from "expo-router";

export default function ChildSecretObjectSetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="child-welcome" />
      <Stack.Screen name="secret-object-intro" />
      <Stack.Screen name="select-secret-object" />
    </Stack>
  );
}
