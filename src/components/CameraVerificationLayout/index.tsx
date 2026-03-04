import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import {
  PhotoStep,
  saveIdentityPhoto,
} from "@/src/utils/identity-photo-storage";
import { CameraView } from "expo-camera";
import type { ParseKeys } from "i18next";
import { useCallback, useRef, useState } from "react";
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

const BUHO_ASPECT_RATIO = 134 / 375;
const BUHO_WIDTH_RATIO = 1;
const OVAL_ASPECT_RATIO = 1.55;
const OVAL_RX_RATIO = 0.3;
const CAMERA_FADE_DURATION = 1000;
const OVERLAY_BORDER_WIDTH = 1000;

interface CameraVerificationLayoutProps {
  titleKey: ParseKeys;
  photoStep: PhotoStep;
  onPhotoTaken: () => void;
  onCancel: () => void;
}

const CameraVerificationLayout = ({
  titleKey,
  photoStep,
  onPhotoTaken,
  onCancel,
}: CameraVerificationLayoutProps) => {
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

  const handleTakePhoto = useCallback(async () => {
    if (isTakingPhoto.current || !cameraRef.current) return;
    isTakingPhoto.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo) {
        saveIdentityPhoto(photoStep, photo.uri);
        onPhotoTaken();
      }
    } finally {
      isTakingPhoto.current = false;
    }
  }, [photoStep, onPhotoTaken]);

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
          <Text style={styles.cameraTitle} accessibilityRole="header">
            {t(titleKey)}
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
            <View style={styles.overlayContainer} pointerEvents="none">
              <View style={{ transform: [{ scaleY: OVAL_ASPECT_RATIO }] }}>
                <View
                  style={[
                    styles.ovalOverlay,
                    {
                      width: ovalRx * 2 + OVERLAY_BORDER_WIDTH * 2,
                      height: ovalRx * 2 + OVERLAY_BORDER_WIDTH * 2,
                      borderRadius: ovalRx + OVERLAY_BORDER_WIDTH,
                    },
                  ]}
                />
              </View>
            </View>
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
            onPress={onCancel}
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
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  ovalOverlay: {
    borderWidth: OVERLAY_BORDER_WIDTH,
    borderColor: colors.deco.overlay,
  },
  cameraFrame: {
    borderRadius: 51,
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

export default CameraVerificationLayout;
