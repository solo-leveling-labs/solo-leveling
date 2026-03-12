import AuthLayout from "@/src/components/AuthLayout";
import { DropdownSelect } from "@/src/components/DropdownSelect";
import FormField from "@/src/components/FormField";
import { Switch } from "@/src/components/Switch";
import {
  CreateRuleRequest,
  NotificationType,
  RuleResponseType,
  RuleSeverity,
} from "@/src/api/rules/rules.types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

const SEVERITY_COLOR_MAP: Record<RuleSeverity, string> = {
  Leve: colors.deco.decoGreen,
  Moderada: colors.deco.decoYellow,
  Grave: colors.accent.mainRed,
  Emergencia: colors.error,
};

const RESPONSE_TYPE_COLOR_MAP: Record<RuleResponseType, string> = {
  "Responder normalmente": colors.deco.decoGreen,
  "Responder y sugerir hablar con un adulto": colors.deco.decoYellow,
  "No responder y sugerir hablar con un adulto": colors.accent.mainRed,
  "Ante emergencias ayuda y avisa que se solicitara ayuda a un adulto":
    colors.error,
};

const NOTIFICATION_TYPES: NotificationType[] = [
  "IN_APP",
  "EMAIL",
  "PUSH_NOTIFICATION",
];

const CreateCustomAlertScreen = () => {
  const { back } = useRouter();
  const { t } = useTranslation();

  const [bannedContent, setBannedContent] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<RuleSeverity>("Leve");
  const [responseType, setResponseType] = useState<RuleResponseType>(
    "Responder normalmente",
  );
  const [isBlocking, setIsBlocking] = useState(false);
  const [notify, setNotify] = useState(false);
  const [typeOfNotification, setTypeOfNotification] = useState<
    NotificationType[]
  >([]);

  const isFormValid =
    bannedContent.trim().length > 0 &&
    description.trim().length > 0 &&
    (!notify || typeOfNotification.length > 0);

  const severityOptions = (
    Object.keys(SEVERITY_COLOR_MAP) as RuleSeverity[]
  ).map((key) => ({
    key,
    label: t(`profileSetup.createCustomAlert.severity.${key}`),
  }));

  const responseTypeOptions = (
    Object.keys(RESPONSE_TYPE_COLOR_MAP) as RuleResponseType[]
  ).map((key) => ({
    key,
    label: t(`profileSetup.createCustomAlert.responseType.${key}`),
  }));

  const toggleNotificationType = useCallback((type: NotificationType) => {
    setTypeOfNotification((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const handleNext = useCallback(() => {
    if (!isFormValid) return;

    const _payload: CreateRuleRequest = {
      bannedContent: bannedContent.trim(),
      description: description.trim(),
      severity,
      responseType,
      isBlocking,
      notify,
      typeOfNotification,
    };

    // TODO: Call create rule API with _payload
  }, [
    isFormValid,
    bannedContent,
    description,
    severity,
    responseType,
    isBlocking,
    notify,
    typeOfNotification,
  ]);

  return (
    <AuthLayout
      showBackArrow
      backArrowA11y={t("common.backA11y")}
      title={t("profileSetup.createCustomAlert.title")}
      subtitle={t("profileSetup.createCustomAlert.subtitle")}
      onNext={handleNext}
      onBack={back}
      isFormValid={isFormValid}
      nextLabel={t("profileSetup.createCustomAlert.next")}
      nextLabelA11y={t("profileSetup.createCustomAlert.nextA11y")}
      hideBackButton
    >
      <FormField
        label={t("profileSetup.createCustomAlert.fields.bannedContent")}
        value={bannedContent}
        onChangeText={setBannedContent}
        placeholder={t(
          "profileSetup.createCustomAlert.fields.bannedContentPlaceholder",
        )}
        labelA11y={t("profileSetup.createCustomAlert.fields.bannedContent")}
        autoCapitalize="sentences"
      />

      <FormField
        label={t("profileSetup.createCustomAlert.fields.description")}
        value={description}
        onChangeText={setDescription}
        placeholder={t(
          "profileSetup.createCustomAlert.fields.descriptionPlaceholder",
        )}
        labelA11y={t("profileSetup.createCustomAlert.fields.description")}
        autoCapitalize="sentences"
      />

      <DropdownSelect
        label={t("profileSetup.createCustomAlert.fields.severity")}
        options={severityOptions}
        selectedKey={severity}
        onSelect={(key) => setSeverity(key as RuleSeverity)}
        accessibilityLabel={t("profileSetup.createCustomAlert.severityA11y")}
        colorMap={SEVERITY_COLOR_MAP}
      />

      <DropdownSelect
        label={t("profileSetup.createCustomAlert.fields.responseType")}
        options={responseTypeOptions}
        selectedKey={responseType}
        onSelect={(key) => setResponseType(key as RuleResponseType)}
        accessibilityLabel={t(
          "profileSetup.createCustomAlert.responseTypeA11y",
        )}
        colorMap={RESPONSE_TYPE_COLOR_MAP}
      />

      <View style={styles.switchRow}>
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchTitle}>
            {t("profileSetup.createCustomAlert.fields.isBlocking")}
          </Text>
          <Text style={styles.switchDescription}>
            {t("profileSetup.createCustomAlert.fields.isBlockingDescription")}
          </Text>
        </View>
        <Switch
          value={isBlocking}
          onValueChange={setIsBlocking}
          accessibilityLabel={t(
            "profileSetup.createCustomAlert.isBlockingA11y",
          )}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchTitle}>
            {t("profileSetup.createCustomAlert.fields.notify")}
          </Text>
          <Text style={styles.switchDescription}>
            {t("profileSetup.createCustomAlert.fields.notifyDescription")}
          </Text>
        </View>
        <Switch
          value={notify}
          onValueChange={setNotify}
          accessibilityLabel={t("profileSetup.createCustomAlert.notifyA11y")}
        />
      </View>

      {notify && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          layout={LinearTransition.duration(200)}
          style={styles.notificationTypesContainer}
        >
          <Text style={styles.notificationTypesLabel}>
            {t("profileSetup.createCustomAlert.fields.notificationType")}
          </Text>
          <View style={styles.notificationTypesPills}>
            {NOTIFICATION_TYPES.map((type) => {
              const isSelected = typeOfNotification.includes(type);
              return (
                <Pressable
                  key={type}
                  onPress={() => toggleNotificationType(type)}
                  style={({ pressed }) => [
                    styles.pill,
                    isSelected && styles.pillSelected,
                    pressed && styles.pillPressed,
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={t(
                    `profileSetup.createCustomAlert.notificationType.${type}`,
                  )}
                >
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={18}
                    color={isSelected ? colors.accent.mainBlue : colors.neutral[500]}
                  />
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected,
                    ]}
                  >
                    {t(`profileSetup.createCustomAlert.notificationType.${type}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  switchTextContainer: {
    flex: 1,
    gap: 4,
  },
  switchTitle: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    lineHeight: 22,
  },
  switchDescription: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    lineHeight: 14,
  },
  notificationTypesContainer: {
    gap: 10,
  },
  notificationTypesLabel: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
  },
  notificationTypesPills: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.neutral[700],
  },
  pillSelected: {
    borderColor: colors.accent.mainBlue,
    backgroundColor: colors.overlay.selected,
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillText: {
    fontSize: 13,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    lineHeight: 18,
  },
  pillTextSelected: {
    color: colors.accent.mainBlue,
    fontFamily: fonts.poppins.bold,
  },
});

export default CreateCustomAlertScreen;
