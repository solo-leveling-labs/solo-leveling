import SelectProfileIcon1 from "@/assets/svg/select-profile-icon-1.svg";
import SelectProfileIcon2 from "@/assets/svg/select-profile-icon-2.svg";
import SelectProfileIcon3 from "@/assets/svg/select-profile-icon-3.svg";
import SelectProfileIcon4 from "@/assets/svg/select-profile-icon-4.svg";
import SelectProfileIcon5 from "@/assets/svg/select-profile-icon-5.svg";
import { colors } from "@/src/theme/colors";
import { ComponentType } from "react";
import { SvgProps } from "react-native-svg";

interface AvatarConfig {
  SvgComponent: ComponentType<SvgProps>;
  frameColor: string;
}

const AVATAR_CONFIGS: Record<1 | 2 | 3 | 4 | 5, AvatarConfig> = {
  1: { SvgComponent: SelectProfileIcon1, frameColor: colors.deco.decoYellow },
  2: { SvgComponent: SelectProfileIcon2, frameColor: colors.deco.decoGreen },
  3: { SvgComponent: SelectProfileIcon3, frameColor: colors.deco.decoBlue },
  4: { SvgComponent: SelectProfileIcon4, frameColor: colors.deco.decoViolet },
  5: { SvgComponent: SelectProfileIcon5, frameColor: colors.accent.skyblue },
};

export const getAvatarConfig = (avatarIndex: number): AvatarConfig => {
  const index = (avatarIndex >= 1 && avatarIndex <= 5 ? avatarIndex : 1) as
    | 1
    | 2
    | 3
    | 4
    | 5;
  return AVATAR_CONFIGS[index];
};
