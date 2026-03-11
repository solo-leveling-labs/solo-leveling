import { TFunction } from "i18next";

export const getAlertOptions = (t: TFunction, isLocked?: boolean) => ({
  severityOptions: [
    { key: "mild", label: t("profileSetup.configureAlerts.severity.mild") },
    {
      key: "moderate",
      label: t("profileSetup.configureAlerts.severity.moderate"),
    },
    { key: "severe", label: t("profileSetup.configureAlerts.severity.severe") },
    {
      key: "emergency",
      label: t("profileSetup.configureAlerts.severity.emergency"),
    },
  ],
  responseOptions: [
    {
      key: "respondNormally",
      label: t("profileSetup.configureAlerts.responseOptions.respondNormally"),
    },
    {
      key: "respondAndSuggest",
      label: t(
        "profileSetup.configureAlerts.responseOptions.respondAndSuggest",
      ),
    },
    {
      key: "dontRespondAndSuggest",
      label: t(
        "profileSetup.configureAlerts.responseOptions.dontRespondAndSuggest",
      ),
    },
    ...(isLocked
      ? [
          {
            key: "emergencyResponse",
            label: t(
              "profileSetup.configureAlerts.responseOptions.emergencyResponse",
            ),
          },
        ]
      : []),
  ],
  notificationOptions: [
    {
      key: "appOnly",
      label: t("profileSetup.configureAlerts.notificationOptions.appOnly"),
    },
    {
      key: "appAndEmail",
      label: t("profileSetup.configureAlerts.notificationOptions.appAndEmail"),
    },
    {
      key: "appEmailAndPush",
      label: t(
        "profileSetup.configureAlerts.notificationOptions.appEmailAndPush",
      ),
    },
    ...(isLocked
      ? [
          {
            key: "emergencyNotification",
            label: t(
              "profileSetup.configureAlerts.notificationOptions.emergencyNotification",
            ),
          },
        ]
      : []),
  ],
});
