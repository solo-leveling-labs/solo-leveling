import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

interface PinKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspacePress: () => void;
}

const PinKeypad = ({ onDigitPress, onBackspacePress }: PinKeypadProps) => {
  const { t } = useTranslation();

  const renderKey = (digit: string) => (
    <Pressable
      key={digit}
      style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
      onPress={() => onDigitPress(digit)}
      accessibilityLabel={t("parentPinAccess.digitA11y", { digit })}
      accessibilityRole="button"
    >
      <Text style={styles.keyText}>{digit}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {ROWS.map((row) => (
        <View key={row.join("")} style={styles.row}>
          {row.map(renderKey)}
        </View>
      ))}

      {/* Row 4: empty | 0 | backspace */}
      <View style={styles.row}>
        <View style={styles.key} />

        {renderKey("0")}

        <Pressable
          style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
          onPress={onBackspacePress}
          accessibilityLabel={t("parentPinAccess.backspaceA11y")}
          accessibilityRole="button"
        >
          <Ionicons
            name="backspace-outline"
            size={28}
            color={colors.neutral[200]}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  key: {
    flex: 1,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
  },
  keyPressed: {
    opacity: 0.7,
  },
  keyText: {
    fontFamily: fonts.poppins.regular,
    fontSize: 28,
    color: colors.neutral[200],
    includeFontPadding: false,
  },
});

export default PinKeypad;
