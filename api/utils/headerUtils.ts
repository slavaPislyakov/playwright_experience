export type UserRole = "authorized" | "guest";

export interface ApiUser {
  apiKey?: string;
  role: UserRole;
}

export const API_USERS: Record<UserRole, ApiUser> = {
  authorized: {
    apiKey: process.env.API_KEY,
    role: "authorized",
  },
  guest: {
    apiKey: undefined,
    role: "guest",
  },
} as const;

export const getAuthHeaders = (role: UserRole): Record<string, string> => {
  const user = API_USERS[role];

  if (!user) {
    throw new Error(`Unknown role: ${role}`);
  }

  const headers: Record<string, string> = {
    // "X-User-Role": user.role,
  };

  if (user.apiKey) {
    headers["x-apisports-key"] = user.apiKey;
  }

  return headers;
};
