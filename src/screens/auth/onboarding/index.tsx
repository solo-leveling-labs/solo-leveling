import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const SLIDE_KEYS = ["slide1", "slide2", "slide3"] as const;
const FADE_DURATION = 200;

const OnboardingScreen = () => {
  const { replace } = useRouter();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const isLastSlide = currentIndex === SLIDE_KEYS.length - 1;
  const currentSlideKey = SLIDE_KEYS[currentIndex];

  const handleNext = useCallback(() => {
    if (isAnimating.current) return;
    if (isLastSlide) {
      replace("/welcome");
      return;
    }
    isAnimating.current = true;
    setCurrentIndex((prev) => prev + 1);
  }, [isLastSlide, replace]);

  const handleSkip = useCallback(() => {
    replace("/welcome");
  }, [replace]);

  return (
    <View style={styles.container}>
      <View
        style={{ ...styles.imagePlaceholder, height: SCREEN_HEIGHT * 0.55 }}
      />

      <View style={styles.contentContainer}>
        <Animated.View
          key={currentIndex}
          entering={FadeIn.duration(FADE_DURATION)}
          exiting={FadeOut.duration(FADE_DURATION)}
          onLayout={() => {
            isAnimating.current = false;
          }}
        >
          <Text style={styles.title}>
            {t(`auth.onboarding.${currentSlideKey}.title`)}
          </Text>
          <Text style={styles.description}>
            {t(`auth.onboarding.${currentSlideKey}.description`)}
          </Text>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.skipButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSkip}
            accessibilityLabel={t("auth.onboarding.skipA11y")}
            accessibilityRole="button"
          >
            <Text style={styles.skipButtonText}>
              {t("auth.onboarding.skip")}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.nextButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleNext}
            accessibilityLabel={t(
              isLastSlide
                ? "auth.onboarding.startA11y"
                : "auth.onboarding.nextA11y",
            )}
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>
              {isLastSlide
                ? t("auth.onboarding.start")
                : t("auth.onboarding.next")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  imagePlaceholder: {
    backgroundColor: "#D9D9D9",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    lineHeight: 24,
    marginTop: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  skipButton: {
    borderWidth: 1.5,
    borderColor: colors.accent.mainBlue,
    backgroundColor: colors.transparent,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
  },
  nextButton: {
    backgroundColor: colors.accent.mainBlue,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.white,
  },
});

export default OnboardingScreen;
