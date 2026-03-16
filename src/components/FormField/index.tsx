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
}: FormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, errorText && styles.labelError]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          errorText && styles.inputContainerError,
        ]}
      >
        <TextInput
          style={styles.input}
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
          placeholderTextColor={colors.neutral[700]}
          accessibilityLabel={labelA11y}
        />
        {rightIconName && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.eyeIcon}
            accessibilityLabel={pressableA11y}
            accessibilityRole="button"
          >
            <Ionicons
              name={rightIconName}
              size={22}
              color={colors.neutral[500]}
            />
          </Pressable>
        )}
      </View>
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
  inputContainerFocused: {
    borderColor: colors.border.focused,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    height: 56,
    paddingHorizontal: 20,
    lineHeight: 22,
    includeFontPadding: false,
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
