import { CameraVerificationLayout } from "@/src/components/CameraVerificationLayout";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";

const CameraVerificationStep2Screen = () => {
  const { push, dismissTo } = useRouter();

  const handlePhotoTaken = useCallback(() => {
    push("/step-3");
  }, [push]);

  const handleCancel = useCallback(() => {
    dismissTo("/intro");
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
