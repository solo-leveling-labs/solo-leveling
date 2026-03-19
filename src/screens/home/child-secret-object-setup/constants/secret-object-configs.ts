import SecretObjectIcon1 from "@/assets/svg/secret-object-icon-1.svg";
import SecretObjectIcon2 from "@/assets/svg/secret-object-icon-2.svg";
import SecretObjectIcon3 from "@/assets/svg/secret-object-icon-3.svg";
import SecretObjectIcon4 from "@/assets/svg/secret-object-icon-4.svg";
import SecretObjectIcon5 from "@/assets/svg/secret-object-icon-5.svg";
import SecretObjectIcon6 from "@/assets/svg/secret-object-icon-6.svg";
import SecretObjectIcon7 from "@/assets/svg/secret-object-icon-7.svg";
import SecretObjectIcon8 from "@/assets/svg/secret-object-icon-8.svg";
import { colors } from "@/src/theme/colors";
import { ComponentType } from "react";
import { SvgProps } from "react-native-svg";

export interface SecretObjectConfig {
  SvgComponent: ComponentType<SvgProps>;
  frameColor: string;
}

export const SECRET_OBJECT_CONFIGS: Record<number, SecretObjectConfig> = {
  1: { SvgComponent: SecretObjectIcon1, frameColor: colors.deco.decoViolet },
  2: { SvgComponent: SecretObjectIcon2, frameColor: colors.deco.decoBlue },
  3: { SvgComponent: SecretObjectIcon3, frameColor: colors.deco.decoGreen },
  4: { SvgComponent: SecretObjectIcon4, frameColor: colors.deco.decoGreen },
  5: { SvgComponent: SecretObjectIcon5, frameColor: colors.deco.decoYellow },
  6: { SvgComponent: SecretObjectIcon6, frameColor: colors.deco.decoBlue },
  7: { SvgComponent: SecretObjectIcon7, frameColor: colors.deco.decoYellow },
  8: { SvgComponent: SecretObjectIcon8, frameColor: colors.deco.decoViolet },
};

export const SECRET_OBJECT_INDICES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
