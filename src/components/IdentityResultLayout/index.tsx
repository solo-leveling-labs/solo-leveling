import BgDecorations from "@/assets/svg/bg-decorations.svg";
import Buho from "@/assets/svg/buho.svg";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useFocusEffect } from "expo-router";
import type { ParseKeys } from "i18next";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUHO_ASPECT_RATIO = 134 / 375;

interface IdentityResultLayoutProps {
  titleKey: ParseKeys;
  subtitleKey: ParseKeys;
  titleA11yKey: ParseKeys;
  children: ReactNode;
}

const IdentityResultLayout = ({
  titleKey,
  subtitleKey,
  titleA11yKey,
  children,
}: IdentityResultLayoutProps) => {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const { bottom: safeBottom } = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  return (
    <View style={styles.container}>
      <BgDecorations width={100} height={166} style={styles.decorations} />
      <Buho
        width={screenWidth}
        height={screenWidth * BUHO_ASPECT_RATIO}
        style={styles.background}
      />

      <View style={[styles.content, { paddingBottom: safeBottom + 56 }]}>
        <View
          style={styles.textContainer}
          accessibilityLabel={t(titleA11yKey)}
          accessibilityRole="header"
        >
          <Text style={styles.title}>{t(titleKey)}</Text>
          <Text style={styles.subtitle}>{t(subtitleKey)}</Text>
        </View>

        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  decorations: {
    position: "absolute",
    top: 0,
    right: -10,
  },
  background: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    paddingTop: "25%",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  textContainer: {
    gap: 8,
  },
  title: {
    fontFamily: fonts.raleway.extraBold,
    fontSize: 48,
    color: colors.accent.mainBlue,
  },
  subtitle: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.accent.mainBlue,
  },
});

export default IdentityResultLayout;
