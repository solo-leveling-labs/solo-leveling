import AddProfileIconFrame from "@/assets/svg/add-profile-icon-frame.svg";
import BuhoOjo from "@/assets/svg/Buho-ojo.svg";
import SelectProfileBackground from "@/assets/svg/select-profile-background.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileCard from "./components/ProfileCard";

const BACKGROUND_ASPECT_RATIO = 32 / 375;

interface ChildProfile {
  id: string;
  name: string;
  avatarIndex: number;
}

const SelectProfileScreen = () => {
  const { t } = useTranslation();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { push } = useRouter();
  const { childName } = useLocalSearchParams<{ childName: string }>();

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const cardWidth = (screenWidth - 48 - 16) / 2;

  const profiles: ChildProfile[] = childName
    ? [{ id: "1", name: childName, avatarIndex: 1 }]
    : [];

  const handleProfilePress = useCallback(
    (id: string) => {
      const profile = profiles.find((p) => p.id === id);
      if (!profile) return;
      push({
        pathname: "/(child-secret-object-setup)/child-welcome",
        params: {
          childId: id, // TODO: Get childId from back
          childName: profile.name,
          avatarIndex: String(profile.avatarIndex),
        },
      });
    },
    [push, profiles],
  );

  const handleAddProfile = useCallback(() => {
    push({
      pathname: "/(first-profile-setup)/create-profile",
      params: { source: "select-profile" },
    });
  }, [push]);

  const handleParentAccess = useCallback(() => {
    // TODO: Navigate to confirm parent PIN screen
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: safeTop + 48 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.title}>{t("selectProfile.title")}</Text>

        <View style={styles.profileGrid}>
          {profiles.map((profile) => (
            <View
              key={profile.id}
              style={[styles.profileCardWrapper, { width: cardWidth }]}
            >
              <ProfileCard
                id={profile.id}
                name={profile.name}
                avatarIndex={profile.avatarIndex}
                onPress={handleProfilePress}
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
              {/* TODO: Replace with correct SVG */}
              <AddProfileIconFrame width={128} height={128} />
              <Text style={styles.addProfileText}>
                {t("selectProfile.addProfile")}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: safeBottom + 40 }]}>
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

        <SelectProfileBackground
          width={screenWidth}
          height={screenWidth * BACKGROUND_ASPECT_RATIO}
          style={styles.background}
        />
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
    fontSize: 40,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    textAlign: "center",
    includeFontPadding: false,
  },
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginVertical: 56,
    flex: 1,
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
  footer: {
    paddingHorizontal: 16,
    marginTop: 24,
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
    left: 0,
  },
  parentButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.neutral.white,
  },
  background: {
    alignSelf: "center",
  },
});

export default SelectProfileScreen;
