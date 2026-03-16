export type RuleSeverity = "Leve" | "Moderada" | "Grave" | "Emergencia";

export type NotificationType = "IN_APP" | "EMAIL" | "PUSH_NOTIFICATION";

export type RuleResponseType =
  | "Responder normalmente"
  | "Responder y sugerir hablar con un adulto"
  | "No responder y sugerir hablar con un adulto"
  | "Ante emergencias ayuda y avisa que se solicitara ayuda a un adulto";

export interface Rule {
  id: number;
  accountId: number;
  bannedContent: string;
  description: string;
  severity: RuleSeverity;
  responseType: RuleResponseType;
  isActive: boolean;
  default: boolean;
  typeOfNotification: NotificationType[];
  createdAt: string;
  updatedAt: string;
  users: { id: number; fullName: string }[];
}

export interface RuleListResponse {
  statusCode: number;
  data: Rule[];
}

export interface CreateRuleRequest {
  bannedContent: string;
  description: string;
  severity: RuleSeverity;
  responseType: RuleResponseType;
  isBlocking: boolean;
  notify: boolean;
  typeOfNotification: NotificationType[];
}

export interface AssignRulesRequest {
  ruleIds: number[];
}
