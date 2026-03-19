// Requests
export interface CreateUserRequest {
  fullName: string;
  birthday: string; // ISO date string: "YYYY-MM-DD"
}

// Responses
export interface UserResponseDto {
  id: number;
  fullName: string;
  birthday: string;
  role: "PARENT" | "CHILD" | "ADMIN";
  accountId: number;
  parentUserId: number;
  createdAt: string;
  updatedAt: string;
  hasSecretObject: boolean;
}

export interface CreateUserResponse {
  statusCode: number;
  data: UserResponseDto;
}

export interface GetUserResponse {
  statusCode: number;
  data: UserResponseDto;
}

export interface GetUsersResponse {
  statusCode: number;
  data: UserResponseDto[];
}
