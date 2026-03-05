import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
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

interface SignUpLayoutProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  isFormValid: boolean;
  nextLabel?: string;
  nextLabelA11y?: string;
  backLabel?: string;
  backLabelA11y?: string;
}

const SignUpLayout = ({
  title,
  subtitle,
  description,
  children,
  onNext,
  onBack,
  isFormValid,
  nextLabel,
  nextLabelA11y,
  backLabel,
  backLabelA11y,
}: SignUpLayoutProps) => {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const { bottom: safeBottom } = useSafeAreaInsets();

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
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title ?? t("auth.signUp.title")}</Text>
            <Text style={styles.subtitle}>
              {subtitle ?? t("auth.signUp.subtitle")}
            </Text>
          </View>

          <View style={styles.form}>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            {children}
          </View>

          <View style={[styles.footer, { paddingBottom: safeBottom + 40 }]}>
            {/* TODO: Fix insets problem */}
            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                !isFormValid && styles.nextButtonDisabled,
                pressed && isFormValid && styles.buttonPressed,
              ]}
              onPress={onNext}
              disabled={!isFormValid}
              accessibilityLabel={nextLabelA11y ?? t("auth.signUp.nextA11y")}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.nextButtonText,
                  !isFormValid && styles.nextButtonTextDisabled,
                ]}
              >
                {nextLabel ?? t("auth.signUp.next")}
              </Text>
            </Pressable>
            <Pressable
              onPress={onBack}
              accessibilityLabel={backLabelA11y ?? t("auth.signUp.backA11y")}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.backText}>
                {backLabel ?? t("auth.signUp.back")}
              </Text>
            </Pressable>
          </View>
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
  },
  form: {
    gap: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    alignItems: "center",
    gap: 16,
    marginTop: 56,
  },
  nextButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
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
  },
  nextButtonTextDisabled: {
    color: colors.neutral[700],
  },
  backButton: {
    width: "100%",
    alignItems: "center",
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

export default SignUpLayout;
