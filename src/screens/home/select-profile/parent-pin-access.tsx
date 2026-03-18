import ChildWelcomeDecoBottom from "@/assets/svg/child-welcome-deco-bottom.svg";
import ChildWelcomeDecoTop from "@/assets/svg/child-welcome-deco-top.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { haptics } from "@/src/utils/haptic-feedback";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PinKeypad from "./components/PinKeypad";

const DECO_OVERFLOW = 40;
const PIN_LENGTH = 4;

const ParentPinAccessScreen = () => {
  const { t } = useTranslation();
  const { back } = useRouter();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();

  const [pin, setPin] = useState<string>("");

  const handleDigitPress = useCallback((digit: string) => {
    haptics.light();
    setPin((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev));
  }, []);

  const handleBackspacePress = useCallback(() => {
    haptics.light();
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const handleForgotPin = useCallback(() => {
    // TODO: Navigate to forgot PIN flow
  }, []);

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
          { paddingTop: safeTop + 16, paddingBottom: safeBottom + 16 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={handleBack}
          accessibilityLabel={t("parentPinAccess.backA11y")}
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={colors.accent.mainBlue}
          />
        </Pressable>

        <View style={styles.textSection}>
          <Text style={styles.title}>{t("parentPinAccess.title")}</Text>
          <Text style={styles.subtitle}>{t("parentPinAccess.subtitle")}</Text>
        </View>

        <View style={styles.pinDotsSection}>
          <Text style={styles.instruction}>
            {t("parentPinAccess.instruction")}
          </Text>

          <View style={styles.pinDotsRow}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <View
                key={i}
                style={styles.pinDotFrame}
                accessibilityLabel={t("parentPinAccess.pinDotA11y", {
                  position: i + 1,
                  total: PIN_LENGTH,
                })}
              >
                {i < pin.length && <View style={styles.pinDotFilled} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.keypadSection}>
          <Pressable
            style={({ pressed }) => [
              styles.forgotPinButton,
              pressed && styles.forgotPinButtonPressed,
            ]}
            onPress={handleForgotPin}
            accessibilityLabel={t("parentPinAccess.forgotPinA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.forgotPinText}>
              {t("parentPinAccess.forgotPin")}
            </Text>
          </Pressable>

          <PinKeypad
            onDigitPress={handleDigitPress}
            onBackspacePress={handleBackspacePress}
          />
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
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  textSection: {
    gap: 12,
    marginTop: 16,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    lineHeight: 24,
  },
  pinDotsSection: {
    paddingHorizontal: 20,
    gap: 24,
    marginTop: 40,
  },
  instruction: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22.4,
  },
  pinDotsRow: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  pinDotFrame: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.neutral.disabled,
    backgroundColor: colors.neutral.fill,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pinDotFilled: {
    width: 16,
    height: 16,
    borderRadius: 100,
    backgroundColor: colors.deco.decoGreen,
  },
  forgotPinButton: {
    alignSelf: "center",
    padding: 10,
  },
  forgotPinButtonPressed: {
    opacity: 0.7,
  },
  forgotPinText: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
  },
  keypadSection: {
    marginTop: "auto",
    gap: 6,
  },
});

export default ParentPinAccessScreen;
