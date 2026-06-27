import { Router } from "express";

import { asyncHandler } from "../utils/async-handler";
import { streamMediaAsset } from "../controllers/mediaController";

export const mediaRoutes = Router();

mediaRoutes.get("/:id", asyncHandler(streamMediaAsset));
