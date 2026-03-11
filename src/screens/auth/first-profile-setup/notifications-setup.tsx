import AuthLayout from "@/src/components/AuthLayout";
import FormField from "@/src/components/FormField";
import { Switch } from "@/src/components/Switch";
import { FormErrors } from "@/src/screens/auth/first-profile-setup/types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NotificationsSetupScreen = () => {
  const { back, replace } = useRouter();
  const { t } = useTranslation();
  const { childName } = useLocalSearchParams<{ childName: string }>();

  // TODO: Get actual email from auth context/store (Ignore when Reviewing)
  const signUpEmail = "carloslopez@gmail.com";

  const [email, setEmail] = useState(signUpEmail);
  const [backupEmail, setBackupEmail] = useState("");
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleTogglePush = useCallback((value: boolean) => {
    // TODO: Request push notification permissions when enabling  (Ignore when Reviewing)
    setIsPushEnabled(value);
  }, []);

  const handleNext = () => {
    // TODO: Save notification settings and complete profile setup  (Ignore when Reviewing)
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
    replace({ pathname: "/profile-complete", params: { childName } });
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
