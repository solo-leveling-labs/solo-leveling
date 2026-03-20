import AddProfileIconFrame from "@/assets/svg/add-profile-icon-frame.svg";
import BuhoOjo from "@/assets/svg/Buho-ojo.svg";
import SelectProfileBackground from "@/assets/svg/select-profile-background.svg";
import { useGetUsers } from "@/src/api/users/users.hooks";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import { minDelay } from "@/src/utils/min-delay";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const { data: usersResponse, isLoading: isFetching, refetch } = useGetUsers();
  const userRole = useAuthStore((state) => state.user?.role);
  const isParent = userRole === "PARENT" || !userRole;
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    minDelay().then(() => setMinDelayDone(true));
  }, []);

  const isLoading = isFetching || !minDelayDone;

  useFocusEffect(
    useCallback(() => {
      refetch();

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, [refetch]),
  );

  const cardWidth = (screenWidth - 48 - 16) / 2;

  const parentUserId = (() => {
    const parent = usersResponse?.data?.find((user) => user.role === "PARENT");
    return parent ? String(parent.id) : null;
  })();

  const childProfiles = (() => {
    if (!usersResponse?.data) return [];
    return usersResponse.data
      .filter((user) => user.role === "CHILD")
      .map((user, index) => ({
        id: String(user.id),
        name: user.fullName,
        avatarIndex: (index % AVATAR_COUNT) + 1,
        hasSecretObject: user.hasSecretObject,
      }));
  })();

  const handleProfilePress = (id: string) => {
    const profile = childProfiles.find((p) => p.id === id);
    if (!profile) return;

    if (profile.hasSecretObject) {
      push({
        pathname: "/(select-profile)/select-secret-object",
        params: {
          childId: id,
          mode: "login",
        },
      });
    } else {
      push({
        pathname: "/(select-profile)/child-welcome",
        params: {
          childId: id,
          childName: profile.name,
          avatarIndex: String(profile.avatarIndex),
        },
      });
    }
  };

  const handleAddProfile = () => {
    push({
      pathname: "/(select-profile)/create-profile",
      params: { source: "select-profile" },
    });
  };

  const handleParentAccess = () => {
    if (!parentUserId) return;
    push({
      pathname: "/(select-profile)/parent-access",
      params: { parentUserId },
    });
  };

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
            <ActivityIndicator size="small" color={colors.accent.mainBlue} />
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

            {isParent && (
              <View style={[styles.profileCardWrapper, { width: cardWidth }]}>
                <TouchableOpacity
                  style={styles.addProfileCard}
                  onPress={handleAddProfile}
                  activeOpacity={ACTIVE_OPACITY}
                  accessibilityLabel={t("selectProfile.addProfileA11y")}
                  accessibilityRole="button"
                >
                  <AddProfileIconFrame width={128} height={128} />
                  <Text style={styles.addProfileText}>
                    {t("selectProfile.addProfile")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.fixedBottom} pointerEvents="box-none">
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.parentButton}
            onPress={handleParentAccess}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityLabel={t("selectProfile.parentAccessA11y")}
            accessibilityRole="button"
          >
            <View style={styles.parentButtonDecoration}>
              <BuhoOjo width={85} height={56} />
            </View>
            <Text style={styles.parentButtonText}>
              {t("selectProfile.parentAccess")}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: colors.accent.lightBackground,
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
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 32,
    paddingVertical: 24,
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
