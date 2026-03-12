import { apiSecure } from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/endpoints";

import { UpdateAccountRequest } from "./accounts.types";

export const accountsApi = {
  updateAccount: async (payload: UpdateAccountRequest): Promise<void> => {
    await apiSecure.put(ENDPOINTS.accounts.base, payload);
  },
};
