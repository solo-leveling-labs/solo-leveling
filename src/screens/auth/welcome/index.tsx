import CoLogo from "@/assets/svg/co-logo.svg";
import WelcomeBackground from "@/assets/svg/welcome-background.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const logo = require("@/assets/images/logo.png");

const SVG_ASPECT_RATIO = 132 / 375;

const WelcomeScreen = () => {
  const { push } = useRouter();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  const handleFirstTime = () => push("/sign-up");
  const handleHaveAccount = () => push("/sign-in");

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.coLogoContainer}>
          <CoLogo width={123} height={70} />
        </View>
        <Image
          source={logo}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel={t("appName")}
        />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.subtitle}>{t("auth.welcome.subtitle")}</Text>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleFirstTime}
            accessibilityLabel={t("auth.welcome.firstTimeA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>
              {t("auth.welcome.firstTime")}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleHaveAccount}
            accessibilityLabel={t("auth.welcome.haveAccountA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>
              {t("auth.welcome.haveAccount")}
            </Text>
          </Pressable>
        </View>
      </View>

      <WelcomeBackground
        width={screenWidth}
        height={screenWidth * SVG_ASPECT_RATIO}
        style={styles.background}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent.lightBackground,
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "40%",
  },
  coLogoContainer: {
    position: "absolute",
    top: 15,
  },
  logo: {
    width: 313,
    height: 150,
  },
  bottomSection: {
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: "35%",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    marginBottom: 24,
    textAlign: "center",
  },
  buttonsContainer: {
    gap: 16,
  },
  button: {
    height: 70,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryButton: {
    backgroundColor: colors.accent.mainBlue,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: colors.accent.mainBlue,
    backgroundColor: colors.transparent,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
  },
  background: {
    position: "absolute",
    bottom: 0,
  },
});

export default WelcomeScreen;
