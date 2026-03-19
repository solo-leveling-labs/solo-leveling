import { useLogin } from "@/src/api/auth/auth.hooks";
import { AuthLayout } from "@/src/components/AuthLayout";
import { FormField } from "@/src/components/FormField";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

const SignInScreen = () => {
  const { push } = useRouter();
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSignIn = useCallback(() => {
    if (!isFormValid) return;

    login(
      { email: email.trim(), password },
      {
        onError: (e) => {
          if (isAxiosError(e)) {
            console.log("login error:", e.response?.data);
          }
          Alert.alert(
            t("common.errors.title"),
            t("auth.signIn.errorInvalidCredentials"),
          );
        },
      },
    );
  }, [email, password, isFormValid, login, t]);

  const handleGoToSignUp = useCallback(() => {
    push("/(auth)/sign-up-step-1");
  }, [push]);

  return (
    <AuthLayout
      title={t("auth.signIn.title")}
      subtitle={t("auth.signIn.subtitle")}
      onNext={handleSignIn}
      onBack={handleGoToSignUp}
      isFormValid={isFormValid}
      isLoading={isPending}
      nextLabel={t("common.actions.signIn")}
      nextLabelA11y={t("auth.signIn.submitA11y")}
      backLabel={t("auth.signIn.footerSignUp")}
      backLabelA11y={t("auth.signIn.goToSignUpA11y")}
    >
      <FormField
        label={t("common.fields.email")}
        value={email}
        onChangeText={setEmail}
        placeholder={t("common.fields.email")}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        labelA11y={t("auth.signIn.emailInputA11y")}
      />

      <FormField
        label={t("common.fields.password")}
        value={password}
        onChangeText={setPassword}
        placeholder={t("common.fields.password")}
        secureTextEntry={!showPassword}
        rightIconName={showPassword ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowPassword((prev) => !prev)}
        pressableA11y={t("auth.signIn.togglePasswordA11y")}
        labelA11y={t("auth.signIn.passwordInputA11y")}
      />
    </AuthLayout>
  );
};

export default SignInScreen;
