import AuthLayout from "@/src/components/AuthLayout";
import FormField from "@/src/components/FormField";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text } from "react-native";

const isValidAge = (value: string): boolean => {
  const num = Number(value);
  return value.length > 0 && Number.isInteger(num) && num > 0 && num < 100;
};

const CreateProfileScreen = () => {
  const { push, dismissTo } = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const isFormValid = name.trim().length > 0 && isValidAge(age);

  const handleAgeChange = useCallback((text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 2);
    setAge(digits);
  }, []);

  const handleNext = useCallback(() => {
    if (!isFormValid) return;
    push({ pathname: "/configure-alerts", params: { childName: name.trim() } });
  }, [isFormValid, push, name]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      t("profileSetup.createProfile.skipAlert.title"),
      t("profileSetup.createProfile.skipAlert.message"),
      [
        {
          text: t("profileSetup.createProfile.skipAlert.cancel"),
          style: "cancel",
        },
        {
          text: t("profileSetup.createProfile.skipAlert.confirm"),
          style: "destructive",
          onPress: () => dismissTo("/(tabs)"),
        },
      ],
    );
  }, [dismissTo, t]);

  return (
    <AuthLayout
      title={t("profileSetup.createProfile.title")}
      subtitle={t("profileSetup.createProfile.subtitle")}
      onNext={handleNext}
      onBack={handleCancel}
      isFormValid={isFormValid}
      nextLabel={t("profileSetup.createProfile.next")}
      backLabel={t("profileSetup.createProfile.back")}
      nextLabelA11y={t("profileSetup.createProfile.nextA11y")}
      backLabelA11y={t("profileSetup.createProfile.backA11y")}
    >
      <Text style={styles.sectionTitle}>
        {t("profileSetup.createProfile.sectionTitle")}
      </Text>

      <FormField
        label={t("profileSetup.createProfile.fields.childName")}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholder={t("profileSetup.createProfile.placeholders.name")}
        labelA11y={t("profileSetup.createProfile.nameInputA11y")}
      />
      <FormField
        label={t("profileSetup.createProfile.fields.age")}
        value={age}
        onChangeText={handleAgeChange}
        keyboardType="number-pad"
        placeholder={t("profileSetup.createProfile.placeholders.age")}
        labelA11y={t("profileSetup.createProfile.ageInputA11y")}
        helperText={t("profileSetup.createProfile.helperAge")}
        maxLength={2}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22,
  },
});

export default CreateProfileScreen;
