import AuthLayout from "@/src/components/AuthLayout";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, Text, View } from "react-native";

const ProfileCompleteScreen = () => {
  const { dismissTo } = useRouter();
  const { t } = useTranslation();
  const { childName } = useLocalSearchParams<{ childName: string }>(); // TODO: Send to back on request

  const setProfileSetupComplete = useAuthStore(
    (state) => state.setProfileSetupComplete,
  );

  // Prevent Android back gesture/button from navigating away
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const handleAccept = useCallback(() => {
    setProfileSetupComplete(true);
    dismissTo({ pathname: "/(select-profile)", params: { childName } });
  }, [dismissTo, setProfileSetupComplete, childName]);

  return (
    <AuthLayout
      title={t("profileSetup.profileComplete.title")}
      subtitle={t("profileSetup.profileComplete.subtitle")}
      onNext={handleAccept}
      onBack={() => {}}
      hideBackButton
      nextLabel={t("profileSetup.profileComplete.accept")}
      nextLabelA11y={t("profileSetup.profileComplete.acceptA11y")}
    >
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>
          {t("profileSetup.profileComplete.instructionsTitle")}
        </Text>

        <View style={styles.instructionBlock}>
          <Text style={styles.instructionText}>
            <Text style={styles.instructionLabel}>
              {t("profileSetup.profileComplete.childDevice")}
            </Text>
            {t("profileSetup.profileComplete.childDeviceDescription")}
          </Text>
        </View>

        <View style={styles.instructionBlock}>
          <Text style={styles.instructionText}>
            <Text style={styles.instructionLabel}>
              {t("profileSetup.profileComplete.parentDevice")}
            </Text>
            {t("profileSetup.profileComplete.parentDeviceDescription")}
          </Text>
        </View>

        <Text style={styles.closingMessage}>
          {t("profileSetup.profileComplete.closingMessage")}
        </Text>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  instructionsContainer: {
    gap: 16,
  },
  instructionsTitle: {
    fontSize: 32,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
  },
  instructionBlock: {
    gap: 4,
  },
  instructionLabel: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
    lineHeight: 24,
  },
  closingMessage: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
  },
});

export default ProfileCompleteScreen;
