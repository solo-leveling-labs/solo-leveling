import { Stack } from "expo-router";
import AuthProvider, { useAuth } from "@/src/contexts/AuthContext";

function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="(auth)"
          options={{ animation: "slide_from_left" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
