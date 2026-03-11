import AuthLayout from "@/src/components/AuthLayout";
import FormField from "@/src/components/FormField";
import { useSignupStore } from "@/src/store/signup.store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { setStep2 } = useSignupStore();

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

    setStep2(email.trim(), password);
    push("/(auth)/sign-up-step-3");
  };

  return (
    <AuthLayout
      title={t("auth.signUp.title")}
      subtitle={t("auth.signUp.subtitle")}
      description={t("auth.signUpStep2.description")}
      onNext={handleNext}
      onBack={back}
      isFormValid={isFormFilled}
    >
      <FormField
        label={t("auth.signUpStep2.fields.mail")}
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="off"
        textContentType="none"
        placeholder={t("auth.signUpStep2.fields.mail")}
        labelA11y={t("auth.signUpStep2.mailInputA11y")}
        errorText={errors.email}
      />
      <FormField
        label={t("auth.signUpStep2.fields.password")}
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry={!showPassword}
        autoComplete="off"
        textContentType="none"
        placeholder={t("auth.signUpStep2.fields.password")}
        labelA11y={t("auth.signUpStep2.passwordInputA11y")}
        errorText={errors.password}
        pressableA11y={t("auth.signUpStep2.togglePasswordA11y")}
        rightIconName={showPassword ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowPassword((prev) => !prev)}
      />

      <FormField
        label={t("auth.signUpStep2.fields.repeatPassword")}
        value={repeatPassword}
        onChangeText={handleRepeatPasswordChange}
        secureTextEntry={!showRepeatPassword}
        autoComplete="off"
        textContentType="none"
        placeholder={t("auth.signUpStep2.fields.repeatPassword")}
        labelA11y={t("auth.signUpStep2.repeatPasswordInputA11y")}
        errorText={errors.repeatPassword}
        pressableA11y={t("auth.signUpStep2.toggleRepeatPasswordA11y")}
        rightIconName={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowRepeatPassword((prev) => !prev)}
      />
    </AuthLayout>
  );
};

export default SignUpStep2Screen;
