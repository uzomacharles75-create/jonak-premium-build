import mongoose from "mongoose";

import { getDb } from "./db";

export function getMediaBucket() {
  return new mongoose.mongo.GridFSBucket(getDb(), {
    bucketName: "media",
  });
}

export function toObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid MongoDB ObjectId");
  }

  return new mongoose.Types.ObjectId(id);
}
