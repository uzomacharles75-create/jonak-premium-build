import { Router } from "express";

import { asyncHandler } from "../utils/async-handler";
import { requireAuth } from "../middleware/auth";
import { uploadLimiter } from "../middleware/rate-limit";
import { mediaUpload } from "../middleware/upload";
import {
  deleteMediaAsset,
  listMediaAssets,
  uploadMediaAssets,
} from "../controllers/mediaController";

export const adminMediaRoutes = Router();

adminMediaRoutes.use(requireAuth);
adminMediaRoutes.get("/", asyncHandler(listMediaAssets));
adminMediaRoutes.post(
  "/upload",
  uploadLimiter,
  mediaUpload.array("files", 12),
  asyncHandler(uploadMediaAssets),
);
adminMediaRoutes.delete("/:id", asyncHandler(deleteMediaAsset));
