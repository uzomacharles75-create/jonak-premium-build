import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const mediaAssetSchema = new Schema(
  {
    fileId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    kind: { type: String, enum: ["image", "video"], required: true, index: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export type MediaAsset = InferSchemaType<typeof mediaAssetSchema>;

export const MediaAssetModel = mongoose.models.MediaAsset ?? model("MediaAsset", mediaAssetSchema);
