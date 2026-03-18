import AddProfileIconFrame from "@/assets/svg/add-profile-icon-frame.svg";
import BuhoOjo from "@/assets/svg/Buho-ojo.svg";
import SelectProfileBackground from "@/assets/svg/select-profile-background.svg";
import { useGetUsers } from "@/src/api/users/users.hooks";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { minDelay } from "@/src/utils/min-delay";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
const AVATAR_COUNT = 5;

const SelectProfileScreen = () => {
  const { t } = useTranslation();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { push } = useRouter();
  const { data: usersResponse, isLoading: isFetching } = useGetUsers();
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    minDelay().then(() => setMinDelayDone(true));
  }, []);

  const isLoading = isFetching || !minDelayDone;

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

  const childProfiles = useMemo(() => {
    if (!usersResponse?.data) return [];
    return usersResponse.data
      .filter((user) => user.role === "CHILD")
      .map((user, index) => ({
        id: String(user.id),
        name: user.fullName,
        avatarIndex: (index % AVATAR_COUNT) + 1,
        hasSecretObject: user.hasSecretObject,
      }));
  }, [usersResponse]);

  const handleProfilePress = useCallback(
    (id: string) => {
      const profile = childProfiles.find((p) => p.id === id);
      if (!profile) return;
      push({
        pathname: "/(child-secret-object-setup)/child-welcome",
        params: {
          childId: id,
          childName: profile.name,
          avatarIndex: String(profile.avatarIndex),
        },
      });
    },
    [push, childProfiles],
  );

  const handleAddProfile = useCallback(() => {
    push({
      pathname: "/(first-profile-setup)/create-profile",
      params: { source: "select-profile" },
    });
  }, [push]);

  const handleParentAccess = useCallback(() => {
    push("/(select-profile)/parent-access");
  }, [push]);

  const backgroundHeight = screenWidth * BACKGROUND_ASPECT_RATIO;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: safeTop + 96,
            paddingBottom: backgroundHeight + 56 + 20 + safeBottom + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("selectProfile.title")}</Text>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.accent.mainBlue} />
          </View>
        ) : (
          <View style={styles.profileGrid}>
            {childProfiles.map((profile) => (
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
                <AddProfileIconFrame width={128} height={128} />
                <Text style={styles.addProfileText}>
                  {t("selectProfile.addProfile")}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.fixedBottom} pointerEvents="box-none">
        <View style={styles.footer}>
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
          height={backgroundHeight}
        />
      </View>
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
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addProfileCard: {
    alignItems: "center",
    gap: 16,
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
  fixedBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    paddingTop: 24,
    width: "100%",
    backgroundColor: colors.accent.lightBackground,
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
    fontFamily: fonts.raleway.bold,
    fontSize: 20,
    lineHeight: 24,
    color: colors.neutral.white,
  },
});

export default SelectProfileScreen;
