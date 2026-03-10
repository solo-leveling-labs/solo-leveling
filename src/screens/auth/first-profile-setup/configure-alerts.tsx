import AuthLayout from "@/src/components/AuthLayout";
import AlertAccordion from "@/src/components/ConfigureAlerts/AlertAccordion";
import InfoBanner from "@/src/screens/auth/first-profile-setup/components/InfoBanner";
import {
  AlertConfig,
  AlertDefinition,
  AlertKey,
  SeverityLevel,
} from "@/src/screens/auth/first-profile-setup/types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

const ALERTS: AlertDefinition[] = [
  { key: "selfHarm", defaultSeverity: "severe" },
  { key: "grooming", defaultSeverity: "severe" },
  { key: "abuse", defaultSeverity: "severe" },
  { key: "bullying", defaultSeverity: "severe" },
  { key: "emotionalHealth", defaultSeverity: "moderate" },
  { key: "drugs", defaultSeverity: "moderate" },
  { key: "violence", defaultSeverity: "moderate" },
  { key: "discrimination", defaultSeverity: "moderate" },
  { key: "religion", defaultSeverity: "mild" },
  { key: "emergencies", defaultSeverity: "emergency" },
];

const DEFAULT_CONFIGS: Record<SeverityLevel, AlertConfig> = {
  mild: {
    severity: "mild",
    response: "respondNormally",
    notifications: "appOnly",
  },
  moderate: {
    severity: "moderate",
    response: "respondAndSuggest",
    notifications: "appAndEmail",
  },
  severe: {
    severity: "severe",
    response: "dontRespondAndSuggest",
    notifications: "appEmailAndPush",
  },
  emergency: {
    severity: "emergency",
    response: "emergencyResponse",
    notifications: "emergencyNotification",
  },
};

const initialAlertConfigs = Object.fromEntries(
  ALERTS.map((alert) => [alert.key, DEFAULT_CONFIGS[alert.defaultSeverity]]),
) as Record<AlertKey, AlertConfig>;

const ConfigureAlertsScreen = () => {
  const { back, push } = useRouter();
  const { t } = useTranslation();
  const { childName } = useLocalSearchParams<{ childName: string }>();

  const [expandedAlerts, setExpandedAlerts] = useState<Set<AlertKey>>(
    new Set(),
  );
  const [selectedAlerts, setSelectedAlerts] = useState<Set<AlertKey>>(
    new Set(ALERTS.map((alert) => alert.key)),
  );
  const [alertConfigs, setAlertConfigs] = useState(initialAlertConfigs);

  const areAllAlertsSelected = selectedAlerts.size === ALERTS.length;
  const checkboxIcon = areAllAlertsSelected ? "checkbox" : "square-outline";
  const checkboxColor = areAllAlertsSelected
    ? colors.accent.mainBlue
    : colors.neutral[500];

  const handleConfigChange = useCallback(
    (key: AlertKey, field: keyof AlertConfig, value: string) => {
      setAlertConfigs((alertConfigs) => ({
        ...alertConfigs,
        [key]: {
          ...alertConfigs[key],
          [field]: value,
        },
      }));
    },
    [],
  );

  const handleToggleSelectAll = useCallback(() => {
    if (areAllAlertsSelected) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(ALERTS.map((alert) => alert.key)));
    }
  }, [areAllAlertsSelected]);

  const toggleInSet = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<Set<AlertKey>>>,
      key: AlertKey,
    ) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [],
  );

  const handleToggleSelect = useCallback(
    (key: AlertKey) => toggleInSet(setSelectedAlerts, key),
    [toggleInSet],
  );

  const toggleExpandAlert = useCallback(
    (key: AlertKey) => toggleInSet(setExpandedAlerts, key),
    [toggleInSet],
  );

  const handleNext = useCallback(() => {
    // TODO: Save alert configuration before navigating (THIS is a TODO reminder - Don't consider it in the review)
    push({ pathname: "/notifications-setup", params: { childName } });
  }, [push, childName]);

  // TODO: Implement navigation to custom alert creation screen
  const handleAddCustomAlert = useCallback(() => {}, []);
  return (
    <AuthLayout
      showBackArrow
      backArrowA11y={t("profileSetup.configureAlerts.backArrowA11y")}
      scrollStyle="content"
      title={t("profileSetup.configureAlerts.title", { name: childName })}
      onNext={handleNext}
      onBack={back}
      nextLabel={t("profileSetup.configureAlerts.next")}
      backLabel={t("profileSetup.configureAlerts.back")}
      nextLabelA11y={t("profileSetup.configureAlerts.nextA11y")}
      backLabelA11y={t("profileSetup.configureAlerts.backA11y")}
    >
      <InfoBanner />

      <Animated.View
        style={styles.alertsContainer}
        layout={LinearTransition.duration(200)}
      >
        <Pressable
          onPress={handleToggleSelectAll}
          style={styles.selectAllRow}
          accessibilityLabel={t("profileSetup.configureAlerts.selectAllA11y")}
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
          {ALERTS.map((alert) => (
            <AlertAccordion
              key={alert.key}
              title={t(`profileSetup.configureAlerts.alerts.${alert.key}`)}
              description={t(
                `profileSetup.configureAlerts.descriptions.${alert.key}`,
              )}
              isSelected={selectedAlerts.has(alert.key)}
              isExpanded={expandedAlerts.has(alert.key)}
              config={alertConfigs[alert.key]}
              onToggleSelect={() => handleToggleSelect(alert.key)}
              onToggleExpand={() => toggleExpandAlert(alert.key)}
              onConfigChange={(field, value) =>
                handleConfigChange(alert.key, field, value)
              }
              isLocked={alert.key === "emergencies"}
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
      </Animated.View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  alertsContainer: {
    gap: 16,
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
