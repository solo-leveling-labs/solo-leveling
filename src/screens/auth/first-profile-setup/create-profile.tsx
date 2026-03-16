import CalendarIcon from "@/assets/svg/calendar.svg";
import AuthLayout from "@/src/components/AuthLayout";
import DatePickerField from "@/src/components/DatePickerField";
import FormField from "@/src/components/FormField";
import { useCreateUser } from "@/src/api/users/users.hooks";
import { minDelay } from "@/src/utils/min-delay";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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

const CreateProfileScreen = () => {
  const { push, dismissTo } = useRouter();
  const { t } = useTranslation();
  const { mutateAsync: createUser } = useCreateUser();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleNext = useCallback(async () => {
    if (!isFormValid || !birthDate) return;

    setIsLoading(true);

    try {
      const [data] = await Promise.all([
        createUser({ fullName: name.trim(), birthday: toISODate(birthDate) }),
        minDelay(),
      ]);
      push({
        pathname: "/configure-alerts",
        params: { childName: data.data.fullName, childId: data.data.id },
      });
    } catch {
      Alert.alert(
        t("common.errors.title"),
        t("common.errors.genericMessage"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isFormValid, birthDate, createUser, name, push, t]);

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
      isLoading={isLoading}
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

      <DatePickerField
        label={t("profileSetup.createProfile.fields.birthDate")}
        onPress={showDatePicker}
        labelA11y={t("profileSetup.createProfile.birthDateInputA11y")}
        isPlaceholder={!birthDate}
        displayValue={
          birthDate
            ? formatDate(birthDate)
            : t("profileSetup.createProfile.selectDate")
        }
        helperText={t("profileSetup.createProfile.helperBirthDate")}
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
        date={birthDate ?? new Date()}
        confirmTextIOS={t("profileSetup.createProfile.datePickerConfirm")}
        cancelTextIOS={t("profileSetup.createProfile.datePickerCancel")}
        locale={t("profileSetup.createProfile.datePickerLocale")}
        pickerContainerStyleIOS={styles.datePickerIOS}
        customConfirmButtonIOS={({ onPress }) => (
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              styles.datePickerConfirmButton,
              pressed && styles.datePickerConfirmPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t("profileSetup.createProfile.datePickerConfirm")}
          >
            <Text style={styles.datePickerConfirmText}>
              {t("profileSetup.createProfile.datePickerConfirm")}
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
    color: colors.system.iosBlue,
  },
});

export default CreateProfileScreen;
