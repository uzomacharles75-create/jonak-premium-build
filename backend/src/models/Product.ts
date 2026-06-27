import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const productMediaSchema = new Schema(
  {
    mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", required: true },
    isCover: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    fullDescription: { type: String, required: true, trim: true, maxlength: 4000 },
    category: { type: String, required: true, trim: true, index: true, maxlength: 80 },
    price: { type: Number, required: true, min: 0 },
    availability: {
      type: String,
      enum: ["available", "limited", "made_to_order", "out_of_stock"],
      default: "available",
      index: true,
    },
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    media: { type: [productMediaSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type Product = InferSchemaType<typeof productSchema>;

export const ProductModel = mongoose.models.Product ?? model("Product", productSchema);
