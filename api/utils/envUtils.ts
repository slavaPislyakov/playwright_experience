import * as dotenv from "dotenv";

let envInitialized = false;

/**
 * Loads `.env` into `process.env`. Idempotent — safe to call multiple times.
 * Called explicitly from `playwright.config.ts` so that env access is
 * deterministic and not a hidden module-import side effect.
 */
export const initEnv = (): void => {
  if (envInitialized) return;
  dotenv.config();
  envInitialized = true;
};

export const optionalEnv = (name: string): string | undefined => process.env[name];

export const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required env var: ${name}`);
  }
  return value;
};
