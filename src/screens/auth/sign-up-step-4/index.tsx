import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;

const SignUpStep4Screen = () => {
  const { back } = useRouter();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const { bottom: safeBottom } = useSafeAreaInsets();

  const handleCameraAccess = () => {
    // TODO: Implement camera permission request and identity verification
  };

  const handleCancel = () => {
    back();
  };

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.content} bounces>
        <View style={styles.header}>
          <Text style={styles.title}>{t("auth.signUpStep4.title")}</Text>
          <Text style={styles.subtitle}>{t("auth.signUpStep4.subtitle")}</Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>{t("auth.signUpStep4.body1")}</Text>
          <Text style={styles.bodyText}>{t("auth.signUpStep4.body2")}</Text>
          <Text style={styles.bodyText}>{t("auth.signUpStep4.body3")}</Text>
        </View>

        <View style={[styles.footer, { paddingBottom: safeBottom + 40 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.cameraButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCameraAccess}
            accessibilityLabel={t("auth.signUpStep4.cameraButtonA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.cameraButtonText}>
              {t("auth.signUpStep4.cameraButton")}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCancel}
            accessibilityLabel={t("auth.signUpStep4.cancelA11y")}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.cancelText}>
              {t("auth.signUpStep4.cancel")}
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
    paddingTop: "25%",
    justifyContent: "space-between",
  },
  header: {
    gap: 8,
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22,
  },
  bodyContainer: {
    gap: 20,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    gap: 16,
    marginTop: 56,
  },
  cameraButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  cameraButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
  },
  cancelButton: {
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
  },
  decorations: {
    position: "absolute",
    top: 0,
    right: -10,
  },
  background: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
});

export default SignUpStep4Screen;
