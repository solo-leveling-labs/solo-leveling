import { TokenService } from "@/src/api/tokenService";
import { AuthUser } from "@/src/api/types";
import { appZustandStorage } from "@/src/store/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  isIdentityVerified: boolean;
  isProfileSetupComplete: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: AuthUser | null;

  initialize: () => Promise<void>;
  login: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setIdentityVerified: (verified: boolean) => void;
  setProfileSetupComplete: (complete: boolean) => void;
  setUser: (user: AuthUser) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  isAuthenticated: false,
  isIdentityVerified: false,
  isProfileSetupComplete: false,
  isLoading: false,
  isInitialized: false,
  user: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      initialize: async () => {
        try {
          const [hasToken, persistedUser] = await Promise.all([
            TokenService.hasToken(),
            Promise.resolve(get().user),
          ]);

          if (hasToken && persistedUser !== null) {
            set({ isAuthenticated: true, isInitialized: true });
          } else {
            set({ isAuthenticated: false, isInitialized: true });
          }
        } catch (error) {
          console.error("[AuthStore] Initialization failed", error);
          set({ isAuthenticated: false, isInitialized: true });
        }
      },

      login: async (
        accessToken: string,
        refreshToken: string,
        user: AuthUser,
      ) => {
        await TokenService.setTokens(accessToken, refreshToken);
        set({ isAuthenticated: true, user });
      },

      logout: async () => {
        await TokenService.clearTokens();
        set({ ...INITIAL_STATE, isInitialized: true });
      },

      setIdentityVerified: (verified: boolean) => {
        set({ isIdentityVerified: verified });
      },

      setProfileSetupComplete: (complete: boolean) => {
        set({ isProfileSetupComplete: complete });
      },

      setUser: (user: AuthUser) => {
        set({ user });
      },
      updateUser: (partial: Partial<AuthUser>) => {
        const current = get().user;
        if (current === null) return;
        set({ user: { ...current, ...partial } });
      },
      reset: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => appZustandStorage),
    },
  ),
);
