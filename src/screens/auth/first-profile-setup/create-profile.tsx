import CalendarIcon from "@/assets/svg/calendar.svg";
import { rulesApi } from "@/src/api/rules/rules.api";
import { RULES_QUERY_KEY } from "@/src/api/rules/rules.hooks";
import { useCreateUser } from "@/src/api/users/users.hooks";
import { AuthLayout } from "@/src/components/AuthLayout";
import { DatePickerField } from "@/src/components/DatePickerField";
import { FormField } from "@/src/components/FormField";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { minDelay } from "@/src/utils/min-delay";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  const { push, dismissTo, back } = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutateAsync: createUser } = useCreateUser();
  const { source } = useLocalSearchParams<{ source: string }>();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [extraInfo, setExtraInfo] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = name.trim().length > 0 && birthDate !== null;
  const isFromSelectProfile = source === "select-profile";

  const showDatePicker = () => {
    Keyboard.dismiss();
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleDateConfirm = (date: Date) => {
    hideDatePicker();
    setBirthDate(date);
  };

  const handleNext = async () => {
    if (!isFormValid || !birthDate) return;

    setIsLoading(true);

    const payload = {
      fullName: name.trim(),
      birthday: toISODate(birthDate),
      ...(extraInfo.trim() && { extraInformation: extraInfo.trim() }),
    };

    try {
      const [data] = await Promise.all([
        createUser(payload),
        queryClient.prefetchQuery({
          queryKey: RULES_QUERY_KEY,
          queryFn: () => rulesApi.getRules(),
        }),
        minDelay(),
      ]);

      push({
        pathname: "/configure-alerts",
        params: {
          childName: data.data.fullName,
          childId: data.data.id,
          source,
        },
      });
    } catch {
      Alert.alert(t("common.errors.title"), t("common.errors.genericMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
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
          onPress: () => dismissTo("/(tabs-child)"),
        },
      ],
    );
  };

  return (
    <AuthLayout
      title={t("profileSetup.createProfile.title")}
      subtitle={t("profileSetup.createProfile.subtitle")}
      onNext={handleNext}
      onBack={isFromSelectProfile ? back : handleCancel}
      isFormValid={isFormValid}
      isLoading={isLoading}
      headerBottomSpacing={20}
      footerTopSpacing={24}
      nextLabel={t("profileSetup.createProfile.next")}
      backLabel={
        isFromSelectProfile
          ? t("profileSetup.createProfile.back")
          : t("profileSetup.createProfile.skip")
      }
      nextLabelA11y={t("profileSetup.createProfile.nextA11y")}
      backLabelA11y={
        isFromSelectProfile
          ? t("common.backA11y")
          : t("profileSetup.createProfile.backA11y")
      }
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

      <View style={styles.personalizationSection}>
        <Text style={styles.sectionTitle}>
          {t("profileSetup.createProfile.personalizationTitle")}
        </Text>
        <Text style={styles.personalizationDescription}>
          {t("profileSetup.createProfile.personalizationDescription")}
        </Text>
      </View>

      <View style={styles.textAreaGroup}>
        <Text style={styles.textAreaLabel}>
          {t("profileSetup.createProfile.fields.extraInfo")}
        </Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={extraInfo}
            onChangeText={setExtraInfo}
            placeholder={t("profileSetup.createProfile.placeholders.extraInfo")}
            placeholderTextColor={colors.neutral[500]}
            multiline
            textAlignVertical="top"
            accessibilityLabel={t("profileSetup.createProfile.extraInfoA11y")}
          />
        </View>
      </View>

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
          <TouchableOpacity
            onPress={onPress}
            style={styles.datePickerConfirmButton}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityRole="button"
            accessibilityLabel={t(
              "profileSetup.createProfile.datePickerConfirm",
            )}
          >
            <Text style={styles.datePickerConfirmText}>
              {t("profileSetup.createProfile.datePickerConfirm")}
            </Text>
          </TouchableOpacity>
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
  personalizationSection: {
    gap: 8,
    marginTop: 8,
  },
  personalizationDescription: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 19.6,
  },
  textAreaGroup: {
    gap: 8,
  },
  textAreaLabel: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
  },
  textAreaContainer: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.accent.mainBlue,
    margin: 1,
  },
  textArea: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    height: 120,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    lineHeight: 22,
    includeFontPadding: false,
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
  datePickerConfirmText: {
    fontSize: 20,
    color: colors.system.iosBlue,
  },
});

export default CreateProfileScreen;
