import SecretObjectIcon1 from "@/assets/svg/secret-object-icon-1.svg";
import SecretObjectIcon2 from "@/assets/svg/secret-object-icon-2.svg";
import SecretObjectIcon3 from "@/assets/svg/secret-object-icon-3.svg";
import SecretObjectIcon4 from "@/assets/svg/secret-object-icon-4.svg";
import SecretObjectIcon5 from "@/assets/svg/secret-object-icon-5.svg";
import SecretObjectIcon6 from "@/assets/svg/secret-object-icon-6.svg";
import SecretObjectIcon7 from "@/assets/svg/secret-object-icon-7.svg";
import SecretObjectIcon8 from "@/assets/svg/secret-object-icon-8.svg";
import { colors } from "@/src/theme/colors";
import { ComponentType, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

const SECRET_OBJECT_CONFIGS: Record<
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  { SvgComponent: ComponentType<SvgProps>; frameColor: string }
> = {
  1: { SvgComponent: SecretObjectIcon1, frameColor: colors.deco.decoYellow },
  2: { SvgComponent: SecretObjectIcon2, frameColor: colors.deco.decoViolet },
  3: { SvgComponent: SecretObjectIcon3, frameColor: colors.deco.decoBlue },
  4: { SvgComponent: SecretObjectIcon4, frameColor: colors.deco.decoViolet },
  5: { SvgComponent: SecretObjectIcon5, frameColor: colors.deco.decoGreen },
  6: { SvgComponent: SecretObjectIcon6, frameColor: colors.deco.decoYellow },
  7: { SvgComponent: SecretObjectIcon7, frameColor: colors.deco.decoViolet },
  8: { SvgComponent: SecretObjectIcon8, frameColor: colors.deco.decoBlue },
};

interface SecretObjectCardProps {
  index: number;
  isSelected: boolean;
  isDimmed: boolean;
  onPress: (index: number) => void;
}

const SecretObjectCard = ({
  index,
  isSelected,
  isDimmed,
  onPress,
}: SecretObjectCardProps) => {
  const { t } = useTranslation();
  const configIndex = index as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  const { SvgComponent, frameColor } = SECRET_OBJECT_CONFIGS[configIndex];

  const scaleValue = useSharedValue(1);

  useEffect(() => {
    scaleValue.value = withTiming(isSelected ? 1.08 : 1, {
      duration: 300,
    });
  }, [scaleValue, isSelected]);

  const cardStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scaleValue.value }],
    }),
    [],
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
        isDimmed && styles.containerDimmed,
      ]}
      onPress={() => onPress(index)}
      accessibilityLabel={t("selectSecretObject.cardA11y", { index })}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Animated.View style={cardStyle}>
        <View
          style={[styles.frameShadow, isSelected && styles.frameShadowSelected]}
        >
          <View style={[styles.frameInner, { borderColor: frameColor }]}>
            <SvgComponent width={124} height={124} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  containerPressed: {
    opacity: 0.8,
  },
  containerDimmed: {
    opacity: 0.5,
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
  frameShadowSelected: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  frameInner: {
    width: 145,
    height: 145,
    borderRadius: 12,
    borderWidth: 11,
    backgroundColor: colors.accent.lightBackground,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SecretObjectCard;
