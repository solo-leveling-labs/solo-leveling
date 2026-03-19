import ChildWelcomeDecoBottom from "@/assets/svg/child-welcome-deco-bottom.svg";
import ChildWelcomeDecoTop from "@/assets/svg/child-welcome-deco-top.svg";
import PinKeypad from "@/src/components/PinKeypad";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PIN_LENGTH = 4;

const DECO_OVERFLOW = 40;

const ParentAccessScreen = () => {
  const { back } = useRouter();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const [pin, setPin] = useState<string[]>([]);

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (pin.length >= PIN_LENGTH) return;

      const nextPin = [...pin, digit];
      setPin(nextPin);

      if (nextPin.length === PIN_LENGTH) {
        const pinString = nextPin.join("");

        // TODO: replace stub with POST /auth/select-profile once API is wired
        console.log("[ParentAccess] PIN entered:", pinString);
        Alert.alert("PIN ingresado", `PIN ingresado: ${pinString}`, [
          {
            text: "OK",
            onPress: () => setPin([]),
          },
        ]);
      }
    },
    [pin],
  );

  const handleBackspacePress = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  return (
    <View style={styles.container}>
      <ChildWelcomeDecoTop width={100} height={166} style={styles.decoTop} />
      <ChildWelcomeDecoBottom
        width={100}
        height={166}
        style={styles.decoBottom}
      />

      <View
        style={[
          styles.content,
          { paddingTop: safeTop + 16, paddingBottom: safeBottom + 24 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={back}
          activeOpacity={ACTIVE_OPACITY}
          accessibilityLabel="Volver"
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={colors.accent.mainBlue}
          />
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <Text style={styles.greeting}>¡Hola!</Text>
          <Text style={styles.subtitle}>
            Te damos la bienvenida al acceso para padres.
          </Text>
        </View>

        <View style={styles.pinSection}>
          <Text style={styles.instruction}>
            Ingresá el PIN para gestionar los perfiles y alertas.
          </Text>

          <View style={styles.dotsRow}>
            {Array.from({ length: PIN_LENGTH }).map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index < pin.length && styles.dotFilled]}
              >
                {index < pin.length && <View style={styles.dotInner} />}
              </View>
            ))}
          </View>

          <Text style={styles.forgotPin}>Olvidé mi clave</Text>
        </View>

        <View style={styles.keypadWrapper}>
          <PinKeypad
            onDigitPress={handleDigitPress}
            onBackspacePress={handleBackspacePress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  decoTop: {
    position: "absolute",
    top: -DECO_OVERFLOW,
    right: -DECO_OVERFLOW,
  },
  decoBottom: {
    position: "absolute",
    bottom: -DECO_OVERFLOW,
    left: -DECO_OVERFLOW,
    transform: [{ rotate: "180deg" }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 10,
    alignSelf: "flex-start",
    marginBottom: 32,
  },
  titleSection: {
    gap: 8,
    marginBottom: 40,
  },
  greeting: {
    fontFamily: fonts.raleway.extraBold,
    fontSize: 48,
    color: colors.accent.mainBlue,
    letterSpacing: -0.96,
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: fonts.raleway.semiBold,
    fontSize: 20,
    color: colors.accent.mainBlue,
    lineHeight: 28,
  },
  pinSection: {
    alignItems: "center",
    gap: 24,
    marginBottom: 32,
  },
  instruction: {
    fontFamily: fonts.poppins.regular,
    fontSize: 16,
    color: colors.neutral.black,
    textAlign: "center",
    lineHeight: 22.4,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 16,
  },
  dot: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    borderColor: colors.neutral.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  dotFilled: {
    borderColor: colors.accent.mainBlue,
  },
  dotInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.deco.decoGreen,
  },
  forgotPin: {
    fontFamily: fonts.poppins.regular,
    fontSize: 12,
    color: colors.neutral[300],
    textAlign: "center",
  },
  keypadWrapper: {
    marginTop: "auto",
  },
});

export default ParentAccessScreen;
