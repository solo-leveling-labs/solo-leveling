import CameraVerificationLayout from "@/src/components/CameraVerificationLayout";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";

const CameraVerificationStep3Screen = () => {
  const { dismissTo, push } = useRouter();

  const handlePhotoTaken = () => {
    push("/verification-loading");
  };

  const handleCancel = useCallback(() => {
    dismissTo("/intro");
  }, [dismissTo]);

  return (
    <CameraVerificationLayout
      titleKey="auth.cameraVerification.step3Title"
      photoStep="step3"
      onPhotoTaken={handlePhotoTaken}
      onCancel={handleCancel}
    />
  );
};

export default CameraVerificationStep3Screen;
