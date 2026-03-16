import { NotificationType, RuleResponseType, RuleSeverity } from "@/src/api/rules/rules.types";

export const RULE_SEVERITIES: RuleSeverity[] = [
  "Leve",
  "Moderada",
  "Grave",
  "Emergencia",
];

export const RULE_RESPONSE_TYPES: RuleResponseType[] = [
  "Responder normalmente",
  "Responder y sugerir hablar con un adulto",
  "No responder y sugerir hablar con un adulto",
  "Ante emergencias ayuda y avisa que se solicitara ayuda a un adulto",
];

export const RULE_NOTIFICATION_TYPES: NotificationType[] = [
  "IN_APP",
  "PUSH_NOTIFICATION",
  "EMAIL",
];
