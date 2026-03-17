import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SecretObjectCard from "./components/SecretObjectCard";

const SECRET_OBJECT_INDICES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const SelectSecretObjectScreen = () => {
  const { t } = useTranslation();
  const { dismissTo } = useRouter();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { childId: _childId } = useLocalSearchParams<{ childId: string }>();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardPress = useCallback((index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleConfirm = useCallback(() => {
    // TODO: Save selected secret object + navigate to next screen
    dismissTo("/(tabs)");
  }, [dismissTo]);

  const isConfirmEnabled = selectedIndex !== null;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: safeTop + 48 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.title}>{t("selectSecretObject.title")}</Text>

        <View style={styles.cardGrid}>
          {SECRET_OBJECT_INDICES.map((index) => (
            <SecretObjectCard
              key={index}
              index={index}
              isSelected={selectedIndex === index}
              isDimmed={selectedIndex !== null && selectedIndex !== index}
              onPress={handleCardPress}
            />
          ))}
        </View>

        <View style={[styles.footer, { paddingBottom: safeBottom + 40 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              !isConfirmEnabled && styles.confirmButtonDisabled,
              pressed && isConfirmEnabled && styles.confirmButtonPressed,
            ]}
            onPress={handleConfirm}
            disabled={!isConfirmEnabled}
            accessibilityLabel={t("selectSecretObject.confirmA11y")}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isConfirmEnabled }}
          >
            <Text
              style={[
                styles.confirmButtonText,
                !isConfirmEnabled && styles.confirmButtonTextDisabled,
              ]}
            >
              {t("selectSecretObject.confirm")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    textAlign: "center",
    includeFontPadding: false,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    marginVertical: 56,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
  },
  confirmButton: {
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  confirmButtonDisabled: {
    backgroundColor: colors.neutral.disabled,
  },
  confirmButtonPressed: {
    opacity: 0.8,
  },
  confirmButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.neutral.white,
  },
  confirmButtonTextDisabled: {
    color: colors.neutral[700],
  },
});

export default SelectSecretObjectScreen;
