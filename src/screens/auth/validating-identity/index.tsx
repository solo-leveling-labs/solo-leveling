import IdentityResultLayout from "@/src/components/IdentityResultLayout";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const PROGRESS_DURATION = 4000;

const ValidatingIdentityScreen = () => {
  const { t } = useTranslation();
  const { replace } = useRouter();

  const progress = useSharedValue(0);
  const trackWidth = useSharedValue(0);

  const progressFillStyle = useAnimatedStyle(() => ({
    width: progress.value * trackWidth.value,
  }));

  const handleValidationComplete = useCallback(() => {
    replace("/identity-validated");
  }, [replace]);

  useEffect(() => {
    progress.value = withDelay(
      300,
      withTiming(
        1,
        {
          duration: PROGRESS_DURATION,
          easing: Easing.out(Easing.exp),
        },
        (finished) => {
          "worklet";
          if (finished) {
            scheduleOnRN(handleValidationComplete);
          }
        },
      ),
    );
  }, [progress, handleValidationComplete]);

  return (
    <IdentityResultLayout
      titleKey="auth.validatingIdentity.title"
      subtitleKey="auth.validatingIdentity.subtitle"
      titleA11yKey="auth.validatingIdentity.titleA11y"
    >
      <View style={styles.progressWrapper}>
        <View
          style={styles.progressTrack}
          onLayout={(e) => {
            trackWidth.value = e.nativeEvent.layout.width;
          }}
          accessibilityLabel={t("auth.validatingIdentity.progressBarA11y")}
          accessibilityRole="progressbar"
        >
          <Animated.View style={[styles.progressFill, progressFillStyle]} />
        </View>
      </View>
    </IdentityResultLayout>
  );
};

const styles = StyleSheet.create({
  progressWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 56,
  },
  progressTrack: {
    height: 8,
    borderRadius: 20,
    backgroundColor: colors.deco.progressTrack,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: colors.deco.decoGreen,
  },
});

export default ValidatingIdentityScreen;
