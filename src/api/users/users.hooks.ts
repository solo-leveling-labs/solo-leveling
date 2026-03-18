import { useMutation, useQuery } from "@tanstack/react-query";

import { usersApi } from "./users.api";
import { CreateUserRequest } from "./users.types";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => usersApi.createUser(payload),
  });
};
