import IdentityResultLayout from "@/src/components/IdentityResultLayout";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

const IdentityValidationFailedScreen = () => {
  const { t } = useTranslation();
  const { dismissTo } = useRouter();

  const handleRetry = useCallback(() => {
    dismissTo("/sign-up-step-4");
  }, [dismissTo]);

  return (
    <IdentityResultLayout
      titleKey="auth.identityValidationFailed.title"
      subtitleKey="auth.identityValidationFailed.subtitle"
      titleA11yKey="auth.identityValidationFailed.titleA11y"
    >
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          onPress={handleRetry}
          accessibilityLabel={t("auth.identityValidationFailed.retryA11y")}
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>
            {t("auth.identityValidationFailed.retry")}
          </Text>
        </Pressable>
      </View>
    </IdentityResultLayout>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 70,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.neutral.white,
  },
});

export default IdentityValidationFailedScreen;
