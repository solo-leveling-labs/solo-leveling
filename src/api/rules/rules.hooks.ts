import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { rulesApi } from "./rules.api";
import { CreateRuleRequest } from "./rules.types";

export const RULES_QUERY_KEY = ["rules"] as const;

export const useGetRules = () => {
  return useQuery({
    queryKey: RULES_QUERY_KEY,
    queryFn: () => rulesApi.getRules(),
  });
};

export const useCreateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRuleRequest) => rulesApi.createRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RULES_QUERY_KEY });
    },
  });
};

export const useAssignRules = () => {
  return useMutation({
    mutationFn: ({
      userId,
      ruleIds,
    }: {
      userId: string | number;
      ruleIds: number[];
    }) => rulesApi.assignRulesToUser(userId, { ruleIds }),
  });
};
