import { apiSecure } from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/endpoints";

import { AssignRulesRequest, CreateRuleRequest, RuleListResponse } from "./rules.types";

export const rulesApi = {
  getRules: async (): Promise<RuleListResponse> => {
    const { data } = await apiSecure.get<RuleListResponse>(ENDPOINTS.rules.base);
    return data;
  },

  assignRulesToUser: async (
    userId: string | number,
    payload: AssignRulesRequest,
  ): Promise<void> => {
    await apiSecure.post(ENDPOINTS.rules.assignToUser(userId), payload);
  },

  createRule: async (payload: CreateRuleRequest): Promise<void> => {
    await apiSecure.post(ENDPOINTS.rules.base, payload);
  },
};
