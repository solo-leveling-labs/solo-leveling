import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DatePickerFieldProps {
  label: string;
  labelA11y: string;
  onPress: () => void;
  displayValue: string;
  isPlaceholder?: boolean;
  helperText?: string;
  errorText?: string;
  rightIconElement?: ReactNode;
}

const DatePickerField = ({
  label,
  labelA11y,
  onPress,
  displayValue,
  isPlaceholder,
  helperText,
  errorText,
  rightIconElement,
}: DatePickerFieldProps) => {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, errorText && styles.labelError]}>
        {label}
      </Text>
      <Pressable
        style={[styles.inputContainer, errorText && styles.inputContainerError]}
        onPress={onPress}
        accessibilityLabel={labelA11y}
        accessibilityRole="button"
      >
        <Text
          style={[styles.dateText, isPlaceholder && styles.dateTextPlaceholder]}
        >
          {displayValue}
        </Text>
        {rightIconElement}
      </Pressable>
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
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
  labelError: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.border.default,
    backgroundColor: colors.transparent,
  },
  inputContainerError: {
    borderColor: colors.error,
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
  errorText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.error,
    paddingHorizontal: 24,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  helperText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    paddingHorizontal: 24,
    lineHeight: 16,
  },
});

export default DatePickerField;
