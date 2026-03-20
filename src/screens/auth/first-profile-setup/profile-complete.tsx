import { AuthLayout } from "@/src/components/AuthLayout";
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
  const { source } = useLocalSearchParams<{ source?: string }>();

  const isFromSelectProfile = source === "select-profile";

  const setProfileSetupComplete = useAuthStore(
    (state) => state.setProfileSetupComplete,
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const handleAccept = () => {
    if (!isFromSelectProfile) {
      setProfileSetupComplete(true);
    }
    dismissTo("/(select-profile)");
  };

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
          <Text style={styles.instructionLabel}>
            {t("profileSetup.profileComplete.childDevice")}
          </Text>
          <Text style={styles.instructionText}>
            {t("profileSetup.profileComplete.childDeviceDescription")}
          </Text>
        </View>

        <View style={styles.instructionBlock}>
          <Text style={styles.instructionLabel}>
            {t("profileSetup.profileComplete.parentDevice")}
          </Text>
          <Text style={styles.instructionText}>
            {t("profileSetup.profileComplete.parentDeviceDescription")}
            <Text style={styles.instructionBold}>
              {t("profileSetup.profileComplete.parentDeviceImportant")}
            </Text>
            {t("profileSetup.profileComplete.parentDeviceImportantDescription")}
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
    marginTop: 40,
    marginBottom: 40,
    gap: 32,
  },
  instructionsTitle: {
    fontSize: 32,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    lineHeight: 38.4,
  },
  instructionBlock: {
    gap: 8,
  },
  instructionLabel: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
  instructionBold: {
    fontFamily: fonts.poppins.bold,
  },
  closingMessage: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
});

export default ProfileCompleteScreen;
