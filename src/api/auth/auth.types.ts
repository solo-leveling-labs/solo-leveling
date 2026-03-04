// Requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  accountName: string;
  email: string;
  fullName: string;
  birthday: string; // ISO date string: "YYYY-MM-DD"
  password: string;
  pin: string;
}

export interface SelectProfileRequest {
  userId: number;
  pin?: string; // Required when selecting a PARENT profile
  secretObjectId?: number; // Required when selecting a CHILD profile
}

// Responses
export type UserRole = "PARENT" | "CHILD" | "ADMIN";

export interface AccountSnapshot {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  data: {
    auth: boolean;
    token: string;
    refreshToken: string;
    account: AccountSnapshot;
  };
}

export interface SignupResponse {
  data: {
    auth: boolean;
    token: string;
    refreshToken: string;
    account: AccountSnapshot;
    userId: number;
  };
}

export interface SelectProfileResponse {
  auth: boolean;
  token: string;
  refreshToken: string;
  role: UserRole;
}
