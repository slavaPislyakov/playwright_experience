import path from "path";

import * as dotenv from "dotenv";

// Load .env from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required env var: ${name}`);
  }
  return value;
};
