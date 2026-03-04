import CameraVerificationLayout from "@/src/components/CameraVerificationLayout";
import { useRouter } from "expo-router";
import { useCallback } from "react";

const CameraVerificationStep3Screen = () => {
  const { replace, dismissTo } = useRouter();

  const handlePhotoTaken = useCallback(() => {
    replace("/validating-identity");
  }, [replace]);

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
