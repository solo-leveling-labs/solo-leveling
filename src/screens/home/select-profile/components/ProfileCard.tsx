import SelectProfileIcon1 from "@/assets/svg/select-profile-icon-1.svg";
import SelectProfileIcon2 from "@/assets/svg/select-profile-icon-2.svg";
import SelectProfileIcon3 from "@/assets/svg/select-profile-icon-3.svg";
import SelectProfileIcon4 from "@/assets/svg/select-profile-icon-4.svg";
import SelectProfileIcon5 from "@/assets/svg/select-profile-icon-5.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

const AVATAR_CONFIGS: Record<
  1 | 2 | 3 | 4 | 5,
  { SvgComponent: ComponentType<SvgProps>; frameColor: string }
> = {
  1: { SvgComponent: SelectProfileIcon1, frameColor: colors.deco.decoYellow },
  2: { SvgComponent: SelectProfileIcon2, frameColor: colors.deco.decoGreen },
  3: { SvgComponent: SelectProfileIcon3, frameColor: colors.deco.decoBlue },
  4: { SvgComponent: SelectProfileIcon4, frameColor: colors.deco.decoViolet },
  5: { SvgComponent: SelectProfileIcon5, frameColor: colors.accent.skyblue },
};

interface ProfileCardProps {
  id: string;
  name: string;
  avatarIndex: number;
  onPress: (id: string) => void;
}

const ProfileCard = ({ id, name, avatarIndex, onPress }: ProfileCardProps) => {
  const { t } = useTranslation();
  const configIndex = ((((avatarIndex - 1) % 5) + 5) % 5 + 1) as 1 | 2 | 3 | 4 | 5;
  const { SvgComponent, frameColor } = AVATAR_CONFIGS[configIndex];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={() => onPress(id)}
      accessibilityLabel={t("selectProfile.profileCardA11y", { name })}
      accessibilityRole="button"
    >
      <View style={[styles.frame, { borderColor: frameColor }]}>
        <SvgComponent width={110} height={110} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  containerPressed: {
    opacity: 0.8,
  },
  frame: {
    width: 128,
    height: 128,
    borderRadius: 12,
    borderWidth: 11,
    backgroundColor: colors.accent.lightBackground,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.neutral.black,
    textAlign: "center",
  },
});

export default ProfileCard;
