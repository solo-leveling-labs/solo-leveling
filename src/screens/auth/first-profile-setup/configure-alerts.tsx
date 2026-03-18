/* eslint-disable react-hooks/exhaustive-deps */
import { useAssignRules, useGetRules } from "@/src/api/rules/rules.hooks";
import {
  NotificationType,
  Rule,
  RuleResponseType,
  RuleSeverity,
} from "@/src/api/rules/rules.types";
import { AlertAccordion } from "@/src/components/AlertAccordion";
import { AuthLayout } from "@/src/components/AuthLayout";
import InfoBanner from "@/src/screens/auth/first-profile-setup/components/InfoBanner";
import {
  AlertConfig,
  NotificationsLevel,
  ResponseLevel,
  SeverityLevel,
} from "@/src/screens/auth/first-profile-setup/types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { minDelay } from "@/src/utils/min-delay";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

const SEVERITY_MAP: Record<RuleSeverity, SeverityLevel> = {
  Leve: "mild",
  Moderada: "moderate",
  Grave: "severe",
  Emergencia: "emergency",
};

const RESPONSE_MAP: Record<RuleResponseType, ResponseLevel> = {
  "Responder normalmente": "respondNormally",
  "Responder y sugerir hablar con un adulto": "respondAndSuggest",
  "No responder y sugerir hablar con un adulto": "dontRespondAndSuggest",
  "Ante emergencias ayuda y avisa que se solicitara ayuda a un adulto":
    "emergencyResponse",
};

const toNotificationsLevel = (
  types: NotificationType[] | null,
): NotificationsLevel => {
  if (!types) return "emergencyNotification";
  const has = (t: NotificationType) => types.includes(t);
  if (has("IN_APP") && has("EMAIL") && has("PUSH_NOTIFICATION"))
    return "appEmailAndPush";
  if (has("IN_APP") && has("EMAIL")) return "appAndEmail";
  if (has("IN_APP")) return "appOnly";
  return "emergencyNotification";
};

const toAlertConfig = (rule: Rule): AlertConfig => ({
  severity: SEVERITY_MAP[rule.severity],
  response: RESPONSE_MAP[rule.responseType],
  notifications: toNotificationsLevel(rule.typeOfNotification),
});

const ConfigureAlertsScreen = () => {
  const { back, push } = useRouter();
  const { t } = useTranslation();
  const { childName, childId } = useLocalSearchParams<{
    childName: string;
    childId: string;
  }>();

  const { data: rulesResponse, isLoading: isLoadingRules } = useGetRules();
  const { mutateAsync: assignRules } = useAssignRules();
  const rules = rulesResponse?.data.slice().reverse() ?? [];

  const [expandedAlerts, setExpandedAlerts] = useState<Set<number>>(new Set());
  const [selectedAlerts, setSelectedAlerts] = useState<Set<number>>(new Set());
  const [alertConfigs, setAlertConfigs] = useState<Record<number, AlertConfig>>(
    {},
  );

  useEffect(() => {
    if (rules.length > 0) {
      setSelectedAlerts(new Set(rules.map((r) => r.id)));
      setAlertConfigs(
        Object.fromEntries(rules.map((r) => [r.id, toAlertConfig(r)])),
      );
    }
  }, [rules.length]);

  const areAllAlertsSelected =
    rules.length > 0 && selectedAlerts.size === rules.length;
  const checkboxIcon = areAllAlertsSelected ? "checkbox" : "square-outline";
  const checkboxColor = areAllAlertsSelected
    ? colors.accent.mainBlue
    : colors.neutral[500];

  const handleConfigChange = useCallback(
    (id: number, field: keyof AlertConfig, value: string) => {
      setAlertConfigs((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    },
    [],
  );

  const handleToggleSelectAll = useCallback(() => {
    if (areAllAlertsSelected) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(rules.map((r) => r.id)));
    }
  }, [areAllAlertsSelected, rules]);

  const toggleInSet = useCallback(
    (setter: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [],
  );

  const handleToggleSelect = useCallback(
    (id: number) => toggleInSet(setSelectedAlerts, id),
    [toggleInSet],
  );

  const toggleExpandAlert = useCallback(
    (id: number) => toggleInSet(setExpandedAlerts, id),
    [toggleInSet],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = useCallback(async () => {
    setIsSubmitting(true);

    try {
      await Promise.all([
        assignRules({ userId: childId, ruleIds: [...selectedAlerts] }),
        minDelay(),
      ]);
      push({
        pathname: "/notifications-setup",
        params: { childName, childId },
      });
    } catch {
      Alert.alert(t("common.errors.title"), t("common.errors.genericMessage"));
    } finally {
      setIsSubmitting(false);
    }
  }, [assignRules, childId, selectedAlerts, push, childName, t]);

  const handleAddCustomAlert = useCallback(() => {
    push("/create-custom-alert");
  }, [push]);

  return (
    <AuthLayout
      showBackArrow
      backArrowA11y={t("profileSetup.configureAlerts.backArrowA11y")}
      title={t("profileSetup.configureAlerts.title", { name: childName })}
      onNext={handleNext}
      onBack={back}
      nextLabel={t("profileSetup.configureAlerts.next")}
      backLabel={t("profileSetup.configureAlerts.back")}
      nextLabelA11y={t("profileSetup.configureAlerts.nextA11y")}
      backLabelA11y={t("profileSetup.configureAlerts.backA11y")}
      isFormValid={!isLoadingRules}
      isLoading={isSubmitting}
      headerBottomSpacing={36}
      footerTopSpacing={36}
    >
      <InfoBanner />

      <Animated.View
        style={styles.alertsContainer}
        layout={LinearTransition.duration(200)}
      >
        {isLoadingRules ? (
          <ActivityIndicator
            size="large"
            color={colors.accent.mainBlue}
            style={styles.loader}
          />
        ) : (
          <>
            <Pressable
              onPress={handleToggleSelectAll}
              style={styles.selectAllRow}
              accessibilityLabel={t(
                "profileSetup.configureAlerts.selectAllA11y",
              )}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked:
                  selectedAlerts.size === 0
                    ? false
                    : areAllAlertsSelected
                      ? true
                      : "mixed",
              }}
            >
              <Animated.View
                key={checkboxIcon}
                entering={FadeIn.duration(150).withInitialValues({
                  transform: [{ scale: 0.8 }],
                })}
              >
                <Ionicons name={checkboxIcon} size={24} color={checkboxColor} />
              </Animated.View>
              <Text style={styles.selectAllText}>
                {t("profileSetup.configureAlerts.selectAll")}
              </Text>
            </Pressable>

            <View style={styles.alertsList}>
              {rules.map((rule) => (
                <AlertAccordion
                  key={rule.id}
                  title={rule.bannedContent}
                  description={rule.description}
                  isSelected={selectedAlerts.has(rule.id)}
                  isExpanded={expandedAlerts.has(rule.id)}
                  config={alertConfigs[rule.id] ?? toAlertConfig(rule)}
                  onToggleSelect={() => handleToggleSelect(rule.id)}
                  onToggleExpand={() => toggleExpandAlert(rule.id)}
                  onConfigChange={(field, value) =>
                    handleConfigChange(rule.id, field, value)
                  }
                  isLocked={rule.severity === "Emergencia"}
                />
              ))}
            </View>

            <Animated.View
              style={styles.addAlertRow}
              layout={LinearTransition.duration(200)}
            >
              <Pressable
                style={({ pressed }) => [pressed && styles.addAlertPressed]}
                onPress={handleAddCustomAlert}
                accessibilityLabel={t(
                  "profileSetup.configureAlerts.addCustomAlertA11y",
                )}
                accessibilityRole="button"
              >
                <Text style={styles.addAlertText}>
                  {t("profileSetup.configureAlerts.addCustomAlert")}
                </Text>
              </Pressable>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  alertsContainer: {
    gap: 16,
  },
  loader: {
    paddingVertical: 40,
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectAllText: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[700],
    lineHeight: 20,
  },
  alertsList: {
    gap: 8,
  },
  addAlertRow: {
    alignItems: "flex-end",
  },
  addAlertText: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
    lineHeight: 20,
    textDecorationLine: "underline",
  },
  addAlertPressed: {
    opacity: 0.8,
  },
});

export default ConfigureAlertsScreen;
