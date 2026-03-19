import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface FormFieldProps {
  label: string;
  labelA11y: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  autoComplete?: ComponentProps<typeof TextInput>["autoComplete"];
  textContentType?: ComponentProps<typeof TextInput>["textContentType"];
  errorText?: string;
  secureTextEntry?: boolean;
  rightIconName?: ComponentProps<typeof Ionicons>["name"];
  onRightIconPress?: () => void;
  helperText?: string;
  pressableA11y?: string;
  maxLength?: number;
  disabled?: boolean;
}

export const FormField = ({
  label,
  labelA11y,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  errorText,
  secureTextEntry,
  rightIconName,
  onRightIconPress,
  helperText,
  pressableA11y,
  maxLength,
  disabled = false,
}: FormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = (value?.length ?? 0) > 0;
  const isError = !!errorText;

  const getLabelStyle = () => {
    if (disabled) return styles.labelDisabled;
    if (isError) return styles.labelError;
    if (isFocused || hasValue) return styles.labelActive;
    return null;
  };

  const getContainerStyle = () => {
    if (disabled) return styles.inputContainerDisabled;
    if (isError) return styles.inputContainerError;
    if (isFocused) return styles.inputContainerFocused;
    return null;
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, getLabelStyle()]}>{label}</Text>
      <View style={[styles.inputContainer, getContainerStyle()]}>
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          textContentType={textContentType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={maxLength}
          placeholderTextColor={
            disabled ? colors.neutral.disabled : colors.neutral[500]
          }
          editable={!disabled}
          accessibilityLabel={labelA11y}
        />
        {rightIconName && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.eyeIcon}
            disabled={disabled}
            accessibilityLabel={pressableA11y}
            accessibilityRole="button"
          >
            <Ionicons
              name={rightIconName}
              size={22}
              color={disabled ? colors.neutral.disabled : colors.neutral[500]}
            />
          </Pressable>
        )}
      </View>
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, disabled && styles.helperTextDisabled]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
  },
  labelActive: {
    color: colors.neutral[300],
  },
  labelError: {
    color: colors.error,
  },
  labelDisabled: {
    color: colors.neutral.disabled,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.accent.mainBlue,
    backgroundColor: colors.transparent,
    margin: 1,
  },
  inputContainerFocused: {
    borderWidth: 2,
    backgroundColor: colors.neutral.white,
    margin: 0,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerDisabled: {
    borderColor: colors.neutral.disabled,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[200],
    height: 56,
    paddingHorizontal: 24,
    lineHeight: 22,
    includeFontPadding: false,
  },
  inputDisabled: {
    color: colors.neutral.disabled,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.error,
    paddingHorizontal: 24,
    lineHeight: 14.4,
  },
  helperText: {
    fontSize: 12,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[500],
    paddingHorizontal: 24,
    lineHeight: 14.4,
  },
  helperTextDisabled: {
    color: colors.neutral.disabled,
  },
});
