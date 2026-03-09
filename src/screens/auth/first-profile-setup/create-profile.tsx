import CalendarIcon from "@/assets/svg/calendar.svg";
import AuthLayout from "@/src/components/AuthLayout";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {t("profileSetup.createProfile.fields.childName")}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder={t("profileSetup.createProfile.placeholders.name")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("profileSetup.createProfile.nameInputA11y")}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {t("profileSetup.createProfile.fields.age")}
        </Text>
        <Pressable
          style={styles.inputContainer}
          onPress={showDatePicker}
          accessibilityLabel={t("profileSetup.createProfile.ageInputA11y")}
          accessibilityRole="button"
        >
          <Text
            style={[styles.dateText, !birthDate && styles.dateTextPlaceholder]}
          >
            {birthDate
              ? formatDate(birthDate)
              : t("profileSetup.createProfile.selectDate")}
          </Text>
          <CalendarIcon width={22} height={22} style={styles.calendarIcon} />
        </Pressable>
        <Text style={styles.helperText}>
          {t("profileSetup.createProfile.helperAge")}
        </Text>
      </View>

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
    lineHeight: 22,
    includeFontPadding: false,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    paddingHorizontal: 20,
    lineHeight: 56,
  },
  dateTextPlaceholder: {
    color: colors.neutral[700],
  },
  calendarIcon: {
    position: "absolute",
    right: 20,
  },
  helperText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    lineHeight: 16,
    letterSpacing: 0.4,
    paddingHorizontal: 20,
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
