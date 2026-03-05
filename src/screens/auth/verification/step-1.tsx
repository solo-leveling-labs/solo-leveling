import CameraVerificationLayout from "@/src/components/CameraVerificationLayout";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";

const CameraVerificationStep1Screen = () => {
  const { push, dismissTo } = useRouter();

  const handlePhotoTaken = useCallback(() => {
    push("/step-2");
  }, [push]);

  const handleCancel = useCallback(() => {
    dismissTo("/intro");
  }, [dismissTo]);

  return (
    <CameraVerificationLayout
      titleKey="auth.cameraVerification.step1Title"
      photoStep="step1"
      onPhotoTaken={handlePhotoTaken}
      onCancel={handleCancel}
    />
  );
};

export default CameraVerificationStep1Screen;
