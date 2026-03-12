import { useQuery } from "@tanstack/react-query";

import { rulesApi } from "./rules.api";

export const RULES_QUERY_KEY = ["rules"] as const;

export const useGetRules = () => {
  return useQuery({
    queryKey: RULES_QUERY_KEY,
    queryFn: () => rulesApi.getRules(),
  });
};
