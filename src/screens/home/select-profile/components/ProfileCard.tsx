import { getAvatarConfig } from "@/src/constants/avatar-configs";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
  id: string;
  name: string;
  avatarIndex: number;
  onPress: (id: string) => void;
}

const ProfileCard = ({ id, name, avatarIndex, onPress }: ProfileCardProps) => {
  const { t } = useTranslation();
  const { SvgComponent, frameColor } = getAvatarConfig(avatarIndex);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={ACTIVE_OPACITY}
      accessibilityLabel={t("selectProfile.profileCardA11y", { name })}
      accessibilityRole="button"
    >
      <View style={[styles.frame, { borderColor: frameColor }]}>
        <SvgComponent width={110} height={110} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
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
