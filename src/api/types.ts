export interface ApiError {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}

export interface AuthTokensResponse {
  token: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: "PARENT" | "CHILD" | "ADMIN";
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: AuthUser | null;
}
