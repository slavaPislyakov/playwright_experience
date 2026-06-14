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
  [UserRole.AUTHORIZED]: {
    apiKey: requireEnv("API_KEY"),
    role: UserRole.AUTHORIZED,
  },
  [UserRole.GUEST]: {
    role: UserRole.GUEST,
  },
};

export const getAuthHeaders = (role: UserRole): Record<string, string> => {
  const user = API_USERS[role];

  if (!user) {
    throw new Error(`Unknown role: ${role}`);
  }

  if (user.role === UserRole.AUTHORIZED && user.apiKey) {
    return { "x-rapidapi-key": user.apiKey };
  }

  return {};
};
