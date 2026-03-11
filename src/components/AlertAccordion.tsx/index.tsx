import { getAlertOptions } from "@/src/screens/auth/first-profile-setup/constants/alert-options";
import {
  AlertAccordionProps,
  AlertConfig,
  NOTIFICATION_COLORS,
  RESPONSE_COLORS,
  SEVERITY_COLORS,
} from "@/src/screens/auth/first-profile-setup/types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import DropdownSelect from "../DropdownSelect";

const AlertAccordion = ({
  title,
  description,
  isSelected,
  isExpanded,
  config,
  onToggleSelect,
  onToggleExpand,
  onConfigChange,
  isLocked,
}: AlertAccordionProps) => {
  const { t } = useTranslation();
  const { severityOptions, responseOptions, notificationOptions } =
    getAlertOptions(t, isLocked);

  const chevronRotation = useSharedValue(isExpanded ? 1 : 0);
  const checkboxIcon = isSelected ? "checkbox" : "square-outline";
  const checkboxColor = isSelected
    ? colors.accent.mainBlue
    : colors.neutral[500];
  const severityColor = SEVERITY_COLORS[config.severity];
  const severityLabel = t(
    `profileSetup.configureAlerts.severity.${config.severity}`,
  );

  const handleFieldChange = useCallback(
    (field: keyof AlertConfig) => (value: string) =>
      onConfigChange(field, value),
    [onConfigChange],
  );

  useEffect(() => {
    chevronRotation.value = withTiming(isExpanded ? 1 : 0, { duration: 200 });
  }, [chevronRotation, isExpanded]);

  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
    }),
    [],
  );

  return (
    <Animated.View style={styles.card} layout={LinearTransition.duration(200)}>
      <Pressable
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
        onPress={onToggleExpand}
        accessibilityLabel={t(
          "profileSetup.configureAlerts.alertAccordionA11y",
          { alert: title },
        )}
        accessibilityRole="button"
      >
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          accessibilityLabel={t(
            "profileSetup.configureAlerts.alertCheckboxA11y",
            { alert: title },
          )}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
        >
          <Animated.View
            key={checkboxIcon}
            entering={FadeIn.duration(150).withInitialValues({
              transform: [{ scale: 0.8 }],
            })}
          >
            <Ionicons name={checkboxIcon} size={24} color={checkboxColor} />
          </Animated.View>
        </Pressable>
        <Text style={styles.alertTitle}>{title}</Text>
        <View style={[styles.severityChip, { backgroundColor: severityColor }]}>
          <Text style={styles.severityChipText}>{severityLabel}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={24} color={colors.neutral[300]} />
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(150)}
        >
          <View style={styles.divider} />
          <View style={styles.expandedContent}>
            <Text style={styles.description}>{description}</Text>

            <DropdownSelect
              label={t("profileSetup.configureAlerts.dropdowns.severity")}
              options={severityOptions}
              selectedKey={config.severity}
              onSelect={handleFieldChange("severity")}
              accessibilityLabel={t(
                "profileSetup.configureAlerts.dropdownA11y",
                { field: t("profileSetup.configureAlerts.dropdowns.severity") },
              )}
              colorMap={SEVERITY_COLORS}
              disabled={isLocked}
            />

            <DropdownSelect
              label={t("profileSetup.configureAlerts.dropdowns.response")}
              options={responseOptions}
              selectedKey={config.response}
              onSelect={handleFieldChange("response")}
              accessibilityLabel={t(
                "profileSetup.configureAlerts.dropdownA11y",
                { field: t("profileSetup.configureAlerts.dropdowns.response") },
              )}
              colorMap={RESPONSE_COLORS}
              disabled={isLocked}
            />

            <DropdownSelect
              label={t("profileSetup.configureAlerts.dropdowns.notifications")}
              options={notificationOptions}
              selectedKey={config.notifications}
              onSelect={handleFieldChange("notifications")}
              accessibilityLabel={t(
                "profileSetup.configureAlerts.dropdownA11y",
                {
                  field: t(
                    "profileSetup.configureAlerts.dropdowns.notifications",
                  ),
                },
              )}
              colorMap={NOTIFICATION_COLORS}
              disabled={isLocked}
            />
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 8,
  },
  headerPressed: {
    backgroundColor: colors.overlay.press,
  },
  alertTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    lineHeight: 22,
  },
  severityChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  severityChipText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.lightBackground,
    textAlign: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral.disabled,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    lineHeight: 20,
  },
});

export default AlertAccordion;
