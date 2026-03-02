import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { logout } = useAuth();
  const { top } = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const nextLanguage = i18n.resolvedLanguage === "es" ? "en" : "es";
    i18n.changeLanguage(nextLanguage).catch((error) => {
      console.error("Failed to change app language", error);
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: top + 12 }]}>
        <Text style={styles.topBarTitle}>{t("appName")}</Text>
        <View style={styles.topBarActions}>
          <Pressable
            onPress={handleLanguageToggle}
            style={({ pressed }) => [
              styles.languageButton,
              pressed && styles.languageButtonPressed,
            ]}
            accessibilityLabel={t("home.languageToggleA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.languageButtonText}>
              {i18n.resolvedLanguage === "es" ? "ES" : "EN"}
            </Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            accessibilityLabel={t("home.logoutA11y")}
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t("home.title")}</Text>
        <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
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
  topBarActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5EA",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  languageButtonPressed: {
    opacity: 0.8,
  },
  languageButtonText: {
    color: "#1A1A2E",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
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
