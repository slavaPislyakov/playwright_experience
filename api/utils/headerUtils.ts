import { requireEnv } from "@@/api/utils/envUtils";

export enum UserRole {
  AUTHORIZED = "authorized",
  GUEST = "guest",
}

interface ApiUser {
  apiKey?: string;
  role: UserRole;
}

const API_USERS: Record<UserRole, ApiUser> = {
  authorized: {
    apiKey: requireEnv("API_KEY"),
    role: UserRole.AUTHORIZED,
  },
  guest: {
    apiKey: undefined,
    role: UserRole.GUEST,
  },
} as const;

export const getAuthHeaders = (role: UserRole): Record<string, string | undefined> => {
  const user = API_USERS[role];

  if (!user) {
    throw new Error(`Unknown role: ${role}`);
  }

  const headers: Record<string, string | undefined> = {};

  if (user.role === UserRole.AUTHORIZED) {
    headers["x-rapidapi-key"] = user.apiKey;
  }

  return headers;
};
