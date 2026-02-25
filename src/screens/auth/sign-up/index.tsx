import WelcomeBackground from "@/assets/svg/welcome-background.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SVG_ASPECT_RATIO = 132 / 375;
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

const SignUpScreen = () => {
  const { back } = useRouter();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isUnderage, setIsUnderage] = useState(false);

  const isFormValid =
    name.trim().length > 0 && birthDate !== null && !isUnderage;

  const showDatePicker = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const handleDateConfirm = useCallback((date: Date) => {
    hideDatePicker();
    setBirthDate(date);
    const age = getAge(date);
    setIsUnderage(age < MINIMUM_AGE);
  }, []);

  const handleNext = () => {
    if (!birthDate) return;

    if (isUnderage) {
      // TODO: Navigate to underage screen
      return;
    }

    // TODO: Navigate to next registration step
  };

  return (
    <View style={styles.container}>
      <WelcomeBackground
        width={screenWidth}
        height={screenWidth * SVG_ASPECT_RATIO}
        style={styles.background}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t("auth.signUp.title")}</Text>
            <Text style={styles.subtitle}>{t("auth.signUp.subtitle")}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.description}>
              {t("auth.signUp.description")}
            </Text>

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
                  style={[
                    styles.dateText,
                    !birthDate && styles.dateTextPlaceholder,
                  ]}
                >
                  {birthDate
                    ? formatDate(birthDate)
                    : t("auth.signUp.selectDate")}
                </Text>
                {/* TODO: Add svg icon for calendar */}
                <Ionicons
                  style={styles.calendarIcon}
                  name="calendar-outline"
                  size={22}
                  color={colors.neutral[500]}
                />
              </Pressable>
              {isUnderage && (
                <Text style={styles.underageText}>
                  {t("auth.signUp.underageWarning")}
                </Text>
              )}
            </View>
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
          />

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                !isFormValid && styles.nextButtonDisabled,
                pressed && isFormValid && styles.buttonPressed,
              ]}
              onPress={handleNext}
              disabled={!isFormValid}
              accessibilityLabel={t("auth.signUp.nextA11y")}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.nextButtonText,
                  !isFormValid && styles.nextButtonTextDisabled,
                ]}
              >
                {t("auth.signUp.next")}
              </Text>
            </Pressable>

            <Pressable
              onPress={back}
              accessibilityLabel={t("auth.signUp.backA11y")}
              accessibilityRole="button"
              style={styles.backButton}
            >
              <Text style={styles.backText}>{t("auth.signUp.back")}</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: "40%",
    justifyContent: "space-between",
  },
  header: {
    gap: 8,
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
  },
  form: {
    gap: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22,
    marginBottom: 16,
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
  underageText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.error,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  datePickerIOS: {
    alignItems: "center",
  },
  calendarIcon: {
    position: "absolute",
    right: 20,
  },
  footer: {
    alignItems: "center",
    gap: 16,
    paddingBottom: "35%",
    marginTop: 56,
  },
  nextButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 64,
    width: "100%",
  },
  nextButtonDisabled: {
    backgroundColor: colors.neutral.disabled,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
  },
  backButton: {
    width: "100%",
    alignItems: "center",
  },
  nextButtonTextDisabled: {
    color: colors.neutral[700],
  },
  backText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
  },
  background: {
    position: "absolute",
    bottom: 0,
  },
});

export default SignUpScreen;
