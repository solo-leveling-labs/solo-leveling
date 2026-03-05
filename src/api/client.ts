import { useAuthStore } from "@/src/store/auth.store";
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { API_BASE_URL, ENDPOINTS } from "./endpoints";
import { TokenService } from "./tokenService";
import { AuthTokensResponse } from "./types";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retried?: boolean;
  }
}

const AXIOS_CONFIG: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
};

export const api = axios.create(AXIOS_CONFIG);
export const apiSecure = axios.create(AXIOS_CONFIG);

apiSecure.interceptors.request.use(
  async (config) => {
    if (config.headers.Authorization) {
      return config;
    }

    const accessToken = await TokenService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    const status: number | undefined = error.response?.status;
    const isAuthError = status === 401 || status === 403;
    const wasAlreadyRetried = originalRequest._retried === true;

    if (!isAuthError || wasAlreadyRetried) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    const refreshToken = await TokenService.getRefreshToken();

    if (!refreshToken) {
      await handleSessionExpired();
      return Promise.reject(error);
    }

    try {
      const { data } = await api.post<AuthTokensResponse>(
        ENDPOINTS.auth.refresh,
        { refreshToken },
      );

      await TokenService.setTokens(data.token, data.refreshToken);

      originalRequest.headers.set("Authorization", `Bearer ${data.token}`);

      return apiSecure(originalRequest);
    } catch (refreshError) {
      await handleSessionExpired();
      return Promise.reject(refreshError);
    }
  },
);

const handleSessionExpired = async (): Promise<void> => {
  await useAuthStore.getState().logout();
  router.replace("/(auth)/sign-in");
};
