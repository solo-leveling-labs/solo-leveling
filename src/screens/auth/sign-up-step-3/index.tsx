import SignUpLayout from "@/src/components/SignUpLayout";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const PIN_LENGTH = 6;

const SignUpStep3Screen = () => {
  const { back } = useRouter();
  const { t } = useTranslation();

  const [pin, setPin] = useState("");
  const [repeatPin, setRepeatPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showRepeatPin, setShowRepeatPin] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isFormValid =
    pin.length === PIN_LENGTH && pin === repeatPin && termsAccepted;

  const handlePinChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    if (digitsOnly.length <= PIN_LENGTH) {
      setPin(digitsOnly);
    }
  };

  const handleRepeatPinChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    if (digitsOnly.length <= PIN_LENGTH) {
      setRepeatPin(digitsOnly);
    }
  };

  const handleNext = () => {
    if (!isFormValid) return;
    // TODO: Call register() from AuthContext with collected data
  };

  return (
    <SignUpLayout
      description={t("auth.signUpStep3.description")}
      onNext={handleNext}
      onBack={back}
      isFormValid={isFormValid}
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("auth.signUpStep3.fields.pin")}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={handlePinChange}
            secureTextEntry={!showPin}
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            placeholder={t("auth.signUpStep3.fields.pin")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("auth.signUpStep3.pinInputA11y")}
          />
          <Pressable
            onPress={() => setShowPin((prev) => !prev)}
            style={styles.eyeIcon}
            accessibilityLabel={t("auth.signUpStep3.togglePinA11y")}
            accessibilityRole="button"
          >
            <Ionicons
              name={showPin ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.neutral[500]}
            />
          </Pressable>
        </View>
        <Text style={styles.helperText}>{t("auth.signUpStep3.helperPin")}</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {t("auth.signUpStep3.fields.repeatPin")}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={repeatPin}
            onChangeText={handleRepeatPinChange}
            secureTextEntry={!showRepeatPin}
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            placeholder={t("auth.signUpStep3.fields.repeatPin")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("auth.signUpStep3.repeatPinInputA11y")}
          />
          <Pressable
            onPress={() => setShowRepeatPin((prev) => !prev)}
            style={styles.eyeIcon}
            accessibilityLabel={t("auth.signUpStep3.toggleRepeatPinA11y")}
            accessibilityRole="button"
          >
            <Ionicons
              name={showRepeatPin ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.neutral[500]}
            />
          </Pressable>
        </View>
      </View>

      <Pressable
        style={styles.checkboxRow}
        onPress={() => setTermsAccepted((prev) => !prev)}
        accessibilityLabel={t("auth.signUpStep3.termsCheckboxA11y")}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: termsAccepted }}
      >
        <Ionicons
          name={termsAccepted ? "checkbox-outline" : "square-outline"}
          size={24}
          color={colors.accent.mainBlue}
        />
        <Text style={styles.checkboxText}>
          {t("auth.signUpStep3.termsCheckbox")}
        </Text>
      </Pressable>
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
    borderRadius: 28,
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 8,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    lineHeight: 22,
  },
});

export default SignUpStep3Screen;
