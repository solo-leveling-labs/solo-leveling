import CloseBigIcon from "@/assets/svg/close_big.svg";
import {
  useAssignSecretObject,
  useSelectProfile,
} from "@/src/api/auth/auth.hooks";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { minDelay } from "@/src/utils/min-delay";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SECRET_OBJECT_CONFIGS,
  SECRET_OBJECT_INDICES,
} from "./constants/secret-object-configs";
const FADE_DURATION = 250;

const GRID_FRAME_SIZE = 145;
const GRID_ICON_SIZE = 124;
const ENLARGED_FRAME_SIZE = 210;
const ENLARGED_ICON_SIZE = 180;

const OPEN_SPRING = { damping: 18, stiffness: 260, mass: 0.8 } as const;
const CLOSE_SPRING = { damping: 22, stiffness: 300 } as const;

interface ObjectFrameProps {
  index: number;
  size: "grid" | "enlarged";
}

const ObjectFrame = ({ index, size }: ObjectFrameProps) => {
  const config = SECRET_OBJECT_CONFIGS[index];
  if (!config) return null;

  const { SvgComponent, frameColor } = config;
  const isEnlarged = size === "enlarged";
  const frameSize = isEnlarged ? ENLARGED_FRAME_SIZE : GRID_FRAME_SIZE;
  const iconSize = isEnlarged ? ENLARGED_ICON_SIZE : GRID_ICON_SIZE;

  return (
    <View
      style={[styles.frameShadow, isEnlarged && styles.frameShadowEnlarged]}
    >
      <View
        style={[
          styles.frameInner,
          { borderColor: frameColor, width: frameSize, height: frameSize },
        ]}
      >
        <SvgComponent width={iconSize} height={iconSize} />
      </View>
    </View>
  );
};

type ScreenMode = "setup" | "login";

const SelectSecretObjectScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { back } = router;
  const rootNavigation = useNavigation().getParent();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { childId, mode = "setup" } = useLocalSearchParams<{
    childId: string;
    mode?: ScreenMode;
  }>();

  const { mutate: selectProfile } = useSelectProfile();
  const { mutate: assignSecretObject } = useAssignSecretObject();

  const [confirmState, setConfirmState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const isConfirmBusy = confirmState !== "idle";

  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0);

  const openOverlay = useCallback(
    (index: number) => {
      cancelAnimation(cardScale);
      cancelAnimation(overlayOpacity);

      setOverlayIndex(index);
      setVisibleIndex(index);
      cardScale.value = 0;
      overlayOpacity.value = withTiming(1, { duration: FADE_DURATION });
      cardScale.value = withSpring(1, OPEN_SPRING);
    },
    [overlayOpacity, cardScale],
  );

  const closeOverlay = useCallback(() => {
    setOverlayIndex(null);

    overlayOpacity.value = withTiming(0, { duration: FADE_DURATION });
    cardScale.value = withSpring(0, CLOSE_SPRING, (finished) => {
      if (finished) {
        runOnJS(setVisibleIndex)(null);
      }
    });
  }, [overlayOpacity, cardScale]);

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const handleConfirm = useCallback(() => {
    if (visibleIndex === null || isConfirmBusy) return;

    setConfirmState("loading");

    const onSuccess = () => {
      setConfirmState("success");

      if (mode === "login") {
        minDelay().then(() => {
          rootNavigation?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "(tabs-child)" }],
            }),
          );
        });
      } else {
        minDelay().then(() => {
          router.push({
            pathname: "/(select-profile)/secret-object-confirmation",
            params: { objectId: String(visibleIndex) },
          });
        });
      }
    };

    const onError = () => {
      setConfirmState("error");
      setTimeout(() => setConfirmState("idle"), 1200);
    };

    if (mode === "login") {
      selectProfile(
        { userId: Number(childId), secretObjectId: visibleIndex },
        { onSuccess, onError },
      );
    } else {
      assignSecretObject(
        { userId: Number(childId), objectId: visibleIndex },
        { onSuccess, onError },
      );
    }
  }, [
    mode,
    visibleIndex,
    childId,
    isConfirmBusy,
    selectProfile,
    assignSecretObject,
    rootNavigation,
    router,
  ]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: safeTop + 16, paddingBottom: safeBottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={ACTIVE_OPACITY}
          onPress={handleBack}
          accessibilityLabel={t("selectSecretObject.backA11y")}
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={colors.accent.mainBlue}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          {t(
            mode === "login"
              ? "selectSecretObject.loginTitle"
              : "selectSecretObject.setupTitle",
          )}
        </Text>

        <View style={styles.cardGrid}>
          {SECRET_OBJECT_INDICES.map((index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridCard}
              activeOpacity={ACTIVE_OPACITY}
              onPress={() => openOverlay(index)}
              accessibilityLabel={t("selectSecretObject.cardA11y", { index })}
              accessibilityRole="button"
            >
              <ObjectFrame index={index} size="grid" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {visibleIndex !== null && (
        <Animated.View
          style={[StyleSheet.absoluteFill, overlayAnimatedStyle]}
          pointerEvents={overlayIndex !== null ? "box-none" : "none"}
        >
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, styles.backdrop]}
            activeOpacity={1}
            onPress={closeOverlay}
            accessibilityLabel={t("selectSecretObject.backA11y")}
            accessibilityRole="button"
          />

          <View style={styles.modalContainer} pointerEvents="box-none">
            <View style={styles.closeRow}>
              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={ACTIVE_OPACITY}
                onPress={closeOverlay}
                accessibilityLabel={t("selectSecretObject.backA11y")}
                accessibilityRole="button"
              >
                <CloseBigIcon width={56} height={56} />
              </TouchableOpacity>
            </View>

            <Animated.View style={[styles.modalCard, modalCardAnimatedStyle]}>
              <ObjectFrame index={visibleIndex} size="enlarged" />
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                confirmState === "error" && styles.confirmButtonError,
              ]}
              activeOpacity={ACTIVE_OPACITY}
              onPress={handleConfirm}
              disabled={isConfirmBusy}
              accessibilityLabel={t("selectSecretObject.confirmA11y")}
              accessibilityRole="button"
            >
              {confirmState === "loading" && (
                <ActivityIndicator
                  color={colors.neutral.white}
                  size="small"
                  style={styles.confirmOverlay}
                />
              )}
              {confirmState === "success" && (
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={colors.neutral.white}
                  style={styles.confirmOverlay}
                />
              )}
              {confirmState === "error" && (
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.neutral.white}
                  style={styles.confirmOverlay}
                />
              )}
              <Text
                style={[
                  styles.confirmButtonText,
                  isConfirmBusy && styles.confirmButtonTextHidden,
                ]}
              >
                {t(
                  mode === "login"
                    ? "selectSecretObject.loginConfirm"
                    : "selectSecretObject.setupConfirm",
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 10,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    textAlign: "center",
    includeFontPadding: false,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    marginTop: 32,
    flex: 1,
  },
  gridCard: {
    alignItems: "center",
  },
  frameShadow: {
    borderRadius: 12,
    backgroundColor: colors.accent.lightBackground,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  frameShadowEnlarged: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  frameInner: {
    borderRadius: 12,
    borderWidth: 11,
    backgroundColor: colors.accent.lightBackground,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: 327,
    alignSelf: "center",
  },
  closeRow: {
    width: "100%",
    alignItems: "flex-end",
  },
  closeButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 100,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  confirmButtonError: {
    backgroundColor: colors.error,
  },
  confirmOverlay: {
    position: "absolute",
  },
  confirmButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.neutral.white,
  },
  confirmButtonTextHidden: {
    opacity: 0,
  },
});

export default SelectSecretObjectScreen;
