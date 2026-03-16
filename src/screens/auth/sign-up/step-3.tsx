import { useSignup } from "@/src/api/auth/auth.hooks";
import { AuthLayout } from "@/src/components/AuthLayout";
import { FormField } from "@/src/components/FormField";
import { useSignupStore } from "@/src/store/signup.store";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

const PIN_LENGTH = 6;

interface FormErrors {
  pin?: string;
  repeatPin?: string;
  terms?: string;
}

const SignUpStep3Screen = () => {
  const { back } = useRouter();
  const { t } = useTranslation();
  const { mutate: signup, isPending } = useSignup();
  const { formData } = useSignupStore();

  const [pin, setPin] = useState("");
  const [repeatPin, setRepeatPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showRepeatPin, setShowRepeatPin] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isFormFilled = pin.length > 0 && repeatPin.length > 0;

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePinChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    if (digitsOnly.length <= PIN_LENGTH) {
      setPin(digitsOnly);
      clearFieldError("pin");
    }
  };

  const handleRepeatPinChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    if (digitsOnly.length <= PIN_LENGTH) {
      setRepeatPin(digitsOnly);
      clearFieldError("repeatPin");
    }
  };

  const handleTermsToggle = () => {
    setTermsAccepted((prev) => !prev);
    clearFieldError("terms");
  };

  const handleSignUpError = (e: unknown) => {
    const backendMessage =
      isAxiosError(e) && typeof e.response?.data?.message === "string"
        ? e.response.data.message
        : null;

    Alert.alert(
      t("common.errors.title"),
      backendMessage ?? t("auth.signUpStep3.errorSignupFailed"),
    );
  };

  const handleNext = () => {
    const newErrors: FormErrors = {};

    if (pin.length < PIN_LENGTH) {
      newErrors.pin = t("auth.signUpStep3.errorPinLength");
    }

    if (pin !== repeatPin) {
      newErrors.repeatPin = t("auth.signUpStep3.errorPinMismatch");
    }

    if (!termsAccepted) {
      newErrors.terms = t("auth.signUpStep3.errorTermsRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    useSignupStore.getState().setStep3(pin);
    const credentials = {
      accountName: formData.fullName,
      email: formData.email,
      fullName: formData.fullName,
      birthday: formData.birthday,
      password: formData.password,
      pin,
    };
    signup(credentials, { onError: handleSignUpError });
  };

  return (
    <AuthLayout
      title={t("auth.signUp.title")}
      subtitle={t("auth.signUp.subtitle")}
      description={t("auth.signUpStep3.description")}
      onNext={handleNext}
      onBack={back}
      isFormValid={isFormFilled && !isPending}
    >
      <FormField
        label={t("auth.signUpStep3.fields.pin")}
        value={pin}
        onChangeText={handlePinChange}
        secureTextEntry={!showPin}
        keyboardType="number-pad"
        maxLength={PIN_LENGTH}
        placeholder={t("auth.signUpStep3.fields.pin")}
        labelA11y={t("auth.signUpStep3.pinInputA11y")}
        errorText={errors.pin}
        pressableA11y={t("auth.signUpStep3.togglePinA11y")}
        rightIconName={showPin ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowPin((prev) => !prev)}
        helperText={t("auth.signUpStep3.helperPin")}
      />

      <FormField
        label={t("auth.signUpStep3.fields.repeatPin")}
        value={repeatPin}
        onChangeText={handleRepeatPinChange}
        secureTextEntry={!showRepeatPin}
        keyboardType="number-pad"
        maxLength={PIN_LENGTH}
        placeholder={t("auth.signUpStep3.fields.repeatPin")}
        labelA11y={t("auth.signUpStep3.repeatPinInputA11y")}
        errorText={errors.repeatPin}
        pressableA11y={t("auth.signUpStep3.toggleRepeatPinA11y")}
        rightIconName={showRepeatPin ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowRepeatPin((prev) => !prev)}
      />

      <Pressable
        style={styles.checkboxRow}
        onPress={handleTermsToggle}
        accessibilityLabel={t("auth.signUpStep3.termsCheckboxA11y")}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: termsAccepted }}
      >
        {/* TODO: Add svg icon for checkbox */}
        <Ionicons
          name={termsAccepted ? "checkbox-outline" : "square-outline"}
          size={24}
          color={errors.terms ? colors.error : colors.accent.mainBlue}
        />
        <Text
          style={[
            styles.checkboxText,
            errors.terms && styles.checkboxTextError,
          ]}
        >
          {t("auth.signUpStep3.termsCheckbox")}
        </Text>
      </Pressable>
      {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 8,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22,
  },
  checkboxTextError: {
    color: colors.error,
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

export default SignUpStep3Screen;
