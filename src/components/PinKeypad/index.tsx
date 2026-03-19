import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { haptics } from "@/src/utils/haptic-feedback";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PinKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspacePress: () => void;
}

const DIGIT_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

const PinKeypad = ({ onDigitPress, onBackspacePress }: PinKeypadProps) => {
  const handleDigit = useCallback(
    (digit: string) => {
      haptics.selection();
      onDigitPress(digit);
    },
    [onDigitPress],
  );

  const handleBackspace = useCallback(() => {
    haptics.selection();
    onBackspacePress();
  }, [onBackspacePress]);

  return (
    <View style={styles.container}>
      {DIGIT_ROWS.map((row) => (
        <View key={row.join("")} style={styles.row}>
          {row.map((digit) => (
            <TouchableOpacity
              key={digit}
              style={styles.key}
              onPress={() => handleDigit(digit)}
              activeOpacity={ACTIVE_OPACITY}
              accessibilityLabel={digit}
              accessibilityRole="button"
            >
              <Text style={styles.keyText}>{digit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.row}>
        <View style={styles.key} />

        <TouchableOpacity
          style={styles.key}
          onPress={() => handleDigit("0")}
          activeOpacity={ACTIVE_OPACITY}
          accessibilityLabel="0"
          accessibilityRole="button"
        >
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.key}
          onPress={handleBackspace}
          activeOpacity={ACTIVE_OPACITY}
          accessibilityLabel="Borrar"
          accessibilityRole="button"
        >
          <Ionicons
            name="backspace-outline"
            size={28}
            color={colors.neutral[200]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  key: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontFamily: fonts.poppins.regular,
    fontSize: 24,
    color: colors.neutral[200],
  },
});

export default PinKeypad;
