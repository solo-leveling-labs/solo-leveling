import { colors } from "@/src/theme/colors";

export type SeverityLevel = "mild" | "moderate" | "severe" | "emergency";
export type ResponseLevel =
  | "respondNormally"
  | "respondAndSuggest"
  | "dontRespondAndSuggest"
  | "emergencyResponse";
export type NotificationsLevel =
  | "appOnly"
  | "appAndEmail"
  | "appEmailAndPush"
  | "emergencyNotification";

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  mild: colors.deco.decoGreen,
  moderate: colors.deco.decoYellow,
  severe: colors.accent.mainRed,
  emergency: colors.error,
};

export const RESPONSE_COLORS: Record<ResponseLevel, string> = {
  respondNormally: colors.deco.decoGreen,
  respondAndSuggest: colors.deco.decoYellow,
  dontRespondAndSuggest: colors.accent.mainRed,
  emergencyResponse: colors.error,
};

export const NOTIFICATION_COLORS: Record<NotificationsLevel, string> = {
  appOnly: colors.deco.decoGreen,
  appAndEmail: colors.deco.decoYellow,
  appEmailAndPush: colors.accent.mainRed,
  emergencyNotification: colors.error,
};

export interface AlertConfig {
  severity: SeverityLevel;
  response: ResponseLevel;
  notifications: NotificationsLevel;
}

export interface AlertAccordionProps {
  title: string;
  description: string;
  isSelected: boolean;
  isExpanded: boolean;
  config: AlertConfig;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onConfigChange: (field: keyof AlertConfig, value: string) => void;
  isLocked?: boolean;
}

export type AlertKey =
  | "selfHarm"
  | "grooming"
  | "abuse"
  | "bullying"
  | "emotionalHealth"
  | "drugs"
  | "violence"
  | "discrimination"
  | "religion"
  | "emergencies";

export interface AlertDefinition {
  key: AlertKey;
  defaultSeverity: SeverityLevel;
}

export interface FormErrors {
  email?: string;
  backupEmail?: string;
}
