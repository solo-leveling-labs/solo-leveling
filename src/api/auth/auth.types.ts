// Requests
export interface ValidateIdentityRequest {
  frontalImageUri: string;
  rightProfileImageUri: string;
  leftProfileImageUri: string;
}

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

export interface AssignSecretObjectRequest {
  userId: number;
  objectId: number;
}

// Responses

export interface ValidateIdentityResponse {
  statusCode: number;
  data: {
    success: boolean;
    validationPassed: boolean;
    failureReasons: string[];
    message: string;
    validation: {
      same_person: {
        result: boolean;
        confidence: number;
        reasoning: string;
      };
      is_adult: {
        result: boolean;
        confidence: number;
        reasoning: string;
        estimated_age_range: string;
      };
      manipulation_detected: {
        result: boolean;
        confidence: number;
        reasoning: string;
      };
      image_quality: {
        sufficient_for_verification: boolean;
        issues_detected: string[];
      };
    };
  };
}

export type UserRole = "PARENT" | "CHILD" | "ADMIN";

export interface AccountSnapshot {
  id: number;
  name: string;
  email: string;
  isIdentityVerified: boolean;
  hasChildProfiles: boolean;
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
  statusCode: number;
  data: {
    auth: boolean;
    token: string;
    refreshToken: string;
    role: UserRole;
  };
}

export interface AssignSecretObjectResponse {
  statusCode: number;
  data: {
    auth: boolean;
    token: string;
    refreshToken: string;
    role: UserRole;
  };
}
