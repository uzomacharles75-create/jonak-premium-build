import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  BACKEND_URL: z.string().optional(),
  AUTH_COOKIE_NAME: z.string().default("jonak_admin_session"),
  ADMIN_TOKEN_TTL: z.string().default("7d"),
  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_ADMIN_NAME: z.string().optional(),
});

const parsedEnv = envSchema.parse(process.env);

export const isProduction = parsedEnv.NODE_ENV === "production";

function normalizeUrl(value: string | undefined) {
  const trimmed = value?.trim().replace(/\/$/, "") ?? "";
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/i.test(trimmed)) {
    return `http://${trimmed}`;
  }

  return `https://${trimmed}`;
}

function resolveBackendUrl(explicitValue: string | undefined) {
  const explicit = normalizeUrl(explicitValue);
  if (explicit) {
    return explicit;
  }

  const renderUrl = normalizeUrl(process.env.RENDER_EXTERNAL_URL);
  if (renderUrl) {
    return renderUrl;
  }

  return isProduction ? "" : "http://localhost:4000";
}

export const env = {
  ...parsedEnv,
  MONGODB_URI: parsedEnv.MONGODB_URI?.trim() ?? (isProduction ? "" : "mongodb-memory-server"),
  JWT_SECRET:
    parsedEnv.JWT_SECRET?.trim() ??
    (isProduction ? "" : "dev-local-jwt-secret-change-in-production"),
  FRONTEND_URL: normalizeUrl(parsedEnv.FRONTEND_URL) || (isProduction ? "" : "http://localhost:5173"),
  BACKEND_URL: resolveBackendUrl(parsedEnv.BACKEND_URL),
  SEED_ADMIN_EMAIL: parsedEnv.SEED_ADMIN_EMAIL?.trim() ?? "admin@jonakconstruction.com",
  SEED_ADMIN_PASSWORD: parsedEnv.SEED_ADMIN_PASSWORD ?? "Admin123!",
  SEED_ADMIN_NAME: parsedEnv.SEED_ADMIN_NAME?.trim() ?? "Jonak Admin",
};

const missingProductionEnv = [
  !env.MONGODB_URI ? "MONGODB_URI" : null,
  !env.JWT_SECRET ? "JWT_SECRET" : null,
  !env.FRONTEND_URL ? "FRONTEND_URL" : null,
].filter(Boolean);

if (isProduction && missingProductionEnv.length > 0) {
  throw new Error(
    `Missing required production environment variables: ${missingProductionEnv.join(", ")}. BACKEND_URL is optional on Render and is detected automatically.`,
  );
}

if (isProduction && env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production.");
}

export const backendOrigin = env.BACKEND_URL.replace(/\/$/, "");
export const frontendOrigin = env.FRONTEND_URL.replace(/\/$/, "");

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction
    ? new URL(frontendOrigin).origin === new URL(backendOrigin).origin
      ? "lax"
      : "none"
    : "lax") as "lax" | "none",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const allowedVideoMimeTypes = new Set(["video/mp4"]);

export const mediaUploadLimits = {
  imageBytes: 15 * 1024 * 1024,
  videoBytes: 25 * 1024 * 1024,
};
