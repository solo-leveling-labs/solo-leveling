import SignUpLayout from "@/src/components/SignUpLayout";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email?: string;
  password?: string;
  repeatPassword?: string;
}

const SignUpStep2Screen = () => {
  const { back, push } = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isFormFilled =
    email.trim().length > 0 && password.length > 0 && repeatPassword.length > 0;

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    clearFieldError("email");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    clearFieldError("password");
  };

  const handleRepeatPasswordChange = (text: string) => {
    setRepeatPassword(text);
    clearFieldError("repeatPassword");
  };

  const handleNext = () => {
    const newErrors: FormErrors = {};

    if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = t("auth.signUpStep2.errorInvalidEmail");
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = t("auth.signUpStep2.errorPasswordLength");
    }

    if (password !== repeatPassword) {
      newErrors.repeatPassword = t("auth.signUpStep2.errorPasswordMismatch");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    push("/(auth)/sign-up-step-3");
  };

  return (
    <SignUpLayout
      description={t("auth.signUpStep2.description")}
      onNext={handleNext}
      onBack={back}
      isFormValid={isFormFilled}
    >
      <View style={styles.fieldGroup}>
        <Text style={[styles.label, errors.email && styles.labelError]}>
          {t("auth.signUpStep2.fields.mail")}
        </Text>
        <View
          style={[
            styles.inputContainer,
            errors.email && styles.inputContainerError,
          ]}
        >
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            placeholder={t("auth.signUpStep2.fields.mail")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("auth.signUpStep2.mailInputA11y")}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[styles.label, errors.password && styles.labelError]}>
          {t("auth.signUpStep2.fields.password")}
        </Text>
        <View
          style={[
            styles.inputContainer,
            errors.password && styles.inputContainerError,
          ]}
        >
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            autoComplete="off"
            textContentType="none"
            placeholder={t("auth.signUpStep2.fields.password")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("auth.signUpStep2.passwordInputA11y")}
          />
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeIcon}
            accessibilityLabel={t("auth.signUpStep2.togglePasswordA11y")}
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.neutral[500]}
            />
          </Pressable>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text
          style={[styles.label, errors.repeatPassword && styles.labelError]}
        >
          {t("auth.signUpStep2.fields.repeatPassword")}
        </Text>
        <View
          style={[
            styles.inputContainer,
            errors.repeatPassword && styles.inputContainerError,
          ]}
        >
          <TextInput
            style={styles.input}
            value={repeatPassword}
            onChangeText={handleRepeatPasswordChange}
            secureTextEntry={!showRepeatPassword}
            autoComplete="off"
            textContentType="none"
            placeholder={t("auth.signUpStep2.fields.repeatPassword")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("auth.signUpStep2.repeatPasswordInputA11y")}
          />
          {/* TODO: Add svg icon for eye toggle */}
          <Pressable
            onPress={() => setShowRepeatPassword((prev) => !prev)}
            style={styles.eyeIcon}
            accessibilityLabel={t("auth.signUpStep2.toggleRepeatPasswordA11y")}
            accessibilityRole="button"
          >
            <Ionicons
              name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.neutral[500]}
            />
          </Pressable>
        </View>
        {errors.repeatPassword && (
          <Text style={styles.errorText}>{errors.repeatPassword}</Text>
        )}
      </View>
    </SignUpLayout>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
  },
  labelError: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: colors.accent.mainBlue,
    backgroundColor: colors.transparent,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.error,
    paddingHorizontal: 24,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
});

export default SignUpStep2Screen;
