export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: "auth/login",
    signup: "auth/signup",
    refresh: "auth/refresh",
    selectProfile: "auth/select-profile",
    assignSecretObject: "auth/assign-secret-object",
    validateIdentity: "auth/validate-identity",
  },
  users: {
    base: "users",
    byId: (id: string) => `users/${id}`,
  },
  notifications: {
    base: "notifications",
    byId: (id: string) => `notifications/${id}`,
    assign: (id: string) => `notifications/${id}/assign`,
    unassign: (id: string) => `notifications/${id}/unassign`,
    userNotification: (notificationId: string) =>
      `user-notifications/${notificationId}`,
  },
  rules: {
    base: "rules",
    byId: (id: string) => `rules/${id}`,
    assign: (id: string) => `rules/${id}/assign`,
    unassign: (id: string) => `rules/${id}/unassign`,
  },
  openai: {
    query: "openai/query",
    thread: "openai/thread",
    threads: "openai/threads",
    activityLogs: "openai-activity-logs",
  },
  secretObjects: {
    base: "secret-objects",
  },
} as const;
