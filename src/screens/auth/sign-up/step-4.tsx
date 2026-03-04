import SignUpLayout from "@/src/components/SignUpLayout";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, View } from "react-native";

const SignUpStep4Screen = () => {
  const { back, push } = useRouter();
  const { t } = useTranslation();

  const [permission, requestPermission] = useCameraPermissions();

  const handleAllowCameraAccess = useCallback(async () => {
    if (!permission) {
      return;
    }
    if (permission.granted) {
      push("/(auth)/camera-verification-step-1");
      return;
    }
    const result = await requestPermission();
    if (result.granted) {
      push("/(auth)/camera-verification-step-1");
    } else {
      Alert.alert(
        t("common.errors.title"),
        t("auth.signUpStep4.permissionDenied"),
      );
    }
  }, [permission, requestPermission, t, push]);

  const handleCancel = useCallback(() => {
    back();
  }, [back]);

  return (
    <SignUpLayout
      title={t("auth.signUpStep4.title")}
      subtitle={t("auth.signUpStep4.subtitle")}
      onNext={handleAllowCameraAccess}
      onBack={handleCancel}
      nextLabel={t("auth.signUpStep4.cameraButton")}
      nextLabelA11y={t("auth.signUpStep4.cameraButtonA11y")}
      backLabel={t("auth.signUpStep4.cancel")}
      backLabelA11y={t("auth.signUpStep4.cancelA11y")}
      isFormValid={true}
    >
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>{t("auth.signUpStep4.body1")}</Text>
        <Text style={styles.bodyText}>{t("auth.signUpStep4.body2")}</Text>
        <Text style={styles.bodyText}>{t("auth.signUpStep4.body3")}</Text>
      </View>
    </SignUpLayout>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    gap: 20,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    color: colors.neutral.black,
    lineHeight: 22,
  },
});

export default SignUpStep4Screen;
