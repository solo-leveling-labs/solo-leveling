import ChildWelcomeDecoBottom from "@/assets/svg/child-welcome-deco-bottom.svg";
import ChildWelcomeDecoTop from "@/assets/svg/child-welcome-deco-top.svg";
import { colors } from "@/src/theme/colors";
import { ACTIVE_OPACITY } from "@/src/theme/constants";
import { fonts } from "@/src/theme/fonts";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SECRET_OBJECT_CONFIGS } from "./constants/secret-object-configs";

const DECO_OVERFLOW = 40;
const ENLARGED_FRAME_SIZE = 210;
const ENLARGED_ICON_SIZE = 180;

const SecretObjectConfirmationScreen = () => {
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const rootNavigation = useNavigation().getParent();
  const { objectId } = useLocalSearchParams<{ objectId: string }>();

  const parsedObjectId = objectId ? Number(objectId) : null;
  const config =
    parsedObjectId !== null ? SECRET_OBJECT_CONFIGS[parsedObjectId] : null;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const handleConfirm = useCallback(() => {
    rootNavigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs-child)" }],
      }),
    );
  }, [rootNavigation]);

  return (
    <View style={styles.container}>
      <ChildWelcomeDecoTop width={100} height={166} style={styles.decoTop} />
      <ChildWelcomeDecoBottom
        width={100}
        height={166}
        style={styles.decoBottom}
      />

      <View
        style={[
          styles.content,
          { paddingTop: safeTop + 16, paddingBottom: safeBottom + 40 },
        ]}
      >
        <View style={styles.body}>
          {config && (
            <View style={styles.frameShadow}>
              <View
                style={[styles.frameInner, { borderColor: config.frameColor }]}
              >
                <config.SvgComponent
                  width={ENLARGED_ICON_SIZE}
                  height={ENLARGED_ICON_SIZE}
                />
              </View>
            </View>
          )}

          <Text style={styles.title}>{"¡Recordá tu objeto secreto!"}</Text>

          <Text style={styles.description}>
            {
              "Vas a necesitar este objeto cada vez que quieras ingresar a Zapienz. ¡No lo olvides!"
            }
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleConfirm}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityLabel="Confirmar que entendí mi objeto secreto"
            accessibilityRole="button"
          >
            <Text style={styles.ctaButtonText}>{"¡Entendido!"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent.lightBackground,
  },
  decoTop: {
    position: "absolute",
    top: -DECO_OVERFLOW,
    right: -DECO_OVERFLOW,
  },
  decoBottom: {
    position: "absolute",
    bottom: -DECO_OVERFLOW,
    left: -DECO_OVERFLOW,
    transform: [{ rotate: "180deg" }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  frameShadow: {
    borderRadius: 12,
    backgroundColor: colors.accent.lightBackground,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  frameInner: {
    borderRadius: 12,
    borderWidth: 11,
    width: ENLARGED_FRAME_SIZE,
    height: ENLARGED_FRAME_SIZE,
    backgroundColor: colors.accent.lightBackground,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.raleway.extraBold,
    color: colors.accent.mainBlue,
    textAlign: "center",
    letterSpacing: -0.96,
    includeFontPadding: false,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    textAlign: "center",
    lineHeight: 22.4,
  },
  footer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  ctaButton: {
    backgroundColor: colors.accent.mainBlue,
    borderRadius: 100,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonText: {
    fontFamily: fonts.poppins.bold,
    fontSize: 16,
    color: colors.neutral.white,
  },
});

export default SecretObjectConfirmationScreen;
