import CalendarIcon from "@/assets/svg/calendar.svg";
import AuthLayout from "@/src/components/AuthLayout";
import FormField from "@/src/components/FormField";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const getDefaultPickerDate = (): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 8);
  return date;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CreateProfileScreen = () => {
  const { push, dismissTo } = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const isFormValid = name.trim().length > 0 && birthDate !== null;

  const showDatePicker = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const handleDateConfirm = useCallback(
    (date: Date) => {
      hideDatePicker();
      setBirthDate(date);
    },
    [hideDatePicker],
  );

  const handleNext = useCallback(() => {
    if (!isFormValid) return;
    push("/configure-alerts");
  }, [isFormValid, push]);

  const handleCancel = useCallback(() => {
    dismissTo("/(tabs)");
  }, [dismissTo]);

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
        isDatePickerInput
        label={t("profileSetup.createProfile.fields.age")}
        onPress={showDatePicker}
        labelA11y={t("profileSetup.createProfile.ageInputA11y")}
        isPlaceholder={!birthDate}
        displayValue={
          birthDate
            ? formatDate(birthDate)
            : t("profileSetup.createProfile.selectDate")
        }
        helperText={t("profileSetup.createProfile.helperAge")}
        rightIconElement={
          <CalendarIcon width={22} height={22} style={styles.calendarIcon} />
        }
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
        date={birthDate ?? getDefaultPickerDate()}
        confirmTextIOS={t("auth.signUp.datePickerConfirm")}
        cancelTextIOS={t("auth.signUp.datePickerCancel")}
        locale={t("auth.signUp.datePickerLocale")}
        pickerContainerStyleIOS={styles.datePickerIOS}
        customConfirmButtonIOS={({ onPress }) => (
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              styles.datePickerConfirmButton,
              pressed && styles.datePickerConfirmPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t("auth.signUp.datePickerConfirm")}
          >
            <Text style={styles.datePickerConfirmText}>
              {t("auth.signUp.datePickerConfirm")}
            </Text>
          </Pressable>
        )}
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
  calendarIcon: {
    position: "absolute",
    right: 20,
  },
  datePickerIOS: {
    alignItems: "center",
  },
  datePickerConfirmButton: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neutral[700],
  },
  datePickerConfirmPressed: {
    backgroundColor: colors.overlay.selected,
  },
  datePickerConfirmText: {
    fontSize: 20,
    fontFamily: fonts.poppins.regular,
    color: colors.system.iosBlue,
  },
});

export default CreateProfileScreen;
