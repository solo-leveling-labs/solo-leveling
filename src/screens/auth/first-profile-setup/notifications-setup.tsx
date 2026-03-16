import { useUpdateAccount } from "@/src/api/accounts/accounts.hooks";
import AuthLayout from "@/src/components/AuthLayout";
import FormField from "@/src/components/FormField";
import { Switch } from "@/src/components/Switch";
import { FormErrors } from "@/src/screens/auth/first-profile-setup/types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { minDelay } from "@/src/utils/min-delay";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, View } from "react-native";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NotificationsSetupScreen = () => {
  const { back, replace } = useRouter();
  const { t } = useTranslation();
  const { childName } = useLocalSearchParams<{ childName: string }>();
  const { mutateAsync: updateAccount } = useUpdateAccount();

  // TODO: Get actual email from auth context/store (Ignore when Reviewing)
  const signUpEmail = "mateolorenzo.dev@gmail.com";

  const [email, setEmail] = useState(signUpEmail);
  const [backupEmail, setBackupEmail] = useState("");
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const isFormFilled = email.trim().length > 0;

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    clearFieldError("email");
  };

  const handleBackupEmailChange = (text: string) => {
    setBackupEmail(text);
    clearFieldError("backupEmail");
  };

  const handleTogglePush = useCallback(async (value: boolean) => {
    if (!value) {
      setIsPushEnabled(false);
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") {
      setIsPushEnabled(true);
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    setIsPushEnabled(status === "granted");
  }, []);

  const handleNext = async () => {
    const newErrors: FormErrors = {};

    if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = t("profileSetup.notificationsSetup.errorInvalidEmail");
    }

    if (backupEmail.trim() !== "" && !EMAIL_REGEX.test(backupEmail.trim())) {
      newErrors.backupEmail = t(
        "profileSetup.notificationsSetup.errorInvalidEmail",
      );
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await Promise.all([
        updateAccount({
          notificationsEmail: email.trim(),
          backupEmail: backupEmail.trim(),
        }),
        minDelay(),
      ]);
      replace({ pathname: "/profile-complete", params: { childName } });
    } catch {
      Alert.alert(t("common.errors.title"), t("common.errors.genericMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("profileSetup.notificationsSetup.title")}
      subtitle={t("profileSetup.notificationsSetup.subtitle")}
      description={t("profileSetup.notificationsSetup.description")}
      descriptionInHeader
      onNext={handleNext}
      onBack={back}
      nextLabel={t("profileSetup.notificationsSetup.next")}
      backLabel={t("profileSetup.notificationsSetup.back")}
      nextLabelA11y={t("profileSetup.notificationsSetup.nextA11y")}
      backLabelA11y={t("profileSetup.notificationsSetup.backA11y")}
      isFormValid={isFormFilled}
      isLoading={isLoading}
    >
      <FormField
        label={t("profileSetup.notificationsSetup.fields.email")}
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        placeholder={t(
          "profileSetup.notificationsSetup.fields.emailPlaceholder",
        )}
        labelA11y={t("profileSetup.notificationsSetup.emailInputA11y")}
        errorText={errors.email}
      />

      <FormField
        label={t("profileSetup.notificationsSetup.fields.backupEmail")}
        value={backupEmail}
        onChangeText={handleBackupEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        placeholder={t(
          "profileSetup.notificationsSetup.fields.emailPlaceholder",
        )}
        labelA11y={t("profileSetup.notificationsSetup.backupEmailInputA11y")}
        helperText={t(
          "profileSetup.notificationsSetup.fields.backupEmailHelper",
        )}
        errorText={errors.backupEmail}
      />

      <View style={styles.pushRow}>
        <View style={styles.pushTextContainer}>
          <Text style={styles.pushTitle}>
            {t("profileSetup.notificationsSetup.pushNotifications.title")}
          </Text>
          <Text style={styles.pushDescription}>
            {t("profileSetup.notificationsSetup.pushNotifications.description")}
          </Text>
        </View>
        <Switch
          value={isPushEnabled}
          onValueChange={handleTogglePush}
          accessibilityLabel={t(
            "profileSetup.notificationsSetup.pushToggleA11y",
          )}
        />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  pushRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginTop: 16,
  },
  pushTextContainer: {
    flex: 1,
    gap: 4,
  },
  pushTitle: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    lineHeight: 22,
  },
  pushDescription: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    lineHeight: 14,
  },
});

export default NotificationsSetupScreen;
