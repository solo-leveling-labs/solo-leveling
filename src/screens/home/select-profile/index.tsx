import AddProfileIconFrame from "@/assets/svg/add-profile-icon-frame.svg";
import BuhoOjo from "@/assets/svg/Buho-ojo.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileCard } from "./components/ProfileCard";

interface ChildProfile {
  id: string;
  name: string;
  avatarIndex: 1 | 2 | 3 | 4 | 5;
}

const SelectProfileScreen = () => {
  const { t } = useTranslation();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const { childName } = useLocalSearchParams<{ childName: string }>();

  const cardWidth = (screenWidth - 48 - 16) / 2;

  // Mock data — will be replaced with real data from backend
  const profiles: ChildProfile[] = childName
    ? [{ id: "1", name: childName, avatarIndex: 1 }]
    : [];

  const handleProfilePress = useCallback((id: string) => {
    // TODO: Set active profile and navigate to tabs
  }, []);

  const handleAddProfile = useCallback(() => {
    router.push("/(first-profile-setup)/create-profile");
  }, [router]);

  const handleParentAccess = useCallback(() => {
    // TODO: Navigate to parent PIN entry
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: safeTop + 80,
            paddingBottom: safeBottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("selectProfile.title")}</Text>

        <View style={styles.profileGrid}>
          {profiles.map((profile) => (
            <View
              key={profile.id}
              style={[styles.profileCardWrapper, { width: cardWidth }]}
            >
              <ProfileCard
                name={profile.name}
                avatarIndex={profile.avatarIndex}
                onPress={() => handleProfilePress(profile.id)}
              />
            </View>
          ))}

          <View style={[styles.profileCardWrapper, { width: cardWidth }]}>
            <Pressable
              style={({ pressed }) => [
                styles.addProfileCard,
                pressed && styles.addProfileCardPressed,
              ]}
              onPress={handleAddProfile}
              accessibilityLabel={t("selectProfile.addProfileA11y")}
              accessibilityRole="button"
            >
              <AddProfileIconFrame width={128} height={128} />
              <Text style={styles.addProfileText}>
                {t("selectProfile.addProfile")}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.parentButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.parentButton,
              pressed && styles.parentButtonPressed,
            ]}
            onPress={handleParentAccess}
            accessibilityLabel={t("selectProfile.parentAccessA11y")}
            accessibilityRole="button"
          >
            <View style={styles.parentButtonDecoration}>
              <BuhoOjo width={85} height={56} />
            </View>
            <Text style={styles.parentButtonText}>
              {t("selectProfile.parentAccess")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 48,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    letterSpacing: -0.96,
  },
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 56,
  },
  profileCardWrapper: {
    alignItems: "center",
  },
  addProfileCard: {
    alignItems: "center",
    gap: 8,
  },
  addProfileCardPressed: {
    opacity: 0.8,
  },
  addProfileText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.neutral.black,
    textAlign: "center",
  },
  parentButtonContainer: {
    marginTop: 56,
    paddingHorizontal: 16,
  },
  parentButton: {
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  parentButtonPressed: {
    opacity: 0.8,
  },
  parentButtonDecoration: {
    position: "absolute",
    left: -7,
  },
  parentButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.neutral.white,
  },
});

export default SelectProfileScreen;
