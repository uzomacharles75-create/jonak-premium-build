import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { env } from "./env";

let connectionPromise: Promise<typeof mongoose> | null = null;
let memoryServer: MongoMemoryServer | null = null;

async function resolveMongoUri() {
  if (env.MONGODB_URI && env.MONGODB_URI !== "mongodb-memory-server") {
    return env.MONGODB_URI;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is required in production.");
  }

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "jonak-premium-build",
      },
    });
  }

  return memoryServer.getUri();
}

export async function connectDatabase() {
  if (!connectionPromise) {
    connectionPromise = resolveMongoUri().then((uri) =>
      mongoose.connect(uri, {
        autoIndex: env.NODE_ENV !== "production",
      }),
    );
  }

  await connectionPromise;
  return mongoose.connection;
}

export function getDb() {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }
  return db;
}
