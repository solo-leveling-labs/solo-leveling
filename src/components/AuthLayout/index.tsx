import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  showBackArrow?: boolean;
  backArrowA11y?: string;
  description?: string;
  descriptionInHeader?: boolean;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  isFormValid?: boolean;
  nextLabel?: string;
  nextLabelA11y?: string;
  backLabel?: string;
  backLabelA11y?: string;
  hideBackButton?: boolean;
  hideFooter?: boolean;
  headerBottomSpacing?: number;
  footerTopSpacing?: number;
  scrollPaddingBottom?: number;
  isLoading?: boolean;
}

export const AuthLayout = ({
  title,
  subtitle,
  showBackArrow,
  backArrowA11y,
  description,
  descriptionInHeader = false,
  children,
  onNext,
  onBack,
  isFormValid = true,
  nextLabel,
  nextLabelA11y,
  backLabel,
  backLabelA11y,
  hideBackButton = false,
  hideFooter = false,
  headerBottomSpacing = 0,
  footerTopSpacing = 0,
  scrollPaddingBottom,
  isLoading = false,
}: AuthLayoutProps) => {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const { bottom: safeBottom, top: safeTop } = useSafeAreaInsets();

  const keyboardHeight = useSharedValue(0);
  const progress = useSharedValue(0);

  useKeyboardHandler({
    onMove: (event) => {
      "worklet";
      keyboardHeight.value = event.height;
      progress.value = event.progress;
    },
  });

  const basePaddingTop = safeTop + (showBackArrow ? 12 : 48);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    "worklet";
    const paddingTop = interpolate(
      progress.value,
      [0, 1],
      [basePaddingTop, safeTop + 8],
    );
    return { paddingTop };
  });

  const footerHeight = safeBottom + 40 + 56 + 16 + 24 + footerTopSpacing + 60;

  const keyboardSpacerStyle = useAnimatedStyle(() => {
    "worklet";
    const spacerHeight = Math.max(0, keyboardHeight.value - footerHeight);
    return { height: spacerHeight };
  });

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.background}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: scrollPaddingBottom },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Animated.View style={headerAnimatedStyle} />
        {showBackArrow && (
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={ACTIVE_OPACITY}
              accessibilityLabel={backArrowA11y ?? t("common.backA11y")}
              accessibilityRole="button"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.accent.mainBlue}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.header, { marginBottom: headerBottomSpacing }]}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {description && descriptionInHeader && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>

        <View style={styles.form}>
          {description && !descriptionInHeader && (
            <Text style={[styles.description, styles.formDescription]}>
              {description}
            </Text>
          )}
          {children}
        </View>

        <Animated.View style={keyboardSpacerStyle} />

        {!hideFooter && (
          <View
            style={[
              styles.footer,
              { marginTop: footerTopSpacing, paddingBottom: safeBottom + 40 },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.nextButton,
                (!isFormValid || isLoading) && styles.nextButtonDisabled,
              ]}
              activeOpacity={ACTIVE_OPACITY}
              onPress={onNext}
              disabled={!isFormValid || isLoading}
              accessibilityLabel={nextLabelA11y ?? t("auth.signUp.nextA11y")}
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.neutral[700]} />
              ) : (
                <Text
                  style={[
                    styles.nextButtonText,
                    !isFormValid && styles.nextButtonTextDisabled,
                  ]}
                >
                  {nextLabel ?? t("auth.signUp.next")}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={ACTIVE_OPACITY}
              accessibilityLabel={backLabelA11y ?? t("auth.signUp.backA11y")}
              accessibilityRole="button"
              accessible={!hideBackButton}
              disabled={hideBackButton}
              style={[
                styles.backButton,
                hideBackButton && styles.backButtonHidden,
              ]}
            >
              <Text style={styles.backText}>
                {backLabel ?? t("auth.signUp.back")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    marginBottom: 15,
  },
  header: {
    gap: 12,
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
  },
  form: {
    gap: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22,
  },
  formDescription: {
    marginBottom: 16,
  },
  footer: {
    alignItems: "center",
    gap: 16,
  },
  nextButton: {
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  nextButtonDisabled: {
    backgroundColor: colors.neutral.disabled,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  nextButtonTextDisabled: {
    color: colors.neutral[700],
  },
  backButton: {
    width: "100%",
    alignItems: "center",
  },
  backButtonHidden: {
    opacity: 0,
  },
  backText: {
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
