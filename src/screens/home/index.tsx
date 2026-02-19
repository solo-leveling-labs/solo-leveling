import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/contexts/AuthContext";

const HomeScreen = () => {
  const { logout } = useAuth();
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: top + 12 }]}>
        <Text style={styles.topBarTitle}>Socrates</Text>
        <Pressable
          onPress={logout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          accessibilityLabel="Log out"
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Ionicons name="home-outline" size={64} color="#1A1A2E" />
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>You are logged in!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
  },
  logoutButtonPressed: {
    backgroundColor: "#FFF0F0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
});

export default HomeScreen;
