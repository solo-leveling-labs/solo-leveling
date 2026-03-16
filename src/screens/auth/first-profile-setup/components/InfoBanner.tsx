import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const InfoBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { t } = useTranslation();

  const handleToggleBanner = useCallback(() => {
    setIsBannerVisible((isBannerVisible) => !isBannerVisible);
  }, []);
  return (
    <View style={styles.sectionContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.sectionTitle,
          pressed && styles.sectionTitlePressed,
        ]}
        onPress={handleToggleBanner}
        accessibilityLabel={t(
          isBannerVisible
            ? "profileSetup.configureAlerts.closeBannerA11y"
            : "profileSetup.configureAlerts.openBannerA11y",
        )}
        accessibilityRole="button"
      >
        <Text style={styles.sectionTitleText}>
          {t("profileSetup.configureAlerts.sectionTitle")}
        </Text>
        <View style={styles.infoBadge}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.neutral[500]}
          />
        </View>
      </Pressable>
      {isBannerVisible && (
        <Animated.View
          style={styles.banner}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(100)}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>
              {t("profileSetup.configureAlerts.infoBanner.title")}
            </Text>
            <Text style={styles.bannerDescription}>
              {t("profileSetup.configureAlerts.infoBanner.description")}
            </Text>
          </View>
          <Pressable
            onPress={handleToggleBanner}
            style={styles.closeBannerButton}
            accessibilityLabel={t(
              "profileSetup.configureAlerts.closeBannerA11y",
            )}
            accessibilityRole="button"
          >
            <Ionicons name="close" size={20} color={colors.neutral[300]} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  sectionTitlePressed: {
    opacity: 0.7,
  },
  sectionTitleText: {
    fontSize: 24,
    fontFamily: fonts.raleway.bold,
    color: colors.accent.mainBlue,
    lineHeight: 29,
  },
  infoBadge: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
  banner: {
    backgroundColor: colors.overlay.bannerGreen,
    borderRadius: 12,
    padding: 16,
  },
  bannerContent: {
    flex: 1,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 15,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    lineHeight: 20,
  },
  bannerDescription: {
    fontSize: 13,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral[300],
    lineHeight: 16,
    paddingRight: 16,
  },
  closeBannerButton: {
    padding: 14,
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default InfoBanner;
