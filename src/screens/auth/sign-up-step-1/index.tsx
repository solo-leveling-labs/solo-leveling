import CalendarIcon from "@/assets/svg/calendar.svg";
import SignUpLayout from "@/src/components/SignUpLayout";
import { useSignupStore } from "@/src/store/signup.store";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const MINIMUM_AGE = 18;

const getAge = (birthDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedBirth = new Date(birthDate);
  normalizedBirth.setHours(0, 0, 0, 0);

  let age = today.getFullYear() - normalizedBirth.getFullYear();
  const monthDiff = today.getMonth() - normalizedBirth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < normalizedBirth.getDate())
  ) {
    age--;
  }
  return age;
};

const getDefaultPickerDate = (): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - MINIMUM_AGE);
  return date;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SignUpStep1Screen = () => {
  const { back, push } = useRouter();
  const { t } = useTranslation();
  const { setStep1 } = useSignupStore();

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

  const handleNext = () => {
    if (!birthDate) return;
    const age = getAge(birthDate);
    if (age < MINIMUM_AGE) {
      push("/(auth)/underage");
      return;
    }

    const formattedBirthday = toISODate(birthDate);

    setStep1(name.trim(), formattedBirthday);
    push("/(auth)/sign-up-step-2");
  };

  return (
    <SignUpLayout
      description={t("auth.signUp.description")}
      onNext={handleNext}
      onBack={back}
      isFormValid={isFormValid}
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("common.fields.name")}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder={t("common.fields.name")}
            placeholderTextColor={colors.neutral[700]}
            accessibilityLabel={t("auth.signUp.nameInputA11y")}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("common.fields.birthDate")}</Text>
        <Pressable
          style={styles.inputContainer}
          onPress={showDatePicker}
          accessibilityLabel={t("auth.signUp.birthDateInputA11y")}
          accessibilityRole="button"
        >
          <Text
            style={[styles.dateText, !birthDate && styles.dateTextPlaceholder]}
          >
            {birthDate ? formatDate(birthDate) : t("auth.signUp.selectDate")}
          </Text>
          <CalendarIcon width={22} height={22} style={styles.calendarIcon} />
        </Pressable>
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
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  datePickerConfirmText: {
    fontSize: 20,
    color: "#0081FF",
  },
  calendarIcon: {
    position: "absolute",
    right: 20,
  },
});

export default SignUpStep1Screen;
