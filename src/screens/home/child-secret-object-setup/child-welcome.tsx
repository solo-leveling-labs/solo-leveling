import ChildWelcomeDecoBottom from "@/assets/svg/child-welcome-deco-bottom.svg";
import ChildWelcomeDecoTop from "@/assets/svg/child-welcome-deco-top.svg";
import { getAvatarConfig } from "@/src/constants/avatar-configs";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DECO_OVERFLOW = 40;

const ChildWelcomeScreen = () => {
  const { t } = useTranslation();
  const { push, back } = useRouter();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { childId, childName, avatarIndex } = useLocalSearchParams<{
    childId: string;
    childName: string;
    avatarIndex: string;
  }>();

  const { SvgComponent: AvatarIcon, frameColor } = getAvatarConfig(
    Number(avatarIndex),
  );

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const handleStart = useCallback(() => {
    push({
      pathname: "/secret-object-intro",
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
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={handleBack}
          accessibilityLabel={t("childWelcome.backA11y")}
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={colors.accent.mainBlue}
          />
        </Pressable>

        <View style={styles.avatarSection}>
          <View style={[styles.avatarFrame, { borderColor: frameColor }]}>
            <AvatarIcon width={110} height={110} />
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.greeting}>
            {t("childWelcome.greeting", { name: childName })}
          </Text>

          <Text style={styles.sectionHeading}>
            {t("childWelcome.subtitle")}
          </Text>

          <Text style={styles.body}>{t("childWelcome.body")}</Text>

          <Text style={styles.sectionHeading}>
            {t("childWelcome.question")}
          </Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={handleStart}
            accessibilityLabel={t("childWelcome.ctaA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.ctaButtonText}>{t("childWelcome.cta")}</Text>
          </Pressable>
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
    marginBottom: 20,
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  avatarSection: {
    alignItems: "center",
  },
  avatarFrame: {
    width: 128,
    height: 128,
    borderRadius: 12,
    borderWidth: 11,
    backgroundColor: colors.accent.lightBackground,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  textSection: {
    gap: 24,
    marginTop: 24,
  },
  greeting: {
    fontSize: 40,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    textAlign: "center",
    includeFontPadding: false,
  },
  sectionHeading: {
    fontSize: 20,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    textAlign: "center",
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22.4,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 56,
  },
  ctaButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ctaButtonPressed: {
    opacity: 0.8,
  },
  ctaButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.neutral.white,
  },
});

export default ChildWelcomeScreen;
