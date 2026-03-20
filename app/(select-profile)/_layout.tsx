import { Stack } from "expo-router";

export default function SelectProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
      <Stack.Screen name="parent-access" />
      <Stack.Screen name="child-welcome" />
      <Stack.Screen name="secret-object-intro" />
      <Stack.Screen name="select-secret-object" />
      <Stack.Screen
        name="secret-object-confirmation"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="create-profile" />
      <Stack.Screen name="configure-alerts" />
      <Stack.Screen name="notifications-setup" />
      <Stack.Screen
        name="profile-complete"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
