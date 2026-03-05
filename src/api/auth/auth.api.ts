import { api, apiSecure } from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/endpoints";

import {
  LoginRequest,
  LoginResponse,
  SelectProfileRequest,
  SelectProfileResponse,
  SignupRequest,
  SignupResponse,
  ValidateIdentityRequest,
  ValidateIdentityResponse,
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

  validateIdentity: async (
    payload: ValidateIdentityRequest,
  ): Promise<ValidateIdentityResponse> => {
    const formData = new FormData();
    formData.append("frontalImage", {
      uri: payload.frontalImageUri,
      type: "image/jpeg",
      name: "frontal.jpg",
    } as unknown as Blob);
    formData.append("rightProfileImage", {
      uri: payload.rightProfileImageUri,
      type: "image/jpeg",
      name: "right-profile.jpg",
    } as unknown as Blob);
    formData.append("leftProfileImage", {
      uri: payload.leftProfileImageUri,
      type: "image/jpeg",
      name: "left-profile.jpg",
    } as unknown as Blob);

    const { data } = await apiSecure.post<ValidateIdentityResponse>(
      ENDPOINTS.auth.validateIdentity,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    if (!data.data.validationPassed) {
      throw new Error(data.data.message);
    }

    return data;
  },
};
