import IdentityResultLayout from "@/src/components/IdentityResultLayout";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

const IdentityValidatedScreen = () => {
  const { t } = useTranslation();

  const handleContinue = useCallback(() => {
    // TODO: Navigate to next screen
  }, []);

  return (
    <IdentityResultLayout
      titleKey="auth.identityValidated.title"
      subtitleKey="auth.identityValidated.subtitle"
      titleA11yKey="auth.identityValidated.titleA11y"
    >
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinue}
          accessibilityLabel={t("auth.identityValidated.continueA11y")}
          accessibilityRole="button"
        >
          <Text style={styles.continueButtonText}>
            {t("auth.identityValidated.continue")}
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
  continueButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  continueButtonPressed: {
    opacity: 0.8,
  },
  continueButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.neutral.white,
  },
});

export default IdentityValidatedScreen;
