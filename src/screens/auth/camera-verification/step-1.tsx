import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { saveIdentityPhoto } from "@/src/utils/identity-photo-storage";
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Defs, Ellipse, Mask, Rect, Svg } from "react-native-svg";

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;
const OVAL_ASPECT_RATIO = 1.55;
const OVAL_RX_RATIO = 0.3;
const CAMERA_FADE_DURATION = 1000;

const CameraVerificationStep1Screen = () => {
  const { back, push } = useRouter();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const { bottom: safeBottom } = useSafeAreaInsets();
  const cameraFeedOpacity = useSharedValue(0);
  const cameraFeedStyle = useAnimatedStyle(() => ({
    opacity: cameraFeedOpacity.value,
  }));

  const [isCameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const isTakingPhoto = useRef(false);

  const paddingHorizontal = 24;
  const frameWidth = screenWidth - paddingHorizontal * 2;
  const frameHeight = screenWidth;
  const ovalRx = frameWidth * OVAL_RX_RATIO;
  const ovalRy = ovalRx * OVAL_ASPECT_RATIO;
  const cx = frameWidth / 2;
  const cy = frameHeight / 2;

  const handleCancel = useCallback(() => {
    back();
  }, [back]);

  const handleTakePhoto = useCallback(async () => {
    if (isTakingPhoto.current || !cameraRef.current) return;
    isTakingPhoto.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo) {
        saveIdentityPhoto(photo.uri);
        push("/(auth)/camera-verification-step-2");
      }
    } finally {
      isTakingPhoto.current = false;
    }
  }, [push]);

  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
    cameraFeedOpacity.value = withTiming(1, { duration: CAMERA_FADE_DURATION });
  }, [cameraFeedOpacity]);

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth * BUHO_WIDTH_RATIO}
        height={screenWidth * BUHO_WIDTH_RATIO * BUHO_ASPECT_RATIO}
        style={styles.background}
      />
      <Animated.View
        key="camera"
        style={[styles.cameraContent, { paddingHorizontal }]}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
      >
        <View
          style={[
            styles.cameraFrame,
            {
              width: frameWidth,
              height: frameHeight,
            },
          ]}
        >
          <Text style={styles.cameraTitle}>
            {t("auth.cameraVerification.step1Title")}
          </Text>

          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              cameraFeedStyle,
              styles.cameraFeedContainer,
            ]}
          >
            <CameraView
              ref={cameraRef}
              facing="front"
              style={StyleSheet.absoluteFillObject}
              onCameraReady={handleCameraReady}
            />
            <Svg
              width={frameWidth}
              height={frameHeight}
              style={StyleSheet.absoluteFillObject}
            >
              {/* Mask: white = show overlay, black = hide overlay (oval hole) */}
              <Defs>
                <Mask
                  id="overlayMask"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={frameWidth}
                  height={frameHeight}
                >
                  <Rect
                    x="0"
                    y="0"
                    width={frameWidth}
                    height={frameHeight}
                    fill="white"
                  />
                  <Ellipse
                    cx={cx}
                    cy={cy}
                    rx={ovalRx}
                    ry={ovalRy}
                    fill="black"
                  />
                </Mask>
              </Defs>
              {/* Semi-transparent overlay with the oval hole applied */}
              <Rect
                x="0"
                y="0"
                width={frameWidth}
                height={frameHeight}
                fill="rgba(0,0,0,0.5)"
                mask="url(#overlayMask)"
              />
              {/* Oval border */}
              <Ellipse
                cx={cx}
                cy={cy}
                rx={ovalRx}
                ry={ovalRy}
                stroke={colors.accent.mainBlue}
                strokeWidth={1}
                fill="none"
              />
            </Svg>
          </Animated.View>
        </View>

        <View style={[styles.cameraFooter, { bottom: safeBottom + 40 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleTakePhoto}
            accessibilityLabel={t(
              "auth.cameraVerification.takePhotoButtonA11y",
            )}
            accessibilityRole="button"
            disabled={!isCameraReady}
            accessibilityState={{ disabled: !isCameraReady }}
          >
            <Text style={styles.primaryButtonText}>
              {t("auth.cameraVerification.takePhotoButton")}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCancel}
            accessibilityLabel={t("auth.cameraVerification.cameraCancelA11y")}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.cancelText}>
              {t("auth.cameraVerification.cancel")}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
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
  background: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  primaryButton: {
    backgroundColor: colors.accent.mainBlue,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: colors.neutral.white,
  },
  cancelButton: {
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.accent.mainBlue,
  },
  cameraContent: {
    flex: 1,
    justifyContent: "center",
  },
  cameraTitle: {
    position: "absolute",
    bottom: "100%",
    fontSize: 24,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    textAlign: "center",
    lineHeight: 29,
    marginBottom: 24,
  },
  cameraFeedContainer: {
    overflow: "hidden",
    borderRadius: 50,
  },
  cameraFrame: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.accent.mainBlue,
  },
  cameraFooter: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "center",
    gap: 16,
  },
});

export default CameraVerificationStep1Screen;
