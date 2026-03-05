import * as SecureStore from "expo-secure-store";

const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
} as const;

const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
  } catch (error) {
    console.error("[TokenService] Failed to get access token", error);
    return null;
  }
};

const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
  } catch (error) {
    console.error("[TokenService] Failed to get refresh token", error);
    return null;
  }
};

const setAccessToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, token);
  } catch (error) {
    console.error("[TokenService] Failed to set access token", error);
  }
};

const setRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, token);
  } catch (error) {
    console.error("[TokenService] Failed to set refresh token", error);
  }
};

const setTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken),
      SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, refreshToken),
    ]);
  } catch (error) {
    console.error("[TokenService] Failed to set tokens", error);
  }
};

const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS),
      SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH),
    ]);
  } catch (error) {
    console.error("[TokenService] Failed to clear tokens", error);
  }
};

/**
 * Checks whether a valid access token is currently stored.
 *
 * @returns True if an access token exists, false otherwise.
 */
const hasToken = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
    return token !== null;
  } catch (error) {
    console.error("[TokenService] Failed to check token existence", error);
    return false;
  }
};

export const TokenService = {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setTokens,
  clearTokens,
  hasToken,
};
