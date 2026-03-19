import "@/src/i18n";
import { useAuthStore } from "@/src/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootNavigator() {
  const {
    isAuthenticated,
    isInitialized,
    isIdentityVerified,
    isProfileSetupComplete,
  } = useAuthStore();

  const [fontsLoaded, fontsError] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Raleway-Bold": require("../assets/fonts/Raleway-Bold.ttf"),
    "Raleway-ExtraBold": require("../assets/fonts/Raleway-ExtraBold.ttf"),
    "Raleway-SemiBold": require("../assets/fonts/Raleway-SemiBold.ttf"),
    ...Ionicons.font,
  });

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if ((!fontsLoaded && !fontsError) || !isInitialized) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(auth)"
          options={{ animation: "slide_from_left" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated && !isIdentityVerified}>
        <Stack.Screen name="(verification)" />
      </Stack.Protected>

      <Stack.Protected
        guard={isAuthenticated && isIdentityVerified && !isProfileSetupComplete}
      >
        <Stack.Screen name="(first-profile-setup)" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated && isProfileSetupComplete}>
        <Stack.Screen name="(select-profile)" />
      </Stack.Protected>

      <Stack.Screen name="(child-secret-object-setup)" />

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
