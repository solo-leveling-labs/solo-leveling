import { colors } from "@/src/theme/colors";
import React, { useEffect } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  value: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  padding?: number;
  activeColor?: string;
  inactiveColor?: string;
  activeThumbColor?: string;
  thumbColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export const Switch = ({
  value,
  onValueChange,
  disabled = false,
  width = 51,
  height = 31,
  padding = 2,
  activeColor = "rgba(25, 118, 210, 0.2)",
  inactiveColor = "rgba(0, 0, 0, 0.38)",
  activeThumbColor = "#1976D2",
  thumbColor = colors.neutral.white,
  accessibilityLabel,
  style,
}: Props) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, progress]);

  const trackRadius = height / 2;
  const thumbSize = height - padding * 2;
  const translateXMax = width - padding * 2 - thumbSize;

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor],
    );

    const opacity = disabled ? 0.55 : 1;

    return {
      backgroundColor,
      opacity,
    };
  }, [activeColor, inactiveColor, disabled]);

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [thumbColor, activeThumbColor],
    );
    return {
      transform: [{ translateX: progress.value * translateXMax }],
      backgroundColor,
    };
  }, [translateXMax, thumbColor, activeThumbColor]);

  const onPress = () => {
    if (disabled) return;
    onValueChange?.(!value);
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      style={style}
    >
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: trackRadius,
            padding,
            justifyContent: "center",
          },
          trackAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              shadowColor: colors.neutral.black,
              shadowOpacity: 0.15,
              shadowRadius: 2.5,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};
