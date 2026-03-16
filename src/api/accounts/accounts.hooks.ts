import { useMutation } from "@tanstack/react-query";

import { accountsApi } from "./accounts.api";
import { UpdateAccountRequest } from "./accounts.types";

export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: (payload: UpdateAccountRequest) =>
      accountsApi.updateAccount(payload),
  });
};
