import ChildWelcomeDecoBottom from "@/assets/svg/child-welcome-deco-bottom.svg";
import ChildWelcomeDecoTop from "@/assets/svg/child-welcome-deco-top.svg";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DECO_OVERFLOW = 40;

const SecretObjectIntroScreen = () => {
  const { t } = useTranslation();
  const { push, back } = useRouter();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { childId } = useLocalSearchParams<{ childId: string }>();

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const handleChoose = useCallback(() => {
    push({
      pathname: "/select-secret-object",
      params: { childId },
    });
  }, [push, childId]);

  return (
    <View style={styles.container}>
      <ChildWelcomeDecoTop width={100} height={166} style={styles.decoTop} />
      <ChildWelcomeDecoBottom
        width={100}
        height={166}
        style={styles.decoBottom}
      />

      <View
        style={[
          styles.content,
          { paddingTop: safeTop + 16, paddingBottom: safeBottom + 40 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={ACTIVE_OPACITY}
          accessibilityLabel={t("secretObjectIntro.backA11y")}
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={colors.accent.mainBlue}
          />
        </TouchableOpacity>

        <View style={styles.textSection}>
          <Text style={styles.title}>{t("secretObjectIntro.title")}</Text>

          <Text style={styles.description}>
            {t("secretObjectIntro.description")}
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleChoose}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityLabel={t("secretObjectIntro.ctaA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.ctaButtonText}>
              {t("secretObjectIntro.cta")}
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
  decoTop: {
    position: "absolute",
    top: -DECO_OVERFLOW,
    right: -DECO_OVERFLOW,
  },
  decoBottom: {
    position: "absolute",
    bottom: -DECO_OVERFLOW,
    left: -DECO_OVERFLOW,
    transform: [{ rotate: "180deg" }],
  },
  backButton: {
    padding: 10,
    alignSelf: "flex-start",
    marginBottom: 60,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  textSection: {
    gap: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    letterSpacing: -0.96,
    includeFontPadding: false,
  },
  description: {
    fontSize: 20,
    fontFamily: fonts.raleway.semiBold,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 56,
    alignItems: "center",
  },
  ctaButton: {
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.neutral.disabled,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: colors.neutral.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  ctaButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.neutral.white,
  },
});

export default SecretObjectIntroScreen;
