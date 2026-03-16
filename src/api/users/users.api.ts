import { apiSecure } from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/endpoints";

import { CreateUserRequest, CreateUserResponse } from "./users.types";

export const usersApi = {
  createUser: async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
    const { data } = await apiSecure.post<CreateUserResponse>(
      ENDPOINTS.users.base,
      payload,
    );
    return data;
  },
};
