import { Stack } from "expo-router";

export default function SelectProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
