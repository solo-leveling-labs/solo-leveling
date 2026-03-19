import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const UnderageScreen = () => {
  const { back } = useRouter();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("auth.underage.title")}</Text>
          <Text style={styles.subtitle}>{t("auth.underage.subtitle")}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={back}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityLabel={t("auth.underage.backA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>{t("auth.underage.back")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Buho
        width={screenWidth}
        height={screenWidth * (134 / 375)}
        style={styles.background}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: "40%",
    gap: 40,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 48,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22,
  },
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  backButton: {
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 100,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
  },
  decorations: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  background: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
});

export default UnderageScreen;
