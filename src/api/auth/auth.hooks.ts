import { TokenService } from "@/src/api/tokenService";
import { AuthUser } from "@/src/api/types";
import { useAuthStore } from "@/src/store/auth.store";
import { useSignupStore } from "@/src/store/signup.store";
import { useMutation } from "@tanstack/react-query";

import { authApi } from "./auth.api";
import {
  AssignSecretObjectRequest,
  LoginRequest,
  SelectProfileRequest,
  SignupRequest,
  ValidateIdentityRequest,
} from "./auth.types";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const setIdentityVerified = useAuthStore(
    (state) => state.setIdentityVerified,
  );
  const setProfileSetupComplete = useAuthStore(
    (state) => state.setProfileSetupComplete,
  );

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: async (data) => {
      const { account, token, refreshToken } = data.data;
      const user: AuthUser = {
        id: account.id,
        name: account.name,
        email: account.email,
      };
      await login(token, refreshToken, user);
      setIdentityVerified(account.isIdentityVerified);
      setProfileSetupComplete(account.hasChildProfiles);
    },
  });
};

export const useSignup = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: SignupRequest) => authApi.signup(payload),
    onSuccess: async (data) => {
      const userData = data.data;
      const user: AuthUser = {
        id: userData.account.id,
        name: userData.account.name,
        email: userData.account.email,
      };

      useSignupStore.getState().reset();
      await login(userData.token, userData.refreshToken, user);
    },
  });
};

export const useValidateIdentity = () => {
  return useMutation({
    mutationFn: (payload: ValidateIdentityRequest) =>
      authApi.validateIdentity(payload),
    onSuccess: (data) => {
      console.log("[useValidateIdentity] success:", data);
    },
    onError: (error) => {
      console.log("[useValidateIdentity] error:", error);
    },
  });
};

export const useAssignSecretObject = () => {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: AssignSecretObjectRequest) =>
      authApi.assignSecretObject(payload),
    onSuccess: async (response) => {
      const { token, refreshToken, role } = response.data;
      updateUser({ role });
      await TokenService.setTokens(token, refreshToken);
    },
  });
};

export const useSelectProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: SelectProfileRequest) => {
      return authApi.selectProfile(payload);
    },
    onSuccess: async (response) => {
      const { token, refreshToken, role } = response.data;
      updateUser({ role });
      await TokenService.setTokens(token, refreshToken);
    },
  });
};
