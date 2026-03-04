import CameraVerificationLayout from "@/src/components/CameraVerificationLayout";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";

const CameraVerificationStep2Screen = () => {
  const { push, dismissTo } = useRouter();

  const handlePhotoTaken = useCallback(() => {
    push("/(auth)/camera-verification-step-3");
  }, [push]);

  const handleCancel = useCallback(() => {
    dismissTo("/sign-up-step-4");
  }, [dismissTo]);

  return (
    <CameraVerificationLayout
      titleKey="auth.cameraVerification.step2Title"
      photoStep="step2"
      onPhotoTaken={handlePhotoTaken}
      onCancel={handleCancel}
    />
  );
};

export default CameraVerificationStep2Screen;
