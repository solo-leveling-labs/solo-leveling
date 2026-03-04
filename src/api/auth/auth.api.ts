import { api, apiSecure } from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/endpoints";

import {
  LoginRequest,
  LoginResponse,
  SelectProfileRequest,
  SelectProfileResponse,
  SignupRequest,
  SignupResponse,
} from "./auth.types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(
      ENDPOINTS.auth.login,
      credentials,
    );
    return data;
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const { data } = await api.post<SignupResponse>(
      ENDPOINTS.auth.signup,
      payload,
    );
    return data;
  },

  selectProfile: async (
    payload: SelectProfileRequest,
  ): Promise<SelectProfileResponse> => {
    const { data } = await apiSecure.post<SelectProfileResponse>(
      ENDPOINTS.auth.selectProfile,
      payload,
    );
    return data;
  },
};
