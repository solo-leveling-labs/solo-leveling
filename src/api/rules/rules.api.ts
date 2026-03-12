import { apiSecure } from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/endpoints";

import { RuleListResponse } from "./rules.types";

export const rulesApi = {
  getRules: async (): Promise<RuleListResponse> => {
    const { data } = await apiSecure.get<RuleListResponse>(ENDPOINTS.rules.base);
    return data;
  },
};
