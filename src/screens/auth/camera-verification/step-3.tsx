import CameraVerificationLayout from "@/src/components/CameraVerificationLayout";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";

const CameraVerificationStep3Screen = () => {
  const { dismissTo } = useRouter();

  const handlePhotoTaken = useCallback(() => {
    // TODO: Navigate to "ValidatingIdentity" screen
  }, []);

  const handleCancel = useCallback(() => {
    dismissTo("/sign-up-step-4");
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
