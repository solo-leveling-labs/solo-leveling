import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import React, { useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;

const VerificationSuccessScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const setIdentityVerified = useAuthStore(
    (state) => state.setIdentityVerified,
  );

  const handleContinue = useCallback(() => {
    setIdentityVerified(true);
  }, [setIdentityVerified]);

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.buho}
      />
      <View
        style={[
          styles.content,
          { paddingTop: safeTop + 80, paddingBottom: safeBottom + 56 },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>¡Perfecto!</Text>
          <Text style={styles.subtitle}>
            Identidad validada correctamente, ya podés empezar a configurar los
            controles parentales.
          </Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleContinue}
            accessibilityLabel="Continuar con la configuración"
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </Pressable>
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
  decorations: {
    position: "absolute",
    top: 0,
    right: -10,
  },
  buho: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  textContainer: {
    gap: 8,
  },
  title: {
    fontSize: 48,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    lineHeight: 57.6,
    letterSpacing: -0.96,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.accent.mainBlue,
    lineHeight: 22.4,
  },
  footer: {
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 70,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.neutral.disabled,
    shadowColor: colors.neutral.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
    lineHeight: 22.4,
  },
});

export default VerificationSuccessScreen;
