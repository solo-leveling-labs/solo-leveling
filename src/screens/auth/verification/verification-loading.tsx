import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { useValidateIdentity } from "@/src/api/auth/auth.hooks";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { getIdentityPhotoUri } from "@/src/utils/identity-photo-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;

const VerificationLoadingScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { top: safeTop } = useSafeAreaInsets();
  const { replace } = useRouter();
  const progress = useSharedValue(0);
  const { mutate: validateIdentity } = useValidateIdentity();

  const completeAndNavigate = useCallback(
    (destination: "/verification-success" | "/verification-error") => {
      progress.value = withTiming(
        1,
        { duration: 400, easing: Easing.out(Easing.cubic) },
        () => runOnJS(replace)(destination),
      );
    },
    [progress, replace],
  );

  // Start API call on mount
  useEffect(() => {
    const frontalImageUri = getIdentityPhotoUri("step1");
    const rightProfileImageUri = getIdentityPhotoUri("step2");
    const leftProfileImageUri = getIdentityPhotoUri("step3");

    if (!frontalImageUri || !rightProfileImageUri || !leftProfileImageUri) {
      replace("/verification-error");
      return;
    }

    validateIdentity(
      { frontalImageUri, rightProfileImageUri, leftProfileImageUri },
      {
        onSuccess: () => completeAndNavigate("/verification-success"),
        onError: () => completeAndNavigate("/verification-error"),
      },
    );
  }, []);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(0.45, { duration: 2000, easing: Easing.out(Easing.cubic) }),
      withTiming(0.72, { duration: 1000, easing: Easing.out(Easing.sin) }),
      withTiming(0.88, { duration: 10000, easing: Easing.out(Easing.sin) }),
    );
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.buho}
      />
      <View style={[styles.content, { paddingTop: safeTop + 80 }]}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Aguarda un momento...</Text>
          <Text style={styles.subtitle}>
            Estamos validando tu identidad, esto puede tomar un momento...
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
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
    paddingHorizontal: 24,
    gap: 56,
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
  progressTrack: {
    height: 8,
    borderRadius: 20,
    backgroundColor: "rgba(25, 118, 210, 0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: colors.deco.decoGreen,
  },
});

export default VerificationLoadingScreen;
