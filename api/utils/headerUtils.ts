import { requireEnv } from "@@/api/utils/envUtils";

export enum UserRole {
  AUTHORIZED = "authorized",
  GUEST = "guest",
}

/**
 * Builds the headers for a given role lazily — `requireEnv("API_KEY")` is only
 * invoked when a caller actually asks for AUTHORIZED headers, not at module
 * import time. This lets `--project=ui`/`--project=noOAuth` runs succeed
 * without `API_KEY` being set, since those suites never request AUTHORIZED
 * headers.
 */
export const getAuthHeaders = (role: UserRole): Record<string, string> => {
  switch (role) {
    case UserRole.AUTHORIZED:
      return { "x-rapidapi-key": requireEnv("API_KEY") };
    case UserRole.GUEST:
      return {};
    default: {
      const _exhaustive: never = role;
      throw new Error(`Unknown UserRole: ${_exhaustive}`);
    }
  }
};
