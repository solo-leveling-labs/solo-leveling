import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
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

interface DropdownOption {
  key: string;
  label: string;
}

interface DropdownSelectProps {
  label: string;
  options: DropdownOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
  accessibilityLabel: string;
  colorMap: Record<string, string>;
  disabled?: boolean;
}

const WARNING_COLORS = new Set<string>([colors.accent.mainRed, colors.error]);

const DropdownSelect = ({
  label,
  options,
  selectedKey,
  onSelect,
  accessibilityLabel,
  colorMap,
  disabled,
}: DropdownSelectProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [triggerHeight, setTriggerHeight] = useState(0);

  const selectedOption = options.find((o) => o.key === selectedKey);
  const selectedEmergencyValue = colorMap[selectedKey] === colors.error;
  const chevronRotation = useSharedValue(isOpen ? 1 : 0);
  const alertIcon = selectedEmergencyValue
    ? "alert-circle"
    : "alert-circle-outline";

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (key: string) => {
      onSelect(key);
      setIsOpen(false);
    },
    [onSelect],
  );

  useEffect(() => {
    chevronRotation.value = withTiming(isOpen ? 1 : 0, { duration: 150 });
  }, [chevronRotation, isOpen]);

  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
    }),
    [],
  );

  return (
    <Animated.View
      style={styles.container}
      layout={LinearTransition.duration(200)}
    >
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.dropdownWrapper, isOpen && styles.dropdownWrapperOpen]}
      >
        <Pressable
          onLayout={(e) => setTriggerHeight(e.nativeEvent.layout.height)}
          style={({ pressed }) => [
            styles.trigger,
            isOpen && styles.triggerOpen,
            pressed && styles.triggerPressed,
            disabled && styles.triggerDisabled,
          ]}
          onPress={handleToggle}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          disabled={disabled}
        >
          {WARNING_COLORS.has(colorMap[selectedKey]) ? (
            <Ionicons
              name={alertIcon}
              size={25}
              color={colorMap[selectedKey]}
            />
          ) : (
            <View style={styles.severityTriggerIndicatorBox}>
              <View
                style={[
                  styles.severityIndicator,
                  { backgroundColor: colorMap[selectedKey] },
                ]}
              />
            </View>
          )}
          <Text style={styles.triggerText}>{selectedOption?.label ?? ""}</Text>
          {!disabled && (
            <Animated.View style={chevronStyle}>
              <Ionicons
                name={"chevron-down"}
                size={20}
                color={colors.neutral[500]}
              />
            </Animated.View>
          )}
        </Pressable>
        {isOpen && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={[
              styles.menuList,
              { marginTop: -triggerHeight, paddingTop: triggerHeight },
            ]}
          >
            {options.map((option) => (
              <Pressable
                key={option.key}
                style={({ pressed }) => [
                  styles.menuItem,
                  option.key === selectedKey && styles.menuItemSelected,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={() => handleSelect(option.key)}
                accessibilityLabel={t(
                  "profileSetup.configureAlerts.dropdownOptionA11y",
                  { option: option.label },
                )}
                accessibilityRole="button"
              >
                {WARNING_COLORS.has(colorMap[option.key]) ? (
                  <Ionicons
                    name={
                      colorMap[option.key] === colors.error
                        ? "alert-circle"
                        : "alert-circle-outline"
                    }
                    size={18}
                    color={colorMap[option.key]}
                  />
                ) : (
                  <View style={styles.severityIndicatorBox}>
                    <View
                      style={[
                        styles.severityIndicator,
                        { backgroundColor: colorMap[option.key] },
                      ]}
                    />
                  </View>
                )}
                <View style={styles.menuItemTextContainer}>
                  <Text style={[styles.menuItemText]}>{option.label}</Text>
                </View>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    lineHeight: 20,
  },
  dropdownWrapper: {
    backgroundColor: colors.neutral.white,
  },
  dropdownWrapperOpen: {
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    backgroundColor: colors.neutral.white,
    elevation: 4,
    borderRadius: 28,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.neutral[700],
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    zIndex: 2,
  },
  triggerOpen: {
    borderColor: colors.neutral[200],
  },
  triggerPressed: {
    opacity: 0.8,
  },
  triggerDisabled: {
    opacity: 0.8,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    lineHeight: 22,
  },
  menuList: {
    backgroundColor: colors.neutral.white,
    borderRadius: 28,
    zIndex: 1,
    overflow: "hidden",
  },
  menuItem: {
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 36,
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemPressed: {
    backgroundColor: colors.overlay.press,
  },
  menuItemSelected: {
    backgroundColor: colors.overlay.selected,
  },
  severityIndicatorBox: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  severityIndicator: {
    width: 13,
    height: 13,
    borderRadius: 100,
  },
  severityTriggerIndicatorBox: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    lineHeight: 26,
  },
});

export default DropdownSelect;
