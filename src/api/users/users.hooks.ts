import { useMutation } from "@tanstack/react-query";

import { usersApi } from "./users.api";
import { CreateUserRequest } from "./users.types";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => usersApi.createUser(payload),
  });
};
