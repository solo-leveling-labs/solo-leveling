import SignUpLayout from "@/src/components/SignUpLayout";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const MIN_PASSWORD_LENGTH = 8;

const SignUpStep2Screen = () => {
  const { back, push } = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const isFormValid =
    email.trim().length > 0 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password === repeatPassword;

  const handleNext = () => {
    if (!isFormValid) return;
    push("/(auth)/sign-up-step-3");
  };

  return (
    <SignUpLayout
      description={t("auth.signUpStep2.description")}
      onNext={handleNext}
      onBack={back}
      isFormValid={isFormValid}
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("auth.signUpStep2.fields.mail")}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
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
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {t("auth.signUpStep2.fields.password")}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
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
        <Text style={styles.helperText}>
          {t("auth.signUpStep2.helperPassword")}
        </Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {t("auth.signUpStep2.fields.repeatPassword")}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry={!showRepeatPassword}
            autoComplete="off"
            textContentType="none"
            placeholder={t("auth.signUpStep2.fields.repeatPassword")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("auth.signUpStep2.repeatPasswordInputA11y")}
          />
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: colors.accent.mainBlue,
    backgroundColor: colors.transparent,
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
  helperText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    marginTop: 4,
    paddingHorizontal: 8,
  },
});

export default SignUpStep2Screen;
