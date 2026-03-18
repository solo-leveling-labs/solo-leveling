import { apiSecure } from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/endpoints";

import {
  CreateUserRequest,
  CreateUserResponse,
  GetUsersResponse,
} from "./users.types";

export const usersApi = {
  getUsers: async (): Promise<GetUsersResponse> => {
    const { data } = await apiSecure.get<GetUsersResponse>(
      ENDPOINTS.users.base,
    );
    return data;
  },

  createUser: async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
    const { data } = await apiSecure.post<CreateUserResponse>(
      ENDPOINTS.users.base,
      payload,
    );
    return data;
  },
};
