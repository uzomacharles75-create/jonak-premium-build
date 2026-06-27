import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

import { connectDatabase } from "./config/db";
import { backendOrigin, env, frontendOrigin, isProduction } from "./config/env";
import { apiLimiter } from "./middleware/rate-limit";
import { errorHandler, notFoundHandler } from "./middleware/error";
import { apiRoutes } from "./routes";
import { UserModel } from "./models/User";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const devOrigins = new Set([
        frontendOrigin,
        backendOrigin,
        "http://localhost:3000",
        "http://localhost:4173",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4173",
        "http://127.0.0.1:5173",
      ]);

      if (isProduction) {
        if (origin === frontendOrigin || origin === backendOrigin) {
          callback(null, true);
          return;
        }
        callback(new Error("CORS not allowed"));
        return;
      }

      const isPrivateNetworkOrigin =
        /^https?:\/\/(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?::\d+)?$/.test(
          origin,
        );

      if (
        devOrigins.has(origin) ||
        isPrivateNetworkOrigin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", apiLimiter);
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "jonak-backend" });
});
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "jonak-backend" });
});
app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function seedAdminIfNeeded() {
  const email = env.SEED_ADMIN_EMAIL.toLowerCase();
  const existingAdmin = await UserModel.findOne({ email }).lean();

  if (existingAdmin) {
    if (!isProduction) {
      console.log(
        `Admin already exists for ${email}. Use the existing credentials to sign in.`,
      );
    }
    return;
  }

  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);

  await UserModel.create({
    name: env.SEED_ADMIN_NAME,
    email,
    passwordHash,
    role: "admin",
    isActive: true,
  });

  console.log(isProduction ? "Seeded production admin account:" : "Seeded local admin account:");
  console.log(`  Email: ${email}`);
  if (!isProduction) {
    console.log(`  Password: ${env.SEED_ADMIN_PASSWORD}`);
  }
  console.log("  Login URL: /admin");
}

async function start() {
  try {
    await connectDatabase();
    await seedAdminIfNeeded();

    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Jonak backend listening on ${backendOrigin} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("Failed to start Jonak backend:", error);
    process.exit(1);
  }
}

void start();
