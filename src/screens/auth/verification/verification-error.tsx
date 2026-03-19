import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;

const VerificationErrorScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { dismissTo } = useRouter();

  const handleRetry = useCallback(() => {
    dismissTo("/intro");
  }, [dismissTo]);

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.buho}
      />
      <View
        style={[
          styles.content,
          { paddingTop: safeTop + 80, paddingBottom: safeBottom + 56 },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("auth.verificationError.title")}</Text>
          <Text style={styles.subtitle}>
            {t("auth.verificationError.subtitle")}
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityLabel={t("auth.verificationError.retryA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>
              {t("auth.verificationError.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  decorations: {
    position: "absolute",
    top: 0,
    right: -10,
  },
  buho: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  textContainer: {
    gap: 8,
  },
  title: {
    fontSize: 48,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    lineHeight: 57.6,
    letterSpacing: -0.96,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
  footer: {
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: colors.accent.mainRed,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: colors.neutral.disabled,
    shadowColor: colors.neutral.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
    lineHeight: 22.4,
  },
});

export default VerificationErrorScreen;
