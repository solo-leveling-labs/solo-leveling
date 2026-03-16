import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

  const paddingTop = safeTop + (showBackArrow ? 12 : 48);

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.background}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop, paddingBottom: scrollPaddingBottom },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {showBackArrow && (
            <View style={styles.topBar}>
              <Pressable
                onPress={onBack}
                style={({ pressed }) => [pressed && styles.backArrowPressed]}
                accessibilityLabel={backArrowA11y ?? t("common.backA11y")}
                accessibilityRole="button"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.accent.mainBlue}
                />
              </Pressable>
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

          {!hideFooter && (
            <View
              style={[
                styles.footer,
                { marginTop: footerTopSpacing, paddingBottom: safeBottom + 40 },
              ]}
            >
              {/* TODO: Fix insets problem */}
              <Pressable
                style={({ pressed }) => [
                  styles.nextButton,
                  (!isFormValid || isLoading) && styles.nextButtonDisabled,
                  pressed && isFormValid && !isLoading && styles.buttonPressed,
                ]}
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
              </Pressable>
              <Pressable
                onPress={onBack}
                accessibilityLabel={backLabelA11y ?? t("auth.signUp.backA11y")}
                accessibilityRole="button"
                accessible={!hideBackButton}
                disabled={hideBackButton}
                style={({ pressed }) => [
                  styles.backButton,
                  hideBackButton && styles.backButtonHidden,
                  pressed && !hideBackButton && styles.buttonPressed,
                ]}
              >
                <Text style={styles.backText}>
                  {backLabel ?? t("auth.signUp.back")}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  flex: {
    flex: 1,
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
  backArrowPressed: {
    opacity: 0.8,
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
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  nextButtonDisabled: {
    backgroundColor: colors.neutral.disabled,
  },
  buttonPressed: {
    opacity: 0.8,
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
